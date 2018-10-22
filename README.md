# Quick starter for nextjs / hasura / magic link login

I really like the way that zeit.co uses "passwordless" authentication. This starter uses nextjs with a custom graphql api which uses schema stitching to pull together the hasura provided api with some custom queries and mutations that handles auth and passes a JWT token on to hasura. From there, Hasura's built in security and permission system handles the rest.

## Current Features
* The /dashboard route is protected by auth by wrapping in the "PleaseSignIn" component.
* Users will provide an email address and receive a "magic link" in their email. They click on the provided link and are logged in automatically.
* If no such user exists in the database, they are presented with a registration view to collect any additional info you want from the user before proceeding.

## Decision decisions / important notes
* I chose to use tachyons for css, but you could swap out with any css solution. 
* I opted to colocate my graphql api with the nextjs server, but these could be split out into separate services.
* I am using the premium version of fontawesome, which requires some additional npm setup. IF you want to skip this, then change icon selections to use free varieties. 

## Deployment:
1. Deploy an Hasura instance. The heroku quickstart deployment is adequate: https://docs.hasura.io/1.0/graphql/manual/getting-started/heroku-simple.html
2. Clone example.env to variables.env
3. Add in the new hasura endpoint into the variables.env variable **HASURA_GRAPHQL_ENGINE_URL**
4. Lock down your hasura instance and record the access key into the variables.env **ACCESS_KEY**
5. Find the direct postgres connection string and add to the variables.env variable it to **PG_CONNECTION_STRING**. This is necessary for the custom resolvers.
6. Fill in the SMTP email credentials in the variables.env variables **MAIL_HOST**, **MAIL_PORT**, **MAIL_USER**, **MAIL_PASS**, **EMAIl_SENDER**. I use mailtrap for quick development testing of emails.
7. Add in some kind of secret key used for signing JWT tokens into variables.env **APP_SECRET**. Make sure to also add the relevant heroku environmental variables. In my case it is setting the Heroku environmental variable **HASURA_GRAPHQL_JWT_SECRET** to value `{"type": "HS256", "key":"<APP_SECRET_HERE>"}`
8. Set up a users table in hasura which has the following columns:
    * id - primary key
    * name - text
    * email - text / unique
    * loginToken - text
    * loginTokenExpiry - text