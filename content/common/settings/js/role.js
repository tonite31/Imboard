$(document).ready(function()
{
	$("#add-level-button").on("click", function()
	{
		if(!$("#new-row").get(0))
		{
			var html = $("#settings-new-role-template").html();
			$("#roleBody").append(html);
			$("#new-row input:first").focus();
			
			$("#save").on("click", function()
			{
				var level = $("#level").val();
				var name = $("#name").val();
				var point = $("#point").val();
				
				var result = $.api.role.insertRole({level : level, name : name, point : point});
				if(result.code == -9996)
				{
					$("#description").text("이미 등록된 레벨입니다");
				}
				else if(result.code == 1000)
				{
					location.reload();
				}
				else
				{
					$("#description").text(JSON.stringify(result));
				}
			});
			
			$("#cancel").on("click", function()
			{
				$("#new-row").remove();
			});
		}
	});
	
	$("tr[data-component='form']").compile(function(data)
	{
		if(data.__roleType == "save")
		{
			var result = $.api.role.updateRole(data);
			console.log("리절트 : ", result);
			if(result.code == -9995)
			{
				$("#description").text("저장이 실패했습니다");
			}
			else if(result.code == 1000)
			{
				$(this).parent().parent().flickering();
			}
			else
			{
				$("#description").text(JSON.stringify(result));
			}
		}
		else if(data.__roleType == "delete")
		{
			var result = $.api.role.deleteRole(data);
			if(result.code == 1000)
			{
				$(this).parent().parent().remove();
			}
			else
			{
				$("#description").text(JSON.stringify(result));
			}
		}
	});
	
//	$("#roleBody button[data-id='save']").on("click", function()
//	{
//		var inputList = $(this).parent().parent().find("input");
//		var level = inputList[0].value;
//		var name = inputList[1].value;
//		var point = inputList[2].value;
//		
//		var result = $.api.role.updateRole({level : level, name : name, point : point});
//		if(result.code == -9995)
//		{
//			$("#description").text("저장이 실패했습니다");
//		}
//		else if(result.code == 1000)
//		{
//			$(this).parent().parent().flickering();
//		}
//		else
//		{
//			$("#description").text(JSON.stringify(result));
//		}
//	});
});