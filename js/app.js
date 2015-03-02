window.state = {
	"view": "",
	"permString": "",
	"perms": []
}

window.prot = new Prot(conf.webSocketURL);

prot.on("close", function()
{
	lib.notify("Can't connect to the server.");
});

prot.on("error", function(evt)
{
	console.log(evt);
});

window.spat = new Spat(
{
	"element": document.getElementById("view"),
	"defaultView": "front"
});

spat.loadViews(
[
	"front",
	"cats",
	"cat",
	"thread",
	"login",
	"register",
	"user",
	"newcat",
	"newthread"
]);

spat.onload = function(view)
{
	state.view = view;

	document.body.className = state.view+" "+state.permString;
}

prot.on("login", function()
{
	prot.send("perms_get", {}, function(err, res)
	{
		if (err)
			return console.log(err);

		state.permString = "";

		res.perms.forEach(function(perm)
		{
			state.permString += " "+perm;
			state.perms[perm] = true;
		});
		state.permString = state.permString.substring(1);

		document.body.className = state.view+" "+state.permString;
	});
});

