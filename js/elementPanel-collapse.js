$(function() {
    $( ".elementPanel.collapsable .title" ).click(function(){
        $( this ).toggleClass('open');
        $( this ).next('.content').slideToggle(700, "easeOutBounce");
        $(document).foundation('equalizer','reflow');
        equalizeNow();
    });
});