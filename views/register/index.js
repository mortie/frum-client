spat.addView("register", ["index", "nocode"], function(args, view)
{
	var inviteCode = args[1];

	if (inviteCode || (!inviteCode && !conf.requireInvite))
		view.draw(view.template("index"));
	else
		return view.draw(view.template("nocode"));

	function register()
	{
		if (view.elem(".in_password").value !== view.elem(".in_password2").value)
			return lib.notify("The passwords don't match.");
		else if (view.elem(".in_username").value.length < 1)
			return lib.notify("You must provide a username.");
		else if (view.elem(".in_password").value.length < 1)
			return lib.notify("You must provide a password.");

		prot.send("user_create",
		{
			"username": view.elem(".in_username").value,
			"password": view.elem(".in_password").value,
			"inviteCode": inviteCode
		},
		function(err, res)
		{
			console.log(err);

			if (err === "EINVITECODE")
				return lib.notify("Invalid invite code.");
			else if (err === "ELOGGEDIN")
				return lib.notify("You're already logged in.");
			else if (err)
				return lib.notify("An error occurred.");

			lib.setStorage("token", res.token);

			location.hash = "front";
		});
	}

	function checkKey(evt)
	{
		if (evt.keyCode === 13)
			register();
	}

	view.event(".in_submit", "click", register);
	view.event(".in_username", "keypress", checkKey);
	view.event(".in_password", "keypress", checkKey);
	view.event(".in_password2", "keypress", checkKey);
});
