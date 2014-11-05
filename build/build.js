var Library=require("./library.js");
var step=require("step");
var path = require('path');
var util=require("util");
var fs = require("fs-extra");

var apiServer="https://api.tinkercad.com";

var dest = path.resolve(__dirname, "tmp");
fs.mkdirp(dest); // make sure the folder exist.

var libInfo = {
	id: "1vxKXGNaLtr", version: 0
};
var libInfo = {
	id: "aLVZT9dTtGG", version: 0
};

var getResourceFullFileName = function(lib, itemName){
	var name = util.format("%s/%s_%s_%s", dest, lib.id, lib.version, itemName);
	return name;
}

var lib = new Library(apiServer,libInfo.id, libInfo.version);
// lib.getJs(function(err, body){
// 	console.log(body);
// });

// lib.getMeta(function(err, body){
// 	console.log(typeof body);
// });

// lib.getMinJs(function(err, body){
// 	console.log(body);
// });
var itemName = 'core.css';
var fileName = getResourceFullFileName(lib, itemName);

lib.downloadItem(itemName, fileName, function(err){
	console.log( err);
});


step(
	function downloadAndCombineJsData(){
		this();
	},
	function getTheMeta(err){
		if(err) throw err;
		this();

	},
	function downloadResourceItems(err){
		if(err) throw err;
		this();

	},
	function logResult(err){
		if(err){
			console.log("Error - " + err.message);
		}
		else{
			console.log("Success");
		}
		
	});