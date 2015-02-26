(function()
{
	var templatesLoaded = false;

	function _draw(name, args)
	{
		switch (name)
		{
		case "login":
			if (args.username)
			{
				spat.draw("userbox", spat.template("userbox_logged_in",
				{
					"username": args.username
				}));
			}
			else
			{
				prot.send("session_get_info", {}, function(err, res)
				{
					if (err)
						return console.log(err);

					spat.draw("userbox", spat.template("userbox_logged_in",
					{
						"username": res.username
					}));
				});
			}
			break;

		case "logout":
			spat.draw("userbox", spat.template("userbox_logged_out"));
			break;
		}
	}

	var _drawQueue = [];
	spat.loadTemplates(
	[
		"userbox_logged_in",
		"userbox_logged_out"
	],
	function()
	{
		templatesLoaded = true;
		_drawQueue.forEach(function(elem)
		{
			_draw(elem[0], elem[1] || {});
		});
	});

	function draw(name, args)
	{
		console.log("Drawing "+name);

		if (templatesLoaded)
			_draw(name, args || {});
		else
			_drawQueue.push([name, args]);
	}

	prot.on("login", function()
	{
		draw("login");
	});

	prot.on("logout", function()
	{
		draw("logout");
	});

	var token = lib.getStorage("token");

	if (token)
	{
		prot.send("session_token_auth",
		{
			"token": token
		},
		function(err, res)
		{
			if (err === "EBADLOGIN")
			{
				lib.setStorage("token", "");
				draw("logout");
			}
			else if (!err)
			{
				draw("login");
			}
			else
			{
				console.log(err);
			}
		});
	}
	else
	{
		draw("logout");
	}
})();
