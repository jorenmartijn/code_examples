// input here
$(document).foundation();

// document ready
$(function() {

	var currentBreakPoint = Foundation.MediaQuery.current;

  // mobile menu toggle
  //-------------------
	$('#navicon').on("click", function() {
    $(this).toggleClass('is-active');
    $("body").toggleClass('stop-scrolling');
  });


  // submenu toggle
  //-------------------
  $('.submenu-toggle').on('click', function(){
	  $(this).toggleClass('plus').toggleClass('minus');
	  if(!$(this).closest('li').find('.sub-menu').first().hasClass('is-active')) {
		  $(this).closest('li').find('.sub-menu').first().addClass('is-active');
		  var activeHeight = $(".mobile-menu-container").outerHeight(true);
		  $(this).closest('li').find('.sub-menu').first().slideToggle(function(){
			  activeHeight += $(this).outerHeight();
			  $(".mobile-menu-container").css("height", activeHeight + 'px' + 30);
		  });
	  } else {
		  var activeHeight = $(this).closest('li').find('.sub-menu').outerHeight();
		  $(this).closest('li').find('.sub-menu').first().slideToggle(function(){
			  $(this).closest('li').find('.sub-menu').removeClass('is-active');
			  activeHeight = $(".mobile-menu-container").outerHeight(true) - activeHeight;
			  $(".mobile-menu-container").css("height", activeHeight + 'px');
			  $(this).closest('li').find('.sub-menu').hide();
			  $(this).closest('li').find('.submenu-toggle').addClass('plus').removeClass('minus');
		  });
	  }
  });

	if ($('.section-hero.is-cover').length > 0) {
		$('.section-hero.is-cover').foundation();
	}


  // sticky header
  //--------------
  var header = $("header#header");
  var offcanvas = $("#offCanvas");
  $(window).scroll(function() {
    var scroll = $(window).scrollTop();
    if (scroll >= 500) {
      header.addClass("sticky-header");
      offcanvas.addClass("sticky-header");
    } else {
      header.removeClass("sticky-header");
      offcanvas.removeClass("sticky-header");
    }
  });


  // position hero overlay
  //----------------------
  function setHeroOverlayPosition() {
	  if ($('.home').length > 0 ) {
			if (currentBreakPoint != 'small'){
				var headerHeight = $('.header-wrap').outerHeight(true);
			  $('.hero-content').css('margin-top', headerHeight + 'px');
			  $('.cta-container').css('margin-top', headerHeight + 'px');
			}

		}
  }
	setHeroOverlayPosition();

	$(window).on('changed.zf.mediaquery', function(event, newSize, oldSize) {
			if (newSize != 'small'){
				setHeroOverlayPosition();
			} else {
				$('.hero-content').css('margin-top', 'auto');
			 $('.cta-container').css('margin-top',  'auto');
			}
	});

	$(window).on('resize',function() {
		setHeroOverlayPosition();
	})


  // smoothscroll to hash
  //---------------------
  $('a[href*=\\#]').on('click', function(event) {
    if ($(this.hash).length > 0) {
      event.preventDefault();
      $('html,body').animate({
        scrollTop: $(this.hash).offset().top - 140
      }, 500);
    }
  });


  // social sharers
  //---------------
  $('ul.social-share > li > a').on('click', function() {
      window.Sharer.init();
  })


  // lazyload
  //---------------------------------
  $.fn.lazyInterchange = function() {
    var selectors = this.each(function() {
      if($(this).attr('data-lazy')){
        $(this).attr('data-interchange',$(this).attr('data-lazy'));
        $(this).removeAttr('data-lazy');
        $(this).foundation();
        $(this).addClass('image-loaded');
      }
    });
    return selectors;
  };


  // call our unveil and then our lazyInterchange
  //---------------------------------
	$('img.lazy').unveil(200,function(){
    $(this).on('load', function(){
      $(this).lazyInterchange();
    });
	});


  // Home first block cta margin
  //
  //----------------------------
  //
  // Deze functionaliteit is geschreven voor het CTA-blok op de homepage.
  // De positie van het CTA-blok zal veranderen wanneer die als eerste is gekozen in de flexibele inhoud.
  //
  //---------------------------------
  if($('body.home section:nth-child(3)').hasClass('section-cta-bar')){
	  $('body.home section:nth-child(3)').find('.row').first().addClass('collapse');
    if (Foundation.MediaQuery.atLeast('xlarge')) {
    	$('body.home section:nth-child(4)').css('margin-top', ($('body.home section:nth-child(3) .container').outerHeight() / 2) + 'px');
    }
  }

  // gallery slider
  //---------------------------------
  $('.gallery-slider').slick({
	  centerMode: false,
	  infinite: true,
	  variableWidth: true,
	  centerPadding: '40px',
	  slidesToShow: 2,
	  nextArrow: '<i class="button slick-next far fa-arrow-right"></i>',
		prevArrow: '<i class="button slick-prev far fa-arrow-left"></i>',
	  responsive: [
	    {
	      breakpoint: 480,
	      settings: {
	        centerPadding: '0px',
	        slidesToShow: 1
	      }
	    }
	  ]
	});


  // Lock body/scroll (mobile nav)
  //---------------
  function lockScroll() {
	if ($('body').hasClass('lock-scroll')) {
		$('body').removeClass('lock-scroll');
	}
	else {
		$('body').addClass('lock-scroll');
	}
}

$('.mobile-navigation').click(function() {
	lockScroll();
 });


}); // end document ready



  // opens the search input in the main menu.
	//----------------------------------------
	$('form.searchform .input-group button').click(function() {
		var element = $(this);
	  setTimeout(function(){
			  $(element).parent().parent().find('.input-group-field').focus();
		  }, 1000);

	  if(!$(this).parent().parent().parent().hasClass('open') || $(this).parent().parent().find('input').val()=="") {
		  $(this).parent().parent().parent().toggleClass('open');
			  return false;
	  }  else {
		  return true;
	  }
	});


	$(document).click(function(event) {

		// desktop
	  if(!$(event.target).closest('.desktop__searchform form').length) {
		if($('.desktop__searchform form').hasClass("open")  ) {
		  $('.desktop__searchform form').removeClass('open');
		}
	  }

	  // mobile
	  if (!$(event.target).closest('.mobile__searchform form').length ) {
		   if($('.mobile__searchform form').hasClass("open")  ) {
		  $('.mobile__searchform form').removeClass('open');
		}
	  }

	});
