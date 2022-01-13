/* Plugin front-end JS */

// Document ready
jQuery(function() {

  var settings_loaded = false;
  var cur_margin_top = parseInt(jQuery('body').css('margin-top'));
  var nrdq_collapsed_height = parseInt(ajax_object_cookie.collapsed_height);
  var more_string = ajax_object_cookie.more_info_string;
  var less_string = ajax_object_cookie.less_info_string;
  var orig_text = '';

  function debounce( fn, threshold ) {
    var timeout;
    return function debounced() {
      if ( timeout ) {
        clearTimeout( timeout );
      }
      function delayed() {
        fn();
        timeout = null;
      }
      setTimeout( delayed, threshold || 200 );
    };
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
  }

  function parseCookie(string){
    if(string.indexOf("|") <= -1){
      return;
    }
    var array = string.split('|');
    for(var i = 0; i < array.length; i++){
      if(array[i].indexOf("=") > -1){
        array[i] = array[i].split("=");
      }
    }
    return array;
  }

  function set_body_top_position() {
    if(jQuery('#nrdq-cookie-notice:visible').length > 0 && jQuery('#nrdq-cookie-notice').hasClass('top')){
      var height = parseInt(jQuery('#nrdq-cookie-notice').outerHeight());
      height = height + cur_margin_top;

      jQuery('body').css('margin-top', height);
    }
  }

  function set_datalayer_variables(){
    window.dataLayer = window.dataLayer || [];
    var cookie = getCookie('cookie_settings');
    var parsed = parseCookie(cookie);
    if(parsed){
      var permissions = {};
      for(var permission = 0; permission < parsed.length; permission++){
        var key = 'cookie-' + parsed[permission][0];
        if(parsed[permission].length == 2 && parsed[permission][1] == 'true'){
          permissions[key] = '1';
        } else {
          permissions[key] = '0';
        }

        var key = 'anonymize-' + parsed[permission][0];
        if(parsed[permission].length == 2 && parsed[permission][1] == 'true'){
          permissions[key] = '0';
        } else {
          permissions[key] = '1';
        }
      }
      dataLayer.push(permissions);
    }
  }

  function nrdq_log_error(error, action){
    jQuery.ajax({
	    type: 'POST',
	    url: ajax_object_cookie.ajax_url,
	    dataType: 'json',
	    data: {
		    action: 'log_error',
		    error : JSON.stringify(error),
		    error_action: action
		  },
			timeout: 10000
		});
  }

  if(typeof ajax_object_cookie.remove !== "undefined" && ajax_object_cookie.remove == 'true' && jQuery('#nrdq-cookie-notice').length > 0){
    jQuery('#nrdq-cookie-notice').remove();
  }

  if(getCookie('cookie_settings')){
  	if(jQuery('#nrdq-cookie-notice:visible').length > 0){
    	jQuery('#nrdq-cookie-notice').hide();
  	}
	} else {
  	if(jQuery('#nrdq-cookie-notice').length > 0){
    	jQuery('#nrdq-cookie-notice').show();
  	}
	}

  if(typeof ajax_object_cookie.ajax !== "undefined" && ajax_object_cookie.ajax == 'true'){
    var cookie = getCookie('cookie_settings');
  	if (cookie) {
  		var parsed = parseCookie(cookie);
    	if(parsed){
      	for(var permission = 0; permission < parsed.length; permission++){
        	if(parsed[permission].length == 2 && parsed[permission][1] == 'true'){
          	jQuery('[nrdq-cookie-permission="' + parsed[permission][0] + '"]').each(function(){
            	switch(jQuery(this).attr('data-type')){
              	case 'html':
              	  jQuery(this).before(jQuery(this).text());
              	  break;
                case 'javascript':
                  var s = document.createElement('script');
                  s.type = 'text/javascript';

                  var content = jQuery(this).text();

                  try {
      							s.appendChild(document.createTextNode(content));
      						} catch (e) {
      							s.text = code;
      						}
      						jQuery(this).before(s);
      						break;
            	}
          	});
        	}
      	}
      }
  	}
	}






  if (jQuery(window).width() < 768 || (typeof ajax_object_cookie.readmore_all !== "undefined" && ajax_object_cookie.readmore_all == '1')) {
		var readmore_data = {
			speed: 150,
	    	embedCSS: false,
			collapsedHeight: nrdq_collapsed_height,
	    	lessLink: '<a href="#" class="nrdq-read-more-link less">' + less_string + '</a>',
	    	moreLink: '<a href="#" class="nrdq-read-more-link more">' + more_string + '</a>',
		};

		jQuery('#nrdq-cookie-notice .cookie__content-wrap p').readmore(readmore_data);
	};




  jQuery(window).on('resize', debounce(function(){
    set_body_top_position();
  }, 500));


  function add_spinner_to_cookie_settings(e){
		e.append('<div class="cookie__wrap"><div class="cookie__inner"><div class="cookie__spinner"><div class="cookie__double-bounce1"></div><div class="cookie__double-bounce2"></div></div></div></div>');
	}

	function remove_spinner_from_cookie_settings(e){
		e.find('.cookie__spinner').remove();
	}

	function add_spinner_to_cookie_notice(e){
		e.append('<div class="cookie__spinner"><div class="cookie__double-bounce1"></div><div class="cookie__double-bounce2"></div></div>');

	}

	function set_cookie_settings(container, level, nonce, loader_container, e){
  	var action = 'set_cookie_status';

  	//Added loader to container
		add_spinner_to_cookie_notice(loader_container);
		container.addClass('cookie__loading');

		var check_data = [];

		if(container.find('#cookie-check').length > 0){
  		level = 0;
  		container.find('#cookie-check input[type="checkbox"]:not(:disabled)').each(function(){
    		var name = jQuery(this).attr('name');
    		var val = (jQuery(this).is(':checked')) ? '1' : '0';
    		check_data.push({ 'name': name, 'val' : val });
    		level++;
  		});
		}

		//Do AJAX call
		jQuery.ajax({
	    type: 'POST',
	    url: ajax_object_cookie.ajax_url,
	    dataType: 'json',
	    data: {
		    action: action,
		    nrdq_secure_value : nonce,
		    level: level,
		    checks: check_data
		  },
			timeout: 15000,
			success: function(data){
  			if(ajax_object_cookie.ajax == 'false'){
    			location.reload();
  			} else {
    			container.hide();
    			jQuery('body').css('margin-top', 0);
    			if(jQuery('#nrdq-cookie-settings-bg:visible').length > 0){
          	jQuery('#nrdq-cookie-settings-bg').hide();
        	}
  			}

			},
			error: function(errorThrown){
				container.html("<div class='cookie__warning'>Onbekende fout, vernieuw de pagina en probeer het nog eens</div>");
				container.show();
				nrdq_log_error(errorThrown, action);
				console.log('Error');
        console.log(errorThrown); // error
    	}
		});
		e.preventDefault();
	}

	jQuery('#nrdq-cookie-notice').on('click', '.action', function(e){
  	//Initialize AJAX variables
  	var container = jQuery(this).closest('#nrdq-cookie-notice');
		var level = parseInt(jQuery(this).attr('data-level'));
		var nonce = jQuery(this).closest('#nrdq-cookie-notice-form').find('input.nonce').val();

    set_cookie_settings(container, level, nonce, container.find('.cookie__row'), e);
	});

	jQuery('#nrdq-cookie-settings').on('click', '.action', function(e){
  	//Initialize AJAX variables
  	var container = jQuery(this).closest('#nrdq-cookie-settings');
		var level = parseInt(jQuery(this).closest('.cookie__inner').find('#nrdq-cookie-settings-form').find('[name="nrdq_cookie_settings"]:checked').val());
		var nonce = jQuery(this).closest('.cookie__inner').find('#nrdq-cookie-settings-form').find('input.nonce').val();

    set_cookie_settings(container, level, nonce, container.find('.cookie__content'), e);
	});

	jQuery('.open-cookie-settings').on('click', function(e){
  	e.preventDefault();

  	//Initialize AJAX variables
  	var container = jQuery('#nrdq-cookie-settings');
    var background = jQuery('#nrdq-cookie-settings-bg');
    container.show();
    background.show();

    if(!settings_loaded) {
      add_spinner_to_cookie_settings(container.find('.cookie__content'));

      //Do AJAX call
  		jQuery.ajax({
  	    type: 'POST',
  	    url: ajax_object_cookie.ajax_url,
  	    dataType: 'json',
  	    data: {
  		    action: 'get_cookie_settings',
  		  },
  			timeout: 15000,
  			success: function(data){
    			remove_spinner_from_cookie_settings(container.find('.cookie__content'));
    			container.find('.cookie__content').html(data);
    			settings_loaded = true;
  			},
  			error: function(errorThrown){
  				container.html("<div class='cookie__warning'>Onbekende fout, vernieuw de pagina en probeer het nog eens</div>");
  				container.show();
  				nrdq_log_error(errorThrown, 'get_cookie_settings');
  				console.log('Error');
          console.log(errorThrown); // error
      	}
		  });
		}
	});


	jQuery('#nrdq-cookie-settings-bg').on('click', function(e){
  jQuery('a.cookie__close-pop-up').click();
    e.preventDefault();
  });

	jQuery('#nrdq-cookie-settings').on('click', '.cookie__close-pop-up', function(e){
		jQuery('#nrdq-cookie-settings').hide();
		jQuery('#nrdq-cookie-settings-bg').hide();
		e.preventDefault();
	});

  //set_datalayer_variables(); Moved to PHP to try and get it above the Tag Manager Code
	set_body_top_position();
});
