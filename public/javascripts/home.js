$(document).ready(function() {
	$('#sign-up-button').click(function() {
		$.post('/sign-up-user', {
			'username': $('#username').val().trim(),
			'firstName': $('#first-name').val().trim(),
			'lastName': $('#last-name').val().trim(),
			'password': $('#password').val(),
			'email': $('#email').val().trim()
		}, function(data) {
			console.log(data);
			$('body').append(data);
		})
	})
})