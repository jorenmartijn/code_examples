

(function($) {

  hljs.initHighlightingOnLoad();

  // Form accordions
  $('.post-type-container').on('click', '.accordion', function(){

    $(this).toggleClass('active');
    var panel = $(this).next().next();
    panel.slideToggle();
  });

  // Post types form button
  $('#add-post-type').on('click', function(){
    var count = $('.post-type-container .accordion').length;
    var html = $('.form-item-template').html();

    var re = new RegExp('{id}', 'g');
    html = html.replace(re, String(count + 1))
    $('.post-type-container').append(html);
    $('.post-type-container .accordion').last().click();
  });

  // Remove post type
  $('.post-type-container').on('click', '.accordion-trash i', function(){

    var trash = $(this).parent();
    var accordion = trash.prev();
    var panel = trash.next();

    trash.remove();
    accordion.remove();
    panel.remove();

    // Reset indexes - ugly, may need to be changed
    var idx = 1;
    var re = new RegExp('\\d+$', 'g');

    $('.post-type-container .panel').each(function(){
      $(this).find('[name*="type-"]').each(function(){
        var name = $(this).attr('name');
        $(this).attr('name',  name.replace(re, idx));
      });
      idx++;
    });

  });


  // Top bar fields
  if($('[name="has-top-bar"]:checked').length > 0){
    $('.top-bar-fields').show();
  }

  if($('[name="has-menu"]:checked').length > 0){
    $('.top-bar-menu-fields').show();
  }

  $('[name="has-top-bar"]').on('change', function(){
    if($(this).prop('checked')) {
      $('.top-bar-fields').show();
    } else {
      $('.top-bar-fields').hide();
    }
  });

  $('[name="has-menu"]').on('change', function(){
    if($(this).prop('checked')) {
      $('.top-bar-menu-fields').show();
    } else {
      $('.top-bar-menu-fields').hide();
    }
  });


  // Socket fields
  if($('[name="has-socket"]:checked').length > 0){
    $('.socket-fields').show();
  }

  $('[name="has-socket"]').on('change', function(){
    if($(this).prop('checked')) {
      $('.socket-fields').show();
    } else {
      $('.socket-fields').hide();
    }
  });

  // Code accordion
  $('.code h4').on('click', function(){

    if(!$(this).hasClass('active')) {
      $('.code h4').removeClass('active');
      $('.code pre.open').slideToggle().removeClass('open');
    }

    $(this).toggleClass('active');
    $(this).next().slideToggle().toggleClass('open');
  });
})(jQuery);

