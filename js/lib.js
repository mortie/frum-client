(function()
{
	window.lib = {};

	var timeouts =
	{
		"notifyClear": undefined
	}

	var msgboxCallbacks =
	{
		"yes": function(){},
		"no": function(){},
		"cancel": function(){},
		"ok": function(){},
		"close": function(){}
	}

	var months =
	[
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	]

	lib.pad = function(str, length, padChar)
	{
		var missing = (length - str.length) + 1;

		if (missing <= 0)
			return str;

		return new Array(missing).join(padChar) + str;
	}

	lib.getStorage = function(key)
	{
		if (window.localStorage)
		{
			return localStorage.getItem(key);
		}
		else
		{
			return document.cookie.split(";").filter(function(str)
			{
				return (str.split("=")[0].trim() === key);
			})[0].split("=")[1].trim();
		}
	}

	lib.setStorage = function(key, val)
	{
		if (window.localStorage)
			localStorage.setItem(key, val);
		else
			document.cookie = key+"="+val;
	}

	lib.msgbox = function(msg, evts)
	{
		spat.elem("#msgbox .content").innerHTML = msg;
		spat.elem("#msgbox").className = "active";

		if (evts && evts.yes)
		{
			spat.elem("#msgbox").className += " withYes";
			msgboxCallbacks.yes = evts.yes;
		}
		if (evts && evts.no)
		{
			spat.elem("#msgbox").className += " withNo";
			msgboxCallbacks.no = evts.no;
		}
		if (evts && evts.cancel)
		{
			spat.elem("#msgbox").className += " withCancel";
			msgboxCallbacks.cancel = evts.cancel;
		}
		if (evts && evts.ok)
		{
			spat.elem("#msgbox").className += " withOk";
			msgboxCallbacks.ok = evts.ok;
		}
		if (evts)
			msgboxCallbacks.close = evts.close || (function(){});
	}

	spat.event("#msgbox .noButton", "click", function evtHandler(e)
	{
		msgboxCallbacks.no(e);
	});
	spat.event("#msgbox .yesButton", "click", function evtHandler(e)
	{
		msgboxCallbacks.yes(e);
	});
	spat.event("#msgbox .cancelButton", "click", function evtHandler(e)
	{
		msgboxCallbacks.cancel(e);
	});
	spat.event("#msgbox .okButton", "click", function evtHandler(e)
	{
		msgboxCallbacks.ok(e);
	});
	spat.event("#msgbox .close", "click", function evtHandler(e)
	{
		msgboxCallbacks.close(e);
	});

	lib.notify = function(title, body, url)
	{
		clearTimeout(timeouts.notifyClear);

		var elem = spat.elem("#notification");

		elem.querySelector(".title").innerHTML = title;
		elem.querySelector(".body").innerHTML = body || "";
		elem.className = "active";
		if (url)
			elem.className += " clickable";

		elem.removeEventListener("mouseover");
		elem.removeEventListener("click");
		elem.querySelector(".title").removeEventListener("click");
		elem.querySelector(".body").removeEventListener("click");

		timeouts.notifyClear = setTimeout(function()
		{
			elem.className = "";
		}, 5000);

		spat.event("#notification", "mouseover", function()
		{
			clearTimeout(timeouts.notifyClear);
		});

		spat.event("#notification .title", "click", function()
		{
			if (url)
				location.href = url;
		});
		spat.event("#notification .body", "click", function()
		{
			if (url)
				location.href = url;
		});
	}

	lib.dateToString = function(date)
	{
		var day = lib.pad(date.getDate().toString(), 2, "0");
		var month = months[date.getMonth()];

		return day+". of "+month+" "+
			date.getFullYear()+", "+
			lib.pad(date.getHours().toString(), 2, "0")+":"+
			lib.pad(date.getMinutes().toString(), 2, "0");
	}

	lib.concurrent = function(funcs, cb)
	{
		var res = {};

		var count = funcs.length;
		var async = function(key, val)
		{
			res[key] = val;

			--count;
			if (count == 0)
				cb(res);
		}

		funcs.forEach(function(func)
		{
			func(async);
		});
	}
})();
