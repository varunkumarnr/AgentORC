import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from a .env file

class Config:
    """Base configuration."""
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:admin@localhost:5432/AgentORC')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PS_CHAT_TOKEN = os.getenv('PS_CHAT_TOKEN')
    GOOGLE_API_KEY=os.getenv('GOOGLE_API_KEY')
    TAVILY_API_KEY=os.getenv('TAVILY_API_KEY')
    JIRA_API_TOKEN=os.getenv('JIRA_API_TOKEN')
    JIRA_USERNAME=os.getenv('JIRA_USERNAME')
    JIRA_INSTANCE_URL=os.getenv('JIRA_INSTANCE_URL')
    JIRA_CLOUD=os.getenv('JIRA_CLOUD', True)
    DEBUG = False
    TESTING = False
