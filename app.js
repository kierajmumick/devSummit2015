var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var M2X = require('m2x');

var request = require('request')

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var m2x = new M2X('4c1ae41004c98ab8ccccde2e460f2be0')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 8080);

m2x.status(function(status) {
    console.log(status);
})

const api_key = "h2tmmsyfjkwo5yaw8dfqjmaludkzegzf";
const api_secret = "2q823smwtouegbojqtvfvyipnkkk3okl";
const phone_number = "tel:+19122460900" //make sure that this number is an AT&T number and it must be formatted with "tel:+1" and then the number with the area code.
const oauth_endpoint = "https://api.att.com/oauth/token";
const sms_endpoint = "https://api.att.com/sms/v3/messaging/outbox"

function sendSMS(mobilenumber, message, resp) {
    request({
        url: oauth_endpoint,
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body: "grant_type=client_credentials&client_id=" + api_key + "&client_secret=" + api_secret + "&scope=SMS"
    } ,
    function (error, response, body){
        request({
            url: sms_endpoint,
            method: "POST",
            headers: { "Authorization": "Bearer " + JSON.parse(body).access_token, "Content-Type": "application/x-www-form-urlencoded" },
            body: "address=" + encodeURIComponent(mobilenumber) + "&message=" + encodeURIComponent(message)
        } , function (error, response, body){ resp.write(body); resp.end(); });
    })
};

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', routes.renderIndex);
app.get('/send-message-to-911', routes.message911)
app.get('/call-nurse', routes.callNurse)

app.post('/sign-up-user', routes.signUpUser);
app.post('/log-in-user', routes.logInUser);

app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

http.createServer(app).listen(app.get('port'), function() {
      console.log('Open browser to http://localhost:' + app.get('port'));
});

module.exports = app;
