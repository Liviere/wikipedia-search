#!/bin/sh
# Load Environment Variables from .env file.
echo Loading Environment Variables...
if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

if [ -z $PORT ]
then
  PORT=3000
fi