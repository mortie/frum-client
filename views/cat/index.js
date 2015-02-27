spat.addView("cat", ["index", "thread"], function(args, view)
{
	var category = parseInt(args[1]);
	var page = (parseInt(args[2]) || 1);

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
				"name": thread.name,
				"date": lib.dateToString(new Date(thread.date_created)),
				"category_id": thread.category_id.toString()
			});
		});

		view.draw(view.template("index",
		{
			"threads": threads,
			"id": category.toString(),
			"prevPage": (page-1).toString(),
			"nextPage": (page+1).toString(),
			"firstPage": (page === 1),
			"lastPage": (res.threads.length < conf.postsPerPage),
			"category": res.threads[0].category_name
		}));
	});
});
