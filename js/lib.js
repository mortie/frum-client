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
		"ok": function(){}
	}

	if (window.Notification)
		Notification.requestPermission();

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

	lib.notify = function(title, body)
	{
		clearTimeout(timeouts.notifyClear);

		spat.elem("#notification .title").innerHTML = title;
		spat.elem("#notification .body").innerHTML = body || "";
		spat.elem("#notification").className = "active";

		if (body && window.Notification)
		{
			new Notification(title,
			{
				"body": body
			});
		}

		timeouts.notifyClear = setTimeout(function()
		{
			spat.elem("#notification").className = "";
		}, 5000);
	}

	lib.dateToString = function(date)
	{
		return ""+
			date.getDate()+"/"+
			(date.getMonth()+1)+"/"+
			date.getFullYear()+" "+
			date.getHours()+":"+
			date.getMinutes();
	}
})();
