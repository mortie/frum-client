spat.addView("front", ["index", "thread"], function(args, view)
{
	var page = (parseInt(args[1]) || "1");

	prot.send("threads_get_front",
	{
		"offset": (page - 1) * conf.postsPerPage,
		"count": conf.postsPerPage
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
