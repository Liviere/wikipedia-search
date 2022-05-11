#!/bin/sh

# Load Environment Variables from .env file.
. ./bin/load-env.sh

nodemon src/server.js