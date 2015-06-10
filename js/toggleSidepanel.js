$(function() {
    $("#toggleSidepanel").click(function() {
        $('.toggleButton').toggleClass('active');

        $('#mainPanel').toggleClass("large-8", "large-12");
        $('#sidePanel').toggleClass("showPanel");
    });
});