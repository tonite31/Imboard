$(document).ready(function()
{
	initForm();

	$("#addBoardButton").on("click", function()
	{
		var roleList = $.api.role.getRoleList();
		var html = $("#settings-board-template").html();
		var template = Handlebars.compile(html);
		$("#boardList").prepend(template({boardList : [{}], roleList : roleList.data}));
		
		var clone = $("#boardList form:first");
		
		clone.find(".panel").attr("class", "panel panel-primary");
		
		clone.find("input[type='hidden']").parent().html("<input type='text' name='id' autofocus='autofocus'/>");
		clone.find(".panel-body input[type!='radio']").val("");
		
		clone.find(".panel-footer input").unbind();
		clone.find(".panel-footer input[value='저장']").attr("data-role", "submit");
		clone.find(".panel-footer input[value='삭제']").val("취소");
		clone.find("input[type='radio'][value='Y']").get(0).checked = true;
		
		var form = clone.get(0);
		
		$(form).removeAttr("novalidate").attr("data-component", "form");
		$(form).compile(function(data)
		{
			if(!data.id)
				data.id = new Date().getTime();

			var result = $.api.board.insertBoard(data);
			if(result.code == 1000)
			{
				data.boardId = data.id;
				$.api.boardAuth.updateBoardAuth(data);
				refresh();
			}
			else if(result.code == -9996)
			{
				$(form).find("span[data-id='result']").text("이미 존재하는 게시판 아이디입니다.").css("color", "white");
			}
			else
			{
				$(form).find("span[data-id='result']").text(JSON.stringify(result)).css("color", "white");
			}
		});
	});
});

function initForm()
{
	$("form[data-component='form']").compile(function(param)
	{
		if(param.__roleType == "save")
		{
			var result = $.api.board.updateBoard(param);
			if(result.code == 1000)
			{
				param.boardId = param.id;
				result = $.api.boardAuth.updateBoardAuth(param);
				if(result)
				{
					$(this).parent().children("span").text("Saved").css("color", "#777");
				}
				else
				{
					$(this).parent().children("span").text(result.message).css("color", "red");
				}
			}
			else
			{
				$(this).parent().children("span").text(result.message).css("color", "red");
			}
			
			var that = this;
			setTimeout(function()
			{
				$(that).parent().children("span").text("");
			}, 1000 * 10);
		}
		else if(param.__roleType == "delete")
		{
			var parent = $(this).parent().parent();
			var boardId = parent.find("span[data-id='boardId']").text();
			
			var result = $.api.board.deleteBoard(param);
			if(result.code == 1000)
			{
				parent.remove();
				refresh();
			}
		}
	});
}

function refresh()
{
	var result = $.api.board.getBoardList();
	if(result.code == 1000)
	{
		$("#boardList").templating("settings-board-template", {boardList : result.data});
		initForm();
	}
}