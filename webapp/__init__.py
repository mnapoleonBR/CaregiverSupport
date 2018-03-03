from flask import Flask
from webapp.helpers import template
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
    return template('home')

@app.route('/news')
def news():
    return template('news')

@app.route('/calendar')
def calendar():
    return template('calendar')

@app.route('/nationalresources')
def nationalResources():
    return template('nationalresources')

@app.route('/assessment')
def test():
    return template('survey', questions=questions)

