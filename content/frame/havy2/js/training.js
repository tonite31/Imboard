$(document).ready(function()
{
	$("button[data-id='expandButton']").on("click", function()
	{
		var maxHeight = $(this).parent().css("max-height");
		if(maxHeight == "430px")
		{
			$(this).parent().css("max-height", "");
			$(this).text("접기");
		}
		else
		{
			$(this).parent().css("max-height", "430px");
			$(this).text("펼치기");
		}
	});
	
	$("button[data-delete]").on("click", function()
	{
		if(confirm("정말 삭제하시겠습니까?"))
		{
			var result = $.api.article.deleteArticle({boardId : "training", seq : $(this).attr("data-delete"), isRemove : "Y"});
			if(result.code == 1000)
			{
				$(this).parent().parent().parent().remove();
			}
			else
			{
				alert("권한이 없습니다");
			}
		}
	});
});