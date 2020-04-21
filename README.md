# capacity planner block

An application for Airtable.com which helps users connect consumers and
producers, creating a schedule of discrete deliveries.

## Terminology

- **consumer** - an entity described by: "name" (a string value), "need" (an
  integer value), and "times" (one or more day-of-week/time-of-day pairs)
- **producer** - an entity described by: "name" (a string value), "capacity"
  (an integer value), "price" (a floating point number), and "times" (one or
  more day-of-week/time-of-day pairs)
- **shift** - a day of the week and a time of day, e.g. "Tuesday afternoon"

This block was initially developed for use in disaster relief planning. In this
context, "consumers" were hospitals whose "need" was measured in number of
workers looking for a meal at the end of their work day. "Producers" were
locally-owned restaurants whose "capacity" was measured in the number of meals
they were capable of delivering. Volunteers used this tool to create weekly
schedules, facilitating weekly deliveries to help independent businesses feed
hospital workers in their communities.

## License

Copyright 2020 Bocoup under [the MIT Expat
license](https://directory.fsf.org/wiki/License:Expat).
