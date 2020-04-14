import * as http from 'http';
import * as querystring from 'querystring';
import { ITimeZone } from './ITimeZone';

export class Timezonedb {
    hostname = 'api.timezonedb.com';
    version = 'v2.1';
    format = 'json';
    by = 'position';
    api_key = '';

    constructor(key: string) {
        this.setApiKey(key);
    }

    setApiKey(key: string) {
        if (!key.length) {
            return;
        }

        this.api_key = key;
    }

    setApiHostname(hostname: string) {
        if (!hostname.length) {
            return;
        }

        this.hostname = hostname;
    }

    setApiVersion(version: string) {
        if (!version.length) {
            return;
        }

        this.version = version;
    }

    public getTimeZone(location: { lng: string, lat: string }, options?: { format: string, by: string }) {
        const formatedParams = this.getParams(location, options);
        const queryParams = querystring.stringify(formatedParams);

        return new Promise<ITimeZone>((resolve, reject) => {
            const request = http.get({
                hostname: this.hostname,
                port: 80,
                path: `${this.apiPath}?${queryParams}`
            }, (response) => {
                let rawResponse = '';

                response.on('data', (data) => {
                    rawResponse += data;
                });

                response.on('end', () => {
                    let parsedResponse = null;

                    try {
                        parsedResponse = JSON.parse(rawResponse);
                    } catch (error) {
                        return reject(error);
                    }

                    if ((parsedResponse.message !== '')) {
                        return reject(new Error(parsedResponse.message));
                    } else {
                        return resolve(parsedResponse);
                    }
                });

                response.on('error', (err) => {
                    return reject(err);
                });
            });

            request.on('error', (err) => {
                return reject(err);
            });
        });
    }

    get apiPath() {
        return `http://${this.hostname}/${this.version}/get-time-zone`;
    }

    private getParams(location: { lng: string; lat: string; }, options?: { format: string; by: string; }) {
        let defaultOpts = {
            key: this.api_key,
            format: this.format,
            by: this.by
        };

        if (options) {
            defaultOpts = Object.assign(defaultOpts, options);
        }

        return {
            ...defaultOpts,
            ...location
        }
    }
}
