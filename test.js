global._path =
{
	home : __dirname,
	content : __dirname + "/content",
	src : __dirname + "/src",
	resources : __dirname + "/resources",
	lib : __dirname + "/src/lib",
	log : __dirname + "/logs",
	userdata : __dirname + "/userdata"
};
	
global._config = require(__dirname + '/resources/properties/config');

/**
 * 
 */
var mysql = require('mysql');
var Immy = require(_path.lib + "/Immy");
var Logger  = require(_path.lib + "/Logger");

/**
 * global 객체 생성
 */
global.pool = mysql.createPool(_config.jdbc);
global._log = new Logger(_path.log + "/debug.log", _config.log.level, _config.log.colorize, true);
global._loge = new Logger(_path.log + "/exception.log", _config.log.level, _config.log.colorize, true);
global.ParameterBinder = require(_path.lib + "/ParameterBinder.js");
global._async = require('async');
global._utils = require(_path.lib + "/Utils.js");
global._immy = new Immy(pool, _log, _loge);

_immy.scanTypeHandler(_path.src + "/handler");
_immy.scanModel(_path.src + "/vo");
_immy.scanQuery(_path.resources + "/mybatis");

_immy.executeQuery('article', 'getArticle', {boardId : '123', seq : 1}, function(result)
{
	console.log("결과", result[0].fileList);
});