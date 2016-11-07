var savedSeq = null;
$(document).ready(function()
{
	var signedUser = $.api.user.getSignedUser();
	
	if($.query.seq != null)
		savedSeq = $.query.seq;
	
	var result = $.api.article.getArticle({boardId : "qna", seq : $.query.seq, password : $.query.password});
	if(result.code == 1000)
	{
		$('#subject').val(result.data.subject);
		$('#content').val(result.data.content);
		$('#writerName').val(result.data.writerName);
		$('#password').val(result.data.password);
	}
	else if(result.code == -9998)
	{
		alert("비밀번호가 일치하지 않습니다");
		history.back();
	}
	else
	{
		alert("게시글이 존재하지 않습니다");
		history.back();
	}
	
	$('#write').on('click', function()
	{
		$('#writeForm').submit();
	});
	
	formSubmit('#writeForm', function(param)
	{
		param.boardId = "qna";
		if(signedUser.code == 1000 && signedUser.data.level < 0)
		{
			param.isNotice = "Y";
			delete param.password;
		}
		
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
				alert("비밀번호가 일치하지 않습니다.");
			}
			else
			{
				location.href = "?body=havy&subbody=contact";
			}
		}
	});
});