from flask import Flask
from helpers import template
import os

app = Flask(__name__)

questions = [
    {
        "description": "What is your favorite color?",
        "button_text": "next",
        "options": [
            {"name": "red", "text": "Red"},
            {"name": "blue", "text": "Blue"},
            {"name": "green", "text": "Green"}
        ]
    },
    {
        "description": "What is your favorite Japanese food?",
        "button_text": "next",
        "options": [
            {"name": "ramen", "text": "Ramen, duh."},
            {"name": "udon", "text": "Udon!"},
            {"name": "sukiyaki", "text": "Sukiyaki!"}
        ]
    }
]

@app.route('/')
def home():
    return template('home', names=['Chelse', 'Elaine', 'Jared', 'Tyler', 'Valeria'])

@app.route('/calendar')
def calendar():
    return template('calendar')

@app.route('/nationalresources')
def nationalResources():
    return template('nationalresources')

@app.route('/test')
def test():
    return template('survey', questions=questions)

