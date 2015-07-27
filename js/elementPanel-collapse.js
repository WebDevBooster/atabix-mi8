$(function() {
    $( ".elementPanel.collapsable .title" ).click(function(){
        $( this ).parent().toggleClass('open');
        $( this ).next('.content').slideToggle(700, "easeOutBounce");
    });
});