![islands](/src/images/logo-o.png?raw=True)

*A logic game where you build islands using a few simple rules*

## Introduction
![gameplay](/src/images/islands-gameplay.png?raw=True)

Islands is a fullstack implementation of the Japanese puzzle game [Nurikabe](https://en.wikipedia.org/wiki/Nurikabe_(puzzle)) hosted [here](https://islands-94307.web.app). This game is similar to Minesweeper, where you use numbers given within the grid to determine which tiles are land and which are water. Learn how to play, keep track of your stats, compare your scores to others, and immerse yourself in the world of Nurikabe puzzles :)


## Built With
#### Frontend 
* [![React][React.js]][React-url]
* ![HTML][HTML5]
* ![CSS3][CSS3]

#### Backend
* [![Node][Node.js]][Node-url]
* [![Express][Express.js]][Express-url]
* [![Python][Python]][Python-url]

#### Database
* [![Postgres][Postgres]][Postgres-url]
* [![Firebase Authentication][FirebaseAuth]][FirebaseAuth-url]

#### Hosting
* [![Heroku][Heroku]][Heroku-url]
* [![Firebase][Firebase]][Firebase-url]


## Features
* Tutorial to teach you all the rules
* Various levels of difficulty
* User authentication
* User statistics
* Leaderboards


## Getting Started
Provide step-by-step instructions on how to set up and run your project locally. Include prerequisites (e.g., Node.js installed) and commands to clone the repository, install dependencies, and start the development server.

### Prerequisites
* npm
  ```sh
  npm install npm@latest -g
  ```
* PostgreSQL
- Download and Install [PostgreSQL](https://www.postgresql.org/download/)
- Follow the installation instructions based on your operating system (Windows, macOS, Linux).
- Start the PostgreSQL service after installation.


### Installation
1) Clone the repository
```
git clone https://github.com/sterfd/Islands.git
```

2) Navigate into the project directory
```
cd islands
```

3) Install dependencies
```
npm install
```

4) Navigate into the server directory
```
cd server
```

5) Import Database Schema and Data:
```
psql -d your_database_name -f islands.sql
```

6) Install dependencies
```
npm install
```

7) Start the backend development server
```
npm start
```

8) Navigate into the main directory and create a .env File:
```
cd ..
# Create .env and save the following:
DATABASE_URL=postgres://your_postgres_username:your_postgres_password@localhost:5432/your_database_name
# Replace your_postgres_username, your_postgres_password, and your_database_name with your PostgreSQL credentials and database name.
```

9) Start the development server
```
npm start
```

<!-- MARKDOWN LINKS & IMAGES -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Heroku]: https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white
[Heroku-url]: https://www.heroku.com
[Firebase]: https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase
[Firebase-url]: https://firebase.google.com
[FirebaseAuth]: https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34
[FirebaseAuth-url]: https://firebase.google.com/docs/auth
[Postgres]: https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
[Postgres-url]: https://www.postgresql.org
[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express-url]: https://expressjs.com
[Node.js]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en
[CSS3]: https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white
[HTML5]: https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white
[Python]: https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54
[Python-url]: https://www.python.org

