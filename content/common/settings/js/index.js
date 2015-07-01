$(document).ready(function()
{
	if($.query.fragment)
	{
		$(".tabs .tab").removeClass("selected");
		$(".tabs .tab[href='?fragment=" + $.query.fragment + "']").addClass("selected");
	}
	else
	{
		location.href = "?fragment=board";
	}
});