spat.addView("thread", ["index", "post"], function(args, view)
{
	var id = parseInt(args[1]);
	var page = (parseInt(args[2]) || 1);

	if (!id)
		location.hash = "front";

	lib.concurrent(
	[
		function(cb)
		{
			prot.send("thread_get_info",
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

				cb("thread", res);
			});
		},

		function(cb)
		{
			prot.send("thread_get_posts",
			{
				"thread_id": id,
				"offset": (page - 1) * conf.postsPerPage,
				"count": conf.postsPerPage
			},
			function(err, res)
			{
				if (err)
				{
					lib.notify("An unknown error occurred.");
					return console.log(err);
				}

				cb("posts", res.posts);
			});
		}
	],
	function(res)
	{
		var posts = "";
		res.posts.forEach(function(post)
		{
			posts += view.template("post",
			{
				"date": lib.dateToString(new Date(post.date_created)),
				"username": post.username,
				"content": post.html
			});
		});

		view.draw(view.template("index",
		{
			"name": res.thread.name,
			"date": lib.dateToString(new Date(res.thread.date_created)),
			"category": res.thread.category_name,
			"category_id": res.thread.category_id.toString(),
			"posts": posts,
			"id": id.toString(),
			"nextPage": (page + 1).toString(),
			"prevPage": (page - 1).toString(),
			"firstPage": (page === 1),
			"lastPage": (res.posts.length < conf.postsPerPage)
		}));

		function submitPost()
		{
			if (view.elem(".in_newpost").value.length < 1)
				return lib.notify("You must supply some content.");

			prot.send("post_create",
			{
				"content": view.elem(".in_newpost").value,
				"thread_id": id
			},
			function(err, res)
			{
				if (err)
				{
					lib.notify("An unknown error occurred.");
					console.log(err);
				}

				spat.reload();
			});
		}

		view.event(".in_submit", "click", submitPost);
	});
});
