$(function() {
    $( ".elementPanel.collapsable .title" ).click(function(){
        $( this).prev(".elementPanel").switchClass("open", "closed");
        $( this ).next('.content').slideToggle(700, "easeOutBounce");

        $(document).foundation('equalizer','reflow');
        equalizeNow();
    });
});