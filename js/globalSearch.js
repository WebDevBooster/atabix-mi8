(function( $ ){

    $.fn.globalSearch = function( options ) {  
        
        // Create some defaults, extending them with any options that were provided
        var settings = $.extend({
            'id': 'globalSearch',
            'prefill': '',
            'url' : '/admin/global-search'
        }, options);
        
        if(options == 'open') {
            open(this);
            return this;
        } else if(options == 'close') {
            close(this);
            return this;
        } else {
            return this.each(function() {
                $(this).data('settings', settings);
                init(this);
            });
        }
    
    };
    
    
    function init(e) {
        
        // Later hier de HTML tekenen. Voor nu even niet tijdens development
        var popup = $('<div id="paul">').addClass('iscool');
        //$('body').append(popup);
    }
    
    function open(e) {
        var settings = $(e).data('settings');
        $('#'+settings.id).trigger('click');
        
        $searchbox = $('#'+settings.id+'_modalSearch').find('.searchField').focus().trigger('click');
        console.log($searchbox);
    }
    
    function close(e) {
        var settings = $(e).data('settings');
        $searchbox.trigger('focus');
    }
    
})( jQuery );
