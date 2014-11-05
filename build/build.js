var Library=require("./library.js");
var step=require("step");
var path = require('path');
var util=require("util");
var fs = require("fs-extra");
var async = require("async");

/*****************************/
// Define the configurations.
/*****************************/

var apiServer="https://api.tinkercad.com";

// the location where the disconnected pacakge is stored to.
var version="5";
var dest = path.resolve(__dirname, "../tmp", version);
var combinedJsFileName = path.resolve(dest, "widget.js");

// define the libraries included in the disconnected package.
var libList = [
	{ id: "1vxKXGNaLtr", version: 0 }, // core
	// {}, // uitoolkit
	// {}, // player
	{id: "aLVZT9dTtGG", version: 0}, // connector
	// {}, // contentbuilder
	// {}, // contentbuildercore
	// {} // transformation modifier
];
// var libInfo = {
// 	id: "1vxKXGNaLtr", version: 0
// };
// var libInfo = {
// 	id: "aLVZT9dTtGG", version: 0
// };
/*****************************/

fs.mkdirp(dest); // make sure the folder exist.

var getResourceFullFileName = function(lib, itemName){
	var name = util.format("%s/%s_%s_%s", dest, lib.id, lib.version, itemName);
	return name;
}

var libs = [];
for(var i = 0; i < libList.length; i++){
	libs.push(new Library(apiServer,libList[i].id, libList[i].version))
}
// var lib = new Library(apiServer,libInfo.id, libInfo.version);
// lib.getJs(function(err, body){
// 	console.log(body);
// });

// var lib = new Library(apiServer,libInfo.id, libInfo.version);
// lib.getJs(function(err, body){
// 	console.log(body);
// });

// lib.getMeta(function(err, body){
// 	console.log(body);
// });

// lib.getMinJs(function(err, body){
// 	console.log(body);
// });
// var itemName = 'core.css';
// var fileName = getResourceFullFileName(lib, itemName);

// lib.downloadItem(itemName, fileName, function(err){
// 	console.log( err);
// });


step(
	function downloadAndCombineJsData(){
		console.log("downloading js data...");
		var getJs = function(lib, callback){
			lib.getJs(callback);
		}
		async.map(libs, getJs, this);
	},
	function combineAndSaveJsFile(err, files){
		if(err) throw err;
		var combinedJs = "";
		for(var i=0; i < files.length; i++){
			combinedJs+=files[i];
		}
		fs.writeFile(combinedJsFileName, combinedJs, this);
	},
	function getTheMeta(err){
		if(err) throw err;
		console.log("downloading meta data...");

		var getMeta = function(lib, callback){
			lib.getMeta(callback);
		}
		async.map(libs, getMeta, this);
	},
	function downloadResourceItems(err, metas){
		if(err) throw err;
		console.log("downloading resource files...");

		var resourceList = [];
		var resources, j;
		for(var i=0; i<metas.length; i++){
			resources = metas[i].resources;
			for(j=0; j<resources.length; j++){
				if(resources[j].purpose !== "doc"){
					resourceList.push({lib: libs[i], name:resources[j].name, file: getResourceFullFileName(libs[i], resources[j].name)});
				}
			}
		}
		
		var downloadItem = function(res, callback){
			res.lib.downloadItem(res.name, res.file, callback);
		}
		async.map(resourceList, downloadItem, this);
	},
	function logResult(err){
		if(err){
			console.log("Error - " + err.message);
		}
		else{
			console.log("Success");
		}
	});