var request = require("request");
var util=require("util");
var fs = require("fs");

/**
@param {String} server the value is like https://api.tinkercad.com
**/
var Library = function(server, id, version){
	this.server = server;
	this.id = id;
	this.version = version;
};

Library.prototype = {
	getJs: function(callback){
		var url = util.format("%s/libraries/%s/%s/library.js", this.server, this.id, this.version);
		_get(url, callback);
	},
	getMinJs: function(callback){
		var url = util.format("%s/libraries/%s/%s/library.min.js", this.server, this.id, this.version);
		_get(url, callback);
	},
	/**
	@param {Function(err, metaJSON)} callback
	**/
	getMeta: function(callback){
		if(typeof callback !== 'function') return;

		var url = util.format("%s/libraries/%s/%s", this.server, this.id, this.version);
		_get(url, function(err, meta){
			if(!err){
				if(typeof meta === 'string'){
					meta = JSON.parse(meta);
				}
			}

			callback(err, meta);
		});
	},
	getItem: function(id, callback){
		var url = util.format("%s/libraries/%s/%s/item/%s", this.server, this.id, this.version, id);
		_get(url, callback);
	},
	downloadItem: function(id, fullFileName, callback){
		var statusCode = 200;
		// http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options
		var url = util.format("%s/libraries/%s/%s/item/%s", this.server, this.id, this.version, id);
		var r = request(url).on('response', function(response) {
			statusCode = response.statusCode;
		    // console.log(response.headers['content-type'])
		}).pipe(fs.createWriteStream(fullFileName));
		r.on('close', function(){
			var bSucc = statusCode >= 200 && statusCode < 300;
			var err = bSucc?undefined:new Error("Failed to download");
			callback(err);
		});
	}
};

/**
Return the body of the http response.
**/
var _get=function(url, callback){
	if(typeof callback !== 'function') return;

	request(url, function (err, response, body) {
		if(err){
			callback(err);
		}
		else{
			callback(undefined, body);
		}
	});
};

module.exports = Library;