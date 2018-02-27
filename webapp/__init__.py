from flask import Flask
from helpers import template
import os

app = Flask(__name__)

@app.route('/')
def home():
    return template('home', names=['Chelse', 'Elaine', 'Jared', 'Tyler', 'Valeria'])

@app.route('/calendar')
def calendar():
    return template('calendar')

