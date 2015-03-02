spat.addView("login", ["index"], function(args, view)
{
	view.draw(view.template("index"));

	function login()
	{
		prot.send("session_login",
		{
			"username": view.elem(".in_username").value,
			"password": view.elem(".in_password").value
		},
		function(err, res)
		{
			if (err === "EBADLOGIN")
				return lib.notify("Wrong username or password.")
			else if (err)
				return console.log(err);

			lib.setStorage("token", res.token);
			location.hash = "front";
		});
	}

	function checkKey(evt)
	{
		if (evt.keyCode === 13)
			login();
	}

	view.event(".in_submit", "click", login);
	view.event(".in_username", "keydown", checkKey);
	view.event(".in_password", "keydown", checkKey);
});
