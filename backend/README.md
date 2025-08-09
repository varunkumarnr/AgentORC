# AgentORC Backend documentation

## Installation

**Prerequisites**

1. Python 3.x
2. pip (Python package manager)
3. PostgreSQL (or any other preferred database)

**Clone the Repository**

```bash
  git clone https://github.com/varunkumarnr/AgentORC.git
  cd AgentORC/backend
```

**Setting Up the Backend**

```bash
    cd backend
    python3 -m venv venv
    source venv/Scripts/activate
    # if your not real programmer and still using  command promond first get pychiartist help and than run the following venv\Scripts\activate
```

**Install Backend Dependencies**

```bash
    pip install -r requirements.txt
```

**Set Up Environment Variables**

add the following in <b>.env</b>

```plaintext
    DATABASE_URL=postgresql://username:password@localhost:5432/DBNAME
```

add the following in <b>.flaskenv</b>

```plaintext
    FLASK_APP=wsgi.py
    FLASK_ENV=development
    FLASK_DEBUG=True
```

**Initialize the Database**

```bash
    flask db init
    flask db migrate -m "Initial migration"
    flask db upgrade
```

**Run the Flask Application**

```bash
    flask run
```

The Flask app should now be running on http://127.0.0.1:5000/.

Thanks and good job
