# hmpps-digital-prison-reporting-mi-ui

[![repo standards badge](https://img.shields.io/badge/dynamic/json?color=blue&style=flat&logo=github&label=MoJ%20Compliant&query=%24.result&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-digital-prison-reporting-mi-ui)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-digital-prison-reporting-mi-ui 'Link to report')
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-digital-prison-reporting-mi-ui/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-digital-prison-reporting-mi-ui)

# Instructions

This is an HMPPS project that has been created as part of bootstrapping -
see https://github.com/ministryofjustice/hmpps-project-bootstrap.

This bootstrap is community managed by the mojdt `#typescript` slack channel.
Please raise any questions or queries there. Contributions welcome!

Our security policy is located [here](https://github.com/ministryofjustice/hmpps-digital-prison-reporting-mi-ui/security/policy).

More information about the template project including features can be found [here](https://dsdmoj.atlassian.net/wiki/spaces/NDSS/pages/3488677932/Typescript+template+project).

## Running the app

The easiest way to run the app is to use docker compose to create the service and all dependencies.

`docker-compose pull`

`docker-compose up`

### Dependencies

The app requires:

- hmpps-auth - for authentication
- redis - session store and token caching

#### Managing dependencies

This app uses [hmpps-npm-script-allowlist](https://github.com/ministryofjustice/hmpps-typescript-lib/tree/main/packages/npm-script-allowlist) to restrict pre/post install scripts to help mitigate attacks using this vector. Any `npm ci` that you would normally execute or put in scripts, should be replaced by `npm run setup` which ensures the allowlist checks are run. This library forbids post/preinstall scripts to run as part of `npm i`, so if the library you are installing depends on them, you should check first whether it's a trustworthy library and whether there's an alternative, but if not, you will need to run `npm run setup` afterward and go through the warnings that pop up for it and check any scripts it needs.

Whenever a library bump is required for one of the scripts in the [allowlist](./.allowed-scripts.mjs), you should:
1) Run `npm run setup` - it will prod you that you need to update the allowlist to allow the new version
2) Check - has the script changed (e.g. `postinstall: "node install.js"`? Look at changes in the package.json between the previous version in the allowlist and the one you've updated to
3) If it did, check the updated package.json script and any scripts it triggers
4) If it did not, check the script file it references. For example, ESBuild has a `postinstall` script of `node install.js` - so we should if that changed.

How to check a post/preinstall script?

Often it will be in the root of the github repo or in a `scripts` folder, but sometimes it is not. For example, again taking ESBuild, if we [search for install.js](https://github.com/search?q=repo%3Aevanw%2Fesbuild%20install.js&type=code) we can see it comes from (at the time of writing) `lib/npm/node-install.js`, so we should check this script, and if we're checking after an upgrade, we should check this script didn't change between previous version in our allowlist and current. If it didn't change, we don't have to worry at all. If it did, we should do our due diligence and check we're ok with what it is doing.

If you're not sure, please ask a TA or seek help in the #typescript channel on Slack.

### Running the app for development

To start the main services excluding the example typescript template app:

`docker-compose up --scale=app=0`

Install dependencies using `npm install`, ensuring you are using `node v18.x` and `npm v9.x`

Note: Using `nvm` (or [fnm](https://github.com/Schniz/fnm)), run `nvm install --latest-npm` within the repository folder to use the correct version of node, and the latest version of npm. This matches the `engines` config in `package.json` and the CircleCI build config.

And then, to build the assets and start the app with nodemon:

`npm run start:dev`

### Run with local redis

Install Redis
`brew install redis`

Run the Redis Server
`redis-server`

Download the postgres driver (for the API) and put in the project root: https://jdbc.postgresql.org/download/postgresql-42.6.0.jar

And then, to build the assets and start the app with nodemon:

`npm run start:dev`

### Run with HMPPS Auth

If you want to use the dev HMPPS Auth instead of the local one, you can add the following env vars to an .env file (or in your IntelliJ run config):

```shell
HMPPS_AUTH_URL=https://sign-in-dev.hmpps.service.justice.gov.uk/auth
API_CLIENT_ID=<Your client ID>
API_CLIENT_SECRET=<Your client secret>
SYSTEM_CLIENT_ID=<Your client ID>
SYSTEM_CLIENT_SECRET=<Your client secret>
```

### Run linter

`npm run lint`

### Run tests

`npm run test`

### Running integration tests

For local running, start a test db, redis, and wiremock instance by:

`docker-compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)

And then either, run tests in headless mode with:

`npm run int-test`

Or run tests with the cypress UI:

`npm run int-test-ui`

### Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`

## Deployment to Cloud Platform Environment

The app is deployed to the namespace: `hmpps-digital-prison-reporting-mi-<env>`.

Config for the dev environment can be found here: https://github.com/ministryofjustice/cloud-platform-environments/tree/main/namespaces/live.cloud-platform.service.justice.gov.uk/hmpps-digital-prison-reporting-mi-dev

The CPE deployment for this app consists of:

- A service account for CircleCI.
- An Elasticache cluster.
  - A secret containing the EC details (used by this app).
- A secret containing the session secret for this app - generated by Terraform.

Additionally, the HMPPS auth service details need to be manually deployed to each environment. The file `hmps-auth-secret.yaml` should be updated with the base64 encoded values and applied to the environment.

_NB: Please do not commit these changes to `hmps-auth-secret.yaml`._

Example of base64 encoding a secret value:

```
echo -n 'placeholder' | base64
```

Example of applying the secret to an environment:

```
kubectl -n hmpps-digital-prison-reporting-mi-dev apply -f hmps-auth-secret.yaml
```

## Running acceptance tests

Acceptance tests can be run using the following commands:

```shell
npm run acceptance-test
```

They can be configured using the following environment variables:

```shell
CYPRESS_USERNAME=# The HMPPS Auth user's username, for the relevant environment (e.g. SPEGG_GEN)
CYPRESS_PASSWORD=# The HMPPS Auth user's password, for the relevant environment (e.g. Password1!)
CYPRESS_BASE_URL=# The URL of the UI to test (defaults to 'https://digital-prison-reporting-mi-ui-dev.hmpps.service.justice.gov.uk/')
CYPRESS_SIGN_IN_URL=# The URL of the HMPPS Auth server (defaults to 'sign-in-dev.hmpps.service.justice.gov.uk')
CYPRESS_API_BASE_URL=# The base URL of the environment's API (defaults to 'https://digital-prison-reporting-mi-dev.hmpps.service.justice.gov.uk')
```

## Maintenance Mode

Putting the application into maintenance mode will disable app functionality by redirecting all users to a maintenance screen on all routes. To enable maintenance mode add the following env variables to the K8s config:

- **MAINTENANCE_MODE_ENABLED**: Should contain a boolean value indicating whether maintenance mode should be enabled.
- **MAINTENANCE_MODE_MESSAGE**: Should contain a string value describing the nature of the maintenance work being applied.

```
...
env:
- name: MAINTENANCE_MODE_ENABLED
  value: FALSE
- name: MAINTENANCE_MODE_MESSAGE
  value: "We are performing scheduled maintenance"
...
```
