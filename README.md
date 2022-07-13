# Meeting Scheduler

Make and view meetings or class schedules and use a real-time 
online whiteboard in your browser on desktop, tablet, or smartphone.

* Users can be selected conveniently in drop-down menus when scheduling meetings. 
* Personalized meeting times and dates are displayed for each user. 
* Users can share an online real-time whiteboard.
* Sign up and Login authenticates users and keeps track of schedules between logins.
* Content Security Policy protects the site from inline script and style hacks. 

This project uses React, Javascript, NodeJS, Express, Nginx, Socket.io, Canvas, PostgreSQL, Knex, Webpack, Flexbox, SCSS, and JSON Web Tokens.

<img src="./images/schedulePage.jpg">

<img src="./images/whiteboard.jpg">

# Installation
* The site is configured to use an Express server for both http and socket.io with an Nginx server as a reverse proxy. The Express server is configured in the server/index.js file. An example nginx.conf file for Nginx server configuration with the needed "proxy pass" set up is included. 
* Select the port to be used for the socket.io server (such as 3000) and put it in config.js.
* Choose a jwt (JSON web token) secret and put it in server/config.js. 
* Create a PostgreSQL database with tables and table columns as in the included example_tables.txt example file.  
* The project is configured by default for localhost http to enable a quick setup for local experimentation, but with necessary changes for https included in comments. Certificate paths should be included in server/config.js.
* Install nodeJS.
* Run "yarn install" to install all needed nodejs packages and dependencies.
* Start the Nginx server (if used) and PostgreSQL database.
* Run "npm start" to start the Express server.

# Notes
* To enhance security from inline scripting and styling hacks, inline scripting and styling were minimized and Content Security Policy (CSP) was implemented. Styled Components (SC) was originally used, but since it functions primarily by converting SC statements to inline styling, SC was replaced with SCSS files.
