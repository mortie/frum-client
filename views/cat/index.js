spat.addView("cat", ["index", "thread"], function(args, view)
{
	var category = parseInt(args[1]);
	var page = (parseInt(args[2]) || "1");

	if (!category)
		location.hash = "front";

	prot.send("threads_get",
	{
		"offset": (page - 1) * conf.postsPerPage,
		"count": conf.postsPerPage,
		"category_id": category
	},
	function(err, res)
	{
		var threads = "";

		res.threads.forEach(function(thread)
		{
			threads += view.template("thread",
			{
				"id": thread.id.toString(),
				"username": thread.username,
				"name": thread.name
			});
		});

		view.draw(view.template("index",
		{
			"threads": threads
		}));
	});

});
