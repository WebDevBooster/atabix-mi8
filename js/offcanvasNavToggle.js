$('.offcanvas').on('click', 'span', function(){
    $(this).toggleClass('fa-plus').toggleClass('fa-minus');
    $(this).find('.submenu').slideToggle(100); 
});

$('.offcanvas ul li.has-subs').each(function(){
    var span = $(document.createElement('span')).addClass('fa fa-plus');
    $(this).prepend(span); 
});