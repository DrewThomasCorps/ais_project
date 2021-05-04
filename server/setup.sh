#!/usr/bin/env bash
yarn
mongorestore --drop --gzip --archive="data/AISTestData.bson.gz"
mongorestore --drop --gzip --archive="../ais_feed/AISFeed.bson.gz"
cp -n .env.example .env
node ./setup.js

cd ../client && yarn
cd ../ais_feed && yarn
