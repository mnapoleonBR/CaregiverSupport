from flask import Flask, abort, request, session, redirect
import flask
from webapp.helpers import template, createKeywordToResourceMap, validateResourceList
from webapp.resources_list import resourceInfoMap
from webapp.survey_questions import questionnaire_questions, topic_list_options
import json
import os
import requests
from datetime import datetime


import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery

import webapp.emailUtils
import webapp.oauthUtils
import webapp.parseUtils

# This variable specifies the name of a file that contains the OAuth 2.0
# information for this application, including its client_id and client_secret.
CLIENT_SECRETS_FILE = "client_secret.json"

# This OAuth 2.0 access scope allows for full read/write access to the
# authenticated user's account and requires requests to use an SSL connection.
SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/calendar']
API_SERVICE_NAME = 'calendar'
API_VERSION = 'v3'

# Allows for http for oath2, should be changed at some point
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app = Flask(__name__)

app.secret_key = 'CHANGE THIS EVENTUALLY'

@app.route('/')
def home():
    return template('index')

@app.route('/news')
def news():
    return template('news')

@app.route('/calendar')
def calendar():
    return template('calendar')

@app.route('/national-resources')
def national_resources():
    return template('nationalresources')

@app.route('/resource/<resource_name>')
def resource_page(resource_name):
    if resource_name in resourceInfoMap:
        return template(resource_name)
    abort(404)

@app.route('/local-resources')
def local_resources():
    # Once the resources are settled, we shouldn't be making this function call everytime. 
    # Just dump the results in another Python file.
    keywordToResources = json.dumps(createKeywordToResourceMap(resourceInfoMap))
    return template('localresources', keywordToResources=keywordToResources, resourceInfoMap=resourceInfoMap)

@app.route('/connections')
def connections():
    return template('connections')

@app.route('/questionnaire')
@app.route('/questionnaire/restart')
def questionnaire():
    received_restart_request = request.path == '/questionnaire/restart'
    if received_restart_request and session.get('personalized_resources'):
        session.pop('personalized_resources')

    # check if there are already results stored in the session
    stored_results = session.get('personalized_resources')
    existing_results = stored_results and (len(stored_results) > 0)
    return template('survey', 
      questionnaire_questions=questionnaire_questions, 
      topic_list_options=topic_list_options,
      existing_results=existing_results)

@app.route('/questionnaire-submit', methods=['POST'])
def questionnaire_submit():
    relevantResourceIds = json.loads(request.get_data())

    # make sure all the results are valid resources
    # if not validateResourceList(relevantResourceIds, resourceInfoMap):
    #     return json.dumps({'error_message': 'Invalid resources'}), 400

    session['personalized_resources'] = relevantResourceIds

    return json.dumps({'redirect_link': '/questionnaire-results'})
    

@app.route('/questionnaire-results')
def questionnaire_results():
    resource_results = session['personalized_resources']
    if not resource_results:
        return redirect("/questionnaire")

    # TODO: this is hardcoded, remove later
    resource_results = ['veterans', 'stress']

    return template('questionnaire-results', resources=resource_results, resourceInfoMap=resourceInfoMap)


@app.route('/submitMessage', methods=['POST'])
def submitMessage():
    msg = emailUtils.createConnectionsMessage(request)
    emailUtils.send_email(msg)
    return 'success'

@app.route('/getLinks', methods=['GET'])
def getLinks():
  parseUtils.getAllLinks()
  return 'success'

##################### Calendar Stuff #####################

# Send email event to BakerRipley employee for approval
@app.route('/submitEvent', methods=['POST'])
def submitEvent():
    msg = emailUtils.createEventEmail(request)
    emailUtils.send_email(msg)
    return 'success'

# Add event to BakerRipley Google Calendar
@app.route('/createEvent')
def createEvent():
    CALENDAR_ID = 'jh4k25spig0mj610ipq0de83h0@group.calendar.google.com'
    timezone = 'America/Chicago'
    dateFormat = "%m/%d/%Y %I:%M %p"

    if 'event-name' not in flask.session:
        flask.session['event-name'] = request.args.get('event-name')
        flask.session['event-location'] = request.args.get('event-location')
        flask.session['event-description'] = request.args.get('event-description')
        flask.session['start-date'] = request.args.get('start-date')
        flask.session['end-date'] = request.args.get('end-date')

    summary = flask.session['event-name'] 
    location = flask.session['event-location'] 
    description = flask.session['event-description'] 
    startDate = flask.session['start-date'] 
    endDate = flask.session['end-date'] 

    startDateFormatted = datetime.strptime(startDate, dateFormat).isoformat('T')
    endDateFormatted= datetime.strptime(endDate, dateFormat).isoformat('T')

    event = {
      'summary': summary,
      'location': location,
      'description': description,
      'start': {
        'dateTime': startDateFormatted,
        'timeZone': timezone,
      },
      'end': {
        'dateTime': endDateFormatted,
        'timeZone': timezone,
      }
    }

    if 'credentials' not in flask.session:
        return flask.redirect('authorize', code=307)

    # Load credentials from the session.
    credentials = google.oauth2.credentials.Credentials(
      **flask.session['credentials'])

    service = googleapiclient.discovery.build(
      API_SERVICE_NAME, API_VERSION, credentials=credentials)

    event = service.events().insert(calendarId=CALENDAR_ID, body=event).execute()

    print(event)

    # Save credentials back to session in case access token was refreshed.
    # ACTION ITEM: In a production app, you likely want to save these
    #              credentials in a persistent database instead.
    flask.session['credentials'] = oauthUtils.credentials_to_dict(credentials)

    flask.session.pop('event-name')
    flask.session.pop('event-location')
    flask.session.pop('event-description')
    flask.session.pop('start-date')
    flask.session.pop('end-date')

    return template('success')

@app.route('/authorize')
def authorize():
  # Create flow instance to manage the OAuth 2.0 Authorization Grant Flow steps.
  flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
      CLIENT_SECRETS_FILE, scopes=SCOPES)

  flow.redirect_uri = flask.url_for('oauth2callback', _external=True)

  authorization_url, state = flow.authorization_url(
      # Enable offline access so that you can refresh an access token without
      # re-prompting the user for permission. Recommended for web server apps.
      access_type='offline',
      # Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes='true')

  # Store the state so the callback can verify the auth server response.
  flask.session['state'] = state

  return flask.redirect(authorization_url, code=307)


@app.route('/oauth2callback')
def oauth2callback():
  # Specify the state when creating the flow in the callback so that it can
  # verified in the authorization server response.
  state = flask.session['state']

  flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
      CLIENT_SECRETS_FILE, scopes=SCOPES, state=state)
  flow.redirect_uri = flask.url_for('oauth2callback', _external=True)

  # Use the authorization server's response to fetch the OAuth 2.0 tokens.
  authorization_response = flask.request.url
  flow.fetch_token(authorization_response=authorization_response)

  # Store credentials in the session.
  # ACTION ITEM: In a production app, you likely want to save these
  #              credentials in a persistent database instead.
  credentials = flow.credentials
  flask.session['credentials'] = oauthUtils.credentials_to_dict(credentials)

  return flask.redirect(flask.url_for('createEvent'), code=307)

