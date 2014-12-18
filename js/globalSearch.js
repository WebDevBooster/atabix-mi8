;(function ( $, window, document, undefined ) {
        var searchTimeout;
		var pluginName = "globalSearch";
		var defaults = {
            id: 'globalSearch',
            url: '/admin/global-search',
            prefill: '',
            delay: 750,
            selected: 0
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
                    $searchbox = $('#'+this.settings.id+'_searchField');
                    $searchbox.bind('keyup', this.triggerSearch).data('element', this);
				},
				
				openSearch: function () {
                    $('#'+this.settings.id).trigger('click');
                    this.activate();
                    this.element.activate();
				},
				
				activate: function () {
                    $searchbox = $('#'+this.settings.id+'_searchField');
                    setTimeout(function() {
                        console.log($searchbox);
                        $searchbox.focus();
                    }, 1000);
				},
				
				closeSearch: function() {
					$('.md-overlay').trigger('click');
				},
				
				execSearch: function() {
                    $searchbox = $('#'+this.settings.id+'_searchField');
    				
    				var e = this;
    				$.get("/admin/global-search", {
    				          "query": $searchbox.val()
    				    }, function(json) {
        				    e.setResults(json);
    				    }, "json"
    				);
				},
				
				triggerSearch: function(e) {
    				
    				var object = $(this).data('element');
    				
    				if( e.which==16 ||
    				    e.which==17 ||
    				    e.which==18 ||
    				    e.which==19 ||
    				    e.which==20 ||
    				    e.which==27 ||
    				    e.which==33 ||
    				    e.which==34 ||
    				    e.which==35 ||
    				    e.which==36 ||
    				    e.which==37 ||
    				    e.which==38 ||
    				    e.which==39 ||
    				    e.which==40 
    				) return false;
    				console.log('do search');
    				
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(function() {
                        object.execSearch();
                    }, object.settings.delay);
				},
				setResults: function(results) {
                    $resultList = $('#'+this.settings.id+'_resultList');
                    $resultPreview = $('#'+this.settings.id+'_resultPreview');
                    
                    var isFirst = true;
                    
                    $resultList.html('');
                    for(var i in results) {
                        var tmp = results[i];
                        var $list = $('<li>');
                        var $link = $('<a>').attr("href", tmp.url).html(tmp.name).appendTo($list);
                        $list.appendTo($resultList);
                        
                        if(isFirst) {
                            $resultPreview.html(tmp.preview);
                            $list.addClass('active');
                            $link.addClass('active');
                        }
                        isFirst = false;
                    }
				}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				this.each(function() {
        		    if(options == 'open') {
            		    $.data(this, "plugin_" + pluginName).openSearch();
        		    } else if(options == 'close') {
            		    $.data(this, "plugin_" + pluginName).closeSearch();
        		    } else if(options == 'activate') {
            		    $.data(this, "plugin_" + pluginName).activate();
        		    } else {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
        		    }
				});

				// chain jQuery functions
				return this;
		};

})( jQuery, window, document );
