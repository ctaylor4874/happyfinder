# HappyFinder
HappyFinder is a responsive web app that finds happy hours near the
user-provided location and displays each happy hour on a map for
the user to browse and interact with.

Additionally, there is a separate portion of the application that you can
[view here](https://github.com/ctaylor4874/python_sqs_data_scraper).  This portion of
the application is dedicated to getting data from different sources as well as
parsing, cleaning, and storing the data.


HappyFinder makes extensive use of the Foursquare API, and was built using Flask / Python, Postgres, and JS.

## Table of Contents

- [Data Management](#data-management)
- [SQS](#sqs)
- [React and Redux](#react-and-redux)
- [Node and Express](#node-and-express)
- [Libraries and Frameworks](#libraries-and-frameworks)

## Data Management

The data parsing and management is
done with multiple Python 3 scripts that receive and send messages to
separate Amazon SQS Queues.  Data is from Foursquare API, as
well as Google API.  See the scripts that manage these tasks here:
[Data Project Repository](https://github.com/ctaylor4874/python_sqs_data_scraper)

## SQS
The reason I use multiple Python scripts and multiple SQS Queues is so I can
have numerous instances of the same script running on the server.  This cuts
down the time it takes to handle the data exponentially.  For instance, calculating
all of the coordinates for the
[Google Radar Search](https://github.com/ctaylor4874/python_sqs_data_scraper/blob/master/lat_lng_queue.py) takes far less time than
handling the data that is received from [Foursquare Menu Details](https://github.com/ctaylor4874/python_sqs_data_scraper/blob/master/fs_menu_details_queue.py).  In this case, for every
one coordinates calculating script that I run, I need to run two Foursquare
parsing scripts.

## React and Redux

I am using [React](https://facebook.github.io/react/)
and [Redux](http://redux.js.org/) for the front end.  All forms are done
with [redux-form](http://redux-form.com/6.8.0/) and the design scheme
is done with [Material UI](http://www.material-ui.com/#/).  This combination allows me to reuse
components multiple times in different parts of the application.  It also allows
me to add new content rapidly.  Using Redux's application state I can query the server
and when a response has come in, the data is stored in the application state.  The screen will automatically
reload when the state is updated, so when I send out the request, I just wait until it comes back,
then state is updated, and the screen reloads with all the content.

## Node and Express

Node and Express make for a very versatile backend.  For all email I use
[nodemailer](https://github.com/nodemailer/nodemailer).  This allows me to
securely send emails to one of my email addresses, without ever exposing the address
to the public.  In addition to nodemailer, I am also using [MySQL for Node](https://github.com/mysqljs/mysql).
This library has everything that this application needs, including connection pooling and
escaping values to protect against SQL Injection.  The server is quite simple,
the reason for this is the React/Redux frontend, and the data management/aggregation
has been optimized to allow very little work on the server side when a client is
using the application.  This makes the application very fast and responsive.

## Libraries and Frameworks

- [JavaScript Frontend](https://www.javascript.com/)
  - [ES6](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_2015_support_in_Mozilla)
  - [React](https://facebook.github.io/react/)
  - [Redux](http://redux.js.org/)
  - [Redux Thunk](https://github.com/gaearon/redux-thunk)
  - [Redux Form](http://redux-form.com/6.8.0/)
  - [Axios](https://www.axios.com)
  - [React Leaflet](https://github.com/PaulLeCam/react-leaflet)
- [JavaScript Backend](https://www.javascript.com/)
  - [Node.js](https://nodejs.org/en/)
  - [Express](https://expressjs.com/)
  - [Nodemailer](https://github.com/nodemailer/nodemailer)
  - [MySQL](https://github.com/mysqljs/mysql)
  - [Babel](https://babeljs.io/)
- [Python Data Handling](https://www.python.org/) - [Repository Here](https://github.com/ctaylor4874/python_sqs_data_scraper)
  - [Boto 3](https://boto3.readthedocs.io/en/latest/)
  - [Boto Core](https://botocore.readthedocs.io/en/latest/)
  - [MySQL Client](https://pypi.python.org/pypi/mysqlclient)
  - [NumPy](http://www.numpy.org/)
  - [Pandas](http://pandas.pydata.org/)
  - [SQLAlchemy](https://www.sqlalchemy.org/)