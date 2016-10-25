$(document).ready(function()
{
	var signedUser = $.api.user.getSignedUser();
	if(signedUser.code == 1000 && signedUser.data.level < 0)
	{
		$("#passwordConfirmArea").remove();
	}
	
	$("#passwordConfirmArea > form").compile(function(data)
	{
		var result = $.api.article.getArticle({boardId : "qna", seq : $.query.seq, password : data.password});
		if(result.code == 1000)
		{
			var template = Handlebars.compile($("#qnaArticle").html());
			$("#qnaArea").html(template(result.data));
			$("#qnaArea .answer-area").removeAttr("data-bind").removeAttr("data-param").removeAttr("data-template-id");
			
			var result = $.api.comment.getCommentList({boardId : "qna", articleSeq : $.query.seq});
			if(result.code == 1000)
			{
				if(result.data.length <= 0)
				{
					$("#qnaArea .answer-area").html("답변이 아직 등록되지 않았습니다");
				}
				else
				{
					var template = Handlebars.compile($("#qnaComment").html());
					$("#qnaArea .answer-area").html(template({commentList : result.data}));
				}
			}
			else
			{
				$("#qnaArea .answer-area").html("답변을 불러오는데 실패했습니다.");
			}
			
			$("#passwordConfirmArea").remove();
			$("#deleteQna").on("click", function()
			{
				if(confirm("정말 삭제하시겠습니까?"))
				{
					var result = $.api.article.deleteArticle({boardId : "qna", seq : $.query.seq, isRemove : "Y"});
					if(result.code == 1000)
					{
						location.href = "?body=qna";
					}
					else
					{
						alert("오류가 발생했습니다.");
						console.error(result);
					}
				}
			});
		}
		else if(result.code == -9998)
		{
			alert("비밀번호가 일치하지 않습니다");
		}
		else
		{
			alert("게시글이 존재하지 않습니다");
		}
	});
	
	$("#writeComment").on("click", function()
	{
		var content = $("#commentContent").val();
		var result = $.api.comment.insertComment({boardId : "qna", articleSeq : $.query.seq, content : content});
		if(result.code == 1000)
		{
			var commentList = $.api.comment.getCommentList({boardId : "qna", articleSeq : $.query.seq, searchData : {orderByGroupId : "ASC"}});
			if(commentList.code == 1000)
			{
				var template = Handlebars.compile($("#qnaComment").html());
				$(".answer-area").html(template({commentList : commentList.data}));
				$("#commentContent").val("");
			}
			else
			{
				alert("답변 목록을 불러오는데 실패했습니다");
			}
		}
		else
		{
			alert("답변 작성 권한이 없습니다");
		}
	});
	
	$("#deleteQna").on("click", function()
	{
		if(confirm("정말 삭제하시겠습니까?"))
		{
			var result = $.api.article.deleteArticle({boardId : "qna", seq : $.query.seq, isRemove : "Y"});
			if(result.code == 1000)
			{
				location.href = "?body=qna";
			}
			else
			{
				alert("오류가 발생했습니다.");
				console.error(result);
			}
		}
	});
	
	$(".deleteComment").on("click", function()
	{
		var articleSeq = $(this).attr("data-article-seq");
		var seq = $(this).attr("data-seq");
		
		var result = $.api.comment.deleteComment({boardId : "qna", articleSeq : articleSeq, seq : seq, isRemove : "Y"});
		if(result.code == 1000)
		{
			$(this).parent().remove();
		}
		else
		{
			alert("삭제 오류가 발생했습니다");
			console.error(result);
		}
	});
});