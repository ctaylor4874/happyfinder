"""
Module holds the object models for the Happy Hour app
"""
import os
import csv
import requests
import time
import json
import logging
import argparse
from pymongo import MongoClient

responses_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'responses')
APIKEY = os.environ.get('GOOGLE_API_KEY')


class Base:
    def __init__(self):
        self.GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
        self.FOURSQUARE_CLIENT_ID = os.environ.get('FOURSQUARE_CLIENT_ID')
        self.FOURSQUARE_CLIENT_SECRET = os.environ.get('FOURSQUARE_CLIENT_SECRET')
        self.has_happy_hour = False

    @property
    def db_connection(self):
        client = MongoClient('mongodb://localhost:27017/')
        return client.happyfinder_db

    @staticmethod
    def write_response(response, fname):
        with open(os.path.join(responses_dir, fname), 'wb') as f:
            f.write(response.content)

    def get_load(self, api_url, fname):
        res = requests.get(api_url)
        self.write_response(res, fname)
        self.check_api_response(api_url, res)
        str_response = res.content.decode('utf-8')
        return json.loads(str_response)

    @staticmethod
    def check_api_response(api_url, res):
        if 'foursquare' in api_url:
            if res.status_code == 200:
                logging.info('Limit Remaining: {}'.format(res.headers.pop('X-RateLimit-Remaining')))
            if res.status_code == 403:
                logging.info('Rate Limit will Reset at: {}'.format(res.headers.pop('X-RateLimit-Reset')))
                time.sleep(1825)  # delay for one hour once 5000 queries has been hit
        if res.status_code == 400:
            pass


class GoogleDetails(Base):
    def __init__(self, place_id):
        super().__init__()
        self.place_id = place_id
        self.data = self.get_load("https://maps.googleapis.com/maps/api/place/details/json?placeid={}&key={}".format(
            self.place_id, self.GOOGLE_API_KEY), 'GOOGLE_API_DATA.txt')

    @property
    def result(self):
        if 'result' in self.data:
            return self.data['result']

    @property
    def address(self):
        if 'formatted_address' in self.result:
            return self.result['formatted_address']
        pass

    @property
    def phone_number(self):
        if 'formatted_phone_number' in self.result:
            return self.result['formatted_phone_number']

    @property
    def opening_hours(self):
        if 'opening_hours' in self.result:
            return self.result['opening_hours']
        return {}

    @property
    def hours(self):
        if 'weekday_text' in self.opening_hours:
            return self.opening_hours['weekday_text']
        return {}

    @property
    def rating(self):
        if 'rating' in self.result:
            return self.result['rating']

    @property
    def geometry(self):
        if 'geometry' in self.result:
            return self.result['geometry']

    @property
    def location(self):
        if 'location' in self.geometry:
            return self.geometry['location']

    @property
    def lat(self):
        if 'lat' in self.location:
            return str(self.location['lat'])

    @property
    def lng(self):
        if 'lng' in self.location:
            return str(self.location['lng'])

    @property
    def name(self):
        if 'name' in self.result:
            return self.result['name']

    def __repr__(self):
        return "<Google Details: name: {}, lat: {}, lng: {}, rating: {}, hours: {}, phone_number: {}, address: {}>".format(
            self.name, self.lat, self.lng, self.rating, self.hours, self.phone_number, self.address
        )


class FoursquareDetails(Base):
    def __init__(self, google_details):
        super().__init__()
        self.lat = google_details.lat
        self.lng = google_details.lng
        self.name = google_details.name
        self.foursquare_api_data = self.get_load(
            "https://api.foursquare.com/v2/venues/search?intent=match&ll={},{}&query={}&client_id={}&client_secret={}&v=20170109".format(
                str(self.lat), str(self.lng), self.name, self.FOURSQUARE_CLIENT_ID, self.FOURSQUARE_CLIENT_SECRET),
            'FS_API_DATA.txt')

    @property
    def res(self):
        if 'response' in self.foursquare_api_data:
            return self.foursquare_api_data['response']

    def has_menu(self):
        if 'has_menu' in self.res:
            return True
        return False

    def venues(self):
        if 'venues' in self.res:
            return self.res['venues']

    @property
    def has_venues(self):
        if 'venues' in self.res:
            return bool(self.res['venues'])

    @property
    def fs_venue_id(self):
        if self.has_venues:
            if 'id' in self.venues()[0]:
                return self.venues()[0]['id']


class FoursquareVenueDetails(FoursquareDetails, Base):
    def __init__(self, google_details):
        super().__init__(google_details)
        self.foursquare_venue_details = self.get_load(
            "https://api.foursquare.com/v2/venues/{}/menu?client_id={}&client_secret={}&v=20170109".format(
                self.fs_venue_id, self.FOURSQUARE_CLIENT_ID, self.FOURSQUARE_CLIENT_SECRET), 'FS_VENUE_DETAILS.txt')

    @property
    def res_detailed(self):
        if 'response' in self.foursquare_venue_details:
            return self.foursquare_venue_details['response']

    @property
    def menu(self):
        if 'menu' in self.res_detailed:
            return self.res_detailed['menu']
        return {}

    @property
    def menus(self):
        if 'menus' in self.menu:
            return self.menu['menus']
        return {}

    @property
    def menu_items(self):
        if 'items' in self.menus:
            return self.menus['items']
        return {}

    @staticmethod
    def menu_name(menu):
        if 'name' in menu:
            return menu['name'].lower()
        return ''

    @staticmethod
    def menu_description(menu):
        if 'description' in menu:
            return menu['description'].lower()
        return ''

    @property
    def happy_hour_string(self):
        try:
            for menu in self.menu_items:
                if 'happy' in self.menu_name(menu) or 'happy' in self.menu_description(menu):
                    self.has_happy_hour = True
                    return self.menu_description(menu)
        except AttributeError as e:
            logging.info(e)
            return None

    def __repr__(self):
        return "<FS Details: has_happy_hour: {}, happy_hour_string: {}, has_venues_list: {}, fs_venue_id: {}, >".format(
            self.has_happy_hour, self.happy_hour_string, self.has_venues, self.fs_venue_id
        )


class GooglePlaces(Base):
    def google_api_places_url(self, coordinates=None, radius=None):
        return "https://maps.googleapis.com/maps/api/place/radarsearch/json?location={}&radius={}&types=restaurant&key={}".format(
            coordinates, radius, self.GOOGLE_API_KEY)

    def get_places_list(self, **kwargs):
        return self.get_load(self.google_api_places_url(**kwargs), 'PLACES_LIST.txt').get('results')

    def get_place_info(self, coordinates, radius):
        for place in self.get_places_list(coordinates=coordinates, radius=radius):
            place_id = place.get('place_id')
            google_details = GoogleDetails(place_id)
            fs = FoursquareDetails(google_details)
            logging.info(google_details)
            if fs.has_menu and fs.has_venues:
                fs_detailed = FoursquareVenueDetails(google_details)
                logging.info(fs_detailed)
                if fs_detailed.happy_hour_string:
                    data = dict({
                        'name': google_details.name or None,
                        'lat': google_details.lat or None,
                        'lng': google_details.lng or None,
                        'hours': google_details.hours or None,
                        'rating': google_details.rating or None,
                        'phone_number': google_details.phone_number or None,
                        'address': google_details.address or None,
                        'happy_hour_string': fs_detailed.happy_hour_string or None,
                        'fs_venue_id': fs_detailed.fs_venue_id or None
                    })
                    file_exists = os.path.isfile(os.path.join(responses_dir, 'HAPPY_HOURS.csv'))
                    with open(os.path.join(responses_dir, 'HAPPY_HOURS.csv'), 'a') as f:
                        w = csv.DictWriter(f, data.keys())
                        if not file_exists:
                            w.writeheader()
                        w.writerow(data)
                    logging.info('ROW WRITTEN: {}'.format(data))


def scrape():
    # Houston Scrape
    # 29.590177, -95.556335

    current_lat = 29.739638
    current_lng = -95.446815

    # end at top right location
    # Houston Scrape End
    # 29.928755, -95.210266
    lat = 29.743513
    lng = -95.441666

    while current_lat < lat:
        while current_lng < lng:
            place = GooglePlaces()
            place.get_place_info(coordinates='{},{}'.format(lat, lng), radius=1610)
            current_lng += 0.016635
        current_lng = -95.441666
        current_lat += 0.014466
    logging.info('FINISHED')


if __name__ == "__main__":
    argparser = argparse.ArgumentParser()
    argparser.add_argument('-l', '--loglevel', default=20, type=int)
    args = argparser.parse_args()
    logging.basicConfig(level=args.loglevel, format='%(asctime)s:{}'.format(logging.BASIC_FORMAT))
    scrape()
    # print"Started"
    #
    # querycount = 0
    #
    # class ApiConnect(object):
    #     """
    #     Holds Curl procedures to get info from our API partners
    #     """
    #
    #     @staticmethod
    #     def get_load(api_call):
    #         """
    #         Performs Curl with PyCurl using the GET method. Opens/closes each conn.
    #         Args: Full URL for the API call
    #         Returns: getvalue of JSON load from API
    #         """
    #         global querycount
    #         if api_call.find("foursquare") == -1:
    #             querycount += 1
    #             print querycount
    #         url = urllib.urlopen(api_callapi_call).read()
    #         return json.loads(url)
    #
    #
    #
    # class LatLong(object):
    #     """
    #     User superclass. Stores basic lat / lon data for each user as a comma-separated string value
    #     """
    #
    #     def __init__(self):
    #         self.location = ''
    #
    #
    # class Place(object):
    #     """
    #     Place superclass. Gets various detail attributes from the Foursquare api
    #     using Curl. Requires a Foursquare venue_id to construct.
    #     """
    #
    #     def __init__(self, place_id):
    #         self.place_id = place_id
    #         self.happy_string = ''
    #         self.has_happy_hour = False
    #         # Curl to get place details from Google
    #         url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=%s&key=%s" % (
    #             urllib.quote_plus(self.place_id), urllib.quote_plus(APIKEY))
    #         g_place_deets = ApiConnect.get_load(url)
    #         self.lat = str(g_place_deets.get('geometry').get('location').get('lat'))
    #         self.lng = str(g_place_deets.get('geometry').get('location').get('lng'))
    #         self.name = str(g_place_deets.get('name'))
    #
    #         # Curl to get Foursquare venue ID
    #         url = ("https://api.foursquare.com/v2/venues/search?intent=match&ll=%s"
    #                "&query=%s&client_id=%s&client_secret=%s&v=20170109" %
    #                ((str(self.lat + ',' + self.lng)),
    #                 urllib.quote_plus(self.name),
    #                 urllib.quote_plus(FS_CLIENT_ID),
    #                 urllib.quote_plus(FS_SECRET)
    #                 )
    #                )
    #         fs_venue_search = ApiConnect.get_load(url)
    #         if fs_venue_search.get('venues'):
    #             self.fs_venue_id = str(fs_venue_search. \
    #                                    get('venues')[0].get('id', '0'))
    #             address = (fs_venue_search. \
    #                        get('venues')[0].get('location').get('formattedAddress', ''))
    #             self.address = str(address[0])
    #         # Curl to get Foursquare happy hour menu description
    #             url = ("https://api.foursquare.com/v2/venues/%s/menu?client_id=%s&client_"
    #                    "secret=%s&v=20170109" %
    #                    (urllib.quote_plus(self.fs_venue_id),
    #                     urllib.quote_plus(FS_CLIENT_ID),
    #                     urllib.quote_plus(FS_SECRET)
    #                     )
    #                    )
    #             fs_venue_deets = ApiConnect.get_load(url)
    #             for menu in fs_venue_deets.get('menu').get('menus') \
    #                     .get('items', [{'name': '', 'description': ''}]):
    #                 if 'happy hour' in str(menu.get('name', '')).lower() or \
    #                                 'happy hour' in str(menu.get('description', '')).lower():
    #                     self.happy_string = menu.get('description').lower()
    #                     self.has_happy_hour = True
    #                     break
    #
    #     @staticmethod
    #     def get_places(coords, radius='1609'):
    #         """
    #         Gets all places within a certain meter radius of a geo using FourSquare
    #         Args: coords - comma-separated string in the format 'lat,long'
    #               radius - string of meters, max 50000, def. 1600. Ex: '32000'
    #         Returns: list of Place object instances
    #         """
    #         url = (
    #             "https://maps.googleapis.com/maps/api/place/radarsearch/json?location=%s&radius=%s&types=restaurant&key=%s" %
    #             (coords, urllib.quote_plus(radius), urllib.quote_plus(APIKEY)))
    #         places_list = ApiConnect.get_load(url).get('results')
    #         for place in places_list:
    #             place_id = [place][0].get('place_id')
    #             place_instance = Place(place_id)
    #             if place_instance.has_happy_hour:
    #                 sel = """
    #                 SELECT address FROM happy_finder_schema.happy_strings WHERE address = :address;
    #                 """
    #                 with contextlib.closing(Session()) as s:
    #                     selection = s.execute(sel, params={'address': place_instance.address}).fetchall()
    #                 if not selection:
    #                     sql = """
    #                     INSERT INTO happy_finder_schema.happy_strings(happy_text, venue_id, address, latitude, longitude)
    #                     VALUES(:happy_text, :venue_id, :address, :latitude, :longitude);
    #                     """
    #                     with contextlib.closing(Session()) as s:
    #                         try:
    #                             s.execute(sql, params={
    #                                 'happy_text': place_instance.happy_string,
    #                                 'venue_id': place_instance.fs_venue_id,
    #                                 'address': place_instance.address,
    #                                 'latitude': float(place_instance.lat),
    #                                 'longitude': float(place_instance.lng)
    #                             })
    #                         except Exception:
    #                             s.rollback()
    #                             raise
    #                         else:
    #                             s.commit()
    #                             print "!!!!!!!!!!!!!!!STORED!!!!!!!!!!!!!!!!!!!!"
    #
    # def scrape():
    #     ####Austin Scrape
    #     # start here!!
    #     # 30.254154,-97.73598
    #
    #     current_lat = 29.575846
    #     current_lng = -95.594788
    #     # current_lat = 29.738744
    #     # current_lng = -95.465012
    #     # end at top right location
    #     lat = 30.161752
    #     lng = -95.202026
    #     global querycount
    #     while current_lat < lat:
    #         while current_lng < lng:
    #             if querycount >= 3000:  # number of queries to 4square
    #                 print 'pausing'
    #                 querycount = 0
    #                 time.sleep(1825)  # delay for one hour once 5000 queries has been hit
    #             loc = LatLong()
    #             loc.location = str(current_lat) + ',' + str(current_lng)
    #             print loc.location
    #             Place.get_places(loc.location, '1610')
    #             current_lng += 0.016635
    #         current_lng = -95.594788
    #         current_lat += 0.014466
    #     print "*****FINISHED*****"
    #
    #
    # # calls scraper function
    # scrape()
