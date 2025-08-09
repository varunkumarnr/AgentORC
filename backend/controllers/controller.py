from flask import jsonify
from services.service import SimpleService

class SimpleController:
    """Controller class for handling requests."""

    @staticmethod
    def get_status():
        """Handle GET requests to /status."""
        return SimpleService.get_status()