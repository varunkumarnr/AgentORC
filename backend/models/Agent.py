from app import db

class Agent(db.Model):
    id = db.Column(db.String(80), primary_key=True)
    description = db.Column(db.Text, unique=False, nullable=True)
    role = db.Column(db.Text, unique=False, nullable=True)
    goal = db.Column(db.Text, unique=False, nullable=True)
    backstory = db.Column(db.Text, unique=False, nullable=True)
    llm = db.Column(db.Text, unique=False, nullable=True)
    tools = db.Column(db.Text, unique=False, nullable=True)
    system_template = db.Column(db.Text, unique=False, nullable=True)
    prompt_template = db.Column(db.Text, unique=False, nullable=True)
    response_template = db.Column(db.Text, unique=False, nullable=True)
    type = db.Column(db.Text, unique=False, nullable=True)
    save_memory = db.Column(db.Text, unique=False, nullable=True)
    agent_type = db.Column(db.Text, unique=False, nullable=True)

    def __repr__(self):
        return f'<Agent {self.id}>'
    def set_tools(self, tools_list):
        self.tools = ','.join(tools_list)
    def get_tools(self):
        return self.tools.split(',')
