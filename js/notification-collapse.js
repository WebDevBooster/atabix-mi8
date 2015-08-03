$(document).ready(function(){
    $('.notification .main').click(function() {
        $('.notification').switchClass("closed", "open", 700, "easeInOutExpo");
        setTimeout(function(){
            $(document).foundation('equalizer','reflow');
            equalizeNow();
        }, 200);
    });
    $('.notification .closeNotification').click(function() {
        $('.notification').switchClass("open", "closed", 700, "easeInOutExpo");
        setTimeout(function(){
            $(document).foundation('equalizer','reflow');
            equalizeNow();
        }, 200);
    });
});