# Jelli

Jelli is a web app to help others organize their tasks and manage their projects. Utilizes a React front-end to display information retrieved from the Django Rest API back-end. Inspired by Trello.

## Installation

1. Clone repository

```bash
git clone https://github.com/Madelovina/Jelli
```

2. Install the following python modules

```bash
pip install djangorestframework django-cors-headers
```

3. Set the secret key in `server/settings.py`

4. Change to the `/client` directory and install the Node.js modules

```bash
cd client
npm install
```

## Usage

1. Initialize client

```bash
cd client
npm start
```

2. Initialize server

```bash
cd server
python manage.py runserver
```