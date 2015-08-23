var boardId = "";
var seq = "";
var status = 0;

$(document).ready(function()
{
	boardId = $.query.boardId;
	seq = $.query.seq;
	
	var options = {};
	
	if(boardId && seq)
	{
		//수정의 경우
		var result = $.api.article.getArticle({boardId : boardId, seq : seq});
		if(result.code == 1000)
		{
			status = result.status;
			options.data = result.data;
		}
		else
		{
			console.error("글 가져오기 실패", boardId, seq);
			return;
		}
	}
	else
	{
		setTimeout(function()
		{
			if(!boardId && !seq)
			{
				boardId = "temp";
				var result = $.api.article.writeArticle({boardId : boardId, status : status});
				if(result.code == 1000)
				{
					seq = result.data.seq;
				}
				else
				{
					console.error("임시글 작성 실패");
					return;
				}
			}
		}, 1000 * 30);
	}
	
	options.selector = "#typewriter";
	options.upload = function(param)
	{
		$.api.article.uploadFileToAWS(param);
	};
	
	TypeWriter.compile(options);
	
	setTimeout(function()
	{
		var param = TypeWriter.instances.typewriter.getData();
		
		var thumbnailUrl = param.thumbnailTarget ? param.thumbnailTarget.outerHTML : "";
		
		if(!boardId)
			boardId = "temp";
		
		result = $.api.article.writeArticle({boardId : boardId, seq : seq, subject : $("#subject").val(), content : param.content, tag : $("#tags").val(), thumbnailUrl : thumbnailUrl, status : status});
		if(result && result.code == 1000)
		{
			console.log("오토세이브 : ", result);
			articleSeq = result.data.seq;
		}
		else
		{
			console.error("글 자동저장 실패", result);
		}
	}, 60 * 1000);
	
	$("#savePaper").on("click", function()
	{
		var param = TypeWriter.instances.typewriter.getData();
		param.subject = $("#subject").val();
		param.tags = $("#tags").val();
		
		var thumbnailUrl = param.thumbnailTarget ? param.thumbnailTarget.outerHTML : "";
		
		if(!param.subject)
		{
			alert("제목을 입력하세요");
			return;
		}
			
		$("#clone").remove();
		
		var tag = param.tags;
		if(!tag)
		{
			alert("태그를 입력하세요");
			return;
		}
		
		var tagList = tag.split(" ");
		if(tagList && tagList.length > 0)
		{
			for(var i=0; i<tagList.length; i++)
			{
				if(tagList[i].indexOf("#") != 0)
				{
					alert("올바르지 않은 태그가 입력되었습니다");
					return;
				}
			}
			
			var boardName = tagList[0];
			var result = $.api.menu.getBoard({name : boardName});
			if(result.code == 1000)
			{
				var newBoardId = "";
				if(!result.data || result.data.length == 0)
				{
					newBoardId = new Date().getTime();
					$.api.board.insertBoard({id : newBoardId, name : boardName, useYn : 'Y'});
				}
				else
				{
					newBoardId = result.data[0].id;
				}
				
				if(boardId && boardId != newBoardId) // temp 대 새로 생긴 boardId이거나
				{
					var result = $.api.article.deleteArticle({boardId : boardId, seq : seq, isRemove : "Y"});
					if(result.code == 1000)
					{
						//게시판을 옮겨야되니까 boardId와 seq를 이렇게 세팅해준다.
						boardId = newBoardId;
						seq = null;
					}
					else
					{
						//여기는 오토세이브 또는 10초 후 최초 글이 작성되기전에 삭제 요청을 할 수 있어서 실패할 수 있다.
					}
				}
				else
				{
					boardId = newBoardId;
					seq = null;
				}
				
				var result = $.api.article.writeArticle({boardId : boardId, seq : seq, subject : param.subject, content : param.content, tag : param.tags, thumbnailUrl : thumbnailUrl, status : status});
				if(result.code == 1000)
				{
					articleSeq = result.data.seq;
					location.href = "?piece=book&username=" + $.query.username;
				}
				else
				{
					console.error("페이퍼 작성 실패", result);
				}
			}
			else
			{
				console.error("getBoardByName 실패", result);
			}
		}
		else
		{
			alert("태그를 입력하세요");
			return;
		}
	});
	
//	var headerRect = $(".top").getRect();
//	$(window).on("scroll", function()
//	{
//		var rect = $("#typewriter > .typewriter-controlPanel").getRect();
//		
//		if(rect.top <= headerRect.bottom)
//		{
//			if($("#clone").get(0) == null)
//			{
//				var clone = $("#typewriter > .typewriter-controlPanel").clone(true);
//				$("body").append(clone);
//				clone.attr("id", "clone").css("z-index", "10000").css("left", rect.left + "px").css("top", headerRect.bottom).css("width", rect.width + "px").css("position", "fixed").show();
//			}
//		}
//		else
//		{
//			$("#clone").remove();
//		}
//	});
});