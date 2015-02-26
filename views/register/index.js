spat.addView("register", ["index", "nocode"], function(args, view)
{
	var inviteCode = args[1];

	if (inviteCode || (!inviteCode && !conf.requireInvite))
		view.draw(view.template("index"));
	else
		return view.draw(view.template("nocode"));

	view.event(".register", "click", function()
	{
		if (view.elem(".password").value !== view.elem(".password2").value)
			return lib.notify("The passwords don't match.");
		else if (view.elem(".username").value.length < 1)
			return lib.notify("You must provide a username.");
		else if (view.elem(".password").value.length < 1)
			return lib.notify("You must provide a password.");
	});
});
