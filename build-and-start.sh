#!/bin/bash

# Build script to build client and server side of project
# Requires "dev" or "prod" as argument
# dev - just starts one process to use for development
# prod - restarts the running (production needs to be
#        started manually for initial run) pm2 app

mode=$1

if [ -z "$mode" ]; then
  echo "Please provide mode as 1st arg - dev or prod!"
  exit 0
fi

if cd client && npm install && npm run build; then
  cd ..
  if cd server && npm install; then
    if [ "$mode" = "dev" ]; then
      if ! node index.js; then
        echo "Either there is a failure on server or server was killed!"
      fi
    elif [ "$mode" = "prod" ]; then
      if ! pm2 restart tic-tac-toe; then
        echo "Failed to restart server!"
      fi
    fi
  else
    echo "Failed to install npm dependencies on server!\n"
  fi
else
  echo "Failure on client!\n"
fi
