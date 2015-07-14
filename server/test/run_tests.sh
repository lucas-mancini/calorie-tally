#!/bin/sh

TEST_DB_NAME=calorie-tally-test-db

# Set different port to spawn a new instance of the app
export PORT=8090

# Set different database URI to use test database
export MONGO_DATABASE=mongodb://localhost:27017/$TEST_DB_NAME

if [ -z `which mongo` ]; then
  echo "ERROR: The command 'which mongo' returned nothing.  Need to have the mongo shell on your path."
  exit 1
fi

echo "Dropping database: $TEST_DB_NAME"
mongo $TEST_DB_NAME --eval "db.dropDatabase()" 2>&1 >/dev/null

LOG_FILE=test.log

node ../server.js > $LOG_FILE 2>&1 &
# Grab PID of background process
NODE_PID=$!
echo "Node.js app launching on PID: ${NODE_PID}.  Starting tests in 2 seconds.  Log files for the Node.js app are logged to $LOG_FILE"

# Give some time for the app to start
sleep 2

# Run tests
mocha *.js

# Kill background node process
kill $NODE_PID