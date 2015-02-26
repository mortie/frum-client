spat.addView("cats", ["index", "category"], function(args, view)
{
	prot.send("categories_get", {}, function(err, res)
	{
		if (err)
		{
			lib.notify("An error.");
			return console.log(err);
		}

		var categories = "";

		res.categories.forEach(function(category)
		{
			categories += view.template("category",
			{
				"id": category.id.toString(),
				"name": category.name,
				"description": category.description
			});
		});

		view.draw(view.template("index",
		{
			"categories": categories
		}));
	});
});
