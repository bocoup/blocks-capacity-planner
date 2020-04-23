# Capacity planner block

An Airtable Block which helps you plan how to allocate capacity from consumers
to producers, and create a schedule of.

## An airtable what?

An [Airtable Block](https://airtable.com/developers/blocks) is a custom,
resuable web application that you can run inside of an Airtable base to
visualize, manipulate and process data from that base.

## Terminology

- **consumer** - an entity described by: "name" (a string value), "need" (an
  integer value), and "times" (one or more day-of-week/time-of-day pairs)
- **producer** - an entity described by: "name" (a string value), "capacity"
  (an integer value), "price" (a floating point number), and "times" (one or
  more day-of-week/time-of-day pairs)
- **shift** - a day of the week and a time of day, e.g. "Tuesday afternoon"

This block was initially developed for use by volunteer organizers during the
covid-19 pandemic to plan weekly schedules for meal deliveries from restaurants
to hospitals. In this context, "consumers" were hospitals with delivery times
and "producers" were restaurants with shifts. Capacity in this context was
measured in the number of meals a restaurants could deliver to a hospital.

## How to run this block

1. Create a new base using the
   [Capacity Planning Example Base](https://airtable.com/invite/l?inviteId=inv4VdlJpmw7Jiwv0&inviteToken=1a104ad9356cd575e76e2437b670c4c8b1a51fa7bf75114091f1bd4534c5052d).
2. Create a new custom block your new base.
3. Clone this repository and install the block CLI
4. From the root of your new block, run `block run`.
5. Paste the uri that it gives you into the 'edit block' input back on airtable.com.


## License

Copyright 2020 Bocoup under [the MIT Expat
license](https://directory.fsf.org/wiki/License:Expat).
