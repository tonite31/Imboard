var savedSeq = null;
$(document).ready(function()
{
	CKEDITOR.replace("ckeditor", { height: 300 });
	
	if($.query.seq != null)
		savedSeq = $.query.seq;
	
	$("#form").compile(function(param)
	{
		param.boardId = "qna";
		param.content = CKEDITOR.instances.ckeditor.getData();
		var result = null;
		if(savedSeq != null)
		{
			param.seq = savedSeq;
			result = $.api.article.updateArticle(param);
		}
		else
		{
			result = $.api.article.writeArticle(param);
		}
		
		if(result != null)
		{
			if(result.code == -9998)
			{
				alert("권한이 없습니다");
			}
			else
			{
				location.href = "?body=qna";
			}
		}
	});
});