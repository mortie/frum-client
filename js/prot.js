(function()
{
	window.Prot = function(url)
	{
		this.ws = new WebSocket(url, "frumProt");

		this._evts = {};

		this._cbs = [];
		this._requestId = 1;

		this._queue = [];
		this._ready = false;
		this.ws.onopen = function()
		{
			this._ready = true;
			this._queue.forEach(function(entry)
			{
				this.send(entry[0], entry[1], entry[2]);
			}.bind(this));
		}.bind(this);

		this.ws.onclose = function()
		{
			this._emit("close");
		}.bind(this);

		this.ws.onmessage = function(evt)
		{
			var msg = JSON.parse(evt.data);

			//request ID of 0 means that this is an event, not a reply
			if (msg.r === undefined)
			{
				this._emit(msg.e, msg.d);
			}

			//if not, it's a response to a request
			else if (this._cbs[msg.r] !== undefined)
			{
				this._cbs[msg.r](msg.err, msg.d);
				delete this._cbs[msg.r];
			}

			//report errors
			else
			{
				throw new Error("No callbacks from request with ID "+msg.r);
			}
		}.bind(this)
	}

	window.Prot.prototype =
	{
		"on": function(evt, cb)
		{
			if (this._evts[evt] === undefined)
				this._evts[evt] = [];

			this._evts[evt].push(cb);
		},

		"send": function(method, data, cb)
		{
			if (this._ready)
			{
				this._cbs[this._requestId] = cb;

				this.ws.send(JSON.stringify(
				{
					"m": method,
					"r": this._requestId,
					"d": data
				}));

				this._requestId += 1;
			}
			else
			{
				this._queue.push([method, data, cb]);
			}
		},

		"_emit": function(evt, data)
		{
			if (this._evts[evt])
			{
				this._evts[evt].forEach(function(cb)
				{
					cb(data);
				});
			}
		}
	}
})();
