var request = require('request');
var $ = require('jquery');
var _ = require('underscore');
var async = require('async');
var fs = require('fs');

var url = 'http://www.kickstarter.com/discover/recently-launched';
var db;
var done = false;
var page = 1;
var shirtProjects = [];
// By default you get 10 projects for dev,
// specify how many you are willing to wait for
// as the only command line argument
var maxProjects = process.argv[2] ? parseInt(process.argv[2]) : 10;

process.chdir(__dirname);

async.whilst(function() { return !done; },
  function(callback) {
    myrequest(url + '?page=' + page, function(err, response, body) {
      if (response && (response.statusCode === 200)) {
        var $document = $(body);
        var $projects = $document.find('.project');
        async.eachSeries($projects, function(project, callback) {
          // Since I'm too lazy to rewrite this with whilst
          if (done) {
            return callback(null);
          }
          var info = {};
          var $project = $(project);
          info.thumbnail = $project.find('.projectphoto-little').attr('src');
          info.name = clean($project.find('.bbcard_name').text());
          info.blurb = clean($project.find('.bbcard_blurb').text());
          info.link = 'http://www.kickstarter.com' + $project.find('.bbcard_name a').attr('href');
          info.rewards = [];
          myrequest(info.link, function(err, response, body) {
            if (response && (response.statusCode === 200)) {
              var $document = $(body);
              var $rewards = $document.find('.NS-projects-reward');
              _.each($rewards, function(reward) {
                var $reward = $(reward);
                var rewardInfo = {};
                rewardInfo.pledge = clean($reward.find('h5').text());
                var matches = rewardInfo.pledge.match(/(.)([\d\.]+)/);
                if (matches) {
                  rewardInfo.currency = matches[1];
                  rewardInfo.price = matches[2];
                }
                rewardInfo.desc = clean($reward.find('.desc').text());
                info.rewards.push(rewardInfo);
              });
              var shirt = _.find(info.rewards, function(reward) {
                return reward.desc.match(/shirt/i);
              });
              if (shirt) {
                info.shirt = shirt;
                shirtProjects.push(info);
                console.log('Found shirt');
                console.log(shirtProjects.length);
                if (shirtProjects.length === maxProjects) {
                  done = true;
                }
              }
              // projects.push(info);
              return callback(null);
            } else {
              console.log('Error on project page for ' + info.name + ', skipping it');
              return callback(null);
            }
          });
        }, function(err) {
          if (!$projects.length) {
            done = true;
          }
          page++;
          return callback();
        });
      } else {
        console.log('Error encountered on page ' + page);
        done = true;
        return callback();
      }
    });
  },
  generateStore
);

function generateStore() {
  // fs.writeFileSync('data/all.json', JSON.stringify(projects));
  fs.writeFileSync('data/shirts.json', JSON.stringify(shirtProjects));
  console.log('Done!');
}

function clean(text) {
  text = text.trim();
  text = text.replace(/^\s*/, '');
  text = text.replace(/\s*$/, '');
  return text;
}

function myrequest(url, callback) {
  console.log('Requesting ' + url);
  // One-second wait between requests to avoid becoming rate-limited. There are about 640 pages to be
  // crawled, we can wait that many seconds and be nice
  setTimeout(function() {
    return request(url, callback);
  }, 1000);
}

