$(document).ready(function()
{
	$("#contentList").compile({top : 20, direction : "vertical"});
	$(window).on("scroll", function(e)
	{
		var top = $(this).scrollTop();
		console.log(top);
		
		var minTarget = null;
		$("#documentArea *[id^=doc]").each(function()
		{
			var rect = this.getBoundingClientRect();
			if(rect.top >= 0)
			{
				if(!minTarget || minTarget.distance > rect.top)
				{
					minTarget = {distance : rect.top, element : this};
				}
			}
			
			$(this).removeClass("selected");
		});
		
		console.log("머지 : ", minTarget);
		
		if(minTarget)
			$(minTarget.element).addClass("selected");
	});
});