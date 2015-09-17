$(function() {
    $(function() {
        $( ".elementPanel.collapsable .title" ).click(function(){
            $(this).parent(".elementPanel.open").switchClass("open","closed");
            $(this).parent(".elementPanel.closed").switchClass("closed","open");

            $(document).foundation('equalizer','reflow');
            equalizeNow();
            return false;
        });
    });
});