# Meeting Scheduler

Make and view meetings or class schedules and use a real-time online whiteboard in your browser on desktop, tablet, or smartphone.

* Registered users, meeting types, dates and times, and all details can be quickly selected in drop-down menus when scheduling meetings. 
* Each user's meeting times and dates, whether scheduled by themselves or others, are displayed for them on login. 
* Dates for a series of meetings can be calculated and registered automatically by entering only the date and time of the first meeting, meeting weekdays, and the number of weeks. For example, for a New Project meeting to be held on Tuesdays and Thursdays for three weeks beginning Thursday, April 7 from 10:00 a.m. to 11:00 a.m., by specifying only these things, each meeting for the appropriate dates and times will be automatically entered in each attendee's schedule.
* Meetings are shown with unique ID numbers. The ID number can be entered to display all attendees and quickly cancel the meeting on a user's schedule if desired with a click.
* Meetings are internally registered in Coordinated Universal Time (UTC) and times are converted automatically to local time for each user on login.
* When scheduling a meeting, the user is automatically alerted to any conflicts with existing meetings and is given a chance to reschedule or leave the overlapping meeting time as is.
* Login and access are authenticated with JWT (or Django Session Authentication in the Django version).

This project uses React, Node.js, Javascript, Express server, Nginx, Socket.IO, Canvas, PostgreSQL, Knex, Webpack, Flexbox, SCSS, and JSON Web Tokens (JWT). A version using MongoDB and another using Django/Python + React are also available.

![schedulerpage.png](https://github.com/tom4244/meeting_scheduler/blob/main/src/app/img/schedulerpage.png?raw=true)

![whiteboard.png](https://github.com/tom4244/meeting_scheduler/blob/main/src/app/img/whiteboard.png?raw=true)

# Installation
* The site uses an Express server for both http and socket.io with an Nginx server as a reverse proxy. The Express server is configured in the server/index.js file. An example nginx.conf file for Nginx server configuration with the needed "proxy pass" set up is included. 
* Select the port to be used for the socket.io server (3000 is given as default) and put it in config.js.
* Choose a jwt (JSON web token) secret and put it in server/config.js. 
* Create a PostgreSQL database with tables and table columns as in the included example_tables.txt example file.  
* The project is configured by default for localhost http to enable a quick setup for local experimentation, but with necessary changes for https included in comments. Certificate paths should be included in server/config.js.
* Install nodeJS and yarn if they are not installed.
* Run "yarn install" to install all needed nodejs packages and dependencies.
* Start the Nginx server and PostgreSQL database.
* Run "npm start" to start the Express server.

