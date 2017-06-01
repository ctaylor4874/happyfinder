"""
Module holds the object models for the Happy Hour app
"""
import os
import requests
import time
import json
import logging
import argparse
import contextlib
import sqlalchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError

responses_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'responses')

engine = sqlalchemy.create_engine(os.environ.get('HAPPYFINDER_ENGINE'), encoding='utf8')
Session = sessionmaker(engine)


class Base:
    def __init__(self):
        self.GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
        self.FOURSQUARE_CLIENT_ID = os.environ.get('FOURSQUARE_CLIENT_ID')
        self.FOURSQUARE_CLIENT_SECRET = os.environ.get('FOURSQUARE_CLIENT_SECRET')
        self.has_happy_hour = False

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
        return self.data['result'] if 'result' in self.data else None

    @property
    def address(self):
        return self.result['formatted_address'] if 'formatted_address' in self.result else None

    @property
    def url(self):
        return self.result['website'] if 'website' in self.result else None

    @property
    def phone_number(self):
        return self.result['formatted_phone_number'] if 'formatted_phone_number' in self.result else None

    @property
    def opening_hours(self):
        return self.result['opening_hours'] if 'opening_hours' in self.result else {}

    @property
    def hours(self):
        return self.opening_hours['weekday_text'] if 'weekday_text' in self.opening_hours else {}

    @property
    def rating(self):
        return self.result['rating'] if 'rating' in self.result else None

    @property
    def geometry(self):
        return self.result['geometry'] if 'geometry' in self.result else None

    @property
    def location(self):
        return self.geometry['location'] if 'location' in self.geometry else None

    @property
    def lat(self):
        return self.location['lat'] if 'lat' in self.location else None

    @property
    def lng(self):
        return self.location['lng'] if 'lng' in self.location else None

    @property
    def name(self):
        return self.result['name'] if 'name' in self.result else None

    @property
    def price(self):
        return self.result['price_level'] if 'price_level' in self.result else None

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
        return self.foursquare_api_data['response'] if 'response' in self.foursquare_api_data else None

    @property
    def has_venues(self):
        return bool(self.res['venues']) if 'venues' in self.res else None

    @property
    def fs_venue_id(self):
        if self.has_venues:
            return self.venues()[0]['id'] if 'id' in self.venues()[0] else None

    @property
    def category(self):
        if self.has_venues:
            return self.venues()[0]['categories'][0]['shortName'] if 'categories' in self.venues()[0] else None

    def has_menu(self):
        return True if 'has_menu' in self.res else False

    def venues(self):
        return self.res['venues'] if 'venues' in self.res else None


class FoursquareVenueDetails(FoursquareDetails, Base):
    def __init__(self, google_details):
        super().__init__(google_details)
        self.foursquare_venue_details = self.get_load(
            "https://api.foursquare.com/v2/venues/{}/menu?client_id={}&client_secret={}&v=20170109".format(
                self.fs_venue_id, self.FOURSQUARE_CLIENT_ID, self.FOURSQUARE_CLIENT_SECRET), 'FS_VENUE_DETAILS.json')

    @property
    def res_detailed(self):
        return self.foursquare_venue_details['response'] if 'response' in self.foursquare_venue_details else None

    @property
    def menu(self):
        return self.res_detailed['menu'] if 'menu' in self.res_detailed else {}

    @property
    def menus(self):
        return self.menu['menus'] if 'menus' in self.menu else {}

    @property
    def menu_items(self):
        return self.menus['items'] if 'items' in self.menus else {}

    @property
    def happy_hour_string(self):
        try:
            for menu in self.menu_items:
                if 'happy' in self.menu_name(menu) or 'happy' in self.menu_description(menu):
                    self.has_happy_hour = True
                    return self.menu_description(menu)
                if 'entries' in menu:
                    if 'items' in menu['entries']:
                        for item in menu['entries']['items']:
                            if 'name' in item:
                                if 'happy' in item['name'].lower():
                                    self.has_happy_hour = True
                                    return None
        except AttributeError as e:
            logging.info(e)
            return None

    @staticmethod
    def menu_name(menu):
        return menu['name'].lower() if 'name' in menu else ''

    @staticmethod
    def menu_description(menu):
        return menu['description'].lower() if 'description' in menu else ''

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
                if fs_detailed.has_happy_hour:
                    sql = """
                       INSERT INTO happyfinder_schema.happyfinder(happyfinder.name, lat, lng, hours, 
                       rating, phone_number, address, happy_hour_string, url, category, fs_venue_id, google_id, price)
                       VALUES(:v_name, :lat, :lng, :hours, :rating, :phone_number, :address, :happy_hour_string,
                       :url, :category, :fs_venue_id, :google_id, :price);
                       """
                    with contextlib.closing(Session()) as s:
                        try:
                            s.execute(sql, params={
                                'v_name': google_details.name.encode('utf-8') or None,
                                'lat': google_details.lat or None,
                                'lng': google_details.lng or None,
                                'hours': json.dumps(google_details.hours,
                                                    ensure_ascii=False) if google_details.hours else None,
                                'rating': google_details.rating if google_details.rating else None,
                                'phone_number': google_details.phone_number.encode(
                                    'utf-8') if google_details.phone_number else None,
                                'address': google_details.address.encode('utf-8') if google_details.address else None,
                                'happy_hour_string': fs_detailed.happy_hour_string.encode(
                                    'utf-8') if fs_detailed.happy_hour_string else None,
                                'url': google_details.url.encode('utf-8') if google_details.url else None,
                                'category': fs_detailed.category.encode('utf-8') if fs_detailed.category else None,
                                'fs_venue_id': fs_detailed.fs_venue_id.encode('utf-8') or None,
                                'google_id': place_id.encode('utf-8') or None,
                                'price': google_details.price if google_details.price else None
                            })
                            print(google_details.url)
                            print(fs_detailed.category)

                        except IntegrityError or Exception as e:
                            s.rollback()
                            if IntegrityError:
                                logging.info(e)
                                pass
                            else:
                                raise
                        else:
                            s.commit()
                            logging.info("!!!!!!!!!!!!!!!STORED!!!!!!!!!!!!!!!!!!!!")


def scrape():
    # RA Sushi Test
    # 29.740886, -95.448189
    # 29.742731, -95.441666

    # Houston Scrape
    # 29.590177, -95.556335

    current_lat = 29.590177
    current_lng = -95.556335

    # end at top right location
    # Houston Scrape End
    # 29.928755, -95.210266
    lat = 29.928755
    lng = -95.210266

    while current_lat < lat:
        while current_lng < lng:
            place = GooglePlaces()
            place.get_place_info(coordinates='{},{}'.format(current_lat, current_lng), radius=1610)
            current_lng += 0.016635
        current_lng = -95.556335
        current_lat += 0.014466
    logging.info('FINISHED')


if __name__ == "__main__":
    argparser = argparse.ArgumentParser()
    argparser.add_argument('-l', '--loglevel', default=20, type=int)
    args = argparser.parse_args()
    logging.basicConfig(level=args.loglevel, format='%(asctime)s:{}'.format(logging.BASIC_FORMAT))
    scrape()
