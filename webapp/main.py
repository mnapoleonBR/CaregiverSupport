from flask import render_template, Flask
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html', names=['Chelse', 'Elaine', 'Jared', 'Tyler', 'Valeria'])

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
