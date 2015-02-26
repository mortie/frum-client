spat.addView("user", ["index"], function(args, view)
{
	if (!args[1])
		return spat.load("front");

	view.draw(view.template("index",
	{
		"username": args[1]
	}));
});
