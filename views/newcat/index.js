spat.addView("newcat", ["index"], function(args, view)
{
	view.draw(view.template("index"));

	function newcat()
	{
		if (view.elem(".in_name").value.length < 1)
			return lib.notify("You need to supply a name.");
		else if (view.elem(".in_desc").value.length < 1)
			return lib.notify("You must provide a description.");

		prot.send("category_create",
		{
			"name": view.elem(".in_name").value,
			"description": view.elem(".in_desc").value
		},
		function(err, res)
		{
			if (err)
				return lib.notify("An error occurred.");

			location.hash = "cat/"+res.id;
		});
	}

	function checkKey(evt)
	{
		if (evt.keyCode === 13)
			register();
	}

	view.event(".in_submit", "click", newcat);
	view.event(".in_name", "keypress", checkKey);
	view.event(".in_desc", "keypress", checkKey);
});
