;(function ( $, window, document, undefined ) {
        var searchTimeout;
		var pluginName = "todoList";
		var defaults = {
            urlTodolistsPrefix: '/todolists-plugin/todolists',
            urlTodosPrefix: '/todolists-plugin/todolists-items',
            project: 0,
            activeList: 0,
            listbox: {},
            todobox: {},
		};
        
		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
				init: function () {
    				this.contructListBox();
    				this.contructTodoBox();
				},
				
				
				
				// ------------------------------------------------------------------ //
				// Todolists
				contructListBox: function() {
    				this.listbox = $('<div>').addClass('todoLists').appendTo(this.element);
    				
                    var $element = this;
    				var $columns = $('<div>').addClass('columnLabels').appendTo(this.listbox);
    				var $col1 = $('<div>').addClass('checkbox').html('&nbsp;').appendTo($columns);
    				var $col2 = $('<div>').addClass('listTitle').html('Takenlijst').appendTo($columns);
    				var $col3 = $('<div>').addClass('totalTasks').html('Todo\'s').appendTo($columns);
    				var $col4 = $('<div>').addClass('openTasks').html('Open').appendTo($columns);
    				var $col5 = $('<div>').addClass('progressBar').html('&nbsp;').appendTo($columns);
    				var $col6 = $('<div>').addClass('actions').html('&nbsp;').appendTo($columns);
    				
    				var $ul = $('<ul>').appendTo(this.listbox).sortable({
                        update: function(event, ui) {
                            var order = $(this).sortable("toArray");
            				$.post($element.settings.urlTodolistsPrefix+"/handle-sort", {
                				 "project": $element.settings.project
                				,"lists": order
            				}, function(json) {
        				        if(json.status) {
        				            //swal(json.title, json.msg, 'success');
        				        } else {
        				            swal(json.title, json.msg, 'warning');
        				        }
            				}, 'json');
                        }        				
    				});

    				var $addButton = $('<button type="button">').addClass('fi-plus addButton').html('Nieuwe takenlijst toevoegen').click(function() {
        				$element.addList();
    				}).appendTo(this.listbox);
				},

				
				addList: function(p) {
    				var params = $.extend( {
        				 id: 0
        				,name: ''
        				,totalTasks: 0
        				,openTasks: 0
        				,percentage: 0
        				,complete: false
    				}, p);
    				
                    var $element = this;
    				var $list = $(this.listbox).find('ul');
    				var $item = $('<li>').attr("id", "listid_"+params.id).data('params', params).dblclick(function(e) {
        				var p = $(this).data('params');
        				$element.loadList(p.id);
    				}).appendTo($list);

    				var $col1 = $('<div>').addClass('checkbox').appendTo($item);
    				var $checkbox = $('<input type="checkbox">').data('params', params).data('element', this).click(this.saveListCheckbox).appendTo($col1);
    				if(params.complete) {
        				$checkbox.attr("checked", "checked");
        				$item.addClass('complete');
    				}
    				
    				var $col2 = $('<div>').addClass('listTitle').appendTo($item);
    				var $title = $('<input type="text">').data('params', params).data('element', this).val(params.name).change(this.saveListName).appendTo($col2);
    				
    				var $col3 = $('<div>').addClass('totalTasks').html(params.totalTasks).appendTo($item);
    				
    				var $col4 = $('<div>').addClass('openTasks').html(params.openTasks).appendTo($item);
    				
    				var $col5 = $('<div>').addClass('progressBar').appendTo($item);
    				var $title = $('<progress max="100">').val(params.percentage).appendTo($col5);
    				
    				var $col6 = $('<div>').addClass('actions').appendTo($item);
    				var $a1 = $('<a>').addClass('fi-list-bullet').appendTo($col6);
    				var $a2 = $('<a>').addClass('fi-trash').data('params', params).data('element', this).click(this.deleteList).appendTo($col6);
    				var $a3 = $('<a>').addClass('fi-arrow-right').appendTo($col6);
				},
				
				saveListCheckbox: function() {
                    var $element = $(this).data('element');
                    
                    if($(this).is(":checked")) {
                        $(this).parent().parent().addClass('complete');
                    } else {
                        $(this).parent().parent().removeClass('complete');
                    }
                    
                    var p = $.extend( $(this).data('params'), {
                         'project': $element.settings.project
                        ,'checked': $(this).is(":checked")
                    });
                    
    				$.post($element.settings.urlTodolistsPrefix+"/save-checkbox", p, function(json) {
    				        if(json.status) {
    				            //swal(json.title, json.msg, 'success');
    				        } else {
    				            swal(json.title, json.msg, 'warning');
    				        }
    				    }, "json"
    				);
				},
				
				saveListName: function() {
                    var $element = $(this).data('element');
                    
                    var p = $.extend( $(this).data('params'), {
                         'project': $element.settings.project
                        ,'name': $(this).val()
                    });
                    
    				$.post($element.settings.urlTodolistsPrefix+"/save-name", p, function(json) {
    				        if(json.status) {
    				            //swal(json.title, json.msg, 'success');
    				            $element.loadLists();
    				        } else {
    				            swal(json.title, json.msg, 'warning');
    				        }
    				    }, "json"
    				);
				},
				
				deleteList: function() {
                    var $element = $(this).data('element');
                    var p = $.extend( $(this).data('params'), {});
                    
    				if(p.id==0) {
        				$(this).parent().parent().remove();
    				} else {
        				
        				swal({
                              title: 'Takenlijst verwijderen'
                            , text: 'Deze takenlijst bevast '+ p.totalTasks +' taken.<br>Weet je zeker dat je deze wilt verwijderen?'
                            , type: "warning"
                            , showCancelButton: true
                            , confirmButtonColor: "#DD6B55"
                            , confirmButtonText: "Ja, vewijderen"
                            , closeOnConfirm: false 
            				, allowHTML: true
        				}, function() {
            				$.post($element.settings.urlTodolistsPrefix+"/delete", {
            				          "id": p.id
            				    }, function(json) {
            				        if(json.status) {
        				                swal(json.title, json.msg, 'success');
                                        $element.loadLists();
            				        } else {
            				            swal(json.title, json.msg, 'warning');
            				        }
            				    }, "json"
            				);
        				});
        				
    				}
				},
				
				loadLists: function() {
                    var $element = this;
    				$.post(this.settings.urlTodolistsPrefix+"/load", {
    				          "project": this.settings.project
    				    }, function(json) {
    				        if(json.status) {
                                $($element.listbox).find('ul').html('');
                                $($element.todobox).hide();
                                $($element.listbox).show();
    				            for(var i in json.lists) {
        				            var list = json.lists[i];
        				            $element.addList(list);
    				            }
    				        } else {
    				            swal(json.title, json.msg, 'warning');
    				        }
    				    }, "json"
    				);
				},
				
				
				
				// ------------------------------------------------------------------ //
				// Todos
				contructTodoBox: function() {
    				this.todobox = $('<div>').addClass('todoList').appendTo(this.element).hide().show();
    				
                    var $element = this;
    				var $listLabel = $('<div>').addClass('listLabel').appendTo(this.todobox);
    				
    				var $columns = $('<div>').addClass('columnLabels').appendTo(this.todobox);
    				var $col1 = $('<div>').addClass('checkbox').html('&nbsp;').appendTo($columns);
    				var $col2 = $('<div>').addClass('tasktitle').html('Taak').appendTo($columns);
    				var $col3 = $('<div>').addClass('employees').html('Collega(s)').appendTo($columns);
    				var $col4 = $('<div>').addClass('taskstatus').html('Status').appendTo($columns);
    				var $col5 = $('<div>').addClass('delcol').html('&nbsp;').appendTo($columns);

    				var $ul = $('<ul>').appendTo(this.todobox).sortable({
                        update: function(event, ui) {
                            var order = $(this).sortable("toArray");
            				$.post($element.settings.urlTodosPrefix+"/handle-sort", {
                				 "list": $element.settings.activeList
                				,"todos": order
            				}, function(json) {
        				        if(json.status) {
        				            //swal(json.title, json.msg, 'success');
        				        } else {
        				            swal(json.title, json.msg, 'warning');
        				        }
            				}, 'json');
                        }        				
    				});
                    
    				var $addButton = $('<button type="button">').addClass('fi-plus addButton').html('Nieuwe taak toevoegen').click(function() {
        				$element.addTodo();
    				}).appendTo(this.todobox);
				},
				
				addTodo: function(p) {
    				var params = $.extend( {
        				 id: 0
        				,name: ''
        				,status: 'Nieuw'
        				,complete: false
    				}, p);
    				
                    var $element = this;
    				var $list = $(this.todobox).find('ul');
    				var $item = $('<li>').attr("id", "todoid_"+params.id).appendTo($list);

    				var $col1 = $('<div>').addClass('checkbox').appendTo($item);
    				var $checkbox = $('<input type="checkbox">').data('params', params).data('element', this).click(this.saveItemCheckbox).appendTo($col1);
    				if(params.complete) {
        				$checkbox.attr("checked", "checked");
        				$item.addClass('complete');
    				}
    				
    				var $col2 = $('<div>').addClass('tasktitle').appendTo($item);
    				var $title = $('<input type="text">').data('params', params).data('element', this).val(params.name).change(this.saveItemName).appendTo($col2);
    				
    				var $col3 = $('<div>').addClass('employees').appendTo($item);
    				
    				var $col4 = $('<div>').addClass('taskstatus').html(params.status).appendTo($item);
    				
    				var $col5 = $('<div>').addClass('delcol').appendTo($item);
    				var $a1 = $('<a>').addClass('fi-list-bullet').data('id', params.id).appendTo($col5);
    				var $a2 = $('<a>').addClass('fi-trash').data('params', params).data('element', this).click(this.deleteItem).appendTo($col5);
				},
				
				saveItemCheckbox: function() {
                    var $element = $(this).data('element');
                    
                    if($(this).is(":checked")) {
                        $(this).parent().parent().addClass('complete');
                    } else {
                        $(this).parent().parent().removeClass('complete');
                    }
                    
                    var p = $.extend( $(this).data('params'), {
                         'list': $element.settings.activeList
                        ,'checked': $(this).is(":checked")
                    });
                    
    				$.post($element.settings.urlTodosPrefix+"/save-checkbox", p, function(json) {
    				        if(json.status) {
    				            //swal(json.title, json.msg, 'success');
    				        } else {
    				            swal(json.title, json.msg, 'warning');
    				        }
    				    }, "json"
    				);
				},
				
				saveItemName: function() {
                    var $element = $(this).data('element');
                    
                    var p = $.extend( $(this).data('params'), {
                         'list': $element.settings.activeList
                        ,'name': $(this).val()
                    });
                    
    				$.post($element.settings.urlTodosPrefix+"/save-name", p, function(json) {
    				        if(json.status) {
    				            swal(json.title, json.msg, 'success');
    				        } else {
    				            swal(json.title, json.msg, 'warning');
    				        }
    				    }, "json"
    				);
				},
				
				deleteItem: function() {
                    var $element = $(this).data('element');
                    var p = $.extend( $(this).data('params'), {});
                    
    				if(p.id==0) {
        				$(this).parent().parent().remove();
    				} else {
        				
        				swal({
                              title: 'Taak verwijderen'
                            , text: 'Weet je zeker dat je deze wilt verwijderen?'
                            , type: "warning"
                            , showCancelButton: true
                            , confirmButtonColor: "#DD6B55"
                            , confirmButtonText: "Ja, vewijderen"
                            , closeOnConfirm: false 
            				, allowHTML: true
        				}, function() {
            				$.post($element.settings.urlTodosPrefix+"/delete", {
            				          "id": p.id
            				    }, function(json) {
            				        if(json.status) {
        				                swal(json.title, json.msg, 'success');
                                        $element.loadList(json.list);
            				        } else {
            				            swal(json.title, json.msg, 'warning');
            				        }
            				    }, "json"
            				);
        				});
        				
    				}
				},
				
				loadList: function(id) {
                    var $element = this;
    				$.post(this.settings.urlTodosPrefix+"/load", {
    				          "project": this.settings.project,
    				          "id": id
    				    }, function(json) {
    				        if(json.status) {
        				        var $label = $($element.todobox).find('.listLabel').html('');
        				        
        				        $('<a>').html('Takenlijsten').click(function() {
            				        $element.loadLists();
        				        }).appendTo($label);
        				        $label.append(' &raquo; ');
        				        $label.append(json.label);
        				        
        				        $element.settings.activeList = json.list;
        				        
                                $($element.todobox).find('ul').html('');
                                $($element.listbox).hide();
                                $($element.todobox).show();
    				            for(var i in json.todos) {
        				            var todo = json.todos[i];
        				            $element.addTodo(todo);
    				            }
    				        } else {
    				            swal(json.title, json.msg, 'warning');
    				        }
    				    }, "json"
    				);
				}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options, params ) {
				this.each(function() {
                    if (!$.data(this, 'plugin_' + pluginName)) {
                        $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                    }
                    else if ($.isFunction(Plugin.prototype[options])) {
                        $.data(this, 'plugin_' + pluginName)[options](params);
                    }
				});

				// chain jQuery functions
				return this;
		};

})( jQuery, window, document );
