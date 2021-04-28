#!/usr/bin/env bash
yarn
mongorestore --drop --gzip --archive="data/AISTestData.bson.gz"
cp -n .env.example .env
node ./setup.js

cd ../client && yarn
