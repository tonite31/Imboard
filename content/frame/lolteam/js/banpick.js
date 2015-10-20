$(document).ready(function()
{
	$.api.lol.getChampions({}, function(result)
	{
		if(result.code == 1000)
		{
			var template = Handlebars.compile($("#championListTemplate").html());

			var data = JSON.parse(result.data.data);
			
			$("#championList").html(template({championList : data}));
		}
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