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
	// call one of us
}

exports.call911 = function(req, res) {
	// uses the user's cell phone to call 911
}

exports.allowAccess = function(req, res) {
	// we need to show that this either returns true or false
}
