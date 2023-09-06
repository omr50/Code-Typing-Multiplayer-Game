# Code-Typing-Multiplayer-Game

## Microservice based Code Typing multiplayer game.

## Summary & Motivation
This is a web browser game similar to type racer except instead of typing out sentences or quotes,
the user will type out code snippets. I created this project to help myself and others get better
at typing since we are all used to typing essays or emails from a young age but a lot of the keys that
are used in programming like parenthesis, semi colon, brackets, underscore, etc. are not used commonly
so we tend to be much slower when coding then typing. Using this to practice I can type code much
faster than before. There is also a wide selection of languages that the user can choose to practice in
such as:
* Javascript
* Java
* C
* Go
* C++
* Python
* Typescript
* HTML
* C#
* Kotlin
(I might add more languages in the future depending on demand)

## Technologies Used
React, Node.js, Express.js, Typescript, Web Sockets, Postgres, Sequelize, Chart.js, Microservice Architecture

## Project in Action

![Imgur](https://i.imgur.com/ogfC6j2.png)
*User practicing Javascript typing speed in single player mode.*


![Imgur](https://i.imgur.com/3C0JtZd.png)
*Two Logged in users racing against eachother in a multiplayer code typing game.*


![Imgur](https://i.imgur.com/s0nWgT6.png)
*User practicing Python in single player. Red highlight when user makes an errror.*


![Imgur](https://i.imgur.com/ZD6C54p.png)
*Analytics Visualization: Post-game analytics such as interactive graphs, 
providing users insights into their coding speed, mistake patterns, and 
overall improvement over time.*


![Imgur](https://i.imgur.com/LzCxY3E.png)
*Client and server side validation of user sign up.*


![Imgur](https://i.imgur.com/7QkdIVg.png)
*User switched to login screen after successful initial signup.*


![Imgur](https://i.imgur.com/NXRzZJX.png)
*Analytics like before, but user enabled light theme.*


**How to Run Project Locally

1. Clone the repository.
2. Make sure you have docker installed.
Run the following commands:

  docker-compose up --build

  python db_csv_insert.py

Docker compose will run all of the services.

Running the python script will load the snippets
into the database. Make sure to only run the python
script once the database is actually up and running.







