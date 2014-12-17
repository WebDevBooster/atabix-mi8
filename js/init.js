$(function() {
    $('.datepicker').datepicker({
        fistday: 1
    });
    
    $("#globalSearch").globalSearch();
    
    Mousetrap.bind('command+shift+s', function(e) {
        $("#globalSearch").globalSearch('open');
    });
});
