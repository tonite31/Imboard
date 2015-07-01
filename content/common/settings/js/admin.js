$(document).ready(function()
{
	$("#form").compile(function(data)
	{
		if(data.__roleType == "submit")
		{
			if(data.password == data.passwordConfirm)
			{
				var profileImgUrl = $("#profileImg").attr("src");
				if(profileImgUrl)
					data.profileImgUrl = profileImgUrl;
				
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
	
	$("#hiddenFile").on("change", function(e)
	{
		var attachImageData = new FormData();
		
		var files = e.target.files;
		var length = files.length;
		for(var i=0; i<length; i++)
			attachImageData.append("file-" + new Date().getTime() + "-" + i, files[i]);
		
		var param = {
			data : 	attachImageData,
			success : function(result)
			{
				if(result.code != 1000)
				{
					alert("파일업로드 에러 발생");
				}
				else
				{
					result = result.data;
					for(var i=0; i<result.length; i++)
					{
						$(".profileImageContainer").html("<img id='profileImg' src='" + result[i].replace("gif", "png") + "' style='width: 100%;'/>");
					}
				}
			},
			error : function(result)
			{
				alert("파일업로드 에러 : " + result);
			}
		};
		
		$.api.article.uploadFileToAWS(param);
	});
	
//	$("#userProfileForm").compile(function(param)
//	{
//		param.profileImgUrl = $(".profileImageContainer img").attr("src");
//		
//		var user = $.api.user.getSignedUser();
//		var result = $.api.user.getUser({displayId : param.displayId});
//		if(result.code == 1000)
//		{
//			if(result.data && result.data.displayId != user.data.displayId)
//			{
//				$("#userProfileForm input[name='displayId']").css("outline", "1px dashed red");
//				$("#displayIdResult").css("display", "block");
//			}
//			else
//			{
//				$("#userProfileForm input[name='displayId']").css("outline", "");
//				$("#displayIdResult").hide();
//				
//				result = $.api.user.updateUser(param);
//				if(result.code == 1000)
//				{
//					location.href = "?piece=book&username=" + result.data.displayId;
//				}
//			}
//		}
//	});
	
	$("#linkUrlImg").on("click", function()
	{
		$("#urlInput").css("transition", "all 0.5s").css("opacity", "1").css("width", "200px");
		$("#urlInput").focus();
	});
	
	$("#urlInput").on("keyup", function()
	{
		$(".profileImageContainer").html("<img src='" + $(this).val() + "' style='width: 100%;'/>");
	});
});