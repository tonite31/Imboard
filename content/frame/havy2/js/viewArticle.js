$(document).ready(function()
{
	$("#deleteArticle").on("click", function()
	{
		if(confirm("정말 삭제하시겠습니까?"))
		{
			var result = $.api.article.deleteArticle({boardId : $.query.boardId, seq : $.query.seq, isRemove : "Y"});
			if(result.code == 1000)
			{
				$("#viewList").click();
			}
			else
			{
				console.error(result);
			}
		}
	});
	
	$("#viewList").on("click", function()
	{
		var body = "";
		if($.query.boardId == "live" || $.query.boardId == "photo")
			body = "gallery";
		else if($.query.boardId == "training")
			body = "training";
		else if($.query.boardId == "qna")
			body = "qna";
		
		location.href = "?body=" + body + ($.query.boardId ? "&boardId=" + $.query.boardId : "") + ($.query.seq ? "&seq=" + $.query.seq : "") + ($.query.pageIndex ? "&pageIndex=" + $.query.pageIndex : "");
	});
});