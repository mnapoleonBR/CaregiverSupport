from flask import Flask
from helpers import template
import os

app = Flask(__name__)

@app.route('/')
def home():
    return template('home', names=['Chelse', 'Elaine', 'Jared', 'Tyler', 'Valeria'])

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
