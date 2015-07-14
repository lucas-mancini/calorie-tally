# Calorie Tally

Sample calorie counter app, Node.js backend and Single Page Application frontend using Bootstrap and Knockout.

[ADD SCREENSHOT]

## Technology stack

Front End: (see client folder)
  * Jade templating language
  * Bootstrap
  * Sammy
  * Knockout.js
  * jQuery
  * Grunt

Back End: (see server folder)
  * Node JS
  * Express
  * Other libraries: mocha, supertest, jsonwebtoken, bcrypt

Database:
  * MongoDB and Mongoose

Yeoman generator used for Front End: https://github.com/leszekhanusz/generator-knockout-bootstrap/tree/master/app/templates

## How to run app

0. Clone git repository.

### Server:

1. Install MongoDB, and use the mongo shell to run 'use calorie-tally-db' so a new database is created. The connection URI used from the app is: 'mongodb://localhost:27017/calorie-tally-db'.
2. On the server folder, run 'node server.js' (you can use nodemon as well), to start the REST API. The API can be accesed on http://localhost:8080/api.

### Client:

1. Install all dependencies using 'npm install' and 'bower install'.
2. Use 'grunt' to build app, and 'grunt serve' to serve it and monitor changes at http://localhost:9000.

## How to run tests

1. Install mocha: 'npm install -g mocha'.
2. Use mongo shell to run 'use calorie-tally-test-db', to create a database for testing purposes.
2. Execute run_tests.sh, it will spawn a separate instance of the application under a different port, and using the test database, and then, it runs the 'mocha' command, which will run all files under test/*.js. 

## Authentication and Authorization

* Hashed passwords are stored on the DB, never in plain text. I am using bcrypt to hash the password with a salt.
* A JSON Web Token authentication mechanism was implemented. The user then presents his/her credentials (user name and password), so the backend validates this information with the credentials stored on the DB. If this step is successful, a token is generated, and returned to the user, who will securely store it and use it on every request perform, by passing the token on the header of the HTTP request. 

* Regarding authorization, it is worth mentioning two things:
  * a) Some routes are only allowed for admin users, such as 'GET /users' (to get all users information), 'GET /meals' (to get all meals) and 'DELETE /users', to remove users.
  * b) On other routes, mainly the ones that update and create new content, if the user is not admin, it will only be allowed to create/update his own records.

