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
		var thread = view.template("thread",
		{
			"id": res.id,
			"name": res.name,
			"username": res.username,
			"content": res.html
		});

		view.draw(view.template("index",
		{
			"thread": thread
		}));
	});
});
