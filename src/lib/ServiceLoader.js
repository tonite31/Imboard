var CronJob = require('cron').CronJob;
var fs = require('fs');

var Scheduler = function()
{
	if(Scheduler.caller != Scheduler.getInstance)
		throw new Error("This Scheduler object cannot be instanciated");
	
	this.serviceList = {};
};

Scheduler.instance = null;

Scheduler.getInstance = function(){
	if(this.instance == null)
		this.instance = new Scheduler();
	
	return this.instance;
}

Scheduler.prototype.load = function()
{
	
};

module.exports = Scheduler.getInstance();