$(document).ready(function()
{
//	var result = $.api.lol.getTeam({id : "TEAM-5dcc98b0-ed46-11e3-aed9-782bcb67b7b6"});
	
//	var result = $.api.lol.getMembers({teamId : "TEAM-5dcc98b0-ed46-11e3-aed9-782bcb67b7b6"});

	var result = '{"code":1000,"data":[{"playerId":2391989,"joinDate":1402037222000,"inviteDate":1402037222000,"status":"MEMBER","id":2391989,"name":"탭댄스좀비","profileIconId":588,"summonerLevel":30,"revisionDate":1445069954000},{"playerId":10539425,"joinDate":1402037260000,"inviteDate":1402037253000,"status":"MEMBER","id":10539425,"name":"Alprensia","profileIconId":590,"summonerLevel":30,"revisionDate":1445172384000},{"playerId":1142486,"joinDate":1402037263000,"inviteDate":1402037254000,"status":"MEMBER","id":1142486,"name":"포코포코","profileIconId":7,"summonerLevel":30,"revisionDate":1445172384000},{"playerId":1240807,"joinDate":1402037376000,"inviteDate":1402037364000,"status":"MEMBER","id":1240807,"name":"서애 류성룡","profileIconId":931,"summonerLevel":30,"revisionDate":1445172861000},{"playerId":2088429,"joinDate":1402802683000,"inviteDate":1402802578000,"status":"MEMBER","id":2088429,"name":"봉코치","profileIconId":774,"summonerLevel":30,"revisionDate":1445269437000},{"playerId":7363429,"joinDate":1407602630000,"inviteDate":1407602618000,"status":"MEMBER","id":7363429,"name":"바라티에","profileIconId":10,"summonerLevel":30,"revisionDate":1445260232000},{"playerId":4531046,"joinDate":1431241296000,"inviteDate":1431240821000,"status":"MEMBER","id":4531046,"name":"스카이디지털","profileIconId":20,"summonerLevel":30,"revisionDate":1445168736000},{"playerId":1144301,"joinDate":1434213169000,"inviteDate":1434213164000,"status":"MEMBER","id":1144301,"name":"S2중씨","profileIconId":931,"summonerLevel":30,"revisionDate":1445269409000},{"playerId":4437439,"joinDate":1443786821000,"inviteDate":1443786574000,"status":"MEMBER","id":4437439,"name":"꿀먹어","profileIconId":775,"summonerLevel":30,"revisionDate":1445262533000}]}';
	result = JSON.parse(result);
	
	var template = Handlebars.compile($("#memberListTemplate").html());
	if(result.code == 1000)
	{
		$("#memberList").html(template({memberList : result.data}));
	}
});