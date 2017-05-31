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
from pymongo.errors import DuplicateKeyError

responses_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'responses')


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
                reset_time = float(res.headers.pop('X-RateLimit-Reset'))
                logging.info('Rate Limit will Reset at: {}'.format(reset_time))
                while time.time() < reset_time:
                    time.sleep(5)
        if res.status_code == 400:
            pass


class GoogleDetails(Base):
    def __init__(self, place_id):
        super().__init__()
        self.place_id = place_id
        self.data = self.get_load("https://maps.googleapis.com/maps/api/place/details/json?placeid={}&key={}".format(
            self.place_id, self.GOOGLE_API_KEY), 'GOOGLE_API_DATA.json')

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
            'FS_API_DATA.json')

    @property
    def res(self):
        if 'response' in self.foursquare_api_data:
            return self.foursquare_api_data['response']

    @property
    def has_venues(self):
        if 'venues' in self.res:
            return bool(self.res['venues'])

    @property
    def category(self):
        if 'categories' in self.venues()[0]:
            return self.venues()[0]['categories']['shortName']

    @property
    def url(self):
        if 'url' in self.venues()[0]:
            return self.venues()[0]['url']

    @property
    def fs_venue_id(self):
        if self.has_venues:
            if 'id' in self.venues()[0]:
                return self.venues()[0]['id']

    def has_menu(self):
        if 'has_menu' in self.res:
            return True
        return False

    def venues(self):
        if 'venues' in self.res:
            return self.res['venues']


class FoursquareVenueDetails(FoursquareDetails, Base):
    def __init__(self, google_details):
        super().__init__(google_details)
        self.foursquare_venue_details = self.get_load(
            "https://api.foursquare.com/v2/venues/{}/menu?client_id={}&client_secret={}&v=20170109".format(
                self.fs_venue_id, self.FOURSQUARE_CLIENT_ID, self.FOURSQUARE_CLIENT_SECRET), 'FS_VENUE_DETAILS.json')

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

    def __repr__(self):
        return "<FS Details: has_happy_hour: {}, happy_hour_string: {}, has_venues_list: {}, fs_venue_id: {}, >".format(
            self.has_happy_hour, self.happy_hour_string, self.has_venues, self.fs_venue_id
        )


class GooglePlaces(Base):
    def google_api_places_url(self, coordinates=None, radius=None):
        return "https://maps.googleapis.com/maps/api/place/radarsearch/json?location={}&radius={}&types=restaurant&key={}".format(
            coordinates, radius, self.GOOGLE_API_KEY)

    def get_places_list(self, **kwargs):
        return self.get_load(self.google_api_places_url(**kwargs), 'PLACES_LIST.json').get('results')

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
                        'location': {
                            'lat': google_details.lat or None,
                            'lng': google_details.lng or None,
                        },
                        'hours': google_details.hours or None,
                        'rating': google_details.rating or None,
                        'phone_number': google_details.phone_number or None,
                        'address': google_details.address or None,
                        'happy_hour_string': fs_detailed.happy_hour_string or None,
                        'url': fs.url or None,
                        'category': fs.category or None,
                        'fs_venue_id': fs_detailed.fs_venue_id or None
                    })
                    file_exists = os.path.isfile(os.path.join(responses_dir, 'HAPPY_HOURS.csv'))
                    try:
                        self.db_connection.happyfinder.insert_one(data)
                    except DuplicateKeyError as e:
                        logging.info(e)
                        pass
                    with open(os.path.join(responses_dir, 'HAPPY_HOURS.csv'), 'a') as f:
                        w = csv.DictWriter(f, data.keys())
                        if not file_exists:
                            w.writeheader()
                        w.writerow(data)
                    logging.info('ROW WRITTEN: {}'.format(data))


def scrape():
    # Houston Scrape
    # 29.590177, -95.556335

    current_lat = 29.580623
    current_lng = -95.660706

    # end at top right location
    # Houston Scrape End
    # 29.928755, -95.210266
    lat = 30.197366
    lng = -95.171814

    while current_lat < lat:
        while current_lng < lng:
            place = GooglePlaces()
            place.get_place_info(coordinates='{},{}'.format(current_lat, current_lng), radius=1610)
            current_lng += 0.016635
        current_lng = -95.660706
        current_lat += 0.014466
    logging.info('FINISHED')


if __name__ == "__main__":
    argparser = argparse.ArgumentParser()
    argparser.add_argument('-l', '--loglevel', default=20, type=int)
    args = argparser.parse_args()
    logging.basicConfig(level=args.loglevel, format='%(asctime)s:{}'.format(logging.BASIC_FORMAT))
    scrape()