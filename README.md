## Meny v2

This repository contains the code for Meny, a recipe sharing web application.

It is a rewrite of the original Meny, with more complete features and different technologies that I want to experiment a bit more with.

This is a work in progress and for now the application is not yet functional, only parts of the API are currently exposed.

### Technologies

Node.js, Nestjs, Prisma, Postgres, React, Next, Turborepo

### Development

* Install dependencies: `npm install`
* Create env files: `cp apps/api/env/development.example.env apps/api/env/development.env` (repeat for all env files)
* Spin up the postgres db: `docker-compose up meny-db` (optionally with `-d`)
* Start the dev environment: `npm run dev`