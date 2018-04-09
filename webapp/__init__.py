from flask import Flask, abort
from webapp.helpers import template, createKeywordToResourceMap
from webapp.resources_list import resourceToKeywords
from webapp.survey_questions import questions
import json

app = Flask(__name__)

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

@app.route('/assessment')
def test():
    return template('survey', questions=questions)

@app.route('/resource/<resource_name>')
def resource_page(resource_name):
    if resource_name in resourceToKeywords:
        return template(resource_name)
    abort(404)

@app.route('/local-resources')
def local_resources():
    # Once the resources are settled, we shouldn't be making this function call everytime. 
    # Just dump the results in another Python file.
    keywordToResources = json.dumps(createKeywordToResourceMap(resourceToKeywords))
    return template('localresources', keywordToResources=keywordToResources)
