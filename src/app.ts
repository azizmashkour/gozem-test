import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as google from '@google/maps';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import * as moment from 'moment-timezone';
import { Timezonedb } from './lib/timezone';
import { ITimeZone } from './lib/ITimeZone';

export interface IGZDistance {
    start?: {
        location: {
            lat: string;
            lng: string;
        };
        country: string,
        timezone: string
    };
    end?: {
        location: {
            lat: string;
            lng: string;
        },
        country: string;
        timezone: string;
    };
    distance?: {
        value: string;
        units: string;
    };
    time_diff?: {
        value: number;
        units: string;
    };
}

dotenv.config();

process.stdin.resume(); // so the program will not close instantly

console.log('App starting ...');

const corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    }
};

const app = express();

app.use(cors(corsOptions));

app.use(bodyParser.json());

const service = google.createClient({
    key: process.env.API_KEY ? process.env.API_KEY : 'AIzaSyAoaVChcbLGktHmaah78AIRFAt6JutQcV4',
    Promise: Promise
});

const distanceEndpoint = process.env.DISTANCE_ENDPOINT ? process.env.DISTANCE_ENDPOINT : '/api/v1/get_distance_and_time';
const defaultTimezone = process.env.TIMEZONE ? process.env.TIMEZONE : '69L66F24QL0I';
const timezonedb = new Timezonedb(defaultTimezone);

app.post(distanceEndpoint, async ({ body }, res) => {
    console.log('distance api requested: ', body);

    const origins = body.start;
    const destinations = body.end;
    const units = body.units;
    // Response data sructure
    const data: IGZDistance = {
        start: {
            location: origins,
            country: '',
            timezone: ''
        },
        end: {
            location: destinations,
            country: '',
            timezone: ''
        },
        distance: {
            value: '',
            units: ''
        },
        time_diff: {
            value: 0,
            units: ''
        }
    };

    // Use Google distance matrix to get distance between the start and the end locations
    const response = await service.distanceMatrix({
        origins,
        destinations,
        units
    }).asPromise();

    // If google does not recognize locations provide, we should return not Found error
    if (response.json.rows[0].elements[0].status === 'ZERO_RESULTS') {
        return res.status(400).json('Not found');
    }

    // retrieve distance value and unit
    const element = response.json.rows[0].elements[0];

    data.distance.value = element.distance.text.split(' ')[0];
    data.distance.units = element.distance.text.split(' ')[1];

    // Retrieve Timezone infos for start location
    const startTmz = await timezonedb.getTimeZone(origins).catch((reason) => {
        console.log('Erreur Timezone', reason);
    });

    if ((<ITimeZone>startTmz).status === 'OK') {
        data.start.country = (<ITimeZone>startTmz).countryName;
        const subject = moment((<ITimeZone>startTmz).timestamp).tz((<ITimeZone>startTmz).zoneName).toString();
        data.start.timezone = subject.substring(subject.lastIndexOf('GMT'));
    }

    // Retrieve Timezone info for end location
    const endTmz = await timezonedb.getTimeZone(destinations).catch((reason) => {
        console.log('Erreur Timezone', reason);
    });

    if ((<ITimeZone>endTmz).status === 'OK') {
        data.end.country = (<ITimeZone>endTmz).countryName;
        data.end.timezone = (<ITimeZone>endTmz).zoneName;
        const subject = moment((<ITimeZone>endTmz).timestamp).tz((<ITimeZone>endTmz).zoneName).toString();
        data.end.timezone = subject.substring(subject.lastIndexOf('GMT'));
    }

    let mnt = 0;

    // Calculate the time difference between the start location and the end location
    const parsedStartTime = parseInt(data.start.timezone.substring(3, 6);
    const parsedEndTime = parseInt(data.end.timezone.substring(3, 6);

    if (parsedStartTime > parsedEndTime) {
        mnt = parsedStartTime - parsedEndTime;
    } else {
        mnt = parsedEndTime - parsedStartTime;
    }

    data.time_diff = {
        value: mnt,
        units: 'hours'
    };

    return res.json({
        data,
        // startTmz, this comment zone is just for testing, uncomment to view the results in the console output.
        // endTmz
    });
});

app.listen(process.env.PORT, function () {
    console.info('App Started at port', process.env.PORT)
});

export { app };
