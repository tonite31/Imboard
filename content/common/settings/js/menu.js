var selectedMenu = null;

$(document).ready(function()
{
    $("#form").compile(function(data)
    {
        $.api.menu.updateMenu(data);
        $("p[data-id='" + data.id + "']").attr("class", "selected");
        selectedMenu = $("p[data-id='" + data.id + "']");
    });

    var menuClickHandler = function(e)
    {
        $(".menuList p").removeAttr("class");
        if($(this).attr("data-id"))
        {
            $(this).attr("class", "selected");

            selectedMenu = this;

            $("#form").show();

            var result = $.api.menu.getMenu({id : $(this).attr("data-id")});
            if(result.code == 1000)
            {
                $("#form").setData(result.data);
            }

            e.stopPropagation();
        }
        else
        {
            selectedMenu = null;
            $(".menuList p").removeAttr("class");

            $("#form").hide();
        }
    };

    $(".menuList p").on("click", menuClickHandler);

    $("#moveUp").on("click", function(e)
    {
        if(selectedMenu)
        {
            var prev = $(selectedMenu).parent().prev().children("p");
            if(prev.length > 0)
            {
                var prevId = prev.attr("data-id");
                var prevPriority = prev.attr("data-priority");
                var prevName = prev.attr("data-name");

                var id = $(selectedMenu).attr("data-id");
                var priority = $(selectedMenu).attr("data-priority");
                var name = $(selectedMenu).attr("data-name");

                $.api.menu.updateMenu({id : id, name : name, priority : prevPriority});
                $.api.menu.updateMenu({id : prevId, name : prevName, priority : priority});

                $(selectedMenu).parent().insertBefore(prev.parent());
            }
        }

        e.stopPropagation();
    });

    $("#moveDown").on("click", function(e)
    {
        if(selectedMenu)
        {
            var next = $(selectedMenu).parent().next().children("p");
            if(next.length > 0)
            {
                var nextId = next.attr("data-id");
                var nextPriority = next.attr("data-priority");
                var nextName = next.attr("data-name");

                var id = $(selectedMenu).attr("data-id");
                var priority = $(selectedMenu).attr("data-priority");
                var name = $(selectedMenu).attr("data-name");

                $.api.menu.updateMenu({id : id, name : name, priority : nextPriority});
                $.api.menu.updateMenu({id : nextId, name : nextName, priority : priority});

                next.parent().insertBefore($(selectedMenu).parent());
            }
        }

        e.stopPropagation();
    });

    $("#addMenu").on("click", function(e)
    {
        var parentMenuId = null;
        if(selectedMenu)
        {
            parentMenuId = $(selectedMenu).attr("data-id");
        }

        var result = $.api.menu.insertMenu({id : new Date().getTime(), name : "메뉴", parentMenuId : parentMenuId});
        if(result.code == 1000)
        {
            var p = document.createElement("p");
            $(p).attr("data-id", result.data.id);
            $(p).attr("data-name", result.data.name);
            $(p).attr("data-priority", result.data.priority);
            $(p).on("click", menuClickHandler);

            $(p).html("<span>" + result.data.id + "</span><span>" + result.data.name + "</span>");

            var li = document.createElement("li");
            li.appendChild(p);

            var ul = null;
            if(selectedMenu)
                ul = $(selectedMenu).parent().find("ul");
            else
                ul = $(".menuList");

            if(ul.length > 0)
            {
                $(ul).append(li);
            }
            else
            {
                var ul = document.createElement("ul");
                ul.appendChild(li);
                $(selectedMenu).parent().append(ul);
            }
        }

        e.stopPropagation();
    });

    $("#deleteMenu").on("click", function(e)
    {
        if(selectedMenu)
        {
            var result = $.api.menu.deleteMenu({id : $(selectedMenu).attr("data-id")});
            if(result.code == 1000)
            {
                var next = $(selectedMenu).parent().next().find("p");
                $(selectedMenu).parent().remove();
                if(next.length > 0)
                {
                    next.attr("class", "selected");
                    selectedMenu = next;
                }
            }
            else
            {
                console.error(result);
            }
        }

        e.stopPropagation();
    });
});
