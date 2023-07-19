# 🎵 Karakoke

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)

## Overview

Karakoke is a web-based application that brings the fun of karaoke right to your home. It allows users to browse through a vast library of songs and sing their hearts out!

## Features

- **User Authentication**: Users can register, log in, and log out. They can also use their Google or Facebook accounts to log in.
- **Song Library**: Our app includes an extensive library of songs, organized by categories. Users can browse through them or use the search bar to find specific songs.

## Tech Stack

- Frontend: React.js
- Backend: FastAPI
- Database: PostgreSQL
- Authentication: JWT, Google and Facebook Login
- Deployment: Docker

## Installation

1. Clone this repository to your local machine.

```bash
git clone https://github.com/Trsa993/karakoke.git
```

2. Install dependencies.

- Frontend

```bash
cd frontend
npm install
```

- Backend

```bash
cd backend
pip install -r requirements.txt
```

3. Set up your environment variables.

.env file for backend:

```bash
DATABASE_HOSTNAME=
DATABASE_PORT=
DATABASE_PASSWORD=
DATABASE_NAME=
DATABASE_USERNAME=

ACCESS_TOKEN_EXPIRES_IN=
REFRESH_TOKEN_EXPIRES_IN=

JWT_ALGORITHM=
JWT_PRIVATE_KEY=
JWT_PUBLIC_KEY=


GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

SECRET_KEY=
```

4. Run the application

- Frontend

```bash
cd frontend
npm start
```

- Backend

```bash
cd backend
uvicorn app.main:app --reload
```
