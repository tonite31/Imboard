function setValueToForm(element, datas)
{
	$(element).find("*[name]").each(function()
	{
		var name = $(this).attr('name');

		var data = datas[name];
		if(!datas.hasOwnProperty(name))
			return;
		
		if(this.nodeName == "INPUT" && this.type == "radio" && this.value == data)
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
	});
};

function formSubmit(element, callback)
{
	var getValue = function(key)
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
			var value = $(this).attr("data-value");
			if(value)
				return value;
			else
				return $(this).text();
		}
	};
	
	$(element).on('submit', function(e)
	{
		e.stopPropagation();
		e.preventDefault();
		
		var data = {};
		$(element).find("*[name]").each(function()
		{
			var key = $(this).attr("name");
			var value = getValue.call(this, key);
			if(this.nodeName == "INPUT" && this.type == "checkbox")
			{
				if(value)
				{
					if(data[key])
					{
						if(typeof data[key] == "Array")
							data[key].push(value);
						else
							data[key] = [data[key], value];
					}
					else
					{
						data[key] = value;
					}
				}
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
		
		if(callback)
			callback(data);
	});
}