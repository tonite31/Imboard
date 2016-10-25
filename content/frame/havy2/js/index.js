$(document).ready(function()
{
	if(location.search)
	{
		$("header .navbar-nav img").css("opacity", "");
		$("header .navbar-nav a[href='" + location.search + "']").children("img").css("opacity", "1");
	}
});