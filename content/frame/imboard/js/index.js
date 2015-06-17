$(document).ready(function()
{
	if($.query.fragment)
	{
		$(".navbar-nav li").removeAttr("active");
		$(".navbar-nav li a[href='?fragment=" + $.query.fragment + "']").parent().addClass("active");
	}
});