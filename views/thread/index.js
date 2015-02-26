spat.addView("thread", ["index", "thread"], function(args, view)
{
	var id = parseInt(args[1]);

	if (!id)
		location.hash = "front";

	prot.send("thread_get",
	{
		"id": id
	},
	function(err, res)
	{
		if (err)
		{
			lib.notify("An unknown error occurred.");
			return console.log(err);
		}

		console.log(res);

		var thread = view.template("thread",
		{
			"id": id.toString(),
			"name": res.name,
			"username": res.username,
			"content": res.html,
			"date": lib.dateToString(new Date(res.date_created)),
			"category": res.category_name,
			"category_id": res.category_id.toString()
		});

		view.draw(view.template("index",
		{
			"thread": thread
		}));
	});
});
