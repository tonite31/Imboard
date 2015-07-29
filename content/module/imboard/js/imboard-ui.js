(function($) {
	$.fn.templating = function(templateId, data)
	{
		var html = $("#" + templateId).html();
		var template = Handlebars.compile(html);
		$(this).html(template(data));
	};
	
    $.fn.attrr = function(key)
    {
    	var value = $(this).attr(key);
    	$(this).removeAttr(key);
    	return value;
    };
    
    $.fn.getRect = function()
    {
    	return this.get(0).getBoundingClientRect();
    };
    
    $.fn.showProgress = function()
    {
    	try
    	{
    		if(this.get(0) != null)
    		{
    			var progress = document.createElement('div');
            	progress.className = "imboard-progress";
            	
            	var style = getComputedStyle(this.get(0));
            	
            	var width = new Number(style.width.replace("px", ""));
            	var height = new Number(style.height.replace("px", ""));
            	
            	if(width > 100 || height > 100)
            	{
            		width = 100;
            		height = 100;
            		
            		var rect = this.get(0).getBoundingClientRect();
            		
            		var mw = (rect.width - width) / 2;
            		var mh = (rect.height - height) / 2;
            		
            		progress.style.margin = mh + "px " + mw + "px";
            	}
            	
            	progress.style.width = width + "px";
            	progress.style.height = height + "px";

            	$(progress).insertBefore(this);
            	this.get(0).progress = progress;
            	this.hide();
    		}
    		else
    		{
    			console.error("Progress target is null");
    		}
    	}
    	catch(err)
    	{
    		console.error(err.stack);
    	}
    };
    
    $.fn.isProcessing = function()
    {
    	if(this.get(0) != null)
    		return this.get(0).progress != null;
    	else
    		return false;
    };
    
    $.fn.dismissProgress = function()
    {
    	if(this.get(0) != null)
    	{
    		var progress = this.get(0).progress;
        	$(progress).remove();
        	
        	this.get(0).progress = null;
    	}
    	
    	this.show();
    };
    
    $.fn.flickering = function(option)
    {
    	var theme = option && option.theme ? option.theme : "default";
    	var time = option && option.time ? option.time : 500;
    	this.addClass(theme);
    	this.addClass("flickering");
    	
    	var that = this;
    	setTimeout(function(){
    		that.removeClass(theme);
    		setTimeout(function()
    		{
    			that.removeClass('flickering');
    		}, time);
    	}, time);
    };
    
    $.fn.getData = function()
    {
    	if(this.get(0).getData)
    		return this.get(0).getData();
    	else
    		return null;
    };
    
    $.fn.setData = function(data)
    {
    	if(this.get(0).setData)
    		this.get(0).setData(data);
    };
}(jQuery));

(function($)
{
	var component = {};
	$.fn.compile = function()
    {
		for(var i=0; i<this.length; i++)
		{
			var param = arguments;
			var name = $(this[i]).attrr("data-component");
			if(name != null && component.hasOwnProperty(name))
			{
				component[name]($(this[i]).get(0), param);
			}
			
			$(this[i]).find("*[data-component][data-autocompile='true']").each(function()
			{
				$(this).removeAttr("data-autocompile");
				var name = $(this).attrr("data-component");
				if(component.hasOwnProperty(name))
				{
					component[name](this, param);
				}
			});
		}
    };
    
    (function()
    {
    	this.form = function(context, param)
    	{
    		if(context.nodeName == "FORM")
    		{
    			var submit = $(context).find("input[type='submit']");
        		if(submit.length <= 0)
        		{
        			var input = document.createElement("input");
        			input.type = "submit";
        			input.style.position = "absolute";
        			input.style.left = "-10000px";
        			input.style.zIndex = "-1";
        			
        			context._submit = input;
        			$(context).append(input);
        		}
        		else
        		{
        			context._submit = submit[0];
        		}
    		}
    		
    		context.getData = function()
    		{
    			var data = {};
    			$(context).find("*[name]").each(function()
    			{
    				var key = $(this).attr("name");
    				var value = context.getValue.call(this, key);
    				if(this.nodeName == "INPUT" && this.type == "checkbox")
    				{
    					if(!data[key])
    						data[key] = [];
    					
    					if(value)
    						data[key].push(value);
    				}
    				else if(this.nodeName == "INPUT" && this.type == "radio")
    				{
    					if(value)
    						data[key] = value;
    				}
    				else
    				{
    					data[key] = value;
    				}
    			});
    			
    			$(context).find("*[data-name]").each(function()
    			{
    				var key = $(this).attr("data-name");
    				data[key] = context.getValue.call(this, key);
    			});
    			
    			return data;
    		};
    		
    		context.setData = function(data)
    		{
    			for(var key in data)
    			{
    				$(context).find("*[name='" + key + "']").each(function()
    				{
    					context.setValue.call(this, data[key]);
    				});
    				
    				$(context).find("*[data-name='" + key + "']").each(function()
    				{
    					context.setValue.call(this, data[key]);
    				});
    			};
    		};
    		
    		context.setValue = function(data)
    		{
    			if(this.nodeName == "INPUT" && this.type == "radio" && this.value == data[key])
				{
					this.checked = true;
				}
				else if(this.nodeName == "INPUT" && this.type == "checkbox")
				{
					var array = data;
					for(var i=0; i<array.length; i++)
					{
						if(array[i] == this.value)
						{
							this.checked = true;
							break;
						}
					}
				}
				else if(this.nodeName == "INPUT" || this.nodeName == "TEXTAREA")
				{
					$(this).val(data);
				}
				else if(this.nodeName == "IMG")
				{
					$(this).attr("src", data);
				}
				else if(this.nodeName == "SELECT")
				{
					if(this.multiple)
					{
						var array = data;
						for(var i=0; i<array.length; i++)
						{
							$(this).find("option[value='" + array[i] + "']").attr("checked", "checked");
						}
					}
					else
					{
						if(data[0])
							$(this).val(data[0]);
						else
							$(this).val(data);
					}
				}
				else
				{
					$(this).text(data);
				}
    		}
    		
    		context.getValue = function(key)
    		{
    			if(this.nodeName == "INPUT" && this.type == "radio")
				{
					if(this.checked)
						return this.value;
				}
				else if(this.nodeName == "INPUT" && this.type == "checkbox")
				{
					if(this.checked)
					{
						return this.value;
					}
				}
				else if(this.nodeName == "INPUT" || this.nodeName == "TEXTAREA")
				{
					return $(this).val();
				}
				else if(this.nodeName == "IMG")
				{
					var value = $(this).attr("data-value");
					return value ? value : $(this).attr("src");
				}
				else if(this.nodeName == "SELECT")
				{
					if(this.multiple)
					{
						var data = [];
						$(this).find("option:checked").each(function()
						{
							data.push(this.value);
						})
						
						return data;
					}
					else
					{
						return $(this).val();
					}
				}
				else
				{
					return $(this).text();
				}
    		};
    		
    		context.makeValidationMessage = function()
    		{
    			var message = $(this).attr("data-validation-message");
				if(!message)
					message = this.validationMessage;
				
    			var rect = this.getBoundingClientRect();
				
				var pos = {left : this.offsetLeft, top : this.offsetTop};
				
				var parent = this.offsetParent;
				while(parent)
				{
					pos.left += parent.offsetLeft;
					pos.top += parent.offsetTop;
					
					parent = parent.offsetParent;
				}
				
				var div = document.createElement("div");
				div.className = "imboard-ui-validation"
				div.style.left = pos.left + 20 + "px";
				div.style.top = pos.top + rect.height + 5 + "px";
				
				var arrow = document.createElement("span");
				arrow.className = "arrow";
				
				var arrowBorder = document.createElement("span");
				arrowBorder.className = "arrowBorder";
				
				var span = document.createElement("span");
				span.className = "validation-message";
				span.innerText = message;
				
				div.appendChild(arrowBorder);
				div.appendChild(arrow);
				div.appendChild(span);
				
				document.body.appendChild(div);
    		};
    		
    		context.validation = function()
    		{
    			var check = true;
    			var inputList = $(context).find("*[name]");
    			for(var i=0; i<inputList.length; i++)
    			{
    				var result = inputList[i].checkValidity();
    				if(!result)
    				{
    					context.makeValidationMessage.call(inputList[i]);
    					inputList[i].focus();
    					$(inputList[i]).on("input blur", function(e)
    					{
    						$(".imboard-ui-validation").remove();
    					});
    					
    					return false;
    				}
    				
					check = check && result;
    			}
    			
    			return check;
    		};
    		
    		var submitButton = $(context).find("*[data-role='submit']");
    		for(var i=0; i<submitButton.length; i++)
    		{
    			$(submitButton[i]).removeAttr("data-role");
    			(function(roleType)
    			{
    				$(submitButton[i]).on("click", function()
					{
    					if(context.nodeName == "FORM")
    					{
    						var evt = document.createEvent('MouseEvents');
        					evt.initEvent(
        					   'click'      // event type
        					   ,true      // can bubble?
        					   ,true      // cancelable?
        					);

        					context._roleType = roleType;
        					context._context = this;
        					context._submit.dispatchEvent(evt);
    					}
    					else
    					{
    						if(context.validation())
    						{
    							var data = context.getData();
    	    	    			data.__roleType = roleType;
    	    	    			var callback = param[0];
    	    	        		if(callback)
    	    	        		{
        	        				callback.call(context._context, data);
        	        			}
    						}
    					}
					});
    			})($(submitButton[i]).attrr("data-role-type"));
    		}
    		
    		if(context.nodeName == "FORM")
    		{
    			var novalidate = $(context).attr("novalidate");
				context.novalidate = novalidate ? true : false;
				if(!novalidate)
					$(context).attr("novalidate", "novalidate");
    			
				$(context).unbind();
    			$(context).submit(function(e)
	    		{
    				try
    				{
	    				if(this.novalidate || this.validation())
	    				{
	    					var data = this.getData();
	    	    			data.__roleType = this._roleType ? this._roleType : "submit";
	    	    			var callback = param[0];
	    	        		if(callback)
	    	        		{
    	        				callback.call(this._context, data);
    	        			}
    	        		}
    				}
    				catch(err)
        			{
        				console.error(err.stack);
        			}
        			finally
        			{
        				e.preventDefault();
            			e.stopPropagation();
            			return false;
        			}
	    		});
    		}
    	};
    	
    	this.scrollFollower = function(context, param)
    	{
    		var options = param[0];
			if(!options || !options.direction)
				options = {top : 10, direction : "vertical"};
			else if(options.direction == "horizontal" && !options.left)
				options.left = 10;
			
			var rect = $(context).getRect();
			var top = rect.top + $(window).scrollTop();
			var left = rect.left + $(window).scrollLeft();
			
			var setPosition = function()
			{
				if(options.direction == "vertical")
				{
					if(top - options.top <= $(window).scrollTop())
					{
						$(context).css("position", "fixed").css("top", options.top + "px").css("left", rect.left + "px");
					}
					else
					{
						$(context).css("position", "").css("top", "").css("left", "");
					}
				}
				else if(options.direction = "horizontal")
				{
					if(left - options.left <= $(window).scrollLeft())
					{
						$(context).css("position", "fixed").css("top", rect.top + "px").css("left", options.left + "px");
					}
					else
					{
						$(context).css("position", "").css("top", "").css("left", "");
					}
				}
			};
			
			$(window).on("scroll", setPosition);
			setPosition();
    	};
    }).call(component);
    
    (function()
    {
    	$(document).ready(function()
    	{
    		$("body").compile();
    	});
    })();
    
})(jQuery);