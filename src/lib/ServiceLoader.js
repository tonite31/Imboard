var CronJob = require('cron').CronJob;
var fs = require('fs');

module.exports.load = function(dir)
{
	
	var CronJobManager = require('cron-job-manager');
	var manager = new CronJobManager();
	
	manager.add('test1','2 * * * * *', function(){console.log("2초마다!")}, {
	    start: false, 
	    completion: null, 
	    timeZone:"Australia/Sydney"
	  });
	
	manager.add('test2','4 * * * * *', function(){console.log("으아악!")}, {
	    start: false, 
	    completion: null, 
	    timeZone:"Asia/Seoul"
	  });
	
	manager.start('test1');
	manager.start('test2');
	
	
//	var files = fs.readdirSync(dir);
//	
//	for(var i=0; i<files.length; i++)
//	{
//		if(files[i].lastIndexOf(".js") == -1)
//			continue;
//		
//		var module = require(dir + '/' + files[i]);
//		for(var key in module)
//		{
//			var data = module[key];
//			
//			if(data.callback)
//			{
//				var cron = data.cron;
//				if(!cron)
//				{
//					cron = "";
//					if(data.second)
//						cron += (data.second.length == 1 ? "" + data.second : data.second);
//					else
//						cron += "*";
//					
//					if(data.minute)
//						cron += " " + (data.minute.length == 1 ? "0" + data.minute : data.minute);
//					else
//						cron += " *";
//					
//					if(data.hour)
//						cron += " " + (data.hour.length == 1 ? "0" + data.hour : data.hour);
//					else
//						cron += " *";
//					
//					if(data.dayOfMonth)
//						cron += " " + (data.dayOfMonth.length == 1 ? "0" + data.dayOfMonth : data.dayOfMonth);
//					else
//						cron += " *";
//					
//					if(data.month)
//						cron += " " + (data.month.length == 1 ? "0" + data.month : data.month);
//					else
//						cron += " *";
//					
//					if(data.dayOfWeek)
//						cron += " " + (data.dayOfWeek.length == 1 ? "0" + data.dayOfWeek : data.dayOfWeek);
//					else
//						cron += " *";
//				}
//				
//				try
//				{
//					console.log("크론 : ", cron);
//					var job = new CronJob("* * * * * *", data.callback, null, true, "asia/seoul");
//				}
//				catch(err)
//				{
//					_log.error(err.stack);
//				}
//			}
//		}
//	}
};