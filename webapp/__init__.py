from flask import Flask, abort
from webapp.helpers import template
from webapp.resources_list import resources_list
from webapp.survey_questions import questions

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
    if resource_name in resources_list:
        return template(resource_name)
    abort(404)

@app.route('/local-resources')
def local_resources():
    return template('localresources')
