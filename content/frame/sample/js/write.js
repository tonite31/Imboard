$(document).ready(function()
{
	$("#form").compile(function(data)
	{
		var result = null;
		
		if($.query.seq)
			result = $.api.article.updateArticle({boardId : "sample", seq : $.query.seq, subject : data.subject, content : data.content});
		else
			result = $.api.article.insertArticle({boardId : "sample", subject : data.subject, content : data.content, writerName : data.writerName});
		
		if(result.code == 1000)
			location.href = "/";
		else
			console.error(result);
	});
	
	if($.query.seq)
	{
		var result = $.api.article.getArticle({boardId : "sample", seq : $.query.seq});
		$("#form").setData(result.data);
	}
});