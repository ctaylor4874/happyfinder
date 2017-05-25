"""
Module holds the object models for the Happy Hour app
"""
import json
import urllib
import contextlib
import sqlalchemy
import sys
import config
import time

from sqlalchemy.orm import sessionmaker

reload(sys)
sys.setdefaultencoding('utf8')

engine = sqlalchemy.create_engine(config.ENGINE)
Session = sessionmaker(engine)
APIKEY = config.G_API_KEY
FS_CLIENT_ID = config.FS_CLIENT_KEY
FS_SECRET = config.FS_SECRET_KEY

print"Started"

querycount = 0

class ApiConnect(object):
    """
    Holds Curl procedures to get info from our API partners
    """

    @staticmethod
    def get_load(api_call):
        """
        Performs Curl with PyCurl using the GET method. Opens/closes each conn.
        Args: Full URL for the API call
        Returns: getvalue of JSON load from API
        """
        global querycount
        if api_call.find("foursquare") == -1:
            querycount += 1
            print querycount
        url = urllib.urlopen(api_call).read()
        return json.loads(url)



class LatLong(object):
    """
    User superclass. Stores basic lat / lon data for each user as a comma-separated string value
    """

    def __init__(self):
        self.location = ''


class Place(object):
    """
    Place superclass. Gets various detail attributes from the Foursquare api
    using Curl. Requires a Foursquare venue_id to construct.
    """

    def __init__(self, place_id):
        self.place_id = place_id
        self.happy_string = ''
        self.has_happy_hour = False
        # Curl to get place details from Google
        url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=%s&key=%s" % (
            urllib.quote_plus(self.place_id), urllib.quote_plus(APIKEY))
        g_place_deets = ApiConnect.get_load(url)
        self.lat = str(g_place_deets.get('result').get('geometry').get('location').get('lat'))
        self.lng = str(g_place_deets.get('result').get('geometry').get('location').get('lng'))
        self.name = str(g_place_deets.get('result').get('name'))

        # Curl to get Foursquare venue ID
        url = ("https://api.foursquare.com/v2/venues/search?intent=match&ll=%s"
               "&query=%s&client_id=%s&client_secret=%s&v=20170109" %
               ((str(self.lat + ',' + self.lng)),
                urllib.quote_plus(self.name),
                urllib.quote_plus(FS_CLIENT_ID),
                urllib.quote_plus(FS_SECRET)
                )
               )
        fs_venue_search = ApiConnect.get_load(url)
        if fs_venue_search.get('response').get('venues'):
            self.fs_venue_id = str(fs_venue_search.get('response'). \
                                   get('venues')[0].get('id', '0'))
            address = (fs_venue_search.get('response'). \
                       get('venues')[0].get('location').get('formattedAddress', ''))
            self.address = str(address[0])
        # Curl to get Foursquare happy hour menu description
            url = ("https://api.foursquare.com/v2/venues/%s/menu?client_id=%s&client_"
                   "secret=%s&v=20170109" %
                   (urllib.quote_plus(self.fs_venue_id),
                    urllib.quote_plus(FS_CLIENT_ID),
                    urllib.quote_plus(FS_SECRET)
                    )
                   )
            fs_venue_deets = ApiConnect.get_load(url)
            for menu in fs_venue_deets.get('response').get('menu').get('menus') \
                    .get('items', [{'name': '', 'description': ''}]):
                if 'happy hour' in str(menu.get('name', '')).lower() or \
                                'happy hour' in str(menu.get('description', '')).lower():
                    self.happy_string = menu.get('description').lower()
                    self.has_happy_hour = True
                    break

    @staticmethod
    def get_places(coords, radius='1609'):
        """
        Gets all places within a certain meter radius of a geo using FourSquare
        Args: coords - comma-separated string in the format 'lat,long'
              radius - string of meters, max 50000, def. 1600. Ex: '32000'
        Returns: list of Place object instances
        """
        url = (
            "https://maps.googleapis.com/maps/api/place/radarsearch/json?location=%s&radius=%s&types=restaurant&key=%s" %
            (coords, urllib.quote_plus(radius), urllib.quote_plus(APIKEY)))
        places_list = ApiConnect.get_load(url).get('results')
        for place in places_list:
            place_id = [place][0].get('place_id')
            place_instance = Place(place_id)
            if place_instance.has_happy_hour:
                sel = """
                SELECT address FROM happy_finder_schema.happy_strings WHERE address = :address;
                """
                with contextlib.closing(Session()) as s:
                    selection = s.execute(sel, params={'address': place_instance.address}).fetchall()
                if not selection:
                    sql = """
                    INSERT INTO happy_finder_schema.happy_strings(happy_text, venue_id, address, latitude, longitude)
                    VALUES(:happy_text, :venue_id, :address, :latitude, :longitude);
                    """
                    with contextlib.closing(Session()) as s:
                        try:
                            s.execute(sql, params={
                                'happy_text': place_instance.happy_string,
                                'venue_id': place_instance.fs_venue_id,
                                'address': place_instance.address,
                                'latitude': float(place_instance.lat),
                                'longitude': float(place_instance.lng)
                            })
                        except Exception:
                            s.rollback()
                            raise
                        else:
                            s.commit()
                            print "!!!!!!!!!!!!!!!STORED!!!!!!!!!!!!!!!!!!!!"

def scrape():
    ####Austin Scrape
    # start here!!
    # 30.254154,-97.73598

    current_lat = 29.575846
    current_lng = -95.594788
    # current_lat = 29.738744
    # current_lng = -95.465012
    # end at top right location
    lat = 30.161752
    lng = -95.202026
    global querycount
    while current_lat < lat:
        while current_lng < lng:
            if querycount >= 3000:  # number of queries to 4square
                print 'pausing'
                querycount = 0
                time.sleep(1825)  # delay for one hour once 5000 queries has been hit
            loc = LatLong()
            loc.location = str(current_lat) + ',' + str(current_lng)
            print loc.location
            Place.get_places(loc.location, '1610')
            current_lng += 0.016635
        current_lng = -95.594788
        current_lat += 0.014466
    print "*****FINISHED*****"


# calls scraper function
scrape()
