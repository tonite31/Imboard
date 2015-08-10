TypeWriter = {};

(function($t)
{
	$t.keys =
	{
		backspace : 8,
		tab : 9,
		enter : 13,
		shift : 16,
		ctrl : 17,
		alt : 18,
		esc : 27,
		left : 37,
		up : 38,
		right : 39,
		down : 40,
		0 : 48,
		1 : 49,
		2 : 50,
		3 : 51,
		4 : 52,
		5 : 53,
		6 : 54,
		7 : 55,
		8 : 56,
		9 : 57,
		a : 65,
		b : 66,
		c : 67,
		d : 68,
		e : 69,
		f : 70,
		g : 71,
		h : 72,
		i : 73,
		j : 74,
		k : 75,
		l : 76,
		m : 77,
		n : 78,
		o : 79,
		p : 80,
		q : 81,
		r : 82,
		s : 83,
		t : 84,
		u : 85,
		v : 86,
		w : 87,
		x : 88,
		y : 89,
		z : 90
	};
	
	$t.setCaretPosition = function(node, index)
	{
		var range = document.createRange();
		var sel = window.getSelection();
		range.setStart(node, index);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	};
	
	$t.clearSpan = function(divParent)
	{
		$(divParent).find("span").filter(function(){
			return !$(this).text();
		}).remove();
		
		for(var i=1; i<divParent.children.length; i++)
		{
			var prev = divParent.children[i-1];
			var current = divParent.children[i];
			
			var isEquals = false;
			if(prev.style.length == current.style.length)
			{
				for(var j=0; j<prev.style.length; j++)
				{
					if(prev.style[prev.style[j]] != current.style[prev.style[j]])
					{
						isEquals = false;
						break;
					}
					else
					{
						isEquals = true;
					}
				}
			}
			
			if(isEquals)
			{
				var position = -1;
				if(prev.hasCaret)
					position = prev.hasCaret;
				else if(current.hasCaret)
					position = prev.innerText.length + current.hasCaret;
				
				prev.innerText += current.innerText;
				current.parentElement.removeChild(current);

				if(position > -1)
					$t.setCaretPosition(prev.firstChild, position);
				
				i--;
			}
		}
		
		$(divParent).find("span").each(function(){this.hasCaret = null;});
	};
	
	$t.makeSpan = function(target, remainText, selectedText, style, isEnd)
	{
		if(target.parentElement.nodeName == "SPAN")
		{
			//분리
			if(!style.value)
			{
				if(target.parentElement.style.length > 1)
				{
					var span = document.createElement("span");
					span.style.cssText = target.parentElement.style.cssText;
					span.style[style.key] = style.value;
					span.innerText = selectedText;
					
					if(!isEnd)
					{
						var next = target.parentElement.nextSibling;
						if(next)
							target.parentElement.parentElement.insertBefore(span, next);
						else
							target.parentElement.parentElement.appendChild(span);
						
						target.parentElement.innerText = remainText;	
					}
					else
					{
						target.parentElement.parentElement.insertBefore(span, target.parentElement);
						target.parentElement.innerText = remainText;
						
						$t.setCaretPosition(span.firstChild, span.firstChild.length);
						span.hasCaret = span.firstChild.length;
					}
				}
				else
				{
					if(!isEnd)
					{
						var next = target.parentElement.nextSibling;
						if(next)
							target.parentElement.parentElement.insertBefore(document.createTextNode(selectedText), next);
						else
							target.parentElement.parentElement.appendChild(document.createTextNode(selectedText));
						
						target.parentElement.innerText = remainText;
					}
					else
					{
						var node = document.createTextNode(selectedText);
						target.parentElement.parentElement.insertBefore(node, target.parentElement);
						target.parentElement.innerText = remainText;
						
						$t.setCaretPosition(node, node.length);
					}
				}
			}
			else
			{
				var span = document.createElement("span");
				span.style.cssText = target.parentElement.style.cssText;
				span.style[style.key] = style.value;
				span.innerText = selectedText;
				
				if(!isEnd)
				{
					var next = target.parentElement.nextSibling;
					if(next)
						target.parentElement.parentElement.insertBefore(span, next);
					else
						target.parentElement.parentElement.appendChild(span);
					
					target.parentElement.innerText = remainText;
				}
				else
				{
					target.parentElement.parentElement.insertBefore(span, target.parentElement);
					target.parentElement.innerText = remainText;
					
					$t.setCaretPosition(span.firstChild, span.firstChild.length);
					span.hasCaret = span.firstChild.length;
				}
			}
		}
		else
		{
			var span = document.createElement("span");
			span.style[style.key] = style.value;
			span.innerText = selectedText;
			
			var node = null;
			
			if(!style.value)
				node = document.createTextNode(selectedText);
			else
				node = span;
			
			if(!isEnd)
			{
				var next = target.nextSibling;
				if(next)
					target.parentElement.insertBefore(node, next);
				else
					target.parentElement.appendChild(node);
				
				target.parentElement.insertBefore(document.createTextNode(remainText), node);
				
				target.parentElement.removeChild(target);
			}
			else
			{
				var remainNode = document.createTextNode(remainText);
				target.parentElement.insertBefore(node, target);
				target.parentElement.insertBefore(remainNode, target);
				target.parentElement.removeChild(target);
				
				if(node == span)
				{
					$t.setCaretPosition(node.firstChild, node.firstChild.length);
					node.hasCaret = node.firstChild.length;
				}
				else
				{
					$t.setCaretPosition(node, node.length);
				}
			}
		}
	};
	
	$t.setStyle = function(range, sc, ec, list, key, value)
	{
		var isStyled = true;
		for(var i=0; i<list.length; i++)
		{
			if(list[i].nodeName == "#text" && list[i].parentElement.nodeName == "SPAN")
			{
				isStyled = isStyled && (list[i].parentElement.style[key] == value);
			}
			else if(list[i].nodeName == "SPAN")
			{
				isStyled = isStyled && (list[i].style[key] == value);
			}
			else
			{
				isStyled = false;
				break;
			}
		}
		
		for(var i=0; i<list.length; i++)
		{
			if(list[i] == sc)
			{
				$t.makeSpan(sc, sc.nodeValue.substring(0, range.startOffset), sc.nodeValue.substring(range.startOffset), {key : key, value : (isStyled ? "" : value)}, false);
			}
			else if(list[i] == ec)
			{
				$t.makeSpan(ec, ec.nodeValue.substring(range.endOffset), ec.nodeValue.substring(0, range.endOffset), {key : key, value : (isStyled ? "" : value)}, true);
			}
			else
			{
				if(list[i].nodeName == "SPAN")
				{
					if(isStyled)
					{
						if(list[i].style.length > 1)
							list[i].style.fontWeight = "";
						else
							list[i].parentElement.replaceChild(document.createTextNode(list[i].innerText), list[i]);
					}
					else
					{
						list[i].style[key] = value;
					}
				}
				else
				{
					if(!isStyled)
					{
						var span = document.createElement("span");
						span.style[key] = value;
						span.innerText = list[i].innerText ? list[i].innerText : list[i].nodeValue;
						
						list[i].parentElement.replaceChild(span, list[i]);
					}
				}
			}
		}
	};
	
	$t.applyStyle = function(editor, key, value)
	{
		if(window.getSelection)
		{
			var selection = window.getSelection();
			var text = selection.toString();
			if(selection.rangeCount > 0)
			{
				var range = selection.getRangeAt(0);
				
				var ancestor = range.commonAncestorContainer; 
				var sc = range.startContainer;
				var ec = range.endContainer;
				
				//가장 먼저 sc ~ ec를 뽑아낸다.
				
				if($(editor).has(sc).length <= 0 || $(editor).has(ec).length <= 0)
				{
					return;
				}
				
				if(ancestor != editor && (ancestor.nodeName == "DIV" || ancestor.nodeName == "#text"))
				{
					var div = ancestor;
					while(div && div.nodeName != "DIV" && div != editor)
						div = div.parentElement;
					
					//한줄인경우
					if(sc == ec)
					{
						//같은경우
						var before = sc.nodeValue.substring(0, range.startOffset);
						var after = sc.nodeValue.substring(range.endOffset);
						
						if(sc.parentElement.nodeName == "SPAN") // SPAN 하위에 있는경우
						{
							var span = document.createElement("span");
							span.style.cssText = sc.parentElement.style.cssText;
							span.innerText = before;
							
							sc.parentElement.parentElement.insertBefore(span, sc.parentElement);
							
							if(sc.parentElement.style[key] == value)
							{
								if(sc.parentElement.style.length > 1)
								{
									span = document.createElement("span");
									span.style.cssText = sc.parentElement.style.cssText;
									span.style[key] = "";
									span.innerText = text;
									
									sc.parentElement.parentElement.insertBefore(span, sc.parentElement);
								}
								else
								{
									sc.parentElement.parentElement.insertBefore(document.createTextNode(text), sc.parentElement);
								}
							}
							else
							{
								span = document.createElement("span");
								span.style.cssText = sc.parentElement.style.cssText;
								span.style[key] = value;
								span.innerText = text;
								
								sc.parentElement.parentElement.insertBefore(span, sc.parentElement);
							}
							
							span = document.createElement("span");
							span.style.cssText = sc.parentElement.style.cssText;
							span.innerText = after;
							
							sc.parentElement.parentElement.insertBefore(span, sc.parentElement);
							
							sc.parentElement.parentElement.removeChild(sc.parentElement);
						}
						else
						{
							sc.parentElement.insertBefore(document.createTextNode(before), sc);
							
							var span = document.createElement("span");
							span.style[key] = value;
							span.innerText = text;
							
							sc.parentElement.insertBefore(span, sc);
							
							sc.parentElement.insertBefore(document.createTextNode(after), sc);
							
							sc.parentElement.removeChild(sc);
						}
					}
					else
					{
						var list = [sc];
						
						if(sc != ec)
						{
							var target = sc.parentElement != editor ? sc.parentElement.nextSibling : sc.nextSibling;
							while(target && target != ec && target != ec.parentElement)
							{
								list.push(target);
								target = target.nextSibilng;
							}
							
							list.push(ec);
						}

						$t.setStyle(range, sc, ec, list, key, value);
					}

					$t.clearSpan(div);
				}
				else
				{
					//여러줄인경우
					//sc와 ec는 그대로 하면 될거같고
					//중간것들을 찾아야 한다.
					var list = [sc];
				
					//sc의 parentElement가 div인 경우.. sc가 #text인경우
					
					var target = sc.parentElement.nodeName == "SPAN" ? sc.parentElement.nextSibling : sc.nextSibling;
					//sc가 div하위의 마지막 text인경우 next가 안나온다.
					if(!target)
					{
						if(sc.parentElement.nodeName == "SPAN")
							target = sc.parentElement.parentElement.nextSibling;
						else
							target = sc.parentElement.nextSibilng;
						
						if(target)
							target = target.childNodes[0];
					}
					
					while(target != ec && target != ec.parentElement)
					{
						if(target)
						{
							if(target.nodeName == "DIV")
								target = target.childNodes[0];
							list.push(target);
							
							if(target.nextSibling)
							{
								target = target.nextSibling;
								if(target.nodeName == "DIV")
									target = target.childNodes[0];
							}
							else
							{
								target = target.parentElement.nextSibling;
								if(target.childNodes)
									target = target.childNodes[0];
							}
						}
					}
					
					list.push(ec);
					
					$t.setStyle(range, sc, ec, list, key, value);
					
					for(var i=0; i<list.length; i++)
					{
						var div = list[i].parentElement;
						while(div && div.nodeName != "DIV")
							div = div.parentElement;
						
						if(div)
						{
							$t.clearSpan(div);
						}
					}
				}
			}
		}
		else if (document.selection && document.selection.type != "Control")
		{
	        var text = document.selection.createRange().text;
	        console.log("하이텍스트 : ", text);
	    }
	};
	
	$t.getSelectedDiv = function(range, editor)
	{
		var ancestor = range.commonAncestorContainer; 
		var sc = range.startContainer;
		var ec = range.endContainer;
		
		if(ancestor != editor && (ancestor.nodeName == "DIV" || ancestor.nodeName == "#text"))
		{
			if(sc == ec)
			{
				if(sc.parentElement == editor || sc.parentElement.parentElement == editor)
				{
					if(sc.parentElement.nodeName == "SPAN")
					{
						
					}
				}
			}
			else
			{
				var list = [sc];
				
				if(sc != ec)
				{
					var target = sc.parentElement != editor ? sc.parentElement.nextSibling : sc.nextSibling;
					while(target && target != ec && target != ec.parentElement)
					{
						list.push(target);
						target = target.nextSibilng;
					}
					
					list.push(ec);
				}
			}
		}
		else
		{
			var target = sc.parentElement.nodeName == "SPAN" ? sc.parentElement.nextSibling : sc.nextSibling;
			//sc가 div하위의 마지막 text인경우 next가 안나온다.
			if(!target)
			{
				if(sc.parentElement.nodeName == "SPAN")
					target = sc.parentElement.parentElement.nextSibling;
				else
					target = sc.parentElement.nextSibilng;
				
				if(target)
					target = target.childNodes[0];
			}
			
			while(target != ec && target != ec.parentElement)
			{
				if(target)
				{
					if(target.nodeName == "DIV")
						target = target.childNodes[0];
					list.push(target);
					
					if(target.nextSibling)
					{
						target = target.nextSibling;
						if(target.nodeName == "DIV")
							target = target.childNodes[0];
					}
					else
					{
						target = target.parentElement.nextSibling;
						if(target.childNodes)
							target = target.childNodes[0];
					}
				}
			}
			
			list.push(ec);
		}
	};
	
	$t.controller = {};
	$t.controller["fontWeight"] = function(editor)
	{
		$(this).on("click", function()
		{
			var key = "font-weight";
			var value = "bold";
			
			$t.applyStyle(editor, key, value);
		});
	};
	
	$t.controller["fontItalic"] = function(editor)
	{
		$(this).on("click", function()
		{
			var key = "font-style";
			var value = "italic";
			
			$t.applyStyle(editor, key, value);
		});
	};
	
	$t.controller["textUnderline"] = function(editor)
	{
		$(this).on("click", function()
		{
			var key = "text-decoration";
			var value = "underline";
			
			$t.applyStyle(editor, key, value);
		});
	};
	
 	[{id : "h1", name : "H1", hotkey : [$t.keys.alt, $t.keys.h]}, {id : "h2", name : "H2", hotkey : [$t.keys.alt, $t.keys.h]}, {id : "h3", name : "H3", hotkey : [$t.keys.alt, $t.keys.h]}],
 	[{id : "imageUpload", className : "glyphicon glyphicon-picture", hotkey : [$t.keys.ctrl, $t.keys.alt, $t.keys.i]}, {id : "fileUpload", className : "glyphicon glyphicon-paperclip", hotkey : [$t.keys.ctrl, $t.keys.alt, $t.keys.f]}, {id : "youtubeUpload", name : "Youtube", hotkey : [$t.keys.ctrl, $t.keys.alt, $t.keys.y]}]
	
	$t.controller["alignLeft"] = function(editor)
	{
 		if(window.getSelection)
		{
			var selection = window.getSelection();
			if(selection.rangeCount > 0)
			{
				var range = selection.getRangeAt(0);
				
				var ancestor = range.commonAncestorContainer; 
				var sc = range.startContainer;
				var ec = range.endContainer;
				
				//가장 먼저 sc ~ ec를 뽑아낸다.
				
				if($(editor).has(sc).length <= 0 || $(editor).has(ec).length <= 0)
				{
					return;
				}
				
				
			}
		}
	};
	
	$t.controller["alignCenter"] = function(editor)
	{
	};
	
	$t.controller["alignRight"] = function(editor)
	{
	};
	
	$t.controller["image"] = $t.controller["video"] = $t.controller["file"] = function(instance)
	{
		var el = instance.target;
		var options = instance.options;
		var target = $(el).find(".typewriter-content");
		var type = $(this).attr("data-controller");
		var style = $(this).attr("data-style");

		var position = $(this).css("position");
		if(position == "static")
			$(this).css("position", "relative");
		
		var file = document.createElement("input");
		file.type = "file";
		file.className = "typewriter-hiddenfile";
		file.setAttribute("tabindex", "-1");
		$(this).append(file);

		$(this)._on("click", function()
		{
			file.click();
		});
		
		$(file).on("change", function(e)
		{
			$(instance.target).find('[data-toggle="tooltip"]').tooltip("hide");
			instance.uploadFile(el, options, target, e.target.files);
		});
	};
	
	$t.controller["youtube"] = $t.controller["link"] = function(instance)
	{
		var el = instance.target;
		var options = instance.options;
		var target = $(el).find(".typewriter-content");
		var type = $(this).attr("data-controller");
		var style = $(this).attr("data-style");
		
		$(this).on("click", function()
		{
			var div = null;
			if(type == "youtube")
			{
				var text = prompt("유투브 URL을 입력하세요");
				if(text)
				{
					var v = text.replace(/http[s]?:\/\/youtu.be\//gi, "").replace(/http[s]?:\/\/www.youtube.com\/watch\?v=/gi, "");
					
					var styleHtml = "";
					if(style)
						styleHtml = "style='" + style + "'";
					else
						styleHtml = "style='width:640px; height:360px;'";
					
					var html = "<iframe data-focus='true' " + styleHtml + " data-thumbnail-url='http://img.youtube.com/vi/" + v + "/mqdefault.jpg' src='//www.youtube.com/embed/" + v + "' frameborder='0' allowfullscreen></iframe><br/>";

					div = document.createElement("div");
					div.innerHTML = html;
					$(target).find(".typewriter-contentplaceholder").remove();
				}
			}
			else if(type == "link")
			{
				var text = prompt("URL을 입력하세요");
				if(text)
				{
					div = document.createElement("div");
					div.innerHTML = "<a href='" + text + "' target='_blank' style='cursor:pointer;'>" + text + "</a>";
					$(target).find(".typewriter-contentplaceholder").remove();
				}
			}
			
			if(div)
			{
				var node = instance.getFocusedElement();
				if(!node)
				{
					$(target).append(div);
				}
				else
				{
					if(node)
					{
						if(node.nodeType == 3)
						{
							var parent = node.parentNode.className == "typewriter-content" ? node : node.parentNode;
							var next = parent.nextElementSibling;
							if(next)
								parent.parentElement.insertBefore(div, next);
							else
								parent.parentElement.appendChild(div);
						}
						else
						{
							$(target).append(div);
						}
					}
					else
					{
						$(target).append(div);
					}
				}
				
				if(type == "youtube")
					instance.setResizeController(div.children[0]);
				
				instance.setCaretPosition(div.childNodes[1], 0);
			}
//			TypeWriterPrompt.show("유투브 URL을 입력하세요", function(text)
//			{
//				var v = text.replace(/http[s]?:\/\/youtu.be\//gi, "").replace(/http[s]?:\/\/www.youtube.com\/watch\?v=/gi, "");
//				var html = "<iframe width='560' height='315' data-thumbnail-url='http://img.youtube.com/vi/" + v + "/mqdefault.jpg' src='//www.youtube.com/embed/" + v + "' frameborder='0' allowfullscreen></iframe><br/>";
//				console.log("얍");
//			});
		});
	};
	
	$t.getEditor = function(option)
	{
		if(!option)
			option = {};
		
		var editor = {};
		editor.typewriter = document.createElement("div");
		editor.typewriter.className = "typewriter";
		
		editor.controlPanel = document.createElement("div");
		editor.controlPanel.className = "typewriter-controlPanel";
		
		editor.contentArticle = document.createElement("div");
		editor.contentArticle.className = "typewriter-content";
		editor.contentArticle.setAttribute("contenteditable", "true");
		editor.contentArticle.innerHTML = "가나<span style='font-weight:bold;text-decoration:underline;'>다라마</span>바사<div>아자차카</div><div>타파하</div>";
		
		editor.typewriterProgress = document.createElement("div");
		editor.typewriterProgress.className = "typewriter-progress";
		
		editor.typewriter.appendChild(editor.controlPanel);
		editor.typewriter.appendChild(editor.contentArticle);
		editor.typewriter.appendChild(editor.typewriterProgress);
		
		if(!option.controller)
		{
			option.controller =
			[
			 	[{id : "fontWeight", name : "B", hotkey : [$t.keys.alt, $t.keys.b]}, {id : "fontItalic", name : "I", hotkey : [$t.keys.alt, $t.keys.i]}, {id : "textUnderline", name : "U", hotkey : [$t.keys.alt, $t.keys.u]}],
			 	[{id : "alignLeft", className : "glyphicon glyphicon-align-left", hotkey : [$t.keys.alt, $t.keys.l]}, {id : "alignCenter", className : "glyphicon glyphicon-align-center", hotkey : [$t.keys.alt, $t.keys.c]}, {id : "alignRight", className : "glyphicon glyphicon-align-right", hotkey : [$t.keys.alt, $t.keys.r]}],
			 	[{id : "h1", name : "H1", hotkey : [$t.keys.alt, $t.keys.h]}, {id : "h2", name : "H2", hotkey : [$t.keys.alt, $t.keys.h]}, {id : "h3", name : "H3", hotkey : [$t.keys.alt, $t.keys.h]}],
			 	[{id : "imageUpload", className : "glyphicon glyphicon-picture", hotkey : [$t.keys.ctrl, $t.keys.alt, $t.keys.i]}, {id : "fileUpload", className : "glyphicon glyphicon-paperclip", hotkey : [$t.keys.ctrl, $t.keys.alt, $t.keys.f]}, {id : "youtubeUpload", name : "Youtube", hotkey : [$t.keys.ctrl, $t.keys.alt, $t.keys.y]}]
			];
		}
		
		for(var i=0; i<option.controller.length; i++)
		{
			var groupPanel = document.createElement("div");
			groupPanel.className = "typewriter-controlGroup";
			
			var group = option.controller[i];
			for(var j=0; j<group.length; j++)
			{
				var hotkey = "";
				if(group[j].hotkey)
				{
					for(var k=0; k<group[j].hotkey.length; k++)
					{
						if(k > 0)
							hotkey += " + ";
						if(group[j].hotkey[k] == 18)
							hotkey += "ALT";
						else if(group[j].hotkey[k] == 17)
							hotkey += "CTRL";
						else
							hotkey += String.fromCharCode(group[j].hotkey[k]);
					}
				}
				
				var button = document.createElement("button");
				button.type = "button";
				button.setAttribute("title", hotkey);
				button.setAttribute("tabindex", "-1");
				
				button.innerHTML = "<span class='" + (group[j].className ? group[j].className : "") + "'>" + (group[j].name ? group[j].name : "") + "</span>";
				
				groupPanel.appendChild(button);
				
				if($t.controller[group[j].id])
					$t.controller[group[j].id].call(button, editor.contentArticle);
			}
			
			editor.controlPanel.appendChild(groupPanel);
		}
		
		return editor;
	};
	
	$t.instances = {};
	$t.compile = function(options)
	{
		if(typeof options == "object")
		{
			var selector = options.selector;
			
			var target = document.querySelector(selector);
			if(target)
			{
				$t.instances[target.id] = new instance(target, options);
			}
			else
			{
				console.error(selector + " is not found");
			}
		}
		else
		{
			console.error("options is not an object");
		}
	};
	
	var instance = function(target, options)
	{
		this.target = target;
		this.options = options;
		this.keyState = {};
		
		this.init();
	};
	
	instance.prototype.uploadFile = function(el, options, target, files)
	{
		$(".typewriter-progress").show();
		
		var focusedNode = this.getFocusedElement();
		
		var that = this;
		var attachImageData = new FormData();
		
		var typeList = [];
		var length = files.length;
		for(var i=0; i<length; i++)
		{
			typeList.push(files[i].type);
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
					result = result.data;
					for(var i=0; i<result.length; i++)
					{
						var src = result[i];
						
						var type = typeList[i];
						if(type.indexOf("image") != -1)
							type = "image";
						else if(type.indexOf("video") != -1)
							type = "video";
						else
							type = "file";
						
						var div = document.createElement("div");
						if(type == "image")
						{
							var html = "<img data-thumbnail-url='" + src.replace(".gif", ".png") + "' src='" + src + "'/>";
							
							var img = document.createElement("img");
							img.src = src;
							img.onload = function(evt)
							{
					            var width = this.width;
					            var rect = $(that.target).find(".typewriter-content").getRect();
					            if(rect.width < width)
					            	this.style.width = "100%";
					            else
					            	this.style.width = width + "px";
					        };

							div.appendChild(img);
						}
						else if(type == "video")
						{
							var html = "<video width='320' height='240' controls><source src='" + src + "' type='video/mp4'>";
						}
						else if(type == "file")
						{
							var fileName = src.split("/");
							fileName = fileName[fileName.length-1];
							var html = "<a href='" + src + "' style='cursor:pointer;'>" + fileName + "</a>";
							div.innerHTML = html;
						}

						if(div)
						{
							div.appendChild(document.createTextNode(""));

							if(focusedNode)
								$(div).insertAfter(focusedNode);
							else
								$(that.target).find(".typewriter-content").append(div);
								
							targetNode = div;
							
							if(type != "file")
								that.setResizeController(div.children[0]);
							
							that.setCaretPosition(div.childNodes[1], 0);
						}
					}
					
					$(target).find(".typewriter-contentplaceholder").remove();
				}
				
				$(".typewriter-progress").hide();
			},
			error : function(result)
			{
				alert("파일업로드 에러 : " + result);
				$(".typewriter-progress").hide();
			}
		};

		if(options)
			options.upload(param);
		else
			console.error("upload function is undefiend");
	};
	
	instance.prototype.init = function()
	{
		var that = this;
		this.editor = $t.getEditor();
		this.target.innerHTML = "";
		this.target.appendChild(this.editor.typewriter);
		
//		$(window).one("blur", function()
//		{
//			$(that.target).find('[data-toggle="tooltip"]').tooltip("hide");
//		});
//		
//		$(this.target).find('[data-toggle="tooltip"]').tooltip();
//		this.compile();
//		
//		if(this.options.data)
//			$(this.target).find(".typewriter-content").html(this.options.data);
//		
//		$(this.target).find(".typewriter-content").get(0).onkeydown = function(e)
//		{
//			$(this).children(".typewriter-contentplaceholder").remove();
//			this.onkeydown = null;
//		};
//		
//		$(this.target).find(".typewriter-content").on('dragover', function(e)
//		{
//			e.stopPropagation();
//		    e.preventDefault();
//		    e.originalEvent.dataTransfer.dropEffect = 'copy';
//		});
//		
//		$(this.target).find(".typewriter-content").on('drop', function(e)
//		{
//			e.stopPropagation();
//		    e.preventDefault();
//		    
//		    var el = that.target;
//			var options = that.options;
//			var target = $(el).find(".typewriter-content");
//		    
//		    var items = e.originalEvent.dataTransfer.items;
//		    if(items && items.length > 0)
//		    {
//		    	var item = items[0];
//				var div = document.createElement("div");
//				
//				var img = document.createElement("img");
//				img.src = url;
//				img.setAttribute("style", "width:100%;");
//
//				div.appendChild(img);
//				if(div)
//				{
//					div.appendChild(document.createTextNode(""));
//
//					var node = document.getSelection().anchorNode;
//					if(node)
//					{
//						if(node.nodeType == 3)
//						{
//							var parent = node.parentNode.className == "typewriter-content" ? node : node.parentNode;
//							var next = parent.nextElementSibling;
//							if(next)
//								parent.parentElement.insertBefore(div, next);
//							else
//								parent.parentElement.appendChild(div);
//						}
//						else
//						{
//							$(target).append(div);
//						}
//					}
//					else
//					{
//						$(target).append(div);
//					}
//					
//					that.setResizeController(div.children[0]);
//					that.setCaretPosition(div.childNodes[1], 0);
//				}
//		    }
//		    
//		    var files = e.originalEvent.dataTransfer.files; // FileList object.
//
//		    if(files && files.length > 0)
//		    {
//				that.uploadFile(el, options, target, files);
//		    }
//			
//			return false;
//		});
//		
//		$(this.target).find(".typewriter-content").on('paste', function(e)
//		{
//			console.log(e);
//		});
//		
//		$(this.target).find(".typewriter-content").on("click", function(e)
//		{
//			$(this).find(".typewriter-focus").removeAttr("class");
//			$(this).find(".typewriter-resizebar").remove();
//			$(this).find(".typewriter-relative").removeClass("typewriter-relative");
//			
//			var node = that.getFocusedElement();
//			var target = $(node).find("[data-focus='true']").get(0);
//			if(target != null)
//				that.setResizeController(target);
//		});
//		
//		$(this.target).find(".typewriter-content").on("keydown", function(e)
//		{
//			if(e.keyCode == 17)
//			{
//				that.keyState.ctrlPressed = true;
//			}
//			else if(e.keyCode == 16)
//			{
//				that.keyState.shiftPressed = true;
//			}
//			else if(e.keyCode == 18)
//			{
//				if(!that.keyState.altPressed)
//					$(that.target).find('[data-toggle="tooltip"]').tooltip("show");
//				that.keyState.altPressed = true;
//			}
//			else if(e.keyCode == 8 || e.keyCode == 13 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)
//			{
//				$(this).find(".typewriter-focus").removeAttr("class");
//				$(this).find(".typewriter-resizebar").remove();
//				$(this).find(".typewriter-relative").removeClass("typewriter-relative");
//				$(that.target).find('[data-toggle="tooltip"]').tooltip("hide");
//			}
//			else if(e.keyCode == 188 || e.keyCode == 190)
//			{
//				if(that.keyState.altPressed)
//					e.preventDefault();
//			}
//			else
//			{
//				if(that.keyState.altPressed)
//				{
//					e.preventDefault();
//				}
//			}
//		});
//		
//		$(this.target).find(".typewriter-content").on("keyup", function(e)
//		{
//			if(e.keyCode == 17)
//			{
//				that.keyState.ctrlPressed = false;
//			}
//			else if(e.keyCode == 16)
//			{
//				that.keyState.shiftPressed = false;
//			}
//			else if(e.keyCode == 18)
//			{
//				that.keyState.altPressed = false;
//				$("body").find('[data-toggle="tooltip"]').tooltip("hide");
//				e.preventDefault();
//			}
//			else if(e.keyCode == 8 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)
//			{
//				var node = that.getFocusedElement();
//				var img = $(node).find("img").get(0);
//				if(img)
//					that.setResizeController(img);
//			}
//			else if(e.keyCode == 188 || e.keyCode == 190) // < >
//			{
//				if(that.keyState.altPressed)
//				{
//					var offset = -1;
//					if(e.keyCode == 190)
//						offset = 1;
//					
//					var node = that.getFocusedElement();
//					var img = $(node).find("img").get(0);
//					if(img)
//					{
//						var width = img.style.width;
//						if(!width)
//							width = getComputedStyle(img).width;
//						
//						var postfix = "";
//						if(width.indexOf("%") != -1)
//						{
//							width = new Number(width.replace("%", ""));
//							postfix = "%";
//						}
//						else if(width.indexOf("px") != -1)
//						{
//							width = new Number(width.replace("px", ""));
//							postfix = "px";
//						}
//						
//						if(that.keyState.ctrlPressed)
//							width += offset;
//						else
//							width += offset * 10;
//						
//						img.style.width = width + postfix;
//						
//						var rect = img.getBoundingClientRect();
//						img.resizeBar.right.style.left = rect.width + "px";
//						img.resizeBar.right.style.height = rect.height + "px";
//						
//						$(img.resizeBar.right).tooltip("show");
//					}
//					
//					e.preventDefault();
//				}
//			}
//			else
//			{
//				if(that.keyState.altPressed)
//				{
//					if(e.keyCode == 66)
//					{
//						$("button[data-controller='fontBold']:first").click();
//					}
//					else if(e.keyCode == 73)
//					{
//						$("button[data-controller='fontItalic']:first").click();
//					}
//					else if(e.keyCode == 76)
//					{
//						$("button[data-controller='alignLeft']:first").click();
//					}
//					else if(e.keyCode == 67)
//					{
//						$("button[data-controller='alignCenter']:first").click();
//					}
//					else if(e.keyCode == 82)
//					{
//						$("button[data-controller='alignRight']:first").click();
//					}
//					else if(e.keyCode == 80)
//					{
//						$("button[data-controller='image']:first")._emit("click");
//						that.keyState.altPressed = false;
//						$('[data-toggle="tooltip"]').tooltip("hide");
//					}
//					else if(e.keyCode == 86)
//					{
//						$("button[data-controller='video']:first")._emit("click");
//						that.keyState.altPressed = false;
//						$('[data-toggle="tooltip"]').tooltip("hide");
//					}
//					else if(e.keyCode == 70)
//					{
//						$("button[data-controller='file']:first")._emit("click");
//						that.keyState.altPressed = false;
//						$('[data-toggle="tooltip"]').tooltip("hide");
//					}
//					else if(e.keyCode == 89)
//					{
//						$("button[data-controller='youtube']:first").click();
//						that.keyState.altPressed = false;
//						$('[data-toggle="tooltip"]').tooltip("hide");
//					}
//					else if(e.keyCode == 75)
//					{
//						$("button[data-controller='link']:first").click();
//						that.keyState.altPressed = false;
//						$('[data-toggle="tooltip"]').tooltip("hide");
//					}
//
//					e.preventDefault();
//				}
//			}
//		});
	};
	
	instance.prototype.setResizeController = function(node)
	{
		$(node).load(function(e)
		{
			var div = document.createElement("div");
			div.className = "typewriter-resizable";
			div.style.left = node.offsetLeft + "px";
			div.style.top = node.offsetTop + "px";
			div.style.width = e.target.width + "px";
			div.style.height = e.target.height + "px";
			div.setAttribute("contenteditable", "false");
			div.setAttribute("data-toggle", "tooltip");
			div.setAttribute("data-placement", "bottom");
			div.setAttribute("title", "오른쪽 모서리를 클릭하면 크기를 조절할 수 있습니다.");
			
			var rightBar = document.createElement("div");
			rightBar.className = "typewriter-right-resizebar";
			
			var bottomBar = document.createElement("div");
			bottomBar.className = "typewriter-bottom-resizebar";

			rightBar.onmousedown = function(e)
			{
				this.prevX = e.pageX;
				
				var rect = node.getBoundingClientRect();
				document.onmousemove = function(e)
				{
					//마우스의 x좌표에서 rect.left 를 하면 width가 나온다.
					var dx = (e.pageX - rect.left);
					var width = node.style.width;
					if(!width)
						width = getComputedStyle(node).width;
					
					var height = (dx * rect.height) / rect.width;

					node.style.width = dx + "px";
					node.style.height = height + "px";
					
					div.style.width = dx + "px";
					div.style.height = height + "px";
					
					$(div).tooltip("hide");
				};
				
				document.onmouseup = function(e)
				{
					document.onmousemove = null;
					document.onmouseup = null;
					
					$(div).tooltip("hide");
				};
			};
			
			div.appendChild(rightBar);
			div.appendChild(bottomBar);
			
			node.parentElement.appendChild(div);
			
			$(div).tooltip();
			node.resizable = div;
		});
		
		node.refreshResizable = function()
		{
			this.resizable.style.left = this.offsetLeft + "px";
		};
	};
	
	instance.prototype.setData = function(data)
	{
		$(this.target).find(".typewriter-content").html(data);
	};
	
	instance.prototype.getData = function()
	{
		var clone = $(this.target).find(".typewriter-content").clone(true);
		
		clone.find(".typewriter-contentplaceholder").remove();
		clone.find(".typewriter-resizable").remove();
		
		var content = clone.html();

		var thumbnailTarget = $(this.target).find(".typewriter-content *[data-thumbnail-url]:first").get(0);
		var thumbnailUrl = thumbnailTarget ? thumbnailTarget.getAttribute("data-thumbnail-url") : "";
		if(!thumbnailTarget)
		{
			thumbnailTarget = $(this.target).find(".typewriter-content img:first").get(0);
			thumbnailUrl = thumbnailTarget ? thumbnailTarget.getAttribute("src") : "";
		}
		
		//인젝션 대비.
		content = content.replace(/<script[^<]*<\/script>/gi, "").replace(/onmousedown[^"]*"[^"]*"/gi, "").replace(/onmouseup[^"]*"[^"]*"/gi, "");
		
		return {content : content, thumbnailTarget : thumbnailTarget, thumbnailUrl : thumbnailUrl};
	};
	
	instance.prototype.compile = function()
	{
		var that = this;
		$(this.target).find("*[data-controller]").each(function()
		{
			var type = $(this).attr("data-controller");
			if($t.controller.hasOwnProperty(type))
				$t.controller[type].call(this, that);
		});
	};
}(TypeWriter));

(function($) {
    $.fn.attrr = function(key)
    {
    	var value = $(this).attr(key);
    	$(this).removeAttr(key);
    	return value;
    };
    
    $.fn._on = function(key, callback)
    {
    	var el = this.get(0);
    	if(!el.event)
    		el.event = {};
    	
    	el.event[key] = callback;
    };
    
    $.fn._emit = function(key, param)
    {
    	var el = this.get(0);
    	if(el.event && el.event[key])
    		el.event[key].call(el, param);
    };
}(jQuery));