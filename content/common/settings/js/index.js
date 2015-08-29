$(document).ready(function()
{
	if($.query.fragment)
	{
		$(".list-group-item").removeClass("active");
		$(".list-group-item a[href='?fragment=" + $.query.fragment + "']").parent().addClass("active");
	}
	else
	{
		location.href = "?fragment=board";
	}
});
