(function( $ ){

  $.fn.globalSearch = function( options ) {  

    // Create some defaults, extending them with any options that were provided
    var settings = $.extend( {
      'prefill': '',
      'url' : '/admin/global-search'
    }, options);

    return this.each(function() {        

      // Tooltip plugin code here
      console.log("INIT GLOBAL SEARCH FOR");
      console.log(this);

    });

  };
})( jQuery );
