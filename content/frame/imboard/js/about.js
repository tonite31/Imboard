$(document).ready(function()
{
	$("#write").on("click", function()
	{
		$("#writeArea").remove();
		$("#articleArea").prepend($("#writeAreaTemplate").html());
		$("#ckeditor").compile();
		
		$("#writeForm").compile(function(param)
		{
			param.boardId = "about";
			param.content = CKEDITOR.instances.ckeditor.getData();
			param.thumbnailUrl = $("#image-upload-area > img").attr("data-thumbnail-url");
			
			console.log(param);
		});
	});
});