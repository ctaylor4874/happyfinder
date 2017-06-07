import requests
import json
import logging
import time


class APIHandler:
    def __init__(self, url):
        self.url = url

    def get_load(self):
        res = requests.get(self.url)
        self.check_response(res)
        str_response = res.content.decode('utf-8')
        return json.loads(str_response)

    def check_response(self, res):
        if 'foursquare' in self.url and res.status_code == 403:
            reset_time = float(res.headers.pop('X-RateLimit-Reset'))
            logging.info('Rate Limit will Reset at: {}'.format(reset_time))
            while time.time() < reset_time:
                time.sleep(5)
