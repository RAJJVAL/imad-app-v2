var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
    user:'rajjval',
    database: 'rajjval',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
}
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    Cookie: {maxAge: 1000*60*60*24*30}
}));

var articleOne= {
  title:'Article One | Rajjval Jain',
  heading: 'Article One',
  date: 'March 06,2017',
  content: ` <p>
                This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article.
            </p>
            <p>
                 This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article.
            </p>
            <p>
                 This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article.
            </p>`
};


function createTemplate(data){
    var title=data.title;
    var date=data.date;
    var heading=data.heading;
    var content=data.content;

var htmlTemplate= `<html>
     <head>
        <title>
            ${title}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body>
        <div class="container">
        <div>
            
            <a href="/">Home</a>
        </div>
        <hr/>
        <h3>
            ${heading}
        </h3>
        <div>
            ${date.toDateString()}
        </div>
        <div>
           ${content}
        </div>
        </div>
    </body>

</html>
`;
return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'login.html'));
});


app.get('/index', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


function hash (input, salt){
var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pdkdf","10000",salt,hashed.toString('hex')].join('$');
}


app.get('/hash/:input', function(req,res){
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});

app.post('/create-user', function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.RandomBytes(128).toString('hex'); 
    var dbString = hash(passoword,salt);
    pool.query('INSERT INTO "user" (usrername,password) VALUES ($1, $2)',[username,dbString],function(err, result){
      if(err)
     {
         res.status(500).send(err.toString());
     }
     else
     {
         res.send('User successfully created: ' + username);
     }   
    });
});

app.post('\login', function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    pool.query('SELECT * FROM "user" WHERE username = $1',[username],function(err, result){
      if(err)
     {
         res.status(500).send(err.toString());
     }
     else
     {
         if(result.rows.length === 0){
             res.send(403).send('username/password is invalid');
         }else{
             var dbString = result.rows[0].password;
             var slat = dbString.split('$')[2];
             var hashedPassword = hash(password,salt);
             
             if(hashedPassword === dbString){
                 req.session.auth={userId: result.rowa[0].id};
             res.send('credentials correct!');
         }else{
             res.send(403).send('username/password is invalid');
         }
     }
     }   
    });
});

app.get('/check-login',function(req,res){
   if(req.session && req.session.auth && req.session.auth.userId){
       req.send('you are logged in:' + req.session.auth.userId.toString());
   } else{
       res.send('You are not logged in');
   }
});



var pool = new Pool(config);
app.get('/test-db',function(req,res){
    pool.query('SELECT * FROM test', function(err,result){
      if(err)
     {
         res.status(500).send(err.toString());
     }
     else
     {
         res.send(JSON.stringify(result.rows));
     }
    });
});

app.get('/hai', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'hai.html'));
});

app.get('/News', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'News.html'));
});

app.get('/dropdown', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'dropdown.html'));
});

app.get('/mainpage', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'mainpage.html'));
});


app.get('/article/:articleName', function(req,res) {
   
   pool.query("SELECT * FROM article WHERE title = '" + req.params.articleName + "'" , function(err,result){
       if(err){
           res.status(500).send(err.toString());
       }else{
           if(result.rows.length === 0 ){
               res.status(404).send('Article not fond'); 
           }else{
               var articleData = result.rows[0];
       res.send(createTemplate(articleData)); 
           }
       }
   } );
});

app.get('/article-two', function(req,res) {
  res.sendfile(path.join(__dirname,'ui','article-two.html')); 
});

app.get('/article-three', function(req,res) {
   res.sendfile(path.join(__dirname,'ui','article-three.html')); 
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/Free-Download-Background-Images-For-Website-Design-4.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'Free-Download-Background-Images-For-Website-Design-4.jpg'));
});

app.get('/Website-Design-Background.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'Website-Design-Background.png'));
});

app.get('/New.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'New.png'));
});


app.get('/Deep-into-soul-electro-lounge-track.mp3', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'Deep-into-soul-electro-lounge-track.mp3'));
});


app.get('/ally-media-group-home-8.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'ally-media-group-home-8.jpg'));
});

app.get('/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
