var winston = require('winston');

module.exports = function(filename, level, colorize) {
	
	var log =
	{
		'logger' :
		{
			'levels':
			{
				'deploy': -1,
				'detail': 0,
				'trace': 1,
				'debug': 2,
				'enter': 3,
				'info': 4,
				'warn': 5,
				'error': 6
			}
		},
		'colors':
		{
			'detail': 'grey',
			'trace': 'white',
			'debug': 'blue',
			'enter': 'inverse',
			'info': 'green',
			'warn': 'yellow',
			'error': 'red'
		}
	};
	
	var console = new (winston.transports.Console)({'level' : level, 'colorize': colorize});
	var file = new (winston.transports.File)({level : level, json : false, filename : filename});

	if(level >= 0)
		logger = new (winston.Logger)({'transports': [console, file]});
	else
		logger = new (winston.Logger)({"transports" : [file]});
	 
	logger.setLevels(log.logger.levels);
	logger.exitOnError = false;
	winston.addColors(log.colors);
	return logger;
};