from app import db

class Memory(db.Model):
    id = db.Column(db.String, primary_key=True)  
    requirement = db.Column(db.Text, nullable=True)
    subtasks = db.Column(db.JSON, nullable=True)
    previous_response = db.Column(db.Text, nullable=True)
    final_response = db.Column(db.JSON, nullable=True)

    def get_subtasks(self):
        return self.subtasks if self.subtasks else []

 