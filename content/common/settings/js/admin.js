$(document).ready(function()
{
	$("#form").compile(function(data)
	{
		if(data.__roleType == "submit")
		{
			if(data.password == data.passwordConfirm)
			{
				var result1 = $.api.user.updateUser(data);
				var result2 = {code:1000};
				if(data.password != "")
					result2 = $.api.user.updateUserPassword(data);
				
				if(result1.code == 1000 && result2.code == 1000)
				{
					$("#errorMessage").text("저장되었습니다");
					$("#errorMessage").show();
				}
			}
			else
			{
				$("#errorMessage").text("비밀번호가 일치하지 않습니다");
				$("#errorMessage").show();
			}
			
			setTimeout(function()
			{
				$("#errorMessage").text("");
			}, 2000);
		}
		else if(data.__roleType == "initialize")
		{
			var result = $.api.user.initializeAdminAccount();
			console.log(result);
		}
	});
	
	$("input[name^='password']").on("keydown", function()
	{
		if(this.value == "")
			$(this).removeAttr("required");
		else
			$(this).attr("required", "required");
	});
});