var savedSeq = null;
$(document).ready(function()
{
	savedSeq = $.query.seq;
	
	$.api.lol.getChampions({}, function(result)
	{
		if(result.code == 1000)
		{
			var template = Handlebars.compile($("#championListTemplate").html());

			var data = JSON.parse(result.data.data);
			
			$("#championList").html(template({championList : data}));
		}
	});
	
	$("#refresh").on("click", function()
	{
		$("#championList").html("<span class='glyphicon glyphicon-repeat animated rotateOut' style='font-size: 70px; width: 100%; display: inline-block; text-align:center; margin-top: 70px;'></span>");
		$.api.lol.getChampions({refresh: true}, function(result)
		{
			if(result.code == 1000)
			{
				var template = Handlebars.compile($("#championListTemplate").html());

				var data = JSON.parse(result.data.data);
				
				$("#championList").html(template({championList : data}));
			}
		});
	});
	
	$(".position img").on("contextmenu", function(e)
	{
		var id = this.getAttribute('data-origin');
		if(id)
		{
			this.src = "";
			this.removeAttribute('data-origin');
			var origin = document.getElementById(id);
			origin.draggable = true;
			origin.style.opacity = "";
		}
		
		e.preventDefault();
	});
	
	$("#save").on("click", function()
	{
		var list = $(".position img[data-origin]");
		if(list.length < 8)
		{
			$("#error").show();
			return;
		}
		else
		{
			var data =
			{
				top 	: JSON.parse($("#" + $("#top").attr("data-origin")).attr("data-info")),
				jungle 	: JSON.parse($("#" + $("#jungle").attr("data-origin")).attr("data-info")),
				mid 	: JSON.parse($("#" + $("#mid").attr("data-origin")).attr("data-info")),
				ad 		: JSON.parse($("#" + $("#ad").attr("data-origin")).attr("data-info")),
				support : JSON.parse($("#" + $("#support").attr("data-origin")).attr("data-info")),
				ban1 	: JSON.parse($("#" + $("#ban1").attr("data-origin")).attr("data-info")),
				ban2 	: JSON.parse($("#" + $("#ban2").attr("data-origin")).attr("data-info")),
				ban3 	: JSON.parse($("#" + $("#ban3").attr("data-origin")).attr("data-info"))
			};
			
			var param = {};
			param.boardId = "banpick";
			param.content = JSON.stringify(data);
			
			if(savedSeq != null)
			{
				param.seq = savedSeq;
				result = $.api.article.updateArticle(param);
			}
			else
			{
				result = $.api.article.writeArticle(param);
			}
			
			if(result != null)
			{
				if(result.code == -9998)
				{
					alert("글쓰기 권한이 없습니다");
				}
				else
				{
					location.href = "?page=banpickList";
				}
			}
		}
	});
});

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev)
{
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev)
{
    ev.preventDefault();
    var id = ev.dataTransfer.getData("text");
//    ev.target.appendChild(document.getElementById(data));
    
    var origin = document.getElementById(id);
    ev.target.src = origin.src;
    
    origin.style.opacity = "0.5";
    origin.draggable = false;
    
    ev.target.setAttribute("data-origin", id);
}