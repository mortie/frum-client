spat.addView("front", ["index", "thread"], function(args, view)
{
	var page = (parseInt(args[1]) || 1);

	prot.send("threads_get",
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
				"name": thread.name,
				"date": lib.dateToString(new Date(thread.date_created)),
				"category": thread.category_name,
				"category_id": thread.category_id.toString()
			});
		});

		view.draw(view.template("index",
		{
			"threads": threads,
			"prevPage": (page-1).toString(),
			"nextPage": (page+1).toString(),
			"firstPage": (page === 1),
			"lastPage": (res.threads.length < conf.postsPerPage)
		}));
	});
});
