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
		alert(msg);
	}
})();
