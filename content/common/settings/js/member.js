$(document).ready(function()
{
	$("#member table tr[data-id] select").on("change", function()
	{
		var param = {
				id : $(this).parent().parent().attr("data-id"), level : $(this).val(), name : $(this).parent().parent().children("td:first").text()
		}
		
		var result = $.api.user.updateUser(param);
		console.log("결과 : ", result);
	});
});