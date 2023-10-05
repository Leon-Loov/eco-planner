# eco-planner
A tool intended to help planning actions to achieve local environmental goals

## Setup
This tool requires the following environment variables to be set:
- `IRON_SESSION_PASSWORD`: Should be a string at least 32 characters long. This is used to encrypt the session cookie from the Iron Session library.
- `DATABASE_URL`: Should be a connection string to a database. This is used by Prisma to connect to the database. The default configuration expects a MySQL database but this can be changed in the `prisma/schema.prisma` file.

1. Install dependencies with `yarn install`
2. Depending on which database you're connecting to, do one of the following:
    - If you're working against the dev database, run `yarn prisma migrate dev` to apply the migrations to the database.
    - If you're working against the production database, run `yarn prisma migrate deploy` to apply the migrations to the database. (This should be done as part of the deployment process.)

Now you should be able to run the app with `yarn dev` and access it at http://localhost:3000 or build it with `yarn build` and run it with `yarn start`.