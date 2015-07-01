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
			html += "<td><input type='text' name='url' class='textinput' placeholder='URL을 입력해주세요' style='width: 100%;' required='required'/></td>";
			html += "<td class='center'><select name='level'>" + options + "</select></td>";
			html += "<td class='center'><select name='useYn'><option value='Y'>Y</option><option value='N'>N</option></select></td>";
			html += "<td class='center'><button type='button' data-role='submit' data-role-type='save' class='btn btn-default'>저장</button> <button type='button' data-role='submit' data-role-type='cancel' class='btn btn-default'>취소</button></td>";

			var tr = document.createElement("tr");
			tr.innerHTML = html;
			tr.id = "new-row";
			tr.setAttribute("data-component", "form");
			tr.className = "new";
			
			$("#table tbody").prepend(tr);

			$(tr).find("input").focus();
			$(tr).compile(function(data)
			{
				if(data.__roleType == "save")
				{
					var result = $.api.urlAuth.insertUrlAuth(data);
					if(result.code == 1000)
					{
						location.reload();
					}
					else if(result.code == -9996)
					{
						var url = $(tr).find("input[name='url']");
						url.attr("data-toggle", "tooltip").attr("data-placement", "bottom").attr("title", "중복된 URL 입니다");
						url.tooltip();
						$(tr).find("input").css("outline", "1px solid red").focus();
					}
				}
				else
				{
					$(tr).remove();
				}
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