$(function() {
    $('.datepicker').datepicker({
        fistday: 1
    });
    
    $("#globalsearch").globalSearch();
    
    Mousetrap.bind('command+shift+s', function(e) {
        $("#globalsearch").globalSearch('open');
    });
});
