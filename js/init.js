$(function() {
    $('.datepicker').datepicker({
        fistday: 1
    });
    
    $("#globalsearch").globalSearch();
    
    Mousetrap.bind('command+shift+s', function(e) {
        console.log("Execute search");
        $("#globalsearch").globalSearch('open');
    });
});
