$(document).ready(function()
{
	$("button[data-id]").on("click", function()
	{
		var seq = $(this).attr("data-id");
		
		var result = $.api.article.deleteArticle({boardId : "sample", seq : seq, isRemove : "Y"});
		if(result.code == 1000)
			location.reload();
		else
			console.error(result);
	});
});