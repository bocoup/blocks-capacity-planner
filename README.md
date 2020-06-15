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
- **shift** - a day of the week and a meal time, e.g. "Tuesday lunch"

This block was initially developed for use by volunteer organizers during the
covid-19 pandemic to plan weekly schedules for meal deliveries from restaurants
to hospitals. In this context, "consumers" were hospitals with delivery times
and "producers" were restaurants with shifts. Capacity in this context was
measured in the number of meals a restaurants could deliver to a hospital.

## Time zones

This application interprets all dates in terms of Coordinated Universal Time
(UTC).

## How to run this block

1. [Duplicate](https://support.airtable.com/hc/en-us/articles/202584549-Duplicating-an-existing-base) the
   [Capacity Planning Example Base](https://airtable.com/invite/l?inviteId=inv4VdlJpmw7Jiwv0&inviteToken=1a104ad9356cd575e76e2437b670c4c8b1a51fa7bf75114091f1bd4534c5052d).
2. Create a new custom block your new base.
3. Clone this repository and install the block CLI.
4. Instead of running `block init` add run [`block remote-add <KEY_FROM_INIT> <YOUR_REMOTE_NAME>`](https://airtable.com/developers/blocks/guides/run-in-multiple-bases#Use%20remotes%20to%20run%20and%20release%20your%20block)
   to be able to develop this block on your copy of the example base.
5. From the root of your new block, run `block run --remote <YOUR_REMOTE_NAME>`.
6. Paste the uri that it gives you into the 'edit block' input back on airtable.com.

## How to run the automated tests

After cloning this repository, install the dependencies with the following
command:

    npm install

Then, execute the following command to run the tests:

    npm test

If you want to use a debugger [chrome://inspect/](chrome://inspect/#devices) and click "Open dedicated
DevTools for Node" and then run `node --inspect --experimental-modules $(npm bin)/_mocha --ui tdd test`.

## How to release this block

In order to deploy the code to the Blocks running on airtable.com, project
maintainers should follow these steps:

1. Obtain the appropriate Airtable Custom Block configuration file(s) which
   describe the Block instances which are intended to be updated
2. Merge the Git repository's `dev` branch into the `main` branch. This can be
   done with the following commands:

       git checkout main
       git merge --no-ff dev

3. Create a Git tag for the merge commit. For instance, to create a Git tag
   named "x.x.x", run the following command:

       git tag x.x.x

4. Use the process which is documented on [the Airtable.com Block developer
   guide](https://airtable.com/developers/blocks) for deploying the Block

## Conduct

All contributors are expected to adhere to the project's code of conduct,
available in the file named `CODE_OF_CONDUCT.md`.

## License

Copyright 2020 Bocoup under [the MIT Expat
license](https://directory.fsf.org/wiki/License:Expat).
