$(function() {
    $( ".elementPanel.collapsable .title" ).click(function(){
        $( this ).prev().toggleClass('open');
        $( this ).next('.content').slideToggle(700, "easeOutBounce");
    });
});