# kickshirts

This node-powered web app displays all the Kickstarter projects that feature T-shirts as reward items. We thought people would go nuts for it, but... not so much. So we're open-sourcing the code to benefit those who are interested in scraping data from Kickstarter and/or scraping data with Node in general.

## Setup

First, get node installed if you don't have it already.

Then you can run:

    npm install

There are two scripts: `build.js` and `server.js`. The `build.js` script builds a database in `data/shirts.json`. But you don't want to wait for that, so just do:

    mkdir -p data
    cp shirts.json.gz data
    cd data
    gunzip shirts.json.gz
    cd ..

## Running kickshirts

Now you can launch the site:

    node server.js

Now connect:

http://localhost:3000/

Be aware that template edits (the views folder) are not active until you restart the site. CSS edits do not have this restriction.

## Scraping new data

If you do decide to run `build.js`, be aware it fetches only 10 projects by default. If you really want to do a full run, you can do:

    node build.js 1000

PLEASE RUN THIS RESPONSIBLY, do not schedule it to run more than once a day or so at most.

## Deployment

    sc-deploy production

Have fun!

-The team at [P'unk Avenue](http://punkave.com)
