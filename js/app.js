window.prot = new Prot(conf.webSocketURL);

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
