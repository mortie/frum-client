window.spat = new Spat(
{
	"element": document.getElementById("view"),
	"defaultView": "home",
	"viewDir": "views",
});

spat.loadViews(
[
	"front",
	"cats",
	"thread"
]);
