$('.offcanvas ul.menu .has-subs').click(function() {
    $(this).toggleClass('active');
    $(this).find('.submenu').slideToggle();
    $(this).parent().siblings().next().slideToggle();
});

$('.offcanvas span').on('click', function(){
    $(this).toggleClass('fa-plus').toggleClass('fa-minus');
    $(this).find('.submenu').slideToggle(100); 
});