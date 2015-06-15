$(document).ready(function()
{
	if($.query.piece)
	{
		$(".navbar-nav li").removeAttr("active");
		$(".navbar-nav li a[href='?piece=" + $.query.piece + "']").parent().addClass("active");
	}
});