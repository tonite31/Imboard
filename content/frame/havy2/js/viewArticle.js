$(document).ready(function()
{
	var signedUser = $.api.user.getSignedUser();
	if(signedUser.code == 1000 && (!signedUser.data.level || signedUser.data.level >= 0))
	{
		$('#editArticle').remove();
		$('#deleteArticle').remove();
	}
	
	$("#deleteArticle").on("click", function()
	{
		if(confirm("정말 삭제하시겠습니까?"))
		{
			var result = $.api.article.deleteArticle({boardId : $.query.boardId, seq : $.query.seq, isRemove : "Y"});
			if(result.code == 1000)
			{
				$("#viewList").click();
			}
			else
			{
				console.error(result);
			}
		}
	});
	
	$("#viewList").on("click", function()
	{
		location.href = "?body=havy&subbody=contact";
	});
});