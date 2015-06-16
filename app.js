global.useConsole = true;

global._path =
{
	content : __dirname + "/content",
	src : __dirname + "/src",
	resources : __dirname + "/resources",
	lib : __dirname + "/src/lib",
	log : __dirname + "/logs",
	userdata : __dirname + "/userdata"
};
	
global._multipart = require('connect-multiparty');
global._languages = require(__dirname + '/resources/properties/languages');
global._config = require(__dirname + '/resources/properties/config');
global._aws = _config.aws;
global._openAuth = _config.openAuth;
global._code = _config.code;

global._port = _config.server.port;
global._host = _config.server.host;
global._baseUrl = _host;
global._modules = {};

/**
 * 
 */
var express = require('express');
var methodOverride = require('method-override');
var mysql = require('mysql');
var mybatis = require('immybatis');
var session = require('express-session');
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var favicon = require('serve-favicon');
var https = require("https");

var Logger  = require(_path.lib + "/Logger");
var ModuleScanner = require(_path.lib + "/ModuleScanner");
var DataBindModuleLoader = require(_path.lib + "/DataBindModuleLoader");

var fs = require('fs');
if(!fs.existsSync(_path.log))
	fs.mkdirSync(_path.log, 0777);

/**
 * global 객체 생성
 */
global.pool = mysql.createPool(_config.jdbc);
global._log = new Logger(_path.log + "/debug.log", useConsole, _config.log.level, _config.log.colorize);
global._loge = new Logger(_path.log + "/exception.log", useConsole, _config.log.level, _config.log.colorize);
global._mybatis = new mybatis.Principal();
global.sqlMapConfig = _mybatis.processe(_path.src + "/handler/Typehandler", _path.src + "/vo/");
global.ParameterBinder = require(_path.lib + "/ParameterBinder.js");
global.Delegator = require(_path.lib + "/Delegator.js");
global.Render = require(_path.lib + "/Render.js");
global._async = require('async');
global._utils = require(_path.lib + "/Utils.js");

/**
 * 서버에 백그라운드로 올렸을때 오류 나는거때문에 콘솔 오버라이드
 */
if(!global.useConsole)
{
	console = {};
	for(var key in _log)
	{
		console[key] = _log[key];
	}

	console.log = function()
	{
		_log.debug(arguments);
	};
}

/**
 * Express 설정
 */
global.app = express();

var server = app.listen(_port, function()
{
	_log.debug('Listening on port %d', server.address().port);
});

app.use('/content', express.static(_path.content));
app.use('/resources', express.static(_path.userdata));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//app.use(express.bodyParser());
app.use(cookieParser());
app.use(session({ secret: 'imboard', resave: true, saveUninitialized: true}));
app.use(methodOverride());
app.use(require('express-domain-middleware'));
app.use(mybatis.Contexto.domainMiddleware);
app.use(mybatis.Contexto.middlewareOnError);

app.use(function(err, req, res, next)
{
	_loge.error("=================================================");
	_loge.error("time : " + new Date().toString());
	_loge.error("name : DomainError");
	_loge.error("-------------------------------------------------");
	_loge.error(err.stack);
	_loge.error("=================================================");

	res.statusCode = 500;
	res.end();
});

process.on('uncaughtException', function (err)
{
	_loge.error("\n\n");
	_loge.error("=================================================");
	_loge.error("time : " + new Date().toString());
	_loge.error("name : UncaughtException");
	_loge.error("-------------------------------------------------");
	_loge.error(err.stack);
	_loge.error("=================================================\n\n");
});

var FacebookIP = require(_path.lib + "/IdentityProvider").facebook;
var TwitterIP = require(_path.lib + "/IdentityProvider").twitter;
var GoogleIP = require(_path.lib + "/IdentityProvider").google;

FacebookIP(app);
TwitterIP(app);
GoogleIP(app);

ModuleScanner.setLogger(_log);
ModuleScanner.scanRouter(_path.src + "/router");
ModuleScanner.scanModel(_path.src + '/vo');
ModuleScanner.scanMybatisXml(_path.resources + '/mybatis');

DataBindModuleLoader.load(_path.src + "/module");