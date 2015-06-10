;(function ( $, window, document, undefined ) {
        var searchTimeout;
		var pluginName = "sortableList";
		var defaults = {
            urlPrefix: '/todolists-plugin',
            project: 0,
            listType: 'inscope',
            listSortConnect: false,
            
            deleteConfirmTitle: 'Item verwijderen',
            deleteConfirmText: 'Weet je zeker dat je dit item wilt verwijderen?',
            deleteConfirmConfirmButtonText: 'Ja, verwijderen',
            deleteConfirmCancelButtonText: 'annuleren',
            addButtonText: 'Scope toevoegen',
            
            box: {}
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
    				this.contructBox();
				},
				
				
				
				// ------------------------------------------------------------------ //
				// Todolists
				contructBox: function() {
    				this.box = $('<div>').addClass('todoLists').appendTo(this.element);
    				
                    var $element = this;
    				var $columns = $('<div>').addClass('columnLabels').appendTo(this.box);
    				var $col1 = $('<div>').addClass('checkbox').html('&nbsp;').appendTo($columns);
    				var $col2 = $('<div>').addClass('listTitle').html('Scope').appendTo($columns);
    				var $col6 = $('<div>').addClass('delcol').html('&nbsp;').appendTo($columns);
    				
    				var $ul = $('<ul>').appendTo(this.box);
    				
    				// Make Sortable
    				var sortOptions = {
                        update: function(event, ui) {
                            var order = $(this).sortable("toArray");
                            var opt = $.extend($element.settings, {"items": order});
                            
            				$.post($element.settings.urlPrefix+"/handle-sort", opt, function(json) {
        				        if(json.status) {
        				            //swal(json.title, json.msg, 'success');
        				        } else {
        				            swal(json.title, json.msg, 'warning');
        				        }
            				}, 'json');
                        }        				
    				};
    				if($element.settings.listSortConnect) {
        				$ul.addClass($element.settings.listSortConnect);
        				sortOptions = $.extend(sortOptions, { connectWith: '.'+$element.settings.listSortConnect});
    				}
    				$ul.sortable(sortOptions);

    				var $addButton = $('<button type="button">').addClass('fi-plus addButton').html($element.settings.addButtonText).click(function() {
        				$element.addItem();
    				}).appendTo(this.box);
				},

				
				addItem: function(p) {
    				var params = $.extend( {
        				 id: 0
        				,name: ''
        				,complete: false
    				}, p);
    				
                    var $element = this;
    				var $list = $(this.box).find('ul');
    				var $item = $('<li>').attr("id", "itemid_"+params.id).data('params', params).dblclick(function(e) {
        				var p = $(this).data('params');
        				$element.loadItem(p.id);
    				}).appendTo($list);

    				var $col1 = $('<div>').addClass('checkbox').appendTo($item);
    				var $checkbox = $('<input type="checkbox">').data('params', params).data('element', this).click(this.saveCheckbox).appendTo($col1);
    				if(params.complete) {
        				$checkbox.attr("checked", "checked");
        				$item.addClass('complete');
    				}
    				
    				var $col2 = $('<div>').addClass('listTitle').appendTo($item);
    				var $title = $('<input type="text">').data('params', params).data('element', this).val(params.name).change(this.saveName).appendTo($col2);
    				
    				var $col6 = $('<div>').addClass('delcol').appendTo($item);
    				var $a1 = $('<a>').addClass('fi-list-bullet').appendTo($col6);
    				var $a2 = $('<a>').addClass('fi-trash').data('params', params).data('element', this).click(this.deleteItem).appendTo($col6);
				},
				
				saveCheckbox: function() {
                    var $element = $(this).data('element');
                    
                    if($(this).is(":checked")) {
                        $(this).parent().parent().addClass('complete');
                    } else {
                        $(this).parent().parent().removeClass('complete');
                    }
                    
                    var p = $.extend( $element.settings, $(this).data('params'), {
                        'checked': $(this).is(":checked")
                    });
                    
    				$.post($element.settings.urlPrefix+"/save-checkbox", p, function(json) {
    				        if(json.status) {
    				            //swal(json.title, json.msg, 'success');
    				        } else {
    				            swal(json.title, json.msg, 'warning');
    				        }
    				    }, "json"
    				);
				},
				
				saveName: function() {
                    var $element = $(this).data('element');
                    
                    var p = $.extend( $element.settings, $(this).data('params'), {
                        'name': $(this).val()
                    });
                    
    				$.post($element.settings.urlPrefix+"/save-name", p, function(json) {
    				        if(json.status) {
    				            //swal(json.title, json.msg, 'success');
    				            //$element.loadItems();
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
                              title: $element.settings.deleteConfirmTitle
                            , text: $element.settings.deleteConfirmText
                            , type: "warning"
                            , showCancelButton: true
                            , confirmButtonColor: "#DD6B55"
                            , confirmButtonText: $element.settings.deleteConfirmConfirmButtonText
                            , cancelButtonText: $element.settings.deleteConfirmCancelButtonText
                            , closeOnConfirm: false 
            				, allowHTML: true
        				}, function() {
            				$.post($element.settings.urlPrefix+"/delete", {
            				          "id": p.id
            				    }, function(json) {
            				        if(json.status) {
        				                swal(json.title, json.msg, 'success');
                                        $element.loadItems();
            				        } else {
            				            swal(json.title, json.msg, 'warning');
            				        }
            				    }, "json"
            				);
        				});
        				
    				}
				},
				
				loadItems: function() {
                    var $element = this;
                    var p = $.extend({}, this.settings);
                    
    				$.post(this.settings.urlPrefix+"/load", p, function(json) {
    				        if(json.status) {
                                $($element.box).find('ul').html('');
    				            for(var i in json.items) {
        				            var list = json.items[i];
        				            $element.addItem(list);
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
