$(document).ready(function()
{
	$("#class a").on("click", function()
	{
		$("#class .selected").removeAttr("class");
		$(this).attr("class", "selected");
		
		var index = $(this).parent().index();
		$("#infoTable").css("margin-left", "-" + (index*100) + "%");
	});
});