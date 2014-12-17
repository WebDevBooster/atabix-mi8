$(function() {
    $("#globalsearch").globalSearch();
    
    Mousetrap.bind('command+shift+s', function(e) {
        $("#globalsearch").globalSearch('open');
    });
});
