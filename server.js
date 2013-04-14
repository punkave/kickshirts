// Serve up the homepage, pages of projects, and static assets in 'public'
// Automatically reload shirts.json if it is modified, which happens when
// build.js completes a run

var express = require('express');
var app = express();
var fs = require('fs');
var nunjucks = require('nunjucks');

var shirtProjects;
reload();
var perPage = 20;

var env = new nunjucks.Environment();
var indexTmpl = env.getTemplate('views/index.html');
var projectsTmpl = env.getTemplate('views/projects.html');

// If build.js completes a run, load the new data without restarting the server
fs.watch('data/shirts.json', function() {
  // Wait in case the write takes a while to complete
  setTimeout(reload, 5000);
});

app.get('/', function(req, res) {
  var projects = getPage(req);
  res.send(indexTmpl.render({ projects: projects }));
});

app.get('/projects', function(req, res) {
  var projects = getPage(req);
  if (!projects.length) {
    res.statusCode = 404;
    return res.send('Not Found');
  }
  res.send(projectsTmpl.render({ projects: projects }));
});

function getPage(req) {
  var max = req.query.max ? parseFloat(req.query.max) : 0;
  var page = req.query.page ? parseInt(req.query.page, 10) : 1;
  if (page < 1) {
    page = 1;
  }
  var projects = [];
  // Paginate
  var pOffset = (page - 1) * perPage;
  var pLimit = perPage;
  var n = 0;
  for (var i in shirtProjects) {
    var project = shirtProjects[i];
    if ((!max) || (parseFloat(project.shirt.price) <= max)) {
      if (n >= pOffset) {
        projects.push(project);
      }
      n++;
      if (n >= (pOffset + pLimit)) {
        break;
      }
    }
  }
  return projects;
}

app.use(express.static('public'));

listen();

function listen() {
  // Default port for dev
  var port = 3000;
  // Heroku
  if (process.env.PORT) {
    port = process.env.PORT;
  } else {
    try {
      // Stagecoach option
      port = fs.readFileSync('data/port', 'UTF-8').replace(/\s+$/, '');
    } catch (err) {
      console.log("I see no data/port file, defaulting to port " + port);
    }
  }
  console.log("Listening on port " + port);
  app.listen(port);
}

function reload() {
  shirtProjects = JSON.parse(fs.readFileSync('data/shirts.json'));
}
