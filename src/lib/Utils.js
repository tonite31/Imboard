var crypto = require("crypto");

module.exports.dateFormat = function(date)
{
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	
	month = (month < 10 ? "0" + month : month);
	day = (day < 10 ? "0" + day : day);
	hour = (hour < 10 ? "0" + hour : hour);
	minute = (minute < 10 ? "0" + minute : minute);
	second = (second < 10 ? "0" + second : second);
	
	return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
};

module.exports.encrypt = function(text,key)
{
    var cipher = crypto.createCipher('aes-256-cbc',key); 
    var encipheredContent = cipher.update(text,'utf8','hex'); 
    encipheredContent += cipher.final('hex');
    return encipheredContent;
}

module.exports.decrypt = function(text,key)
{
    var decipher = crypto.createDecipher('aes-256-cbc',key);
    var decipheredPlaintext = decipher.update(text,'hex','utf8');
    decipheredPlaintext += decipher.final('utf8');
    return decipheredPlaintext;
}