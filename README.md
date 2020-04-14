# Gozem distances calculator

This project returns, the country and timezone info, distance (in km or miles) and the time difference in hours, between two geo locations.

## Libraries used
- dotenv: Used to load and read environment variables [read more here](https://www.npmjs.com/package/dotenv)
- moment-timezone: Used for time, date and timezone formating. [read more here](https://www.npmjs.com/package/moment-timezone)
- typescript: Used for proptypes validation. [read more here](https://github.com/microsoft/TypeScript)
- body-parser: User to parse incoming request bodies in a middleware before your handlers.  [read more here](https://www.npmjs.com/package/body-parser)
- ts-node: Used to directly run the app with typescript without pre-compilation [read more here](https://github.com/TypeStrong/ts-node)

## Getting Started
1- Download and unzip this project.

2- After downloading you need to install project dependencies depending on your packages manager by running `npm install` Or `yarn`.

## Development server

Run `npm start` or `yarn start` for a dev server.

## Testing the app

You can either download and run Postman from [here](https://github.com/postmanlabs/postman-app-support) and create a POST REQUEST to the current URL(localhost:5000/api/v1/get_distance_and_time) with the paramaters above or use CURL:
```sh
curl --location --request POST 'localhost:3000/api/v1/get_distance_and_time' \
--header 'Content-Type: application/json' \
--data-raw '{
    "start": {
        "lat": 6.367723,
        "lng": 2.3570322
    },
    "end": {
        "lat": 9.5502645,
        "lng": 1.1754511
    },
    "units": "metric"
}'
```

## Other details
Don't hesitate to put any comment here 😉.
