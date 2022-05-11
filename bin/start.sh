#!/bin/sh

# Load Environment Variables from .env file.
. ./bin/load-env.sh

nodejs src/server.js