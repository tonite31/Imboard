/**
 * $.api.lol
 */
$.api.lol = {};
$.api.lol.getTeam = function(data)
{
	return $.api.httpRequest({
	   url: "/lol/getTeam.do",
	   type: 'post',
	   data : data,
	   async: false
	});
};

$.api.lol.getMembers = function(data)
{
	return $.api.httpRequest({
	   url: "/lol/getMembers.do",
	   type: 'post',
	   data : data,
	   async: false
	});
};

$.api.lol.getChampions = function(data, success)
{
	return $.api.httpRequest({
		url: "/lol/getChampions.do",
		type: 'post',
		data : data,
		success : success,
		async: true
	});
};