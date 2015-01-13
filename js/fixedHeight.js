;(function ( $, window, document, undefined ) {
        var searchTimeout;
		var pluginName = "fixedHeight";
		var defaults = {
            correctionTop: 200,
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
    				this.setHeight();
    				
    				var plugin = this;
    				$(window).resize(function() {
        				plugin.setHeight();
    				});
				},
				
				setHeight: function() {
    				var windowHeight = $(window).height();
    				var newHeight = windowHeight - this.settings.correctionTop;
    				
    				$(this.element).height(newHeight);
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
