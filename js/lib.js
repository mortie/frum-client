(function()
{
	window.lib = {};

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

	lib.notify = function(msg)
	{
		spat.elem("#notification .content").innerHTML = msg;
		spat.elem("#notification").className = "active";
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
