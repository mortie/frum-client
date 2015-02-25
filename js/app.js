window.prot = new Prot(conf.webSocketURL);

prot.on("close", function()
{
	alert("Can't connect to the server.");
});

window.spat = new Spat(
{
	"element": document.getElementById("view"),
	"defaultView": "front",
	"viewDir": "views",
});

spat.loadViews(
[
	"front",
	"cats",
	"thread"
]);
