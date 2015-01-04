var request = require('request')
var $ = require('jquery')

/**
 *  User class
 */
var User = function(username, first, last, password, email) {
	this.username = username;
	this.firstName = first;
	this.lastName = last;
	this.password = password;
	this.email = email;
}

User.prototype.email = function() {return this.email;}
User.prototype.firstName = function() {return this.firstName;}
User.prototype.lastName = function() {return this.lastName;}
User.prototype.email = function() {return this.email;}
User.prototype.username = function() {return this.username;}

User.prototype.fullName = function() {return this.firstName + ' ' + this.lastName;}
User.prototype.isAllowedInRoom = function(room) {return room.userAllowed(this);}



/**
 *  Room class
 */
var Room = function(roomName, usersAllowed) {
	this.roomName = name
	this.usersAllowed = usersAllowed;
}
Room.prototype.usersAllowed = function() {return this.usersAllowed;}
Room.prototype.roomName = function() {return this.roomName;}
Room.prototype.accessForUser = function(user) {return this.usersAllowed.contains(user);}

/**
 *  Exports
 */
var users = [];

function userForUsername(username) {
	for (var i = 0; i < users.length; i++) {
		if (users[i].username == username) {return users[i];}
	}
	return null;
}

exports.returnNull = function(req, res) {
	res.send(null);
}

exports.signUpUser = function(req, res) {
	console.log('signUpUser(req, res) was called');
	var username = req.body.username;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var password = req.body.password;
	var email = req.body.email;

	// make sure that the users currently don't include the username
	var user = userForUsername(username);
	if (user != null) {
		res.send({
			'success': false,
			'message': 'Username already taken'
		});
	} else {
		var user = new User(username, firstName, lastName, password, email);
		users.push(user);

		res.send({
			'success': true,
			'username': username
		});
	}

	console.log(users);
}

exports.logInUser = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	var user = userForUsername(username);
	if (user != null) {
		if (user.password == password) {
			res.send({
				'success': true,
				'username': username
			})
		} else {
			res.send({
				'success': false,
				'message': 'Login credentials are not valid'
			})
		}
	} else {
		res.send({
			'success': false,
			'message': 'Login credentials are not valid'
		})
	}
}

exports.renderIndex = function(req, res) {
	console.log('renderIndex(req, res) called');
	res.render('index', { title: 'Express' });
}

exports.callNurse = function(req, res) {
}

exports.unlockDoor = function(req, res) {

}

exports.message911 = function(req, res) {
	// uses the user's cell phone to call 911
	const api_key = "h2tmmsyfjkwo5yaw8dfqjmaludkzegzf";
	const api_secret = "2q823smwtouegbojqtvfvyipnkkk3okl";
	const phone_number = "tel:+19122460900" //make sure that this number is an AT&T number and it must be formatted with "tel:+1" and then the number with the area code.
	const oauth_endpoint = "https://api.att.com/oauth/token";
	const sms_endpoint = "https://api.att.com/sms/v3/messaging/outbox";

	function sendSMS(mobilenumber, message, resp) {
	    request({
	        url: oauth_endpoint,
	        method: "POST",
	        headers: { "Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" },
	        body: "grant_type=client_credentials&client_id=" + api_key + "&client_secret=" + api_secret + "&scope=SMS"
	    } ,
	    function (error, response, body) {
	        request({
	            url: sms_endpoint,
	            method: "POST",
	            headers: { "Authorization": "Bearer " + JSON.parse(body).access_token, "Content-Type": "application/x-www-form-urlencoded" },
	            body: "address=" + encodeURIComponent(mobilenumber) + "&message=" + encodeURIComponent(message)
	        } , function (error, response, body) {
	        });
	    });
	}

	var d = new Date();
	var hr = d.getHours();
	var mn = d.getMinutes();
	sendSMS(phone_number, "Paul Brian has had a heart attack event at lat 36.1104 long -115.2067 on 1/4/2015 at " + hr + ":" + mn + " (Sent automatically from Mi Link Heart Rate Tracking System)", false);
	res.send(); 
}

exports.allowAccess = function(req, res) {
	// we need to show that this either returns true or false
}
