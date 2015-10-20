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
			
			data.sort(function(a, b)
			{
				if(a.name > b.name)
					return 1;
				else if(a.name < b.name)
					return -1;
			});
			
			$("#championList").html(template({championList : data}));
			
			if(savedSeq)
			{
				var result = $.api.article.getArticle({boardId : "banpick", seq : savedSeq});
				if(result.code == 1000)
				{
					$("#subject").val(result.data.subject);
					
					var data = JSON.parse(result.data.content);
					
					$("#top").attr("src", data.top.image);
					$("#top").attr("data-origin", "champion_" + data.top.id);
					$("#top").next().text(data.top.name).show();
					$("#champion_" + data.top.id).attr("draggable", "false");
					$("#champion_" + data.top.id).parent().css("opacity", "0.5");
					
					$("#jungle").attr("src", data.jungle.image);
					$("#jungle").attr("data-origin", "champion_" + data.jungle.id);
					$("#jungle").next().text(data.jungle.name).show();
					$("#champion_" + data.jungle.id).attr("draggable", "false");
					$("#champion_" + data.jungle.id).parent().css("opacity", "0.5");
					
					$("#mid").attr("src", data.mid.image);
					$("#mid").attr("data-origin", "champion_" + data.mid.id);
					$("#mid").next().text(data.mid.name).show();
					$("#champion_" + data.mid.id).attr("draggable", "false");
					$("#champion_" + data.mid.id).parent().css("opacity", "0.5");
					
					$("#ad").attr("src", data.ad.image);
					$("#ad").attr("data-origin", "champion_" + data.ad.id);
					$("#ad").next().text(data.ad.name).show();
					$("#champion_" + data.ad.id).attr("draggable", "false");
					$("#champion_" + data.ad.id).parent().css("opacity", "0.5");
					
					$("#support").attr("src", data.support.image);
					$("#support").attr("data-origin", "champion_" + data.support.id);
					$("#support").next().text(data.support.name).show();
					$("#champion_" + data.support.id).attr("draggable", "false");
					$("#champion_" + data.support.id).parent().css("opacity", "0.5");
					
					$("#ban1").attr("src", data.ban1.image);
					$("#ban1").attr("data-origin", "champion_" + data.ban1.id);
					$("#ban1").next().text(data.ban1.name).show();
					$("#champion_" + data.ban1.id).attr("draggable", "false");
					$("#champion_" + data.ban1.id).parent().css("opacity", "0.5");
					
					$("#ban2").attr("src", data.ban2.image);
					$("#ban2").attr("data-origin", "champion_" + data.ban2.id);
					$("#ban2").next().text(data.ban2.name).show();
					$("#champion_" + data.ban2.id).attr("draggable", "false");
					$("#champion_" + data.ban2.id).parent().css("opacity", "0.5");
					
					$("#ban3").attr("src", data.ban3.image);
					$("#ban3").attr("data-origin", "champion_" + data.ban3.id);
					$("#ban3").next().text(data.ban3.name).show();
					$("#champion_" + data.ban3.id).attr("draggable", "false");
					$("#champion_" + data.ban3.id).parent().css("opacity", "0.5");
				}
			}
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
				
				data.sort(function(a, b)
				{
					if(a.name > b.name)
						return 1;
					else if(a.name < b.name)
						return -1;
				});
				
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
			origin.parentElement.style.opacity = "";
			
			$(this).next().hide();
		}
		
		e.preventDefault();
	});
	
	$("#search").on("keyup", function()
	{
		var value = $("#search").val();
		
		if(value)
		{
			$("#championList > div").hide();
			$("#championList .championName:contains(" + value + ")").parent().show();
		}
		else
		{
			$("#championList > div").show();
		}
	});
	
	$("#save").on("click", function()
	{
		if(!$("#subject").val())
		{
			alert("밴픽 이름을 입력해주세요");
			return;
		}
		
		var list = $(".position img[data-origin]");
		if(list.length < 8)
		{
			alert("모든 챔피언을 선택해주세요");
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
			param.subject = $("#subject").val();
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
	
	$("#delete").on("click", function()
	{
		$.api.article.deleteArticle({boardId : "banpick", seq : savedSeq});
		location.href = "?page=banpickList";
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
    
    origin.parentElement.style.opacity = "0.5";
    origin.draggable = false;
    
    var originId = ev.target.getAttribute("data-origin");
    if(originId)
    {
    	$("#" + originId).attr("draggable", "true");
    	$("#" + originId).parent().css("opacity", "");
    }
    
    ev.target.setAttribute("data-origin", id);
    ev.target.nextElementSibling.innerText = origin.nextElementSibling.innerText;
    ev.target.nextElementSibling.style.display = "";
}