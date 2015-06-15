//pageReady(function()
//{
//	var html = '<button type="button" class="btn btn-default" id="addMenuButton"><span class="glyphicon glyphicon-plus"></span></button><ul id="menuList"></ul>';
//	$("#menu").html(html);
//	
//	var roleList = $.api.role.getRoleList({imboardId : _globalData.imboard.id});
//	var menuList = $.api.menu.getMenuList({imboardId : _globalData.imboard.id});
//	var template = Handlebars.compile($("#imboard-settings-menu-template").html());
//	$("#menuList").html(template({list : menuList, roleList : roleList}));
//	
//	$("#addMenuButton").on("click", function()
//	{
//		var id = new Date().getTime();
//		var html = "<li data-id='" + id + "'><span contenteditable='true'></span>";
//		html += "<div>";
//		html += "<select data-id='" + id + "'></select>\n";
//		html += '<button type="button" class="btn btn-default" data-id="delete"><span class="glyphicon glyphicon-minus"></span></button>\n';
//		html += '<button type="button" class="btn btn-default" data-id="up"><span class="glyphicon glyphicon-arrow-up"></span></button>\n';
//		html += '<button type="button" class="btn btn-default" data-id="down"><span class="glyphicon glyphicon-arrow-down"></span></button></li>';
//		html += "</div>";
//		$("#menuList").append(html);
//		
//		var option = "";
//		for(var i=0; i<roleList.length; i++)
//			option += "<option value='" + roleList[i].level + "'>" + roleList[i].name + "</option>";
//		
//		$("#menuList select[data-id='" + id + "']").html(option);
//		
//		var target = $("#menuList span[contenteditable]");
//		$(target).parent().find("*[data-id]").hide();
//		target.focus();
//		target.on('blur keydown', function(e)
//		{
//			var type = $(this).attr('contenteditable');
//			if(type == "true" && (e.type == "blur" || e.type == "keydown" && e.keyCode == 13))
//			{
//				if($(this).text() != '')
//				{
//					var param = {
//						imboardId : _globalData.imboard.id,
//						id : id,
//						name : $(this).text(),
//						parameter : "",
//						priority : $("#menuList li").index(target.parent())
//					};
//
//					$.api.menu.insertMenu(param);
//					
//					$(this).parent().find("*[data-id]").show();
//					$(this).removeAttr("contenteditable");
//				}
//				else
//				{
//					$(this).parent().remove();
//				}
//			}
//		});
//		
//		$(target).parent().find("button[data-id='delete']").on("click", function()
//		{
//			$.api.menu.deleteMenu({imboardId : _globalData.imboard.id, id : $(this).parent().parent().attr("data-id")});
//			$(this).parent().parent().remove();
//		});
//	});
//	
//	$("#menuList button[data-id='delete']").on("click", function()
//	{
//		$.api.menu.deleteMenu({imboardId : _globalData.imboard.id, id : $(this).parent().parent().attr("data-id")});
//		$(this).parent().parent().remove();
//	});
//	
//	$("#menuList select").on("change", function()
//	{
//		var param = {
//			imboardId : _globalData.imboard.id,
//			id : $(this).attr("data-id"),
//			name : $(this).parent().parent().find("span[data-name]").text(),
//			viewLevel : $(this).val()
//		};
//		
//		$.api.menu.updateMenu(param);
//	});
//	
//	$("#menuList span[data-name]").on("click", function()
//	{
//		$(this).attr("contenteditable", "true");
//		$(this).focus();
//		$(this).on('blur keydown', function(e)
//		{
//			if(e.type == "blur" || e.type == "keydown" && e.keyCode == 13)
//			{
//				if($(this).text() != '')
//				{
//					var param = {
//						imboardId : _globalData.imboard.id,
//						id : $(this).parent().attr('data-id'),
//						name : $(this).text()
//					};
//
//					$.api.menu.updateMenu(param);
//				}
//				
//				$(this).removeAttr("contenteditable");
//				$(this).off('blur keydown');
//			}
//		});
//	});
//	
//	$("#menuList span").on("blur", function()
//	{
//		//imboardId, id, name, parameter, priority, parentMenuId, viewLevel
//	});
//});