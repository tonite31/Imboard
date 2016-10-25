$(document).ready(function()
{
	$("#imageUploader").compile(function(e)
	{
		var files = e.target.files;
		var attachImageData = new FormData();
		var length = files.length;
		for(var i=0; i<length; i++)
		{
			if(files[i].type.indexOf("image") != -1)
				attachImageData.append("file-" + new Date().getTime() + "-" + i, files[i]);
		}
		
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
					$("#imageUploader img").remove();
					result = result.data;
					for(var i=0; i<result.length; i++)
					{
						var src = result[i];
						$("#imageUploader").append("<img style='width:100%;' src='" + src + "'/>");
					}
					
					$("#imageUploader").css("min-height", "");
				}
			},
			error : function(result)
			{
				alert("파일업로드 에러 : " + result);
			}
		};
		
		$.api.article.uploadFile(param);
	});
	
	$("#uploadImage").on("click", function()
	{
		$("#imageUploader input").click();
	});
	
	CKEDITOR.replace("editor");
	
	$("#registerTeacherForm").compile(function(data)
	{
		var content = CKEDITOR.instances.editor.getData();
		data.content = content;
		data.boardId = "teacher";
		data.seq = $.query.seq;
		data.thumbnailUrl = $("#imageUploader img").attr("src");

		var result = null;
		if($.query.seq)
			result = $.api.article.updateArticle(data);
		else
			result = $.api.article.insertArticle(data);
		
		if(result.code == 1000)
		{
			location.href = "?body=teacher";
		}
		else
		{
			alert("오류발생");
			console.error(result);
		}
	});
});