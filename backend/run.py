import sys
import os

# Ensure project root is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import create_app
from backend.config import Config

app = create_app()

if __name__ == '__main__':
    print(f"Starting REALM Life RPG Flask Backend on http://localhost:{Config.PORT}...")
    app.run(host='0.0.0.0', port=Config.PORT, debug=(Config.FLASK_ENV == 'development'))
