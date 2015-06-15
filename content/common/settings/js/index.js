$(document).ready(function()
{
	if($.query.piece)
	{
		$(".tabs .tab").removeClass("selected");
		$(".tabs .tab[href='?piece=" + $.query.piece + "']").addClass("selected");
	}
	else
	{
		location.href = "?piece=board";
	}
});