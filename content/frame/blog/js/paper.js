var paperContentFunctionRect = null;

$(document).ready(function()
{
	$("#commentForm").compile(function(param)
	{
		var result = $.api.comment.writeComment({boardId : $.query.boardId, articleSeq : $.query.seq, content : param.content});
		if(result.code == 1000)
		{
			$("#commentForm textarea").val("");
			reload();
		}
	});
	
	$("#publishPaper").on("click", function()
	{
		var boardId = $(this).attr("data-board-id");
		var seq = $(this).attr("data-seq");
		var result = $.api.article.updateStatus({boardId : boardId, seq : seq, status : 1});
		if(result.code == 1000)
		{
			location.reload();
		}
	});
	
	$("#deletePaper").on("click", function()
	{
		$("#deleteConfirm").toggle();
	});
	
	$("#deleteConfirm").on("click", function()
	{	
		var boardId = $(this).attr("data-board-id");
		var seq = $(this).attr("data-seq");
		
		var result = $.api.article.deleteArticle({boardId : boardId, seq : seq, isRemove : "Y"});
		if(result.code == 1000)
		{
			location.href="?piece=book&username=" + $.query.username;
		}
		else
		{
			console.error("페이퍼삭제 실패 : ", result);
		}
	});
	
	paperContentFunctionRect = $(".paperContentFunction").get(0).getBoundingClientRect();
	
	$(window).on("scroll", function()
	{
		refreshPaperContentFunction.call(this);
	});
	
	setReplyFunction();
});

function refreshPaperContentFunction()
{
	var scrollTop = $(this).scrollTop();
	if(42 <= scrollTop)
	{
		$(".paperContentFunction").css("position", "fixed").css("top", "58px").css("left", paperContentFunctionRect.left + "px").css("right", "");
	}
	else
	{
		$(".paperContentFunction").css("position", "absolute").css("top", "0").css("right", "-100px").css("left", "");
	}
}

function reload()
{
	var result = $.api.comment.getCommentList({boardId : $.query.boardId, articleSeq : $.query.seq, searchData : {orderByGroupId : "DESC"}});
	if(result.code == 1000)
	{
		var html = $("#paperCommentListTemplate").html();
		console.log(html);
		var template = Handlebars.compile(html);
		html = template({commentList : result.data});
		$("#commentContainer").html(html);
		setReplyFunction();
	}
}

function setReplyFunction()
{
	$("#commentContainer .reply").on("click", function()
	{
		var parent = $(this).parent().parent();
		
		$("#replyArea").remove();
		
		parent.append($("#replyTemplate").html());
		
		$("#replyArea textarea").focus();
		$("#replyArea form").compile(function(param)
		{
			var groupId = parent.attr("data-group-id");
			var parentSeq = parent.attr("data-seq");
			
			var result = $.api.comment.writeComment({boardId : $.query.boardId, articleSeq : $.query.seq, content : param.content, groupId : groupId, parentSeq : parentSeq});
			if(result.code == 1000)
			{
				reload();
			}
		});
	});
}