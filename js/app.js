window.prot = new Prot(conf.webSocketURL);

prot.on("close", function()
{
	lib.notify("Can't connect to the server.");
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
	"user"
]);

spat.onload = function(view)
{
	spat.elem("body").className = view;
}
