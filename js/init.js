$(document).foundation();

$(function() {
    $("#st-container").niceScroll({
        cursorborder:"0",
        touchbehavior: false,
        zindex: "999999999999",
        railpadding: {right: 2},
        cursorborderradius: "5px",
        bouncescroll: true,
        scrollspeed: "60"
    });
    
    $('.datepicker').datepicker({
        changeMonth: true,
        changeYear: true,
        firstDay: 1,
        buttonImage: "static/images/loading.gif",
        dateFormat: 'dd-mm-yy',
        showButtonPanel: true
    });
    
    $("#globalSearch").globalSearch();
    
    Mousetrap.bind('command+shift+s', function(e) {
        $("#globalSearch").globalSearch('open');
    });
    
    $(".URLify").dblclick(function(){
        window.location=$(this).find("a").attr("href");
        return false;
    });        
    
    $(".URLifySingle").click(function(){
        window.location=$(this).find("a").attr("href");
        return false;
    });        
    
    $('[autosave-url]').autosave();
});
