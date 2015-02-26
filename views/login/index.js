spat.addView("login", ["index"], function(args, view)
{
	view.draw(view.template("index"));

	function login()
	{
		prot.send("session_login",
		{
			"username": view.elem(".username").value,
			"password": view.elem(".password").value
		},
		function(err, res)
		{
			if (err === "EBADLOGIN")
				return lib.notify("Wrong username or password.")
			else if (err)
				return console.log(err);

			lib.setStorage("token", res.token);
			spat.load("front");
		});
	}

	view.event(".submit", "click", login);
	view.event(".username", "keydown", function(evt)
	{
		if (evt.keyCode === 13) login();
	});
	view.event(".password", "keydown", function(evt)
	{
		if (evt.keyCode === 13) login();
	});
});
