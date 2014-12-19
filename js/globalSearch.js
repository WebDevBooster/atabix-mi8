;(function ( $, window, document, undefined ) {
        var searchTimeout;
		var pluginName = "globalSearch";
		var defaults = {
            id: 'globalSearch',
            url: '/admin/global-search',
            prefill: '',
            delay: 750,
            currentIndex: 0,
            lastSearchQuery: '',
            resultCount: 0,
            results: false,
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
				},
				
				activate: function () {
                    var $searchbox = $('#'+this.settings.id+'_searchField');
                    setTimeout(function() {
                        $searchbox.focus();
                    }, 500);
				},
				
				closeSearch: function() {
					$('.md-overlay').trigger('click');
				},
				
				execSearch: function() {
                    $searchbox = $('#'+this.settings.id+'_searchField');
    				
    				
    				var query = $searchbox.val();
    				var e = this;
    				
    				// Do not search same result
    				if(this.settings.lastSearchQuery == query) return false;
    				
    				this.settings.lastSearchQuery = query;
    				$.get("/admin/global-search", {
    				          "query": query
    				    }, function(json) {
        				    e.settings.results = json;
        				    e.setResults();
    				    }, "json"
    				);
				},
				
				triggerSearch: function(e) {
    				
    				var object = $(this).data('element');
    				
                    switch(e.which) {
                        case 38:
                            if(object.settings.lastSearchQuery.length>0) object.resultUp();
                            return;
                        break;
                        
                        case 40:
                            if(object.settings.lastSearchQuery.length>0) object.resultDown();
                            return;
                        break;
                        
                        case 18:
                        case 19:
                        case 20:
                        case 27:
                        case 33:
                        case 34:
                        case 35:
                        case 36:
                        case 37:
                        case 38:
                        case 39:
                        case 40:
                            return false;
                        break;
                    }
                    
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(function() {
                        object.execSearch();
                    }, object.settings.delay);
				},
				
				setResults: function() {
                    $resultList = $('#'+this.settings.id+'_resultList');
                    $resultPreview = $('#'+this.settings.id+'_resultPreview');
                    
                    var isFirst = true;
                    var results = this.settings.results;
                    
                    $resultList.html('');
                    this.settings.resultCount = 0;
                    this.settings.currentIndex = 0;
                    
                    for(var i in results) {
                        this.settings.resultCount++;
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
                    this.activateResult();
				},
				
				resultUp: function() {
    				var newIndex = Math.max(0, this.settings.currentIndex-1)
    				this.settings.currentIndex = newIndex;
    				this.activateResult();
				},
				
				resultDown: function() {
    				var newIndex = Math.min(this.settings.resultCount-1, this.settings.currentIndex+1)
    				this.settings.currentIndex = newIndex;
    				this.activateResult();
				},
				
				activateResult: function() {
    				
    				var index = this.settings.currentIndex;
    				var results = this.settings.results;
    				
                    $resultPreview = $('#'+this.settings.id+'_resultPreview');
                    $resultListItems = $('#'+this.settings.id+'_resultList li');
                    
                    $resultListItems.removeClass('active');
                    $resultListItems.find('a').removeClass('active');
                    
    				var current = 0;
    				$resultListItems.each(function() {
        				if(index == current) {
            				$(this).addClass('active');
            				$(this).find('a').addClass('active');
            				
            				var selected = results[current];
            				$resultPreview.html(selected.preview);
        				}
        				current++;
    				});
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
