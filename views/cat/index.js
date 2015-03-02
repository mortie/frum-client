spat.addView("cat", ["index", "thread"], function(args, view)
{
	var category = parseInt(args[1]);
	var page = (parseInt(args[2]) || 1);

	if (!category)
		location.hash = "front";

	lib.concurrent(
	[
		function(cb)
		{
			prot.send("threads_get",
			{
				"offset": (page - 1) * conf.postsPerPage,
				"count": conf.postsPerPage,
				"category_id": category
			},
			function(err, res)
			{
				cb("threads", res.threads);
			});
		},

		function(cb)
		{
			prot.send("category_get_info",
			{
				"id": category
			},
			function(err, res)
			{
				cb("category", res);
			});
		}
	],
	function(res)
	{
		var threads = "";
		res.threads.forEach(function(thread)
		{
			threads += view.template("thread",
			{
				"id": thread.id.toString(),
				"name": thread.name,
				"username": thread.username,
				"date": lib.dateToString(new Date(thread.date_created))
			});
		});

		view.draw(view.template("index",
		{
			"threads": threads,
			"category": res.category.name,
			"id": category.toString(),
			"nextPage": (page + 1).toString(),
			"prevPage": (page - 1).toString(),
			"firstPage": (page === 1),
			"lastPage": (res.threads.length < conf.postsPerPage)
		}));
	});
});
