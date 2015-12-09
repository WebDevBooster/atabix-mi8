$('.offcanvas ul.menu .has-subs').click(function() {
    $(this).toggleClass('active');
    $(this).find('.submenu').slideToggle();
    $(this).parent().siblings().next().slideToggle();
});

$('.offcanvas span').on('click', function(){
   console.log("click");
   $(this).find('.submenu').slideToggle(100); 
});

console.log("test");