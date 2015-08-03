$(document).ready(function(){
    $('.notification .main').click(function() {
        $('.notification').switchClass( "closed", "open", 150, "easeInOutExpo");
        setTimeout(function(){
            $(document).foundation('equalizer','reflow');
            equalizeNow();
        }, 200);
    });
    $('.notification .closeNotification').click(function() {
        $('.notification').switchClass("open", "closed", 150, "easeInOutExpo");
        setTimeout(function(){
            $(document).foundation('equalizer','reflow');
            equalizeNow();
        }, 200);
    });
});