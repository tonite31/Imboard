$(document).ready(function()
{
	$("#typeSelect").on("change", function()
	{
		var value = $(this).val();
		var result = $.api.visitor.getVisitorList({type : value});
		
		if(value == "browser")
			$("#typeHeader").text("브라우저 이름");
		else if(value == "referer")
			$("#typeHeader").text("유입 URL");
		else if(value == "date")
			$("#typeHeader").text("접속일자");
		
		if(result.code == 1000)
		{
			var html = $("#imboard-settings-visitor-template").html();
			var template = Handlebars.compile(html);
			
			$("#tbody").html(template({visitorList : result.data}));
		}
		else
		{
			$("#tbody").html("<tr><td style='color:red;' colspan='2'>" + JSON.stringify(result) + "</td>");
		}
	});
});