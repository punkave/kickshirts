# kickshirts

This app displays all the Kickstarter projects that feature T-shirts as reward items.

There are two scripts: `build.js` and `server.js`. The `build.js` script builds a database in `data/shirts.json`. There's a cron job on the server that runs it nightly. But you don't want to wait for that, so just do:

    mkdir -p data
    cp shirts.json.gz data
    cd data
    gunzip shirts.json.gz
    cd ..

Now you can launch the site:

    node server.js

Now connect:

http://localhost:3000/

Be aware that template edits (the views folder) are not active until you restart the site. CSS edits do not have this restriction.

If you do decide to run `build.js`, be aware it fetches only 10 projects by default. We're scraping Kickstarter and you usually don't want to wait for that. If you really want to do a full run, you can do:

    node build.js 1000

But the test data you gunzipped above is perfectly adequate, just a little old.

Have fun!

-Tom
