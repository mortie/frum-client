(function()
{
	function request(url, method, data, cb)
	{
		var xhr = new XMLHttpRequest();
		xhr.onload = function()
		{
			if (xhr.status === 200)
				cb(xhr.responseText);
			else
				throw new Error(xhr.status+": "+xhr.statusText+" ("+url+")");
		}
		xhr.open(method, url);
		xhr.send(data);
	}

	function get(url, cb)
	{
		request(url, "get", null, cb);
	}

	function post(url, data, cb)
	{
		request(url, "post", data, cb);
	}

	function Async(num, cb)
	{
		return function()
		{
			--num;
			if (num <= 0) cb();
		}
	}

	function template(str, args)
	{
		if (!args)
			return str;

		for (var i in args)
		{
			if (typeof args[i] === "string")
				str = str.split("{{"+i+"}}").join(args[i]);
			else if (args[i] === true)
				str = str.split("{{"+i+"?}}").join(i);
			else if (args[i] === false)
				str = str.split("{{"+i+"?}}").join("");
		}

		return str;
	}

	function addEvent(base, q, evt, cb)
	{
		var elems = base.querySelectorAll(q);
		for (var i in elems)
		{
			var elem = elems[i];
			if (!(elem instanceof Node))
				break;

			elem.addEventListener(evt, cb, false);
		}
	}

	window.Spat = function(options)
	{
		options = options || {};

		this.defaultView = options.defaultView;
		this._viewsDir = options.viewsDir || "views";
		this._templatesDir = options.templatesDir || "templates";
		this._element = options.element || document.getElementById("view");

		this._views = {};
		this._path = window.location.hash.substring(1);
		this._templateCache = {};

		function viewChangeHandler()
		{
			this._path = window.location.hash.substring(1);
			if (this._path !== "")
				this.load(this._path);
		}

		window.addEventListener("popstate", viewChangeHandler.bind(this));
		window.addEventListener("load", viewChangeHandler.bind(this));
	}
	window.Spat.prototype =
	{
		"addView": function(name, templates, cb)
		{
			var view = new View(
				name,
				templates,
				this._element,
				this._viewsDir,
				cb
			);

			this._views[name] = view;

			if (this._path == "" && name == this.defaultView)
				this.load(name);
		},

		"loadViews": function(names)
		{
			names.forEach(function(name)
			{
				var s = document.createElement("script");
				s.type = "text/javascript";
				s.src = this._viewsDir+"/"+name+"/index.js";
				document.body.appendChild(s);
			}.bind(this));
		},

		"load": function(path)
		{
			var tokens = path.split("/");
			var view = this._views[tokens[0]];

			if (!view)
			{
				console.log("View not found: "+path);
				return;
			}

			if (view.templatesLoaded)
			{
				view.cb(tokens, view);
				view._element.className = tokens[0];
			}
			else
			{
				view.ontemplatesloaded = function()
				{
					view.cb(tokens, view);
					view._element.className = tokens[0];
				}
			}
		},

		"loadTemplates": function(names, cb)
		{
			if (typeof names === "string")
				names = [names];

			var async = Async(names.length+1, cb);

			names.forEach(function(name)
			{
				if (this._templateCache[name])
					return async();

				get(this._templatesDir+"/"+name+".html", function(res)
				{
					this._templateCache[name] = res;
					async();
				}.bind(this));
			}.bind(this));
			async();
		},

		"template": function(name, args)
		{
			var str = this._templateCache[name];
			if (str === undefined)
				throw new Error(name+": No such template!");

			return template(str, args);
		},

		"draw": function(id, str)
		{
			document.getElementById(id).innerHTML = str;
		},

		"event": function(q, evt, cb)
		{
			addEvent(document, q, evt, cb);
		},

		"elem": function(q)
		{
			return document.querySelector(q);
		}
	}

	var View = function(name, templates, element, viewsDir, cb)
	{
		this.name = name;
		this.cb = cb;
		this._element = element;

		this.templatesLoaded = false;
		this._templateCache = {};

		//do things once all templates are loaded
		var async = Async(templates.length+1, function()
		{
			this.templatesLoaded = true;
			if (this.ontemplatesloaded)
				this.ontemplatesloaded();
		}.bind(this));

		//load all templates
		templates.forEach(function(template)
		{
			get(viewsDir+"/"+name+"/templates/"+template+".html", function(res)
			{
				this._templateCache[template] = res;
				async();
			}.bind(this));
		}.bind(this));
		async();
	}
	View.prototype =
	{
		"template": function(name, args)
		{
			var str = this._templateCache[name];
			if (str === undefined)
				throw new Error(name+": No such template!");

			return template(str, args);
		},

		"draw": function(str)
		{
			this._element.innerHTML = str;
		},

		"event": function(q, evt, cb)
		{
			addEvent(this._element, q, evt, cb);
		},

		"elem": function(q)
		{
			return this._element.querySelector(q);
		},

		"post": post,

		"get": get,

		"Async": Async
	}
})();
