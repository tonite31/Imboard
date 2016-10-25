$(document).ready(function()
{
	$("a[data-seq]").on("click", function()
	{
		var seq = $(this).attr("data-seq");
		var result = $.api.article.deleteArticle({boardId : "teacher", seq : seq, isRemove : "Y"});
		if(result.code == 1000)
		{
			$(this).parent().parent().parent().parent().remove();
		}
		else
		{
			alert("오류발생");
			console.error(result);
		}
	});
});