$(document).ready(function()
{
	$("#addUrlAuth").on("click", function()
	{
		if(!$("#new-row").get(0))
		{
			var roleList = $.api.role.getRoleList();
			
			var options = "";
			if(roleList.code == 1000)
			{
				roleList = roleList.data;
				for(var i=0; i<roleList.length; i++)
				{
					options += "<option value='" + roleList[i].level + "'>" + roleList[i].name + "</option>";
				}
			}
			
			var html = "";
			html += "<td><input type='text' name='url' class='textinput' placeholder='URL을 입력해주세요' style='width: 100%;'/></td>";
			html += "<td class='center'><select name='level'>" + options + "</select></td>";
			html += "<td class='center'><select name='useYn'><option value='Y'>Y</option><option value='N'>N</option></select></td>";
			html += "<td class='center'><button type='button' class='btn default'>저장</button> <button type='button' class='btn default'>취소</button></td>";

			var tr = document.createElement("tr");
			tr.innerHTML = html;
			tr.id = "new-row";
			tr.setAttribute("data-component", "form");
			tr.className = "new";
			
			$("#table tbody").prepend(tr);

			$(tr).find("input").focus();
			$(tr).compile();
			
			var buttons = tr.querySelectorAll("button");
			$(buttons[0]).on("click", function()
			{
				var param = $(tr).getParam();
				var result = $.api.urlAuth.insertUrlAuth(param);
				if(result.code == 1000)
				{
					$(tr).children("td:first-child").html("<span name='url'>" + param.url + "</span>");
					$(tr).find("button:nth-child(2)").text("삭제");
					tr.className = "";
					$(this).remove();
				}
				else if(result.code == -9996)
				{
					alert("중복된 URL입니다");
					$(tr).find("input").css("outline", "1px solid red").focus();
				}
			});
			
			$(buttons[1]).on("click", function()
			{
				if($(this).text() == "삭제")
				{
					var url = $(buttons[1].parentElement.parentElement).find("*[name='url']").text();
					$.api.urlAuth.deleteUrlAuth({url : url});
				}
				
				$(buttons[1].parentElement.parentElement).remove();
			});
		}
	});
	
	$("tr[data-component='form']").each(function()
	{
		var that = this;
		$(this).compile(function(param)
		{
			var result = $.api.urlAuth.deleteUrlAuth(param);
			if(result.code == 1000)
				$(that).remove();
		});
	});

	$("tr").each(function()
	{
		var that = this;
		$(this).find("select").on("change", function()
		{
			var param = $(that).getParam();
			$.api.urlAuth.updateUrlAuth(param);
			$(that).flickering();
		});
	});
});