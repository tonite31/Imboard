$(document).ready(function()
{
	$("#contentList").compile({top : 20, direction : "vertical"});
	$("#contentList li:first").addClass("selected");
	$(window).on("scroll", setSelectedContent);
	setSelectedContent.call(window);
});

function setSelectedContent()
{
	var top = $(this).scrollTop();
	
	$("#contentList li.selected").removeClass("selected");
	
	var minTarget = null;
	$("#documentArea *[id^=doc]").each(function()
	{
		var rect = this.getBoundingClientRect();
		if(rect.top <= 0)
		{
			if(!minTarget || minTarget.distance < rect.top)
			{
				minTarget = {distance : rect.top, element : this};
			}
		}
	});
	
	if(minTarget)
	{
		$("#contentList li a[href='#" + $(minTarget.element).attr("id") + "']").parent().addClass("selected");
	}
	else
	{
		$("#contentList li:first").addClass("selected");
	}
}