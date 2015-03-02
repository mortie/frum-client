spat.addView("newthread", ["index"], function(args, view)
{
	view.draw(view.template("index"));

	var category = parseInt(args[1]);;

	function newthread()
	{
		if (view.elem(".in_name").value.length < 1)
			return lib.notify("You need to supply a name.");
		else if (view.elem(".in_content").value.length < 1)
			return lib.notify("You must provide some content.");

		prot.send("thread_create",
		{
			"name": view.elem(".in_name").value,
			"content": view.elem(".in_content").value,
			"category_id": category
		},
		function(err, res)
		{
			if (err)
			{
				console.log(err);
				return lib.notify("An error occurred.");
			}

			console.log(res);

			console.log("thread/"+res.thread_id);
		});
	}

	function checkKey(evt)
	{
		if (evt.keyCode === 13)
			newthread();
	}

	view.event(".in_submit", "click", newthread);
	view.event(".in_name", "keypress", checkKey);
});
