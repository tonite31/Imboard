$(document).ready(function()
{
	var last = $("#menuList").find("li[data-priority]:last-child");
	
	$("#addType").on("click", function()
	{
		var data = {};
		data.id = new Date().getTime();
		data.name = "게시판";
		data.type = $("#typeSelect").val();
		data.priority = parseInt($(last[0]).attr("data-priority")) + 1;
		var result = $.api.menu.insertMenu(data);
		console.log(result);
	});
});