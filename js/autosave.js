;(function ( $, window, document, undefined ) {
        var searchTimeout;
		var pluginName = "autosave";
		var defaults = {
    		fieldID: null,
    		fieldName: null,
    		fieldValue: null,
            url: false
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
    				var e = this.element;
    				
                    var url = $(e).attr("autosave-url");
                    var id = $(e).attr("autosave-id");
                    if (typeof id !== "undefined" && typeof url !== "undefined") {
        				this.settings.url = url;
        				this.settings.fieldID = id;
        				$(e).change(this.postUpdate).data('plugin', this);
                    }
				},
				
				postUpdate: function() {
    				var plugin = $(this).data('plugin');
                    var value;
                    if ($(this).attr("type") == "checkbox") {
                        if ($(this).prop("checked")) {
                            value = "on";
                        } else {
                            value = "";
                        }
                    } else {
                        value = $(plugin.element).val();
                    }

                    $.ajax(plugin.settings.url, { 
                        dataType: "json",
                        method: "POST",
                        data: {
                            "id": plugin.settings.fieldID,
                            "name": $(plugin.element).attr("name"),
                			"value": value
                        },
                        success: function (json) {
                			if(json.status!=1) {
                                swal(json.title, json.msg, 'error');
                			}
                        }
            		})
            		.fail(function() {
                        swal("Failed to autosave", "Make sure that the url exists and processes the data correctly.", "error");
                    });
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
