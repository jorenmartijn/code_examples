/* Plugin admin dashboard JS */

(function($){  
	
 
	$(document).ready(function(){
		
		$('input[type=radio][name=lock_type]:checked').parent().siblings('.lock_explanation').show();
		$('input[type=radio][name=lock_type]:checked').closest('tr').find('.exceptions').show();
		
		$('input[type=radio][name=lock_type]').change(function() {
				$('.lock_explanation').hide();
				$('.exceptions').hide();
				$(this).parent().siblings('.lock_explanation').show();
        $(this).closest('tr').find('.exceptions').show();
    });
    
    $('#lock_form').submit(function(e) {

	    if($(this).find('input[type="submit"]').val() != "Lock") {
		    return;
	    }

	    var id = String(user.id);
	    var role = user.role;
	    var ip = user.ip;
			var lock_type = $('#lock_form input[name="lock_type"]:checked').val();
			var lock_allowed = true;
			switch(lock_type) {
		    case 'ip_lock':
	        var exceptions = $('#lock_form textarea[name="ip_lock_exceptions"]').val().replace(/\s+/g, '');
	        if (exceptions && !exceptions.includes(ip)){
		        lock_allowed = false;
	        }
	        break;
		    case 'role_lock':
			    var exceptions = $('#lock_form #role_lock_select').val();
	        if (exceptions && exceptions.indexOf(role) == -1){
		        lock_allowed = false;
	        }
					break;
		    case 'user_lock':
		      var exceptions = $('#lock_form #user_lock_select').val();
	        if (exceptions && exceptions.indexOf(id) == -1){
		        lock_allowed = false;
	        }
					break;
			}

			if (!lock_allowed){
				var confirm;
				if (lock_type == 'ip_lock'){
					confirm = window.confirm("Met de huidige instellingen zul je vanaf dit IP-adres geen toegang meer hebben tot deze website. Weet je zeker dat je door wilt gaan? ");
				} else {
					confirm = window.confirm("Met de huidige instellingen zul je met dit account geen toegang meer hebben tot deze website. Weet je zeker dat je door wilt gaan? ");
				}				
				if (confirm == false) {
				  e.preventDefault();
				}			
			}
	    
    });
		
	}); 	 
		
})(jQuery);		