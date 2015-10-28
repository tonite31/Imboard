global.useConsole = true;
process.argv.forEach(function (val, index, array)
{
	if(index == 2 && val == "-deploy")
		global.useConsole = false;
});

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
	
global._multipart = require('connect-multiparty');
global._config = require(__dirname + '/resources/properties/config');
global._aws = _config.aws;
global._OAuth = _config.OAuth;
global._code = _config.code;

global._port = _config.server.port;
global._modules = {};

try
{
	global._localize = require(__dirname + '/content/frame/' + _config.frame + '/properties/localize');
}
catch(err)
{
	global._localize = {};
}

try
{
	global._localizeCore = require(__dirname + '/content/common/core/properties/localize');
}
catch(err)
{
	global._localizeCore = {};
}

try
{
	global._localizeSettings = require(__dirname + '/content/common/settings/properties/localize');
}
catch(err)
{
	global._localizeSettings = {};
}

try
{
	global._variables = require(__dirname + "/content/frame/" + _config.frame + "/properties/variables");
}
catch(err)
{
	global._variables = {};
}

/**
 * 
 */
var express = require('express');
var methodOverride = require('method-override');
var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var favicon = require('serve-favicon');
var https = require("https");

var Immy = require(_path.lib + "/Immy");
var Logger  = require(_path.lib + "/Logger");
var ModuleScanner = require(_path.lib + "/ModuleScanner");

var fs = require('fs');
if(!fs.existsSync(_path.log))
	fs.mkdirSync(_path.log, 0777);

if(!fs.existsSync(_path.userdata))
	fs.mkdirSync(_path.userdata, 0777);

/**
 * global 객체 생성
 */
global.pool = mysql.createPool(_config.jdbc);
global._log = new Logger(_path.log + "/debug.log", _config.log.level, _config.log.colorize, useConsole);
global._loge = new Logger(_path.log + "/exception.log", _config.log.level, _config.log.colorize, useConsole);
global.ParameterBinder = require(_path.lib + "/ParameterBinder.js");
global.Delegator = require(_path.lib + "/Delegator.js");
global.Render = require(_path.lib + "/Render.js");
global._async = require('async');
global._utils = require(_path.lib + "/Utils.js");
global._immy = new Immy(pool, _log, _loge);

var DataBindModuleLoader = require(_path.lib + "/DataBindModuleLoader");

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
app.use(cookieParser());
app.use(session({ secret: 'imboard', resave: true, saveUninitialized: true}));
app.use(methodOverride());
app.use(require('express-domain-middleware'));
app.use(function(req, res, next)
{
	var domain = require("domain");
	var reqDomain = domain.create();

    reqDomain.add(req);
    reqDomain.add(res);

    reqDomain.on('error', function (err)
    {
    	_immy.releaseConnection();
    	
    	_loge.error("\n\n");
    	_loge.error("=================================================");
    	_loge.error("time : " + new Date().toString());
    	_loge.error("name : Domain Error");
    	_loge.error("-------------------------------------------------");
    	_loge.error(err.stack);
    	_loge.error("=================================================\n\n");
    	
    	res.end(JSON.stringify({code : _code.EXCEPTION, message : err.stack}));
    });

    reqDomain.run(next);
});

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

_immy.scanTypeHandler(_path.src + "/handler");
_immy.scanModel(_path.src + "/vo");
_immy.scanQuery(_path.resources + "/mybatis");

ModuleScanner.setLogger(_log);
ModuleScanner.scanRouter(_path.src + "/router");

DataBindModuleLoader.load(_path.src + "/module");