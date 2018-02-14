import os
from webapp import app
from webapp.helpers import env_is_dev

# bind to PORT if defined, otherwise default to 8080.
port = int(os.environ.get('PORT', 5000))
app.run(host='0.0.0.0', port=port, debug=env_is_dev())
