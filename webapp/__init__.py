from flask import Flask, abort
from webapp.helpers import template
from webapp.resources_list import resources_list
import os

app = Flask(__name__)

questions = [
    {
        "description": "What is your favorite color?",
        "options": [
            {"val": "red", "text": "Red"},
            {"val": "blue", "text": "Blue"},
            {"val": "green", "text": "Green"}
        ]
    },
    {
        "description": "What is your favorite Japanese food?",
        "options": [
            {"val": "ramen", "text": "Ramen, duh."},
            {"val": "udon", "text": "Udon!"},
            {"val": "sukiyaki", "text": "Sukiyaki!"}
        ]
    },
    {
        "description": "Which is better, Ratty or Vdub??",
        "options": [
            {"val": "ratty", "text": "Ratty"},
            {"val": "vdub", "text": "Vdub"}
        ]
    }
]

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

