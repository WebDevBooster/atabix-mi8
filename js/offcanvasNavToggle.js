$('.offcanvas ul.menu .has-subs').click(function() {
    $(this).toggleClass('active');
    $(this).find('.submenu').slideToggle();
    $(this).parent().siblings().next().slideToggle();
});