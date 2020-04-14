/**
* Response returned by timezonedb api
*
* @export
* @interface ITimeZone
*/
export interface ITimeZone {
    /**
    * Status of the API query. Either OK or FAILED.
    */
    status: string;
    /**
    * Error message. Empty if no error.
    */
    message: string;
    /**
    * Country code of the time zone
    */
    countryCode: string;
    /**
    * Country name of the time zone.
    */
    countryName: string;
    /**
    * The time zone name.
    */
    zoneName: string;
    /**
    * Abbreviation of the time zone.
    */
    abbreviation: string;
    /**
    * The time offset in seconds based on UTC time.
    */
    gmtOffset: number;
    /**
    * Whether Daylight Saving Time (DST) is used. Either 0 (No) or 1 (Yes).
    */
    dst: string;
    /**
    * The Unix time in UTC when current time zone start.
    */
    zoneStart: number;
    /**
    * The Unix time in UTC when current time zone end.
    */
    zoneEnd: number;
    /**
    * Current local time in Unix time. Minus the value with gmtOffset to get UTC time.
    */
    timestamp: number;
    /**
    * Formatted timestamp in Y-m-d h:i:s format. E.g.: 2020-01-17 14:47:59
    */
    formatted: string;
    nextAbbreviation: string;
}
