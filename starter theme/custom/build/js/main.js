(function(window, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function($) {
            return factory(window, $);
        });
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(window, require('jquery'));
    } else {
        window.lity = factory(window, window.jQuery || window.Zepto);
    }
}(typeof window !== "undefined" ? window : this, function(window, $) {
    'use strict';

    var document = window.document;

    var _win = $(window);
    var _deferred = $.Deferred;
    var _html = $('html');
    var _instances = [];

    var _attrAriaHidden = 'aria-hidden';
    var _dataAriaHidden = 'lity-' + _attrAriaHidden;

    var _focusableElementsSelector = 'a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),iframe,object,embed,[contenteditable],[tabindex]:not([tabindex^="-"])';

    var _defaultOptions = {
        esc: true,
        handler: null,
        handlers: {
            image: imageHandler,
            inline: inlineHandler,
            youtube: youtubeHandler,
            vimeo: vimeoHandler,
            googlemaps: googlemapsHandler,
            facebookvideo: facebookvideoHandler,
            iframe: iframeHandler
        },
        template: '<div class="lity" role="dialog" aria-label="Dialog Window (Press escape to close)" tabindex="-1"><div class="lity-wrap" data-lity-close role="document"><div class="lity-loader" aria-hidden="true">Loading...</div><div class="lity-container"><div class="lity-content"></div><button class="lity-close" type="button" aria-label="Close (Press escape to close)" data-lity-close>&times;</button></div></div></div>'
    };

    var _imageRegexp = /(^data:image\/)|(\.(png|jpe?g|gif|svg|webp|bmp|ico|tiff?)(\?\S*)?$)/i;
    var _youtubeRegex = /(youtube(-nocookie)?\.com|youtu\.be)\/(watch\?v=|v\/|u\/|embed\/?)?([\w-]{11})(.*)?/i;
    var _vimeoRegex =  /(vimeo(pro)?.com)\/(?:[^\d]+)?(\d+)\??(.*)?$/;
    var _googlemapsRegex = /((maps|www)\.)?google\.([^\/\?]+)\/?((maps\/?)?\?)(.*)/i;
    var _facebookvideoRegex = /(facebook\.com)\/([a-z0-9_-]*)\/videos\/([0-9]*)(.*)?$/i;

    var _transitionEndEvent = (function() {
        var el = document.createElement('div');

        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        };

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return transEndEventNames[name];
            }
        }

        return false;
    })();

    function transitionEnd(element) {
        var deferred = _deferred();

        if (!_transitionEndEvent || !element.length) {
            deferred.resolve();
        } else {
            element.one(_transitionEndEvent, deferred.resolve);
            setTimeout(deferred.resolve, 500);
        }

        return deferred.promise();
    }

    function settings(currSettings, key, value) {
        if (arguments.length === 1) {
            return $.extend({}, currSettings);
        }

        if (typeof key === 'string') {
            if (typeof value === 'undefined') {
                return typeof currSettings[key] === 'undefined'
                    ? null
                    : currSettings[key];
            }

            currSettings[key] = value;
        } else {
            $.extend(currSettings, key);
        }

        return this;
    }

    function parseQueryParams(params) {
        var pairs = decodeURI(params.split('#')[0]).split('&');
        var obj = {}, p;

        for (var i = 0, n = pairs.length; i < n; i++) {
            if (!pairs[i]) {
                continue;
            }

            p = pairs[i].split('=');
            obj[p[0]] = p[1];
        }

        return obj;
    }

    function appendQueryParams(url, params) {
        return url + (url.indexOf('?') > -1 ? '&' : '?') + $.param(params);
    }

    function transferHash(originalUrl, newUrl) {
        var pos = originalUrl.indexOf('#');

        if (-1 === pos) {
            return newUrl;
        }

        if (pos > 0) {
            originalUrl = originalUrl.substr(pos);
        }

        return newUrl + originalUrl;
    }

    function error(msg) {
        return $('<span class="lity-error"/>').append(msg);
    }

    function imageHandler(target, instance) {
        var desc = (instance.opener() && instance.opener().data('lity-desc')) || 'Image with no description';
        var img = $('<img src="' + target + '" alt="' + desc + '"/>');
        var deferred = _deferred();
        var failed = function() {
            deferred.reject(error('Failed loading image'));
        };

        img
            .on('load', function() {
                if (this.naturalWidth === 0) {
                    return failed();
                }

                deferred.resolve(img);
            })
            .on('error', failed)
        ;

        return deferred.promise();
    }

    imageHandler.test = function(target) {
        return _imageRegexp.test(target);
    };

    function inlineHandler(target, instance) {
        var el, placeholder, hasHideClass;

        try {
            el = $(target);
        } catch (e) {
            return false;
        }

        if (!el.length) {
            return false;
        }

        placeholder = $('<i style="display:none !important"/>');
        hasHideClass = el.hasClass('lity-hide');

        instance
            .element()
            .one('lity:remove', function() {
                placeholder
                    .before(el)
                    .remove()
                ;

                if (hasHideClass && !el.closest('.lity-content').length) {
                    el.addClass('lity-hide');
                }
            })
        ;

        return el
            .removeClass('lity-hide')
            .after(placeholder)
        ;
    }

    function youtubeHandler(target) {
        var matches = _youtubeRegex.exec(target);

        if (!matches) {
            return false;
        }

        return iframeHandler(
            transferHash(
                target,
                appendQueryParams(
                    'https://www.youtube' + (matches[2] || '') + '.com/embed/' + matches[4],
                    $.extend(
                        {
                            autoplay: 1
                        },
                        parseQueryParams(matches[5] || '')
                    )
                )
            )
        );
    }

    function vimeoHandler(target) {
        var matches = _vimeoRegex.exec(target);

        if (!matches) {
            return false;
        }

        return iframeHandler(
            transferHash(
                target,
                appendQueryParams(
                    'https://player.vimeo.com/video/' + matches[3],
                    $.extend(
                        {
                            autoplay: 1
                        },
                        parseQueryParams(matches[4] || '')
                    )
                )
            )
        );
    }

    function facebookvideoHandler(target) {
        var matches = _facebookvideoRegex.exec(target);

        if (!matches) {
            return false;
        }

        if (0 !== target.indexOf('http')) {
            target = 'https:' + target;
        }

        return iframeHandler(
            transferHash(
                target,
                appendQueryParams(
                    'https://www.facebook.com/plugins/video.php?href=' + target,
                    $.extend(
                        {
                            autoplay: 1
                        },
                        parseQueryParams(matches[4] || '')
                    )
                )
            )
        );
    }

    function googlemapsHandler(target) {
        var matches = _googlemapsRegex.exec(target);

        if (!matches) {
            return false;
        }

        return iframeHandler(
            transferHash(
                target,
                appendQueryParams(
                    'https://www.google.' + matches[3] + '/maps?' + matches[6],
                    {
                        output: matches[6].indexOf('layer=c') > 0 ? 'svembed' : 'embed'
                    }
                )
            )
        );
    }

    function iframeHandler(target) {
        return '<div class="lity-iframe-container"><iframe frameborder="0" allowfullscreen src="' + target + '"/></div>';
    }

    function winHeight() {
        return document.documentElement.clientHeight
            ? document.documentElement.clientHeight
            : Math.round(_win.height());
    }

    function keydown(e) {
        var current = currentInstance();

        if (!current) {
            return;
        }

        // ESC key
        if (e.keyCode === 27 && !!current.options('esc')) {
            current.close();
        }

        // TAB key
        if (e.keyCode === 9) {
            handleTabKey(e, current);
        }
    }

    function handleTabKey(e, instance) {
        var focusableElements = instance.element().find(_focusableElementsSelector);
        var focusedIndex = focusableElements.index(document.activeElement);

        if (e.shiftKey && focusedIndex <= 0) {
            focusableElements.get(focusableElements.length - 1).focus();
            e.preventDefault();
        } else if (!e.shiftKey && focusedIndex === focusableElements.length - 1) {
            focusableElements.get(0).focus();
            e.preventDefault();
        }
    }

    function resize() {
        $.each(_instances, function(i, instance) {
            instance.resize();
        });
    }

    function registerInstance(instanceToRegister) {
        if (1 === _instances.unshift(instanceToRegister)) {
            _html.addClass('lity-active');

            _win
                .on({
                    resize: resize,
                    keydown: keydown
                })
            ;
        }

        $('body > *').not(instanceToRegister.element())
            .addClass('lity-hidden')
            .each(function() {
                var el = $(this);

                if (undefined !== el.data(_dataAriaHidden)) {
                    return;
                }

                el.data(_dataAriaHidden, el.attr(_attrAriaHidden) || null);
            })
            .attr(_attrAriaHidden, 'true')
        ;
    }

    function removeInstance(instanceToRemove) {
        var show;

        instanceToRemove
            .element()
            .attr(_attrAriaHidden, 'true')
        ;

        if (1 === _instances.length) {
            _html.removeClass('lity-active');

            _win
                .off({
                    resize: resize,
                    keydown: keydown
                })
            ;
        }

        _instances = $.grep(_instances, function(instance) {
            return instanceToRemove !== instance;
        });

        if (!!_instances.length) {
            show = _instances[0].element();
        } else {
            show = $('.lity-hidden');
        }

        show
            .removeClass('lity-hidden')
            .each(function() {
                var el = $(this), oldAttr = el.data(_dataAriaHidden);

                if (!oldAttr) {
                    el.removeAttr(_attrAriaHidden);
                } else {
                    el.attr(_attrAriaHidden, oldAttr);
                }

                el.removeData(_dataAriaHidden);
            })
        ;
    }

    function currentInstance() {
        if (0 === _instances.length) {
            return null;
        }

        return _instances[0];
    }

    function factory(target, instance, handlers, preferredHandler) {
        var handler = 'inline', content;

        var currentHandlers = $.extend({}, handlers);

        if (preferredHandler && currentHandlers[preferredHandler]) {
            content = currentHandlers[preferredHandler](target, instance);
            handler = preferredHandler;
        } else {
            // Run inline and iframe handlers after all other handlers
            $.each(['inline', 'iframe'], function(i, name) {
                delete currentHandlers[name];

                currentHandlers[name] = handlers[name];
            });

            $.each(currentHandlers, function(name, currentHandler) {
                // Handler might be "removed" by setting callback to null
                if (!currentHandler) {
                    return true;
                }

                if (
                    currentHandler.test &&
                    !currentHandler.test(target, instance)
                ) {
                    return true;
                }

                content = currentHandler(target, instance);

                if (false !== content) {
                    handler = name;
                    return false;
                }
            });
        }

        return {handler: handler, content: content || ''};
    }

    function Lity(target, options, opener, activeElement) {
        var self = this;
        var result;
        var isReady = false;
        var isClosed = false;
        var element;
        var content;

        options = $.extend(
            {},
            _defaultOptions,
            options
        );

        element = $(options.template);

        // -- API --

        self.element = function() {
            return element;
        };

        self.opener = function() {
            return opener;
        };

        self.options  = $.proxy(settings, self, options);
        self.handlers = $.proxy(settings, self, options.handlers);

        self.resize = function() {
            if (!isReady || isClosed) {
                return;
            }

            content
                .css('max-height', winHeight() + 'px')
                .trigger('lity:resize', [self])
            ;
        };

        self.close = function() {
            if (!isReady || isClosed) {
                return;
            }

            isClosed = true;

            removeInstance(self);

            var deferred = _deferred();

            // We return focus only if the current focus is inside this instance
            if (
                activeElement &&
                (
                    document.activeElement === element[0] ||
                    $.contains(element[0], document.activeElement)
                )
            ) {
                try {
                    activeElement.focus();
                } catch (e) {
                    // Ignore exceptions, eg. for SVG elements which can't be
                    // focused in IE11
                }
            }

            content.trigger('lity:close', [self]);

            element
                .removeClass('lity-opened')
                .addClass('lity-closed')
            ;

            transitionEnd(content.add(element))
                .always(function() {
                    content.trigger('lity:remove', [self]);
                    element.remove();
                    element = undefined;
                    deferred.resolve();
                })
            ;

            return deferred.promise();
        };

        // -- Initialization --

        result = factory(target, self, options.handlers, options.handler);

        element
            .attr(_attrAriaHidden, 'false')
            .addClass('lity-loading lity-opened lity-' + result.handler)
            .appendTo('body')
            .focus()
            .on('click', '[data-lity-close]', function(e) {
                if ($(e.target).is('[data-lity-close]')) {
                    self.close();
                }
            })
            .trigger('lity:open', [self])
        ;

        registerInstance(self);

        $.when(result.content)
            .always(ready)
        ;

        function ready(result) {
            content = $(result)
                .css('max-height', winHeight() + 'px')
            ;

            element
                .find('.lity-loader')
                .each(function() {
                    var loader = $(this);

                    transitionEnd(loader)
                        .always(function() {
                            loader.remove();
                        })
                    ;
                })
            ;

            element
                .removeClass('lity-loading')
                .find('.lity-content')
                .empty()
                .append(content)
            ;

            isReady = true;

            content
                .trigger('lity:ready', [self])
            ;
        }
    }

    function lity(target, options, opener) {
        if (!target.preventDefault) {
            opener = $(opener);
        } else {
            target.preventDefault();
            opener = $(this);
            target = opener.data('lity-target') || opener.attr('href') || opener.attr('src');
        }

        var instance = new Lity(
            target,
            $.extend(
                {},
                opener.data('lity-options') || opener.data('lity'),
                options
            ),
            opener,
            document.activeElement
        );

        if (!target.preventDefault) {
            return instance;
        }
    }

    lity.version  = '@VERSION';
    lity.options  = $.proxy(settings, lity, _defaultOptions);
    lity.handlers = $.proxy(settings, lity, _defaultOptions.handlers);
    lity.current  = currentInstance;

    $(document).on('click.lity', '[data-lity]', lity);

    return lity;
}));

/*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
;(function (factory) { 
if (typeof define === 'function' && define.amd) { 
 // AMD. Register as an anonymous module. 
 define(['jquery'], factory); 
 } else if (typeof exports === 'object') { 
 // Node/CommonJS 
 factory(require('jquery')); 
 } else { 
 // Browser globals 
 factory(window.jQuery || window.Zepto); 
 } 
 }(function($) { 

/*>>core*/
/**
 * 
 * Magnific Popup Core JS file
 * 
 */


/**
 * Private static constants
 */
var CLOSE_EVENT = 'Close',
	BEFORE_CLOSE_EVENT = 'BeforeClose',
	AFTER_CLOSE_EVENT = 'AfterClose',
	BEFORE_APPEND_EVENT = 'BeforeAppend',
	MARKUP_PARSE_EVENT = 'MarkupParse',
	OPEN_EVENT = 'Open',
	CHANGE_EVENT = 'Change',
	NS = 'mfp',
	EVENT_NS = '.' + NS,
	READY_CLASS = 'mfp-ready',
	REMOVING_CLASS = 'mfp-removing',
	PREVENT_CLOSE_CLASS = 'mfp-prevent-close';


/**
 * Private vars 
 */
/*jshint -W079 */
var mfp, // As we have only one instance of MagnificPopup object, we define it locally to not to use 'this'
	MagnificPopup = function(){},
	_isJQ = !!(window.jQuery),
	_prevStatus,
	_window = $(window),
	_document,
	_prevContentType,
	_wrapClasses,
	_currPopupType;


/**
 * Private functions
 */
var _mfpOn = function(name, f) {
		mfp.ev.on(NS + name + EVENT_NS, f);
	},
	_getEl = function(className, appendTo, html, raw) {
		var el = document.createElement('div');
		el.className = 'mfp-'+className;
		if(html) {
			el.innerHTML = html;
		}
		if(!raw) {
			el = $(el);
			if(appendTo) {
				el.appendTo(appendTo);
			}
		} else if(appendTo) {
			appendTo.appendChild(el);
		}
		return el;
	},
	_mfpTrigger = function(e, data) {
		mfp.ev.triggerHandler(NS + e, data);

		if(mfp.st.callbacks) {
			// converts "mfpEventName" to "eventName" callback and triggers it if it's present
			e = e.charAt(0).toLowerCase() + e.slice(1);
			if(mfp.st.callbacks[e]) {
				mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [data]);
			}
		}
	},
	_getCloseBtn = function(type) {
		if(type !== _currPopupType || !mfp.currTemplate.closeBtn) {
			mfp.currTemplate.closeBtn = $( mfp.st.closeMarkup.replace('%title%', mfp.st.tClose ) );
			_currPopupType = type;
		}
		return mfp.currTemplate.closeBtn;
	},
	// Initialize Magnific Popup only when called at least once
	_checkInstance = function() {
		if(!$.magnificPopup.instance) {
			/*jshint -W020 */
			mfp = new MagnificPopup();
			mfp.init();
			$.magnificPopup.instance = mfp;
		}
	},
	// CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
	supportsTransitions = function() {
		var s = document.createElement('p').style, // 's' for style. better to create an element if body yet to exist
			v = ['ms','O','Moz','Webkit']; // 'v' for vendor

		if( s['transition'] !== undefined ) {
			return true; 
		}
			
		while( v.length ) {
			if( v.pop() + 'Transition' in s ) {
				return true;
			}
		}
				
		return false;
	};



/**
 * Public functions
 */
MagnificPopup.prototype = {

	constructor: MagnificPopup,

	/**
	 * Initializes Magnific Popup plugin. 
	 * This function is triggered only once when $.fn.magnificPopup or $.magnificPopup is executed
	 */
	init: function() {
		var appVersion = navigator.appVersion;
		mfp.isLowIE = mfp.isIE8 = document.all && !document.addEventListener;
		mfp.isAndroid = (/android/gi).test(appVersion);
		mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);
		mfp.supportsTransition = supportsTransitions();

		// We disable fixed positioned lightbox on devices that don't handle it nicely.
		// If you know a better way of detecting this - let me know.
		mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent) );
		_document = $(document);

		mfp.popupsCache = {};
	},

	/**
	 * Opens popup
	 * @param  data [description]
	 */
	open: function(data) {

		var i;

		if(data.isObj === false) { 
			// convert jQuery collection to array to avoid conflicts later
			mfp.items = data.items.toArray();

			mfp.index = 0;
			var items = data.items,
				item;
			for(i = 0; i < items.length; i++) {
				item = items[i];
				if(item.parsed) {
					item = item.el[0];
				}
				if(item === data.el[0]) {
					mfp.index = i;
					break;
				}
			}
		} else {
			mfp.items = $.isArray(data.items) ? data.items : [data.items];
			mfp.index = data.index || 0;
		}

		// if popup is already opened - we just update the content
		if(mfp.isOpen) {
			mfp.updateItemHTML();
			return;
		}
		
		mfp.types = []; 
		_wrapClasses = '';
		if(data.mainEl && data.mainEl.length) {
			mfp.ev = data.mainEl.eq(0);
		} else {
			mfp.ev = _document;
		}

		if(data.key) {
			if(!mfp.popupsCache[data.key]) {
				mfp.popupsCache[data.key] = {};
			}
			mfp.currTemplate = mfp.popupsCache[data.key];
		} else {
			mfp.currTemplate = {};
		}



		mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data ); 
		mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos;

		if(mfp.st.modal) {
			mfp.st.closeOnContentClick = false;
			mfp.st.closeOnBgClick = false;
			mfp.st.showCloseBtn = false;
			mfp.st.enableEscapeKey = false;
		}
		

		// Building markup
		// main containers are created only once
		if(!mfp.bgOverlay) {

			// Dark overlay
			mfp.bgOverlay = _getEl('bg').on('click'+EVENT_NS, function() {
				mfp.close();
			});

			mfp.wrap = _getEl('wrap').attr('tabindex', -1).on('click'+EVENT_NS, function(e) {
				if(mfp._checkIfClose(e.target)) {
					mfp.close();
				}
			});

			mfp.container = _getEl('container', mfp.wrap);
		}

		mfp.contentContainer = _getEl('content');
		if(mfp.st.preloader) {
			mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
		}


		// Initializing modules
		var modules = $.magnificPopup.modules;
		for(i = 0; i < modules.length; i++) {
			var n = modules[i];
			n = n.charAt(0).toUpperCase() + n.slice(1);
			mfp['init'+n].call(mfp);
		}
		_mfpTrigger('BeforeOpen');


		if(mfp.st.showCloseBtn) {
			// Close button
			if(!mfp.st.closeBtnInside) {
				mfp.wrap.append( _getCloseBtn() );
			} else {
				_mfpOn(MARKUP_PARSE_EVENT, function(e, template, values, item) {
					values.close_replaceWith = _getCloseBtn(item.type);
				});
				_wrapClasses += ' mfp-close-btn-in';
			}
		}

		if(mfp.st.alignTop) {
			_wrapClasses += ' mfp-align-top';
		}

	

		if(mfp.fixedContentPos) {
			mfp.wrap.css({
				overflow: mfp.st.overflowY,
				overflowX: 'hidden',
				overflowY: mfp.st.overflowY
			});
		} else {
			mfp.wrap.css({ 
				top: _window.scrollTop(),
				position: 'absolute'
			});
		}
		if( mfp.st.fixedBgPos === false || (mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos) ) {
			mfp.bgOverlay.css({
				height: _document.height(),
				position: 'absolute'
			});
		}

		

		if(mfp.st.enableEscapeKey) {
			// Close on ESC key
			_document.on('keyup' + EVENT_NS, function(e) {
				if(e.keyCode === 27) {
					mfp.close();
				}
			});
		}

		_window.on('resize' + EVENT_NS, function() {
			mfp.updateSize();
		});


		if(!mfp.st.closeOnContentClick) {
			_wrapClasses += ' mfp-auto-cursor';
		}
		
		if(_wrapClasses)
			mfp.wrap.addClass(_wrapClasses);


		// this triggers recalculation of layout, so we get it once to not to trigger twice
		var windowHeight = mfp.wH = _window.height();

		
		var windowStyles = {};

		if( mfp.fixedContentPos ) {
            if(mfp._hasScrollBar(windowHeight)){
                var s = mfp._getScrollbarSize();
                if(s) {
                    windowStyles.marginRight = s;
                }
            }
        }

		if(mfp.fixedContentPos) {
			if(!mfp.isIE7) {
				windowStyles.overflow = 'hidden';
			} else {
				// ie7 double-scroll bug
				$('body, html').css('overflow', 'hidden');
			}
		}

		
		
		var classesToadd = mfp.st.mainClass;
		if(mfp.isIE7) {
			classesToadd += ' mfp-ie7';
		}
		if(classesToadd) {
			mfp._addClassToMFP( classesToadd );
		}

		// add content
		mfp.updateItemHTML();

		_mfpTrigger('BuildControls');

		// remove scrollbar, add margin e.t.c
		$('html').css(windowStyles);
		
		// add everything to DOM
		mfp.bgOverlay.add(mfp.wrap).prependTo( mfp.st.prependTo || $(document.body) );

		// Save last focused element
		mfp._lastFocusedEl = document.activeElement;
		
		// Wait for next cycle to allow CSS transition
		setTimeout(function() {
			
			if(mfp.content) {
				mfp._addClassToMFP(READY_CLASS);
				mfp._setFocus();
			} else {
				// if content is not defined (not loaded e.t.c) we add class only for BG
				mfp.bgOverlay.addClass(READY_CLASS);
			}
			
			// Trap the focus in popup
			_document.on('focusin' + EVENT_NS, mfp._onFocusIn);

		}, 16);

		mfp.isOpen = true;
		mfp.updateSize(windowHeight);
		_mfpTrigger(OPEN_EVENT);

		return data;
	},

	/**
	 * Closes the popup
	 */
	close: function() {
		if(!mfp.isOpen) return;
		_mfpTrigger(BEFORE_CLOSE_EVENT);

		mfp.isOpen = false;
		// for CSS3 animation
		if(mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition )  {
			mfp._addClassToMFP(REMOVING_CLASS);
			setTimeout(function() {
				mfp._close();
			}, mfp.st.removalDelay);
		} else {
			mfp._close();
		}
	},

	/**
	 * Helper for close() function
	 */
	_close: function() {
		_mfpTrigger(CLOSE_EVENT);

		var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';

		mfp.bgOverlay.detach();
		mfp.wrap.detach();
		mfp.container.empty();

		if(mfp.st.mainClass) {
			classesToRemove += mfp.st.mainClass + ' ';
		}

		mfp._removeClassFromMFP(classesToRemove);

		if(mfp.fixedContentPos) {
			var windowStyles = {marginRight: ''};
			if(mfp.isIE7) {
				$('body, html').css('overflow', '');
			} else {
				windowStyles.overflow = '';
			}
			$('html').css(windowStyles);
		}
		
		_document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
		mfp.ev.off(EVENT_NS);

		// clean up DOM elements that aren't removed
		mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
		mfp.bgOverlay.attr('class', 'mfp-bg');
		mfp.container.attr('class', 'mfp-container');

		// remove close button from target element
		if(mfp.st.showCloseBtn &&
		(!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
			if(mfp.currTemplate.closeBtn)
				mfp.currTemplate.closeBtn.detach();
		}


		if(mfp.st.autoFocusLast && mfp._lastFocusedEl) {
			$(mfp._lastFocusedEl).focus(); // put tab focus back
		}
		mfp.currItem = null;	
		mfp.content = null;
		mfp.currTemplate = null;
		mfp.prevHeight = 0;

		_mfpTrigger(AFTER_CLOSE_EVENT);
	},
	
	updateSize: function(winHeight) {

		if(mfp.isIOS) {
			// fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
			var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
			var height = window.innerHeight * zoomLevel;
			mfp.wrap.css('height', height);
			mfp.wH = height;
		} else {
			mfp.wH = winHeight || _window.height();
		}
		// Fixes #84: popup incorrectly positioned with position:relative on body
		if(!mfp.fixedContentPos) {
			mfp.wrap.css('height', mfp.wH);
		}

		_mfpTrigger('Resize');

	},

	/**
	 * Set content of popup based on current index
	 */
	updateItemHTML: function() {
		var item = mfp.items[mfp.index];

		// Detach and perform modifications
		mfp.contentContainer.detach();

		if(mfp.content)
			mfp.content.detach();

		if(!item.parsed) {
			item = mfp.parseEl( mfp.index );
		}

		var type = item.type;

		_mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]);
		// BeforeChange event works like so:
		// _mfpOn('BeforeChange', function(e, prevType, newType) { });

		mfp.currItem = item;

		if(!mfp.currTemplate[type]) {
			var markup = mfp.st[type] ? mfp.st[type].markup : false;

			// allows to modify markup
			_mfpTrigger('FirstMarkupParse', markup);

			if(markup) {
				mfp.currTemplate[type] = $(markup);
			} else {
				// if there is no markup found we just define that template is parsed
				mfp.currTemplate[type] = true;
			}
		}

		if(_prevContentType && _prevContentType !== item.type) {
			mfp.container.removeClass('mfp-'+_prevContentType+'-holder');
		}

		var newContent = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]);
		mfp.appendContent(newContent, type);

		item.preloaded = true;

		_mfpTrigger(CHANGE_EVENT, item);
		_prevContentType = item.type;

		// Append container back after its content changed
		mfp.container.prepend(mfp.contentContainer);

		_mfpTrigger('AfterChange');
	},


	/**
	 * Set HTML content of popup
	 */
	appendContent: function(newContent, type) {
		mfp.content = newContent;

		if(newContent) {
			if(mfp.st.showCloseBtn && mfp.st.closeBtnInside &&
				mfp.currTemplate[type] === true) {
				// if there is no markup, we just append close button element inside
				if(!mfp.content.find('.mfp-close').length) {
					mfp.content.append(_getCloseBtn());
				}
			} else {
				mfp.content = newContent;
			}
		} else {
			mfp.content = '';
		}

		_mfpTrigger(BEFORE_APPEND_EVENT);
		mfp.container.addClass('mfp-'+type+'-holder');

		mfp.contentContainer.append(mfp.content);
	},


	/**
	 * Creates Magnific Popup data object based on given data
	 * @param  {int} index Index of item to parse
	 */
	parseEl: function(index) {
		var item = mfp.items[index],
			type;

		if(item.tagName) {
			item = { el: $(item) };
		} else {
			type = item.type;
			item = { data: item, src: item.src };
		}

		if(item.el) {
			var types = mfp.types;

			// check for 'mfp-TYPE' class
			for(var i = 0; i < types.length; i++) {
				if( item.el.hasClass('mfp-'+types[i]) ) {
					type = types[i];
					break;
				}
			}

			item.src = item.el.attr('data-mfp-src');
			if(!item.src) {
				item.src = item.el.attr('href');
			}
		}

		item.type = type || mfp.st.type || 'inline';
		item.index = index;
		item.parsed = true;
		mfp.items[index] = item;
		_mfpTrigger('ElementParse', item);

		return mfp.items[index];
	},


	/**
	 * Initializes single popup or a group of popups
	 */
	addGroup: function(el, options) {
		var eHandler = function(e) {
			e.mfpEl = this;
			mfp._openClick(e, el, options);
		};

		if(!options) {
			options = {};
		}

		var eName = 'click.magnificPopup';
		options.mainEl = el;

		if(options.items) {
			options.isObj = true;
			el.off(eName).on(eName, eHandler);
		} else {
			options.isObj = false;
			if(options.delegate) {
				el.off(eName).on(eName, options.delegate , eHandler);
			} else {
				options.items = el;
				el.off(eName).on(eName, eHandler);
			}
		}
	},
	_openClick: function(e, el, options) {
		var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick;


		if(!midClick && ( e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey ) ) {
			return;
		}

		var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn;

		if(disableOn) {
			if($.isFunction(disableOn)) {
				if( !disableOn.call(mfp) ) {
					return true;
				}
			} else { // else it's number
				if( _window.width() < disableOn ) {
					return true;
				}
			}
		}

		if(e.type) {
			e.preventDefault();

			// This will prevent popup from closing if element is inside and popup is already opened
			if(mfp.isOpen) {
				e.stopPropagation();
			}
		}

		options.el = $(e.mfpEl);
		if(options.delegate) {
			options.items = el.find(options.delegate);
		}
		mfp.open(options);
	},


	/**
	 * Updates text on preloader
	 */
	updateStatus: function(status, text) {

		if(mfp.preloader) {
			if(_prevStatus !== status) {
				mfp.container.removeClass('mfp-s-'+_prevStatus);
			}

			if(!text && status === 'loading') {
				text = mfp.st.tLoading;
			}

			var data = {
				status: status,
				text: text
			};
			// allows to modify status
			_mfpTrigger('UpdateStatus', data);

			status = data.status;
			text = data.text;

			mfp.preloader.html(text);

			mfp.preloader.find('a').on('click', function(e) {
				e.stopImmediatePropagation();
			});

			mfp.container.addClass('mfp-s-'+status);
			_prevStatus = status;
		}
	},


	/*
		"Private" helpers that aren't private at all
	 */
	// Check to close popup or not
	// "target" is an element that was clicked
	_checkIfClose: function(target) {

		if($(target).hasClass(PREVENT_CLOSE_CLASS)) {
			return;
		}

		var closeOnContent = mfp.st.closeOnContentClick;
		var closeOnBg = mfp.st.closeOnBgClick;

		if(closeOnContent && closeOnBg) {
			return true;
		} else {

			// We close the popup if click is on close button or on preloader. Or if there is no content.
			if(!mfp.content || $(target).hasClass('mfp-close') || (mfp.preloader && target === mfp.preloader[0]) ) {
				return true;
			}

			// if click is outside the content
			if(  (target !== mfp.content[0] && !$.contains(mfp.content[0], target))  ) {
				if(closeOnBg) {
					// last check, if the clicked element is in DOM, (in case it's removed onclick)
					if( $.contains(document, target) ) {
						return true;
					}
				}
			} else if(closeOnContent) {
				return true;
			}

		}
		return false;
	},
	_addClassToMFP: function(cName) {
		mfp.bgOverlay.addClass(cName);
		mfp.wrap.addClass(cName);
	},
	_removeClassFromMFP: function(cName) {
		this.bgOverlay.removeClass(cName);
		mfp.wrap.removeClass(cName);
	},
	_hasScrollBar: function(winHeight) {
		return (  (mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height()) );
	},
	_setFocus: function() {
		(mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus();
	},
	_onFocusIn: function(e) {
		if( e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target) ) {
			mfp._setFocus();
			return false;
		}
	},
	_parseMarkup: function(template, values, item) {
		var arr;
		if(item.data) {
			values = $.extend(item.data, values);
		}
		_mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item] );

		$.each(values, function(key, value) {
			if(value === undefined || value === false) {
				return true;
			}
			arr = key.split('_');
			if(arr.length > 1) {
				var el = template.find(EVENT_NS + '-'+arr[0]);

				if(el.length > 0) {
					var attr = arr[1];
					if(attr === 'replaceWith') {
						if(el[0] !== value[0]) {
							el.replaceWith(value);
						}
					} else if(attr === 'img') {
						if(el.is('img')) {
							el.attr('src', value);
						} else {
							el.replaceWith( $('<img>').attr('src', value).attr('class', el.attr('class')) );
						}
					} else {
						el.attr(arr[1], value);
					}
				}

			} else {
				template.find(EVENT_NS + '-'+key).html(value);
			}
		});
	},

	_getScrollbarSize: function() {
		// thx David
		if(mfp.scrollbarSize === undefined) {
			var scrollDiv = document.createElement("div");
			scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
			document.body.appendChild(scrollDiv);
			mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
			document.body.removeChild(scrollDiv);
		}
		return mfp.scrollbarSize;
	}

}; /* MagnificPopup core prototype end */




/**
 * Public static functions
 */
$.magnificPopup = {
	instance: null,
	proto: MagnificPopup.prototype,
	modules: [],

	open: function(options, index) {
		_checkInstance();

		if(!options) {
			options = {};
		} else {
			options = $.extend(true, {}, options);
		}

		options.isObj = true;
		options.index = index || 0;
		return this.instance.open(options);
	},

	close: function() {
		return $.magnificPopup.instance && $.magnificPopup.instance.close();
	},

	registerModule: function(name, module) {
		if(module.options) {
			$.magnificPopup.defaults[name] = module.options;
		}
		$.extend(this.proto, module.proto);
		this.modules.push(name);
	},

	defaults: {

		// Info about options is in docs:
		// http://dimsemenov.com/plugins/magnific-popup/documentation.html#options

		disableOn: 0,

		key: null,

		midClick: false,

		mainClass: '',

		preloader: true,

		focus: '', // CSS selector of input to focus after popup is opened

		closeOnContentClick: false,

		closeOnBgClick: true,

		closeBtnInside: true,

		showCloseBtn: true,

		enableEscapeKey: true,

		modal: false,

		alignTop: false,

		removalDelay: 0,

		prependTo: null,

		fixedContentPos: 'auto',

		fixedBgPos: 'auto',

		overflowY: 'auto',

		closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',

		tClose: 'Close (Esc)',

		tLoading: 'Loading...',

		autoFocusLast: true

	}
};



$.fn.magnificPopup = function(options) {
	_checkInstance();

	var jqEl = $(this);

	// We call some API method of first param is a string
	if (typeof options === "string" ) {

		if(options === 'open') {
			var items,
				itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup,
				index = parseInt(arguments[1], 10) || 0;

			if(itemOpts.items) {
				items = itemOpts.items[index];
			} else {
				items = jqEl;
				if(itemOpts.delegate) {
					items = items.find(itemOpts.delegate);
				}
				items = items.eq( index );
			}
			mfp._openClick({mfpEl:items}, jqEl, itemOpts);
		} else {
			if(mfp.isOpen)
				mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1));
		}

	} else {
		// clone options obj
		options = $.extend(true, {}, options);

		/*
		 * As Zepto doesn't support .data() method for objects
		 * and it works only in normal browsers
		 * we assign "options" object directly to the DOM element. FTW!
		 */
		if(_isJQ) {
			jqEl.data('magnificPopup', options);
		} else {
			jqEl[0].magnificPopup = options;
		}

		mfp.addGroup(jqEl, options);

	}
	return jqEl;
};

/*>>core*/

/*>>inline*/

var INLINE_NS = 'inline',
	_hiddenClass,
	_inlinePlaceholder,
	_lastInlineElement,
	_putInlineElementsBack = function() {
		if(_lastInlineElement) {
			_inlinePlaceholder.after( _lastInlineElement.addClass(_hiddenClass) ).detach();
			_lastInlineElement = null;
		}
	};

$.magnificPopup.registerModule(INLINE_NS, {
	options: {
		hiddenClass: 'hide', // will be appended with `mfp-` prefix
		markup: '',
		tNotFound: 'Content not found'
	},
	proto: {

		initInline: function() {
			mfp.types.push(INLINE_NS);

			_mfpOn(CLOSE_EVENT+'.'+INLINE_NS, function() {
				_putInlineElementsBack();
			});
		},

		getInline: function(item, template) {

			_putInlineElementsBack();

			if(item.src) {
				var inlineSt = mfp.st.inline,
					el = $(item.src);

				if(el.length) {

					// If target element has parent - we replace it with placeholder and put it back after popup is closed
					var parent = el[0].parentNode;
					if(parent && parent.tagName) {
						if(!_inlinePlaceholder) {
							_hiddenClass = inlineSt.hiddenClass;
							_inlinePlaceholder = _getEl(_hiddenClass);
							_hiddenClass = 'mfp-'+_hiddenClass;
						}
						// replace target inline element with placeholder
						_lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
					}

					mfp.updateStatus('ready');
				} else {
					mfp.updateStatus('error', inlineSt.tNotFound);
					el = $('<div>');
				}

				item.inlineElement = el;
				return el;
			}

			mfp.updateStatus('ready');
			mfp._parseMarkup(template, {}, item);
			return template;
		}
	}
});

/*>>inline*/

/*>>ajax*/
var AJAX_NS = 'ajax',
	_ajaxCur,
	_removeAjaxCursor = function() {
		if(_ajaxCur) {
			$(document.body).removeClass(_ajaxCur);
		}
	},
	_destroyAjaxRequest = function() {
		_removeAjaxCursor();
		if(mfp.req) {
			mfp.req.abort();
		}
	};

$.magnificPopup.registerModule(AJAX_NS, {

	options: {
		settings: null,
		cursor: 'mfp-ajax-cur',
		tError: '<a href="%url%">The content</a> could not be loaded.'
	},

	proto: {
		initAjax: function() {
			mfp.types.push(AJAX_NS);
			_ajaxCur = mfp.st.ajax.cursor;

			_mfpOn(CLOSE_EVENT+'.'+AJAX_NS, _destroyAjaxRequest);
			_mfpOn('BeforeChange.' + AJAX_NS, _destroyAjaxRequest);
		},
		getAjax: function(item) {

			if(_ajaxCur) {
				$(document.body).addClass(_ajaxCur);
			}

			mfp.updateStatus('loading');

			var opts = $.extend({
				url: item.src,
				success: function(data, textStatus, jqXHR) {
					var temp = {
						data:data,
						xhr:jqXHR
					};

					_mfpTrigger('ParseAjax', temp);

					mfp.appendContent( $(temp.data), AJAX_NS );

					item.finished = true;

					_removeAjaxCursor();

					mfp._setFocus();

					setTimeout(function() {
						mfp.wrap.addClass(READY_CLASS);
					}, 16);

					mfp.updateStatus('ready');

					_mfpTrigger('AjaxContentAdded');
				},
				error: function() {
					_removeAjaxCursor();
					item.finished = item.loadError = true;
					mfp.updateStatus('error', mfp.st.ajax.tError.replace('%url%', item.src));
				}
			}, mfp.st.ajax.settings);

			mfp.req = $.ajax(opts);

			return '';
		}
	}
});

/*>>ajax*/

/*>>image*/
var _imgInterval,
	_getTitle = function(item) {
		if(item.data && item.data.title !== undefined)
			return item.data.title;

		var src = mfp.st.image.titleSrc;

		if(src) {
			if($.isFunction(src)) {
				return src.call(mfp, item);
			} else if(item.el) {
				return item.el.attr(src) || '';
			}
		}
		return '';
	};

$.magnificPopup.registerModule('image', {

	options: {
		markup: '<div class="mfp-figure">'+
					'<div class="mfp-close"></div>'+
					'<figure>'+
						'<div class="mfp-img"></div>'+
						'<figcaption>'+
							'<div class="mfp-bottom-bar">'+
								'<div class="mfp-title"></div>'+
								'<div class="mfp-counter"></div>'+
							'</div>'+
						'</figcaption>'+
					'</figure>'+
				'</div>',
		cursor: 'mfp-zoom-out-cur',
		titleSrc: 'title',
		verticalFit: true,
		tError: '<a href="%url%">The image</a> could not be loaded.'
	},

	proto: {
		initImage: function() {
			var imgSt = mfp.st.image,
				ns = '.image';

			mfp.types.push('image');

			_mfpOn(OPEN_EVENT+ns, function() {
				if(mfp.currItem.type === 'image' && imgSt.cursor) {
					$(document.body).addClass(imgSt.cursor);
				}
			});

			_mfpOn(CLOSE_EVENT+ns, function() {
				if(imgSt.cursor) {
					$(document.body).removeClass(imgSt.cursor);
				}
				_window.off('resize' + EVENT_NS);
			});

			_mfpOn('Resize'+ns, mfp.resizeImage);
			if(mfp.isLowIE) {
				_mfpOn('AfterChange', mfp.resizeImage);
			}
		},
		resizeImage: function() {
			var item = mfp.currItem;
			if(!item || !item.img) return;

			if(mfp.st.image.verticalFit) {
				var decr = 0;
				// fix box-sizing in ie7/8
				if(mfp.isLowIE) {
					decr = parseInt(item.img.css('padding-top'), 10) + parseInt(item.img.css('padding-bottom'),10);
				}
				item.img.css('max-height', mfp.wH-decr);
			}
		},
		_onImageHasSize: function(item) {
			if(item.img) {

				item.hasSize = true;

				if(_imgInterval) {
					clearInterval(_imgInterval);
				}

				item.isCheckingImgSize = false;

				_mfpTrigger('ImageHasSize', item);

				if(item.imgHidden) {
					if(mfp.content)
						mfp.content.removeClass('mfp-loading');

					item.imgHidden = false;
				}

			}
		},

		/**
		 * Function that loops until the image has size to display elements that rely on it asap
		 */
		findImageSize: function(item) {

			var counter = 0,
				img = item.img[0],
				mfpSetInterval = function(delay) {

					if(_imgInterval) {
						clearInterval(_imgInterval);
					}
					// decelerating interval that checks for size of an image
					_imgInterval = setInterval(function() {
						if(img.naturalWidth > 0) {
							mfp._onImageHasSize(item);
							return;
						}

						if(counter > 200) {
							clearInterval(_imgInterval);
						}

						counter++;
						if(counter === 3) {
							mfpSetInterval(10);
						} else if(counter === 40) {
							mfpSetInterval(50);
						} else if(counter === 100) {
							mfpSetInterval(500);
						}
					}, delay);
				};

			mfpSetInterval(1);
		},

		getImage: function(item, template) {

			var guard = 0,

				// image load complete handler
				onLoadComplete = function() {
					if(item) {
						if (item.img[0].complete) {
							item.img.off('.mfploader');

							if(item === mfp.currItem){
								mfp._onImageHasSize(item);

								mfp.updateStatus('ready');
							}

							item.hasSize = true;
							item.loaded = true;

							_mfpTrigger('ImageLoadComplete');

						}
						else {
							// if image complete check fails 200 times (20 sec), we assume that there was an error.
							guard++;
							if(guard < 200) {
								setTimeout(onLoadComplete,100);
							} else {
								onLoadError();
							}
						}
					}
				},

				// image error handler
				onLoadError = function() {
					if(item) {
						item.img.off('.mfploader');
						if(item === mfp.currItem){
							mfp._onImageHasSize(item);
							mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
						}

						item.hasSize = true;
						item.loaded = true;
						item.loadError = true;
					}
				},
				imgSt = mfp.st.image;


			var el = template.find('.mfp-img');
			if(el.length) {
				var img = document.createElement('img');
				img.className = 'mfp-img';
				if(item.el && item.el.find('img').length) {
					img.alt = item.el.find('img').attr('alt');
				}
				item.img = $(img).on('load.mfploader', onLoadComplete).on('error.mfploader', onLoadError);
				img.src = item.src;

				// without clone() "error" event is not firing when IMG is replaced by new IMG
				// TODO: find a way to avoid such cloning
				if(el.is('img')) {
					item.img = item.img.clone();
				}

				img = item.img[0];
				if(img.naturalWidth > 0) {
					item.hasSize = true;
				} else if(!img.width) {
					item.hasSize = false;
				}
			}

			mfp._parseMarkup(template, {
				title: _getTitle(item),
				img_replaceWith: item.img
			}, item);

			mfp.resizeImage();

			if(item.hasSize) {
				if(_imgInterval) clearInterval(_imgInterval);

				if(item.loadError) {
					template.addClass('mfp-loading');
					mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
				} else {
					template.removeClass('mfp-loading');
					mfp.updateStatus('ready');
				}
				return template;
			}

			mfp.updateStatus('loading');
			item.loading = true;

			if(!item.hasSize) {
				item.imgHidden = true;
				template.addClass('mfp-loading');
				mfp.findImageSize(item);
			}

			return template;
		}
	}
});

/*>>image*/

/*>>zoom*/
var hasMozTransform,
	getHasMozTransform = function() {
		if(hasMozTransform === undefined) {
			hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
		}
		return hasMozTransform;
	};

$.magnificPopup.registerModule('zoom', {

	options: {
		enabled: false,
		easing: 'ease-in-out',
		duration: 300,
		opener: function(element) {
			return element.is('img') ? element : element.find('img');
		}
	},

	proto: {

		initZoom: function() {
			var zoomSt = mfp.st.zoom,
				ns = '.zoom',
				image;

			if(!zoomSt.enabled || !mfp.supportsTransition) {
				return;
			}

			var duration = zoomSt.duration,
				getElToAnimate = function(image) {
					var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
						transition = 'all '+(zoomSt.duration/1000)+'s ' + zoomSt.easing,
						cssObj = {
							position: 'fixed',
							zIndex: 9999,
							left: 0,
							top: 0,
							'-webkit-backface-visibility': 'hidden'
						},
						t = 'transition';

					cssObj['-webkit-'+t] = cssObj['-moz-'+t] = cssObj['-o-'+t] = cssObj[t] = transition;

					newImg.css(cssObj);
					return newImg;
				},
				showMainContent = function() {
					mfp.content.css('visibility', 'visible');
				},
				openTimeout,
				animatedImg;

			_mfpOn('BuildControls'+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);
					mfp.content.css('visibility', 'hidden');

					// Basically, all code below does is clones existing image, puts in on top of the current one and animated it

					image = mfp._getItemToZoom();

					if(!image) {
						showMainContent();
						return;
					}

					animatedImg = getElToAnimate(image);

					animatedImg.css( mfp._getOffset() );

					mfp.wrap.append(animatedImg);

					openTimeout = setTimeout(function() {
						animatedImg.css( mfp._getOffset( true ) );
						openTimeout = setTimeout(function() {

							showMainContent();

							setTimeout(function() {
								animatedImg.remove();
								image = animatedImg = null;
								_mfpTrigger('ZoomAnimationEnded');
							}, 16); // avoid blink when switching images

						}, duration); // this timeout equals animation duration

					}, 16); // by adding this timeout we avoid short glitch at the beginning of animation


					// Lots of timeouts...
				}
			});
			_mfpOn(BEFORE_CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);

					mfp.st.removalDelay = duration;

					if(!image) {
						image = mfp._getItemToZoom();
						if(!image) {
							return;
						}
						animatedImg = getElToAnimate(image);
					}

					animatedImg.css( mfp._getOffset(true) );
					mfp.wrap.append(animatedImg);
					mfp.content.css('visibility', 'hidden');

					setTimeout(function() {
						animatedImg.css( mfp._getOffset() );
					}, 16);
				}

			});

			_mfpOn(CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {
					showMainContent();
					if(animatedImg) {
						animatedImg.remove();
					}
					image = null;
				}
			});
		},

		_allowZoom: function() {
			return mfp.currItem.type === 'image';
		},

		_getItemToZoom: function() {
			if(mfp.currItem.hasSize) {
				return mfp.currItem.img;
			} else {
				return false;
			}
		},

		// Get element postion relative to viewport
		_getOffset: function(isLarge) {
			var el;
			if(isLarge) {
				el = mfp.currItem.img;
			} else {
				el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
			}

			var offset = el.offset();
			var paddingTop = parseInt(el.css('padding-top'),10);
			var paddingBottom = parseInt(el.css('padding-bottom'),10);
			offset.top -= ( $(window).scrollTop() - paddingTop );


			/*

			Animating left + top + width/height looks glitchy in Firefox, but perfect in Chrome. And vice-versa.

			 */
			var obj = {
				width: el.width(),
				// fix Zepto height+padding issue
				height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
			};

			// I hate to do this, but there is no another option
			if( getHasMozTransform() ) {
				obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)';
			} else {
				obj.left = offset.left;
				obj.top = offset.top;
			}
			return obj;
		}

	}
});



/*>>zoom*/

/*>>iframe*/

var IFRAME_NS = 'iframe',
	_emptyPage = '//about:blank',

	_fixIframeBugs = function(isShowing) {
		if(mfp.currTemplate[IFRAME_NS]) {
			var el = mfp.currTemplate[IFRAME_NS].find('iframe');
			if(el.length) {
				// reset src after the popup is closed to avoid "video keeps playing after popup is closed" bug
				if(!isShowing) {
					el[0].src = _emptyPage;
				}

				// IE8 black screen bug fix
				if(mfp.isIE8) {
					el.css('display', isShowing ? 'block' : 'none');
				}
			}
		}
	};

$.magnificPopup.registerModule(IFRAME_NS, {

	options: {
		markup: '<div class="mfp-iframe-scaler">'+
					'<div class="mfp-close"></div>'+
					'<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>'+
				'</div>',

		srcAction: 'iframe_src',

		// we don't care and support only one default type of URL by default
		patterns: {
			youtube: {
				index: 'youtube.com',
				id: 'v=',
				src: '//www.youtube.com/embed/%id%?autoplay=1'
			},
			vimeo: {
				index: 'vimeo.com/',
				id: '/',
				src: '//player.vimeo.com/video/%id%?autoplay=1'
			},
			gmaps: {
				index: '//maps.google.',
				src: '%id%&output=embed'
			}
		}
	},

	proto: {
		initIframe: function() {
			mfp.types.push(IFRAME_NS);

			_mfpOn('BeforeChange', function(e, prevType, newType) {
				if(prevType !== newType) {
					if(prevType === IFRAME_NS) {
						_fixIframeBugs(); // iframe if removed
					} else if(newType === IFRAME_NS) {
						_fixIframeBugs(true); // iframe is showing
					}
				}// else {
					// iframe source is switched, don't do anything
				//}
			});

			_mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function() {
				_fixIframeBugs();
			});
		},

		getIframe: function(item, template) {
			var embedSrc = item.src;
			var iframeSt = mfp.st.iframe;

			$.each(iframeSt.patterns, function() {
				if(embedSrc.indexOf( this.index ) > -1) {
					if(this.id) {
						if(typeof this.id === 'string') {
							embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id)+this.id.length, embedSrc.length);
						} else {
							embedSrc = this.id.call( this, embedSrc );
						}
					}
					embedSrc = this.src.replace('%id%', embedSrc );
					return false; // break;
				}
			});

			var dataObj = {};
			if(iframeSt.srcAction) {
				dataObj[iframeSt.srcAction] = embedSrc;
			}
			mfp._parseMarkup(template, dataObj, item);

			mfp.updateStatus('ready');

			return template;
		}
	}
});



/*>>iframe*/

/*>>gallery*/
/**
 * Get looped index depending on number of slides
 */
var _getLoopedId = function(index) {
		var numSlides = mfp.items.length;
		if(index > numSlides - 1) {
			return index - numSlides;
		} else  if(index < 0) {
			return numSlides + index;
		}
		return index;
	},
	_replaceCurrTotal = function(text, curr, total) {
		return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);
	};

$.magnificPopup.registerModule('gallery', {

	options: {
		enabled: false,
		arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
		preload: [0,2],
		navigateByImgClick: true,
		arrows: true,

		tPrev: 'Previous (Left arrow key)',
		tNext: 'Next (Right arrow key)',
		tCounter: '%curr% of %total%'
	},

	proto: {
		initGallery: function() {

			var gSt = mfp.st.gallery,
				ns = '.mfp-gallery';

			mfp.direction = true; // true - next, false - prev

			if(!gSt || !gSt.enabled ) return false;

			_wrapClasses += ' mfp-gallery';

			_mfpOn(OPEN_EVENT+ns, function() {

				if(gSt.navigateByImgClick) {
					mfp.wrap.on('click'+ns, '.mfp-img', function() {
						if(mfp.items.length > 1) {
							mfp.next();
							return false;
						}
					});
				}

				_document.on('keydown'+ns, function(e) {
					if (e.keyCode === 37) {
						mfp.prev();
					} else if (e.keyCode === 39) {
						mfp.next();
					}
				});
			});

			_mfpOn('UpdateStatus'+ns, function(e, data) {
				if(data.text) {
					data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length);
				}
			});

			_mfpOn(MARKUP_PARSE_EVENT+ns, function(e, element, values, item) {
				var l = mfp.items.length;
				values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : '';
			});

			_mfpOn('BuildControls' + ns, function() {
				if(mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {
					var markup = gSt.arrowMarkup,
						arrowLeft = mfp.arrowLeft = $( markup.replace(/%title%/gi, gSt.tPrev).replace(/%dir%/gi, 'left') ).addClass(PREVENT_CLOSE_CLASS),
						arrowRight = mfp.arrowRight = $( markup.replace(/%title%/gi, gSt.tNext).replace(/%dir%/gi, 'right') ).addClass(PREVENT_CLOSE_CLASS);

					arrowLeft.click(function() {
						mfp.prev();
					});
					arrowRight.click(function() {
						mfp.next();
					});

					mfp.container.append(arrowLeft.add(arrowRight));
				}
			});

			_mfpOn(CHANGE_EVENT+ns, function() {
				if(mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);

				mfp._preloadTimeout = setTimeout(function() {
					mfp.preloadNearbyImages();
					mfp._preloadTimeout = null;
				}, 16);
			});


			_mfpOn(CLOSE_EVENT+ns, function() {
				_document.off(ns);
				mfp.wrap.off('click'+ns);
				mfp.arrowRight = mfp.arrowLeft = null;
			});

		},
		next: function() {
			mfp.direction = true;
			mfp.index = _getLoopedId(mfp.index + 1);
			mfp.updateItemHTML();
		},
		prev: function() {
			mfp.direction = false;
			mfp.index = _getLoopedId(mfp.index - 1);
			mfp.updateItemHTML();
		},
		goTo: function(newIndex) {
			mfp.direction = (newIndex >= mfp.index);
			mfp.index = newIndex;
			mfp.updateItemHTML();
		},
		preloadNearbyImages: function() {
			var p = mfp.st.gallery.preload,
				preloadBefore = Math.min(p[0], mfp.items.length),
				preloadAfter = Math.min(p[1], mfp.items.length),
				i;

			for(i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) {
				mfp._preloadItem(mfp.index+i);
			}
			for(i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) {
				mfp._preloadItem(mfp.index-i);
			}
		},
		_preloadItem: function(index) {
			index = _getLoopedId(index);

			if(mfp.items[index].preloaded) {
				return;
			}

			var item = mfp.items[index];
			if(!item.parsed) {
				item = mfp.parseEl( index );
			}

			_mfpTrigger('LazyLoad', item);

			if(item.type === 'image') {
				item.img = $('<img class="mfp-img" />').on('load.mfploader', function() {
					item.hasSize = true;
				}).on('error.mfploader', function() {
					item.hasSize = true;
					item.loadError = true;
					_mfpTrigger('LazyLoadError', item);
				}).attr('src', item.src);
			}


			item.preloaded = true;
		}
	}
});

/*>>gallery*/

/*>>retina*/

var RETINA_NS = 'retina';

$.magnificPopup.registerModule(RETINA_NS, {
	options: {
		replaceSrc: function(item) {
			return item.src.replace(/\.\w+$/, function(m) { return '@2x' + m; });
		},
		ratio: 1 // Function or number.  Set to 1 to disable.
	},
	proto: {
		initRetina: function() {
			if(window.devicePixelRatio > 1) {

				var st = mfp.st.retina,
					ratio = st.ratio;

				ratio = !isNaN(ratio) ? ratio : ratio();

				if(ratio > 1) {
					_mfpOn('ImageHasSize' + '.' + RETINA_NS, function(e, item) {
						item.img.css({
							'max-width': item.img[0].naturalWidth / ratio,
							'width': '100%'
						});
					});
					_mfpOn('ElementParse' + '.' + RETINA_NS, function(e, item) {
						item.src = st.replaceSrc(item, ratio);
					});
				}
			}

		}
	}
});

/*>>retina*/
 _checkInstance(); }));
/* modernizr 3.5.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-flexbox-scriptdefer-setclasses !*/
!function(e,n,t){function r(e,n){return typeof e===n}function o(){var e,n,t,o,s,i,l;for(var a in S)if(S.hasOwnProperty(a)){if(e=[],n=S[a],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(o=r(n.fn,"function")?n.fn():n.fn,s=0;s<e.length;s++)i=e[s],l=i.split("."),1===l.length?Modernizr[l[0]]=o:(!Modernizr[l[0]]||Modernizr[l[0]]instanceof Boolean||(Modernizr[l[0]]=new Boolean(Modernizr[l[0]])),Modernizr[l[0]][l[1]]=o),C.push((o?"":"no-")+l.join("-"))}}function s(e){var n=x.className,t=Modernizr._config.classPrefix||"";if(_&&(n=n.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(r,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),_?x.className.baseVal=n:x.className=n)}function i(e,n){return!!~(""+e).indexOf(n)}function l(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):_?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function a(e){return e.replace(/([a-z])-([a-z])/g,function(e,n,t){return n+t.toUpperCase()}).replace(/^-/,"")}function f(e,n){return function(){return e.apply(n,arguments)}}function u(e,n,t){var o;for(var s in e)if(e[s]in n)return t===!1?e[s]:(o=n[e[s]],r(o,"function")?f(o,t||n):o);return!1}function c(e){return e.replace(/([A-Z])/g,function(e,n){return"-"+n.toLowerCase()}).replace(/^ms-/,"-ms-")}function d(n,t,r){var o;if("getComputedStyle"in e){o=getComputedStyle.call(e,n,t);var s=e.console;if(null!==o)r&&(o=o.getPropertyValue(r));else if(s){var i=s.error?"error":"log";s[i].call(s,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else o=!t&&n.currentStyle&&n.currentStyle[r];return o}function p(){var e=n.body;return e||(e=l(_?"svg":"body"),e.fake=!0),e}function m(e,t,r,o){var s,i,a,f,u="modernizr",c=l("div"),d=p();if(parseInt(r,10))for(;r--;)a=l("div"),a.id=o?o[r]:u+(r+1),c.appendChild(a);return s=l("style"),s.type="text/css",s.id="s"+u,(d.fake?d:c).appendChild(s),d.appendChild(c),s.styleSheet?s.styleSheet.cssText=e:s.appendChild(n.createTextNode(e)),c.id=u,d.fake&&(d.style.background="",d.style.overflow="hidden",f=x.style.overflow,x.style.overflow="hidden",x.appendChild(d)),i=t(c,e),d.fake?(d.parentNode.removeChild(d),x.style.overflow=f,x.offsetHeight):c.parentNode.removeChild(c),!!i}function y(n,r){var o=n.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(c(n[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var s=[];o--;)s.push("("+c(n[o])+":"+r+")");return s=s.join(" or "),m("@supports ("+s+") { #modernizr { position: absolute; } }",function(e){return"absolute"==d(e,null,"position")})}return t}function v(e,n,o,s){function f(){c&&(delete N.style,delete N.modElem)}if(s=r(s,"undefined")?!1:s,!r(o,"undefined")){var u=y(e,o);if(!r(u,"undefined"))return u}for(var c,d,p,m,v,g=["modernizr","tspan","samp"];!N.style&&g.length;)c=!0,N.modElem=l(g.shift()),N.style=N.modElem.style;for(p=e.length,d=0;p>d;d++)if(m=e[d],v=N.style[m],i(m,"-")&&(m=a(m)),N.style[m]!==t){if(s||r(o,"undefined"))return f(),"pfx"==n?m:!0;try{N.style[m]=o}catch(h){}if(N.style[m]!=v)return f(),"pfx"==n?m:!0}return f(),!1}function g(e,n,t,o,s){var i=e.charAt(0).toUpperCase()+e.slice(1),l=(e+" "+P.join(i+" ")+i).split(" ");return r(n,"string")||r(n,"undefined")?v(l,n,o,s):(l=(e+" "+z.join(i+" ")+i).split(" "),u(l,n,t))}function h(e,n,r){return g(e,t,t,n,r)}var C=[],S=[],w={_version:"3.5.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){S.push({name:e,fn:n,options:t})},addAsyncTest:function(e){S.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=w,Modernizr=new Modernizr;var x=n.documentElement,_="svg"===x.nodeName.toLowerCase(),b="Moz O ms Webkit",P=w._config.usePrefixes?b.split(" "):[];w._cssomPrefixes=P;var z=w._config.usePrefixes?b.toLowerCase().split(" "):[];w._domPrefixes=z,Modernizr.addTest("scriptdefer","defer"in l("script"));var E={elem:l("modernizr")};Modernizr._q.push(function(){delete E.elem});var N={style:E.elem.style};Modernizr._q.unshift(function(){delete N.style}),w.testAllProps=g,w.testAllProps=h,Modernizr.addTest("flexbox",h("flexBasis","1px",!0)),o(),s(C),delete w.addTest,delete w.addAsyncTest;for(var T=0;T<Modernizr._q.length;T++)Modernizr._q[T]();e.Modernizr=Modernizr}(window,document);

/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.9.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
(function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)})(function(i){"use strict";var e=window.Slick||{};e=function(){function e(e,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(e),appendDots:i(e),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(e),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(e).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,"undefined"!=typeof document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):"undefined"!=typeof document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=t++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}var t=0;return e}(),e.prototype.activateADA=function(){var i=this;i.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):o===!0?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&i.options.adaptiveHeight===!0&&i.options.vertical===!1){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),s.options.rtl===!0&&s.options.vertical===!1&&(e=-e),s.transformsEnabled===!1?s.options.vertical===!1?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):s.cssTransitions===!1?(s.options.rtl===!0&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),s.options.vertical===!1?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),s.options.vertical===!1?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this,o=t.getNavTarget();null!==o&&"object"==typeof o&&o.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};e.options.fade===!1?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,e.options.fade===!1?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(i.options.infinite===!1&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1===0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;e.options.arrows===!0&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),e.options.infinite!==!0&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(o.options.dots===!0&&o.slideCount>o.options.slidesToShow){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),e.options.centerMode!==!0&&e.options.swipeToSlide!==!0||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.options.draggable===!0&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>0){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(r.originalSettings.mobileFirst===!1?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),e===!0&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),e===!0&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,e===!0&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||l===!1||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!==0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t,o=this;if(e=o.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var s in e){if(i<e[s]){i=t;break}t=e[s]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),e.options.accessibility===!0&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),e.options.arrows===!0&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),e.options.accessibility===!0&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),e.options.accessibility===!0&&e.$list.off("keydown.slick",e.keyHandler),e.options.focusOnSelect===!0&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>0&&(i=e.$slides.children().children(),i.removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){var e=this;e.shouldClick===!1&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",e.options.fade===!1?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;t.cssTransitions===!1?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;e.cssTransitions===!1?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick","*",function(t){var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&o.is(":focus")&&(e.focussed=!0,e.autoPlay())},0)}).on("blur.slick","*",function(t){i(this);e.options.pauseOnFocus&&(e.focussed=!1,e.autoPlay())})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){var i=this;return i.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(i.options.infinite===!0)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(i.options.centerMode===!0)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),n.options.infinite===!0?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,n.options.vertical===!0&&n.options.centerMode===!0&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!==0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),n.options.centerMode===!0&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:n.options.centerMode===!0&&n.options.infinite===!0?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:n.options.centerMode===!0&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=n.options.vertical===!1?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,n.options.variableWidth===!0&&(o=n.slideCount<=n.options.slidesToShow||n.options.infinite===!1?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=n.options.rtl===!0?o[0]?(n.$slideTrack.width()-o[0].offsetLeft-o.width())*-1:0:o[0]?o[0].offsetLeft*-1:0,n.options.centerMode===!0&&(o=n.slideCount<=n.options.slidesToShow||n.options.infinite===!1?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=n.options.rtl===!0?o[0]?(n.$slideTrack.width()-o[0].offsetLeft-o.width())*-1:0:o[0]?o[0].offsetLeft*-1:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){var e=this;return e.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(e.options.infinite===!1?i=e.slideCount:(t=e.options.slidesToScroll*-1,o=e.options.slidesToScroll*-1,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o,s,n=this;return s=n.options.centerMode===!0?Math.floor(n.$list.width()/2):0,o=n.swipeLeft*-1+s,n.options.swipeToSlide===!0?(n.$slideTrack.find(".slick-slide").each(function(e,s){var r,l,d;if(r=i(s).outerWidth(),l=s.offsetLeft,n.options.centerMode!==!0&&(l+=r/2),d=l+r,o<d)return t=s,!1}),e=Math.abs(i(t).attr("data-slick-index")-n.currentSlide)||1):n.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){var t=this;t.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),t.options.accessibility===!0&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);if(i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),s!==-1){var n="slick-slide-control"+e.instanceUid+s;i("#"+n).length&&i(this).attr({"aria-describedby":n})}}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.options.focusOnChange?e.$slides.eq(s).attr({tabindex:"0"}):e.$slides.eq(s).removeAttr("tabindex");e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;i.options.arrows===!0&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),i.options.accessibility===!0&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;e.options.dots===!0&&e.slideCount>e.options.slidesToShow&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),e.options.accessibility===!0&&e.$dots.on("keydown.slick",e.keyHandler)),e.options.dots===!0&&e.options.pauseOnDotsHover===!0&&e.slideCount>e.options.slidesToShow&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),e.options.accessibility===!0&&e.$list.on("keydown.slick",e.keyHandler),e.options.focusOnSelect===!0&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;i.options.arrows===!0&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),i.options.dots===!0&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&e.options.accessibility===!0?e.changeSlide({data:{message:e.options.rtl===!0?"next":"previous"}}):39===i.keyCode&&e.options.accessibility===!0&&e.changeSlide({data:{message:e.options.rtl===!0?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||r.$slider.attr("data-sizes"),n=document.createElement("img");n.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),r.$slider.trigger("lazyLoaded",[r,e,t])})},n.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),r.$slider.trigger("lazyLoadError",[r,e,t])},n.src=t})}var t,o,s,n,r=this;if(r.options.centerMode===!0?r.options.infinite===!0?(s=r.currentSlide+(r.options.slidesToShow/2+1),n=s+r.options.slidesToShow+2):(s=Math.max(0,r.currentSlide-(r.options.slidesToShow/2+1)),n=2+(r.options.slidesToShow/2+1)+r.currentSlide):(s=r.options.infinite?r.options.slidesToShow+r.currentSlide:r.currentSlide,n=Math.ceil(s+r.options.slidesToShow),r.options.fade===!0&&(s>0&&s--,n<=r.slideCount&&n++)),t=r.$slider.find(".slick-slide").slice(s,n),"anticipated"===r.options.lazyLoad)for(var l=s-1,d=n,a=r.$slider.find(".slick-slide"),c=0;c<r.options.slidesToScroll;c++)l<0&&(l=r.slideCount-1),t=t.add(a.eq(l)),t=t.add(a.eq(d)),l--,d++;e(t),r.slideCount<=r.options.slidesToShow?(o=r.$slider.find(".slick-slide"),e(o)):r.currentSlide>=r.slideCount-r.options.slidesToShow?(o=r.$slider.find(".slick-cloned").slice(0,r.options.slidesToShow),e(o)):0===r.currentSlide&&(o=r.$slider.find(".slick-cloned").slice(r.options.slidesToShow*-1),e(o))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){var i=this;i.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;if(!t.unslicked&&(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),t.options.accessibility===!0&&(t.initADA(),t.options.focusOnChange))){var o=i(t.$slides.get(t.currentSlide));o.attr("tabindex",0).focus()}},e.prototype.prev=e.prototype.slickPrev=function(){var i=this;i.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),r=document.createElement("img"),r.onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),l.options.adaptiveHeight===!0&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),e.options.focusOnSelect===!0&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;return"boolean"==typeof i?(e=i,i=e===!0?0:o.slideCount-1):i=e===!0?--i:i,!(o.slideCount<1||i<0||i>o.slideCount-1)&&(o.unload(),t===!0?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,void o.reinit())},e.prototype.setCSS=function(i){var e,t,o=this,s={};o.options.rtl===!0&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,o.transformsEnabled===!1?o.$slideTrack.css(s):(s={},o.cssTransitions===!1?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;i.options.vertical===!1?i.options.centerMode===!0&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),i.options.centerMode===!0&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),i.options.vertical===!1&&i.options.variableWidth===!1?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):i.options.variableWidth===!0?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();i.options.variableWidth===!1&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,t.options.rtl===!0?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&i.options.adaptiveHeight===!0&&i.options.vertical===!1){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":"undefined"!=typeof arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),i.options.fade===!1?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=i.options.vertical===!0?"top":"left",
"top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||i.options.useCSS===!0&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&i.animType!==!1&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&i.animType!==!1},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),n.options.centerMode===!0){var r=n.options.slidesToShow%2===0?1:0;e=Math.floor(n.options.slidesToShow/2),n.options.infinite===!0&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=n.options.infinite===!0?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(s.options.fade===!0&&(s.options.centerMode=!1),s.options.infinite===!0&&s.options.fade===!1&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=s.options.centerMode===!0?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));return s||(s=0),t.slideCount<=t.options.slidesToShow?void t.slideHandler(s,!1,!0):void t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(a.animating===!0&&a.options.waitForAnimate===!0||a.options.fade===!0&&a.currentSlide===i))return e===!1&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,a.options.infinite===!1&&a.options.centerMode===!1&&(i<0||i>a.getDotCount()*a.options.slidesToScroll)?void(a.options.fade===!1&&(o=a.currentSlide,t!==!0&&a.slideCount>a.options.slidesToShow?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o))):a.options.infinite===!1&&a.options.centerMode===!0&&(i<0||i>a.slideCount-a.options.slidesToScroll)?void(a.options.fade===!1&&(o=a.currentSlide,t!==!0&&a.slideCount>a.options.slidesToShow?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o))):(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!==0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!==0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=a.getNavTarget(),l=l.slick("getSlick"),l.slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide)),a.updateDots(),a.updateArrows(),a.options.fade===!0?(t!==!0?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight()):void(t!==!0&&a.slideCount>a.options.slidesToShow?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)))},e.prototype.startLoad=function(){var i=this;i.options.arrows===!0&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),i.options.dots===!0&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),o=Math.round(180*t/Math.PI),o<0&&(o=360-Math.abs(o)),o<=45&&o>=0?s.options.rtl===!1?"left":"right":o<=360&&o>=315?s.options.rtl===!1?"left":"right":o>=135&&o<=225?s.options.rtl===!1?"right":"left":s.options.verticalSwiping===!0?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(o.touchObject.edgeHit===!0&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(e.options.swipe===!1||"ontouchend"in document&&e.options.swipe===!1||e.options.draggable===!1&&i.type.indexOf("mouse")!==-1))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,e.options.verticalSwiping===!0&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(l.options.verticalSwiping===!0&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(l.options.rtl===!1?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),l.options.verticalSwiping===!0&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,l.options.infinite===!1&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),l.options.vertical===!1?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,l.options.verticalSwiping===!0&&(l.swipeLeft=e+o*s),l.options.fade!==!0&&l.options.touchMove!==!1&&(l.animating===!0?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;return t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow?(t.touchObject={},!1):(void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,void(t.dragging=!0))},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i,e=this;i=Math.floor(e.options.slidesToShow/2),e.options.arrows===!0&&e.slideCount>e.options.slidesToShow&&!e.options.infinite&&(e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===e.currentSlide?(e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):e.currentSlide>=e.slideCount-e.options.slidesToShow&&e.options.centerMode===!1?(e.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):e.currentSlide>=e.slideCount-1&&e.options.centerMode===!0&&(e.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||"undefined"==typeof s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),"undefined"!=typeof t)return t;return o}});
/**
 * @preserve
 * Sharer.js
 *
 * @description Create your own social share buttons
 * @version 0.3.2
 * @author Ellison Leao <ellisonleao@gmail.com>
 * @license GPLv3
 *
 */

(function (window, document) {
    'use strict';
    /**
     * @constructor
     */
    var Sharer = function(elem) {
        this.elem = elem;
    };

    /**
     *  @function init
     *  @description bind the events for multiple sharer elements
     *  @returns {Empty}
     */
    Sharer.init = function() {
        var elems = document.querySelectorAll('.sharer'),
            i,
            l = elems.length;

        for (i = 0; i < l ; i++) {
            elems[i].addEventListener('click', Sharer.add);
        }
    };

    /**
     *  @function add
     *  @description bind the share event for a single dom element
     *  @returns {Empty}
     */
    Sharer.add = function(elem) {
        var target = elem.currentTarget || elem.srcElement;
        var sharer = new Sharer(target);
        sharer.share();
    };

    // instance methods
    Sharer.prototype = {
        constructor: Sharer,
        /**
         *  @function getValue
         *  @description Helper to get the attribute of a DOM element
         *  @param {String} attr DOM element attribute
         *  @param {String} defaultValue value to use for attr
         *  @returns {String|Empty} returns the attr value or empty string
         */
        getValue: function(attr, defaultValue) {
            defaultValue = (defaultValue === undefined) ? '' : defaultValue;
            var val = this.elem.getAttribute('data-' + attr);
            return (val === undefined || val === null) ? defaultValue : val;
        },

        /**
         * @event share
         * @description Main share event. Will pop a window or redirect to a link
         * based on the data-sharer attribute.
         */
        share: function() {
            var sharer = this.getValue('sharer').toLowerCase(),
                sharers = {
                    facebook: {
                        shareUrl: 'https://www.facebook.com/sharer/sharer.php',
                        params: {u: this.getValue('url')}
                    },
                    googleplus: {
                        shareUrl: 'https://plus.google.com/share',
                        params: {url: this.getValue('url')}
                    },
                    linkedin: {
                        shareUrl: 'https://www.linkedin.com/shareArticle',
                        params: {
                            url: this.getValue('url'),
                            mini: true
                        }
                    },
                    twitter: {
                        shareUrl: 'https://twitter.com/intent/tweet/',
                        params: {
                            text: this.getValue('title'),
                            url: this.getValue('url'),
                            hashtags: this.getValue('hashtags'),
                            via: this.getValue('via')
                        }
                    },
                    email: {
                        shareUrl: 'mailto:' + this.getValue('to'),
                        params: {
                            subject: this.getValue('subject'),
                            body: this.getValue('title') + '\n' + this.getValue('url')
                        },
                        isLink: true
                    },
                    whatsapp: {
                        shareUrl: 'whatsapp://send',
                        params: {
                            text: this.getValue('title') + ' ' + this.getValue('url')
                        },
                        isLink: true
                    },
                    telegram: {
                        shareUrl: 'tg://msg_url',
                        params: {
                            text: this.getValue('title') + ' ' + this.getValue('url')
                        },
                        isLink: true
                    },
                    viber: {
                        shareUrl: 'viber://forward',
                        params: {
                            text: this.getValue('title') + ' ' + this.getValue('url')
                        },
                        isLink: true
                    },
                    line: {
                        shareUrl: 'http://line.me/R/msg/text/?' + encodeURIComponent(this.getValue('title') + ' ' + this.getValue('url')),
                        isLink: true
                    },
                    pinterest: {
                        shareUrl: 'https://www.pinterest.com/pin/create/button/',
                        params: {
                            url: this.getValue('url'),
                            media: this.getValue('image'),
                            description: this.getValue('description')
                        }
                    },
                    tumblr: {
                        shareUrl: 'http://tumblr.com/widgets/share/tool',
                        params: {
                            canonicalUrl: this.getValue('url'),
                            content: this.getValue('url'),
                            posttype: 'link',
                            title: this.getValue('title'),
                            caption: this.getValue('caption'),
                            tags: this.getValue('tags')
                        }
                    },
                    hackernews: {
                        shareUrl: 'https://news.ycombinator.com/submitlink',
                        params: {
                            u: this.getValue('url'),
                            t: this.getValue('title')
                        }
                    },
                    reddit: {
                        shareUrl: 'https://www.reddit.com/submit',
                        params: {'url': this.getValue('url')}
                    },
                    vk: {
                        shareUrl: 'http://vk.com/share.php',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title'),
                            description: this.getValue('caption'),
                            image: this.getValue('image')
                        }
                    },
                    xing: {
                        shareUrl: 'https://www.xing.com/app/user',
                        params: {
                            'op': 'share',
                            'url': this.getValue('url'),
                            'title': this.getValue('title')
                        }
                    },
                    buffer: {
                        shareUrl: 'https://buffer.com/add',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title'),
                            via: this.getValue('via'),
                            picture: this.getValue('picture')
                        }
                    },
                    instapaper: {
                        shareUrl: 'http://www.instapaper.com/edit',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title'),
                            description: this.getValue('description')
                        }
                    },
                    pocket: {
                        shareUrl: 'https://getpocket.com/save',
                        params: {
                            url: this.getValue('url')
                        }
                    },
                    digg: {
                        shareUrl: 'http://www.digg.com/submit',
                        params: {
                            url: this.getValue('url')
                        }
                    },
                    stumbleupon: {
                        shareUrl: 'http://www.stumbleupon.com/submit',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title')
                        }
                    },
                    flipboard: {
                        shareUrl: 'https://share.flipboard.com/bookmarklet/popout',
                        params: {
                            v: 2,
                            title: this.getValue('title'),
                            url: this.getValue('url'),
                            t: Date.now()
                        }
                    },
                    weibo: {
                        shareUrl: 'http://service.weibo.com/share/share.php',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title'),
                            pic: this.getValue('image'),
                            appkey: this.getValue('appkey'),
                            ralateUid: this.getValue('ralateuid'),
                            language: 'zh_cn'
                        }
                    },
                    renren: {
                        shareUrl: 'http://share.renren.com/share/buttonshare',
                        params: {
                            link: this.getValue('url')
                        }
                    },
                    myspace: {
                        shareUrl: 'https://myspace.com/post',
                        params: {
                            u: this.getValue('url'),
                            t: this.getValue('title'),
                            c: this.getValue('description')
                        }
                    },
                    blogger: {
                        shareUrl: 'https://www.blogger.com/blog-this.g',
                        params: {
                            u: this.getValue('url'),
                            n: this.getValue('title'),
                            t: this.getValue('description')
                        }
                    },
                    baidu: {
                        shareUrl: 'http://cang.baidu.com/do/add',
                        params: {
                            it: this.getValue('title'),
                            iu: this.getValue('url')
                        }
                    },
                    douban: {
                        shareUrl: 'https://www.douban.com/share/service',
                        params: {
                            name: this.getValue('title'),
                            href: this.getValue('url'),
                            image: this.getValue('image')
                        }
                    },
                    okru: {
                        shareUrl: 'https://connect.ok.ru/dk',
                        params: {
                            'st.cmd': 'WidgetSharePreview',
                            'st.shareUrl': this.getValue('url'),
                            'title': this.getValue('title')
                        }
                    },
                    mailru: {
                        shareUrl: 'http://connect.mail.ru/share',
                        params: {
                            'share_url': this.getValue('url'),
                            'linkname': this.getValue('title'),
                            'linknote': this.getValue('description'),
                            'type': 'page'
                        }
                    }
                },
                s = sharers[sharer];

            // custom popups sizes
            if (s) {
                s.width = this.getValue('width');
                s.height = this.getValue('height');
            }
            return s !== undefined ? this.urlSharer(s) : false;
        },
        /**
         * @event urlSharer
         * @param {Object} sharer
         */
        urlSharer: function(sharer) {
            var p = sharer.params || {},
                keys = Object.keys(p),
                i,
                str = keys.length > 0 ? '?' : '';
            for (i = 0; i < keys.length; i++) {
                if (str !== '?') {
                    str += '&';
                }
                if (p[keys[i]]) {
                    str += keys[i] + '=' + encodeURIComponent(p[keys[i]]);
                }
            }
            sharer.shareUrl += str;

            if (!sharer.isLink) {
                var popWidth = sharer.width || 600,
                    popHeight = sharer.height || 480,
                    left = window.innerWidth / 2 - popWidth / 2 + window.screenX,
                    top = window.innerHeight / 2 - popHeight / 2 + window.screenY,
                    popParams = 'scrollbars=no, width=' + popWidth + ', height=' + popHeight + ', top=' + top + ', left=' + left,
                    newWindow = window.open(sharer.shareUrl, '', popParams);

                if (window.focus) {
                    newWindow.focus();
                }
            } else {
                window.location.href = sharer.shareUrl;
            }
        }
    };

    // adding sharer events on domcontentload
    if (document.readyState === 'complete' || document.readyState !== 'loading') {
        Sharer.init();
    } else {
        document.addEventListener('DOMContentLoaded', Sharer.init);
    }

    // turbolinks compatibility
    window.addEventListener('page:load', Sharer.init);

    // exporting sharer for external usage
    window.Sharer = Sharer;

})(window, document);

/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

  $.fn.unveil = function(threshold, callback) {

    var $w = $(window),
        th = threshold || 0,
        retina = window.devicePixelRatio > 1,
        attrib = retina? "data-src-retina" : "data-src",
        images = this,
        loaded;

    this.one("unveil", function() {
      var source = this.getAttribute(attrib);
      source = source || this.getAttribute("data-src");
      if (source) {
        this.setAttribute("src", source);
        if (typeof callback === "function") callback.call(this);
      }
    });

    function unveil() {
      var inview = images.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;

        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }

    $w.on("scroll.unveil resize.unveil lookup.unveil", unveil);

    unveil();

    return this;

  };

})(window.jQuery || window.Zepto);

/**
 * what-input - A global utility for tracking the current input method (mouse, keyboard or touch).
 * @version v5.0.2
 * @link https://github.com/ten1seven/what-input
 * @license MIT
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("whatInput",[],t):"object"==typeof exports?exports.whatInput=t():e.whatInput=t()}(this,function(){return function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return e[o].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t){"use strict";e.exports=function(){var e=document.documentElement,t=null,n="initial",o=n,i=["input","select","textarea"],r=[],u=[16,17,18,91,93],d={keydown:"keyboard",keyup:"keyboard",mousedown:"mouse",mousemove:"mouse",MSPointerDown:"pointer",MSPointerMove:"pointer",pointerdown:"pointer",pointermove:"pointer",touchstart:"touch"},a=!1,s=!1,c={x:null,y:null},p={2:"touch",3:"touch",4:"mouse"},w=!1;try{var f=Object.defineProperty({},"passive",{get:function(){w=!0}});window.addEventListener("test",null,f)}catch(e){}var v=function(){var e=!!w&&{passive:!0};window.PointerEvent?(window.addEventListener("pointerdown",l),window.addEventListener("pointermove",h)):window.MSPointerEvent?(window.addEventListener("MSPointerDown",l),window.addEventListener("MSPointerMove",h)):(window.addEventListener("mousedown",l),window.addEventListener("mousemove",h),"ontouchstart"in window&&(window.addEventListener("touchstart",L,e),window.addEventListener("touchend",L))),window.addEventListener(g(),h,e),window.addEventListener("keydown",l),window.addEventListener("keyup",l),window.addEventListener("focusin",y),window.addEventListener("focusout",E)},l=function(e){if(!a){var t=e.which,r=d[e.type];"pointer"===r&&(r=x(e));var s="keyboard"===r&&t&&-1===u.indexOf(t)||"mouse"===r||"touch"===r;if(n!==r&&s&&(n=r,m("input")),o!==r&&s){var c=document.activeElement;c&&c.nodeName&&-1===i.indexOf(c.nodeName.toLowerCase())&&(o=r,m("intent"))}}},m=function(t){e.setAttribute("data-what"+t,"input"===t?n:o),b(t)},h=function(e){if(k(e),!a&&!s){var t=d[e.type];"pointer"===t&&(t=x(e)),o!==t&&(o=t,m("intent"))}},y=function(n){t=n.target.nodeName.toLowerCase(),e.setAttribute("data-whatelement",t),n.target.classList&&n.target.classList.length&&e.setAttribute("data-whatclasses",n.target.classList.toString().replace(" ",","))},E=function(){t=null,e.removeAttribute("data-whatelement"),e.removeAttribute("data-whatclasses")},L=function(e){"touchstart"===e.type?(a=!1,l(e)):a=!0},x=function(e){return"number"==typeof e.pointerType?p[e.pointerType]:"pen"===e.pointerType?"touch":e.pointerType},g=function(){return"onwheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll"},b=function(e){for(var t=0,i=r.length;t<i;t++)r[t].type===e&&r[t].fn.call(void 0,"input"===e?n:o)},M=function(e){for(var t=0,n=r.length;t<n;t++)if(r[t].fn===e)return t},k=function(e){c.x!==e.screenX||c.y!==e.screenY?(s=!1,c.x=e.screenX,c.y=e.screenY):s=!0};return"addEventListener"in window&&Array.prototype.indexOf&&function(){d[g()]="mouse",v(),m("input"),m("intent")}(),{ask:function(e){return"intent"===e?o:n},element:function(){return t},ignoreKeys:function(e){u=e},registerOnChange:function(e,t){r.push({fn:e,type:t||"input"})},unRegisterOnChange:function(e){var t=M(e);t&&r.splice(t,1)}}}()}])});

$( document ).ready(function() {
	if ($('.acf-map').length > 0) {
    render_map($('.acf-map'));
	}
});



	function render_map( $el ) {

		// var
		var $markers = $el.find('.marker');

		// vars
		var args = {
			// center		: new google.maps.LatLng(0, 0),
			mapTypeId	: google.maps.MapTypeId.ROADMAP,
			zoom		: 13,
			mapTypeControl: false
		};

		// create map
		var map = new google.maps.Map( $el[0], args);


    map.set('styles', [
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f7f1df"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#d0e3b4"
            }
        ]
    },
    {
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fbd3da"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#bde6ab"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffe15f"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#efd151"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "black"
            }
        ]
    },
    {
        "featureType": "transit.station.airport",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#cfb2db"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#a2daf2"
            }
        ]
    }
]);

		// add a markers reference
		map.markers = [];

		// add markers
		$markers.each(function(){
	    add_marker( $(this), map );
		});
		center_map(map);
    $(window).on("resize load", function() {
      // center map
      center_map(map);
    });
	}


	function add_marker( $marker, map ) {

		// var
		var latlng = new google.maps.LatLng( $marker.attr('data-lat'), $marker.attr('data-lng') );

		// create marker
		var icon = {
		 anchor: new google.maps.Point(22, 59),
		 path: "m40.6 11.1c-2-3.3-4.6-6-7.9-7.9-3.3-2-6.9-2.9-10.9-2.9s-7.6 1-10.9 2.9c-3.3 2-6 4.6-7.9 7.9-2 3.3-3 7-3 10.9 0 2.4.3 4.6.9 6.4.6 1.9 1.8 4.1 3.5 6.9 1.2 1.9 3.7 5.6 7.5 11 3.1 4.4 5.6 8 7.6 10.9.5.8 1.3 1.1 2.3 1.1s1.7-.4 2.3-1.1l7.6-10.9c3.8-5.4 6.3-9.1 7.5-11 1.7-2.7 2.9-5 3.5-6.9s.9-4 .9-6.4c-.1-3.9-1.1-7.6-3-10.9zm-12.4 17.3c-1.8 1.8-3.9 2.7-6.4 2.7s-4.6-.9-6.4-2.7-2.7-3.9-2.7-6.4.9-4.6 2.7-6.4 3.9-2.7 6.4-2.7 4.6.9 6.4 2.7 2.7 3.9 2.7 6.4-1 4.6-2.7 6.4z",
		 fillColor: '#05232e',
     fillOpacity: 1,
		 scaledSize: new google.maps.Size(44, 59),
		 size: new google.maps.Size(44, 59)
    }
    
    // create marker
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      draggable: false,
      icon: icon,
    });

		// add to array
		map.markers.push( marker );



		// if marker contains HTML, add it to an infoWindow
		if( $marker.html() )
		{
			// create info window
			var infowindow = new google.maps.InfoWindow({
				content		: $marker.html()
			});

			// show info window when marker is clicked
			google.maps.event.addListener(marker, 'click', function() {

				infowindow.open( map, marker );

			});
		}
	}

	function center_map( map ) {

    // vars
		var bounds = new google.maps.LatLngBounds();

		// loop through all markers and create bounds
		$.each( map.markers, function( i, marker ){
			var latlng = new google.maps.LatLng( marker.position.lat() , marker.position.lng() );
			bounds.extend( latlng );

		});

		// only 1 marker?
		if( map.markers.length > 2 )
		{
			// set center of map
		    map.setCenter( bounds.getCenter() );
		    map.setZoom( 13 );
		}
		else
		{
			// fit to bounds
			map.setCenter( bounds.getCenter() );
			map.setZoom( 13 );
		}

	}

!function(t){function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var e={};n.m=t,n.c=e,n.i=function(t){return t},n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=6)}([function(t,n){t.exports=jQuery},function(t,n,e){"use strict";function i(){return"rtl"===u()("html").attr("dir")}function r(t,n){return t=t||6,Math.round(Math.pow(36,t+1)-Math.random()*Math.pow(36,t)).toString(36).slice(1)+(n?"-"+n:"")}function o(t){var n,e={transition:"transitionend",WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend"},i=document.createElement("div");for(var r in e)void 0!==i.style[r]&&(n=e[r]);return n||(n=setTimeout(function(){t.triggerHandler("transitionend",[t])},1),"transitionend")}e.d(n,"a",function(){return i}),e.d(n,"b",function(){return r}),e.d(n,"c",function(){return o});var a=e(0),u=e.n(a)},function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var i=e(0),r=e.n(i),o=e(3),a=e(1),u=e(4);o.a.addToJquery(r.a),o.a.rtl=a.a,o.a.GetYoDigits=a.b,o.a.transitionend=a.c,o.a.Plugin=u.a,window.Foundation=o.a},function(t,n,e){"use strict";function i(t){if(void 0===Function.prototype.name){var n=/function\s([^(]{1,})\(/,e=n.exec(t.toString());return e&&e.length>1?e[1].trim():""}return void 0===t.prototype?t.constructor.name:t.prototype.constructor.name}function r(t){return"true"===t||"false"!==t&&(isNaN(1*t)?t:parseFloat(t))}function o(t){return t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}e.d(n,"a",function(){return l});var a=e(0),u=e.n(a),s=e(1),c=e(5),l={version:"6.4.3",_plugins:{},_uuids:[],plugin:function(t,n){var e=n||i(t),r=o(e);this._plugins[r]=this[e]=t},registerPlugin:function(t,n){var r=n?o(n):i(t.constructor).toLowerCase();t.uuid=e.i(s.b)(6,r),t.$element.attr("data-"+r)||t.$element.attr("data-"+r,t.uuid),t.$element.data("zfPlugin")||t.$element.data("zfPlugin",t),t.$element.trigger("init.zf."+r),this._uuids.push(t.uuid)},unregisterPlugin:function(t){var n=o(i(t.$element.data("zfPlugin").constructor));this._uuids.splice(this._uuids.indexOf(t.uuid),1),t.$element.removeAttr("data-"+n).removeData("zfPlugin").trigger("destroyed.zf."+n);for(var e in t)t[e]=null},reInit:function(t){var n=t instanceof u.a;try{if(n)t.each(function(){u()(this).data("zfPlugin")._init()});else{var e=typeof t,i=this;({object:function(t){t.forEach(function(t){t=o(t),u()("[data-"+t+"]").foundation("_init")})},string:function(){t=o(t),u()("[data-"+t+"]").foundation("_init")},undefined:function(){this.object(Object.keys(i._plugins))}})[e](t)}}catch(t){console.error(t)}finally{return t}},reflow:function(t,n){void 0===n?n=Object.keys(this._plugins):"string"==typeof n&&(n=[n]);var e=this;u.a.each(n,function(n,i){var o=e._plugins[i];u()(t).find("[data-"+i+"]").addBack("[data-"+i+"]").each(function(){var t=u()(this),n={};if(t.data("zfPlugin"))return void console.warn("Tried to initialize "+i+" on an element that already has a Foundation plugin.");t.attr("data-options")&&t.attr("data-options").split(";").forEach(function(t,e){var i=t.split(":").map(function(t){return t.trim()});i[0]&&(n[i[0]]=r(i[1]))});try{t.data("zfPlugin",new o(u()(this),n))}catch(t){console.error(t)}finally{return}})})},getFnName:i,addToJquery:function(t){var n=function(n){var e=typeof n,r=t(".no-js");if(r.length&&r.removeClass("no-js"),"undefined"===e)c.a._init(),l.reflow(this);else{if("string"!==e)throw new TypeError("We're sorry, "+e+" is not a valid parameter. You must use a string representing the method you wish to invoke.");var o=Array.prototype.slice.call(arguments,1),a=this.data("zfPlugin");if(void 0===a||void 0===a[n])throw new ReferenceError("We're sorry, '"+n+"' is not an available method for "+(a?i(a):"this element")+".");1===this.length?a[n].apply(a,o):this.each(function(e,i){a[n].apply(t(i).data("zfPlugin"),o)})}return this};return t.fn.foundation=n,t}};l.util={throttle:function(t,n){var e=null;return function(){var i=this,r=arguments;null===e&&(e=setTimeout(function(){t.apply(i,r),e=null},n))}}},window.Foundation=l,function(){Date.now&&window.Date.now||(window.Date.now=Date.now=function(){return(new Date).getTime()});for(var t=["webkit","moz"],n=0;n<t.length&&!window.requestAnimationFrame;++n){var e=t[n];window.requestAnimationFrame=window[e+"RequestAnimationFrame"],window.cancelAnimationFrame=window[e+"CancelAnimationFrame"]||window[e+"CancelRequestAnimationFrame"]}if(/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)||!window.requestAnimationFrame||!window.cancelAnimationFrame){var i=0;window.requestAnimationFrame=function(t){var n=Date.now(),e=Math.max(i+16,n);return setTimeout(function(){t(i=e)},e-n)},window.cancelAnimationFrame=clearTimeout}window.performance&&window.performance.now||(window.performance={start:Date.now(),now:function(){return Date.now()-this.start}})}(),Function.prototype.bind||(Function.prototype.bind=function(t){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var n=Array.prototype.slice.call(arguments,1),e=this,i=function(){},r=function(){return e.apply(this instanceof i?this:t,n.concat(Array.prototype.slice.call(arguments)))};return this.prototype&&(i.prototype=this.prototype),r.prototype=new i,r})},function(t,n,e){"use strict";function i(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}function r(t){return t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function o(t){return r(void 0!==t.constructor.name?t.constructor.name:t.className)}e.d(n,"a",function(){return c});var a=e(0),u=(e.n(a),e(1)),s=function(){function t(t,n){for(var e=0;e<n.length;e++){var i=n[e];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(n,e,i){return e&&t(n.prototype,e),i&&t(n,i),n}}(),c=function(){function t(n,r){i(this,t),this._setup(n,r);var a=o(this);this.uuid=e.i(u.b)(6,a),this.$element.attr("data-"+a)||this.$element.attr("data-"+a,this.uuid),this.$element.data("zfPlugin")||this.$element.data("zfPlugin",this),this.$element.trigger("init.zf."+a)}return s(t,[{key:"destroy",value:function(){this._destroy();var t=o(this);this.$element.removeAttr("data-"+t).removeData("zfPlugin").trigger("destroyed.zf."+t);for(var n in this)this[n]=null}}]),t}()},function(t,n,e){"use strict";function i(t){var n={};return"string"!=typeof t?n:(t=t.trim().slice(1,-1))?n=t.split("&").reduce(function(t,n){var e=n.replace(/\+/g," ").split("="),i=e[0],r=e[1];return i=decodeURIComponent(i),r=void 0===r?null:decodeURIComponent(r),t.hasOwnProperty(i)?Array.isArray(t[i])?t[i].push(r):t[i]=[t[i],r]:t[i]=r,t},{}):n}e.d(n,"a",function(){return u});var r=e(0),o=e.n(r),a=window.matchMedia||function(){var t=window.styleMedia||window.media;if(!t){var n=document.createElement("style"),e=document.getElementsByTagName("script")[0],i=null;n.type="text/css",n.id="matchmediajs-test",e&&e.parentNode&&e.parentNode.insertBefore(n,e),i="getComputedStyle"in window&&window.getComputedStyle(n,null)||n.currentStyle,t={matchMedium:function(t){var e="@media "+t+"{ #matchmediajs-test { width: 1px; } }";return n.styleSheet?n.styleSheet.cssText=e:n.textContent=e,"1px"===i.width}}}return function(n){return{matches:t.matchMedium(n||"all"),media:n||"all"}}}(),u={queries:[],current:"",_init:function(){var t=this;o()("meta.foundation-mq").length||o()('<meta class="foundation-mq">').appendTo(document.head);var n,e=o()(".foundation-mq").css("font-family");n=i(e);for(var r in n)n.hasOwnProperty(r)&&t.queries.push({name:r,value:"only screen and (min-width: "+n[r]+")"});this.current=this._getCurrentSize(),this._watcher()},atLeast:function(t){var n=this.get(t);return!!n&&a(n).matches},is:function(t){return t=t.trim().split(" "),t.length>1&&"only"===t[1]?t[0]===this._getCurrentSize():this.atLeast(t[0])},get:function(t){for(var n in this.queries)if(this.queries.hasOwnProperty(n)){var e=this.queries[n];if(t===e.name)return e.value}return null},_getCurrentSize:function(){for(var t,n=0;n<this.queries.length;n++){var e=this.queries[n];a(e.value).matches&&(t=e)}return"object"==typeof t?t.name:t},_watcher:function(){var t=this;o()(window).off("resize.zf.mediaquery").on("resize.zf.mediaquery",function(){var n=t._getCurrentSize(),e=t.current;n!==e&&(t.current=n,o()(window).trigger("changed.zf.mediaquery",[n,e]))})}}},function(t,n,e){t.exports=e(2)}]);
!function(t){function e(i){if(o[i])return o[i].exports;var n=o[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,e),n.l=!0,n.exports}var o={};e.m=t,e.c=o,e.i=function(t){return t},e.d=function(t,o,i){e.o(t,o)||Object.defineProperty(t,o,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var o=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(o,"a",o),o},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=100)}({1:function(t,e){t.exports={Foundation:window.Foundation}},100:function(t,e,o){t.exports=o(34)},3:function(t,e){t.exports={rtl:window.Foundation.rtl,GetYoDigits:window.Foundation.GetYoDigits,transitionend:window.Foundation.transitionend}},34:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=o(1),n=(o.n(i),o(64));i.Foundation.Box=n.a},64:function(t,e,o){"use strict";function i(t,e,o,i,f){return 0===n(t,e,o,i,f)}function n(t,e,o,i,n){var s,r,h,a,c=f(t);if(e){var l=f(e);r=l.height+l.offset.top-(c.offset.top+c.height),s=c.offset.top-l.offset.top,h=c.offset.left-l.offset.left,a=l.width+l.offset.left-(c.offset.left+c.width)}else r=c.windowDims.height+c.windowDims.offset.top-(c.offset.top+c.height),s=c.offset.top-c.windowDims.offset.top,h=c.offset.left-c.windowDims.offset.left,a=c.windowDims.width-(c.offset.left+c.width);return r=n?0:Math.min(r,0),s=Math.min(s,0),h=Math.min(h,0),a=Math.min(a,0),o?h+a:i?s+r:Math.sqrt(s*s+r*r+h*h+a*a)}function f(t){if((t=t.length?t[0]:t)===window||t===document)throw new Error("I'm sorry, Dave. I'm afraid I can't do that.");var e=t.getBoundingClientRect(),o=t.parentNode.getBoundingClientRect(),i=document.body.getBoundingClientRect(),n=window.pageYOffset,f=window.pageXOffset;return{width:e.width,height:e.height,offset:{top:e.top+n,left:e.left+f},parentDims:{width:o.width,height:o.height,offset:{top:o.top+n,left:o.left+f}},windowDims:{width:i.width,height:i.height,offset:{top:n,left:f}}}}function s(t,e,i,n,f,s){switch(console.log("NOTE: GetOffsets is deprecated in favor of GetExplicitOffsets and will be removed in 6.5"),i){case"top":return o.i(h.rtl)()?r(t,e,"top","left",n,f,s):r(t,e,"top","right",n,f,s);case"bottom":return o.i(h.rtl)()?r(t,e,"bottom","left",n,f,s):r(t,e,"bottom","right",n,f,s);case"center top":return r(t,e,"top","center",n,f,s);case"center bottom":return r(t,e,"bottom","center",n,f,s);case"center left":return r(t,e,"left","center",n,f,s);case"center right":return r(t,e,"right","center",n,f,s);case"left bottom":return r(t,e,"bottom","left",n,f,s);case"right bottom":return r(t,e,"bottom","right",n,f,s);case"center":return{left:$eleDims.windowDims.offset.left+$eleDims.windowDims.width/2-$eleDims.width/2+f,top:$eleDims.windowDims.offset.top+$eleDims.windowDims.height/2-($eleDims.height/2+n)};case"reveal":return{left:($eleDims.windowDims.width-$eleDims.width)/2+f,top:$eleDims.windowDims.offset.top+n};case"reveal full":return{left:$eleDims.windowDims.offset.left,top:$eleDims.windowDims.offset.top};default:return{left:o.i(h.rtl)()?$anchorDims.offset.left-$eleDims.width+$anchorDims.width-f:$anchorDims.offset.left+f,top:$anchorDims.offset.top+$anchorDims.height+n}}}function r(t,e,o,i,n,s,r){var h,a,c=f(t),l=e?f(e):null;switch(o){case"top":h=l.offset.top-(c.height+n);break;case"bottom":h=l.offset.top+l.height+n;break;case"left":a=l.offset.left-(c.width+s);break;case"right":a=l.offset.left+l.width+s}switch(o){case"top":case"bottom":switch(i){case"left":a=l.offset.left+s;break;case"right":a=l.offset.left-c.width+l.width-s;break;case"center":a=r?s:l.offset.left+l.width/2-c.width/2+s}break;case"right":case"left":switch(i){case"bottom":h=l.offset.top-n+l.height-c.height;break;case"top":h=l.offset.top+n;break;case"center":h=l.offset.top+n+l.height/2-c.height/2}}return{top:h,left:a}}o.d(e,"a",function(){return a});var h=o(3),a=(o.n(h),{ImNotTouchingYou:i,OverlapArea:n,GetDimensions:f,GetOffsets:s,GetExplicitOffsets:r})}});
!function(n){function t(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return n[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var e={};t.m=n,t.c=e,t.i=function(n){return n},t.d=function(n,e,o){t.o(n,e)||Object.defineProperty(n,e,{configurable:!1,enumerable:!0,get:o})},t.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(e,"a",e),e},t.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},t.p="",t(t.s=101)}({0:function(n,t){n.exports=jQuery},1:function(n,t){n.exports={Foundation:window.Foundation}},101:function(n,t,e){n.exports=e(35)},35:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=e(1),r=(e.n(o),e(65));o.Foundation.onImagesLoaded=r.a},65:function(n,t,e){"use strict";function o(n,t){function e(){0===--o&&t()}var o=n.length;0===o&&t(),n.each(function(){if(this.complete&&void 0!==this.naturalWidth)e();else{var n=new Image,t="load.zf.images error.zf.images";i()(n).one(t,function n(o){i()(this).off(t,n),e()}),n.src=i()(this).attr("src")}})}e.d(t,"a",function(){return o});var r=e(0),i=e.n(r)}});
!function(n){function t(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return n[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var e={};t.m=n,t.c=e,t.i=function(n){return n},t.d=function(n,e,o){t.o(n,e)||Object.defineProperty(n,e,{configurable:!1,enumerable:!0,get:o})},t.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(e,"a",e),e},t.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},t.p="",t(t.s=102)}({0:function(n,t){n.exports=jQuery},1:function(n,t){n.exports={Foundation:window.Foundation}},102:function(n,t,e){n.exports=e(36)},3:function(n,t){n.exports={rtl:window.Foundation.rtl,GetYoDigits:window.Foundation.GetYoDigits,transitionend:window.Foundation.transitionend}},36:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=e(1),r=(e.n(o),e(66));o.Foundation.Keyboard=r.a},66:function(n,t,e){"use strict";function o(n){return!!n&&n.find("a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]").filter(function(){return!(!a()(this).is(":visible")||a()(this).attr("tabindex")<0)})}function r(n){var t=d[n.which||n.keyCode]||String.fromCharCode(n.which).toUpperCase();return t=t.replace(/\W+/,""),n.shiftKey&&(t="SHIFT_"+t),n.ctrlKey&&(t="CTRL_"+t),n.altKey&&(t="ALT_"+t),t=t.replace(/_$/,"")}e.d(t,"a",function(){return c});var i=e(0),a=e.n(i),u=e(3),d=(e.n(u),{9:"TAB",13:"ENTER",27:"ESCAPE",32:"SPACE",35:"END",36:"HOME",37:"ARROW_LEFT",38:"ARROW_UP",39:"ARROW_RIGHT",40:"ARROW_DOWN"}),f={},c={keys:function(n){var t={};for(var e in n)t[n[e]]=n[e];return t}(d),parseKey:r,handleKey:function(n,t,o){var r,i,d,c=f[t],s=this.parseKey(n);if(!c)return console.warn("Component not defined!");if(r=void 0===c.ltr?c:e.i(u.rtl)()?a.a.extend({},c.ltr,c.rtl):a.a.extend({},c.rtl,c.ltr),i=r[s],(d=o[i])&&"function"==typeof d){var l=d.apply();(o.handled||"function"==typeof o.handled)&&o.handled(l)}else(o.unhandled||"function"==typeof o.unhandled)&&o.unhandled()},findFocusable:o,register:function(n,t){f[n]=t},trapFocus:function(n){var t=o(n),e=t.eq(0),i=t.eq(-1);n.on("keydown.zf.trapfocus",function(n){n.target===i[0]&&"TAB"===r(n)?(n.preventDefault(),e.focus()):n.target===e[0]&&"SHIFT_TAB"===r(n)&&(n.preventDefault(),i.focus())})},releaseFocus:function(n){n.off("keydown.zf.trapfocus")}}}});
!function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=103)}({0:function(e,t){e.exports=jQuery},1:function(e,t){e.exports={Foundation:window.Foundation}},103:function(e,t,n){e.exports=n(37)},37:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),i=(n.n(r),n(67));r.Foundation.MediaQuery=i.a,r.Foundation.MediaQuery._init()},67:function(e,t,n){"use strict";function r(e){var t={};return"string"!=typeof e?t:(e=e.trim().slice(1,-1))?t=e.split("&").reduce(function(e,t){var n=t.replace(/\+/g," ").split("="),r=n[0],i=n[1];return r=decodeURIComponent(r),i=void 0===i?null:decodeURIComponent(i),e.hasOwnProperty(r)?Array.isArray(e[r])?e[r].push(i):e[r]=[e[r],i]:e[r]=i,e},{}):t}n.d(t,"a",function(){return a});var i=n(0),u=n.n(i),o=window.matchMedia||function(){var e=window.styleMedia||window.media;if(!e){var t=document.createElement("style"),n=document.getElementsByTagName("script")[0],r=null;t.type="text/css",t.id="matchmediajs-test",n&&n.parentNode&&n.parentNode.insertBefore(t,n),r="getComputedStyle"in window&&window.getComputedStyle(t,null)||t.currentStyle,e={matchMedium:function(e){var n="@media "+e+"{ #matchmediajs-test { width: 1px; } }";return t.styleSheet?t.styleSheet.cssText=n:t.textContent=n,"1px"===r.width}}}return function(t){return{matches:e.matchMedium(t||"all"),media:t||"all"}}}(),a={queries:[],current:"",_init:function(){var e=this;u()("meta.foundation-mq").length||u()('<meta class="foundation-mq">').appendTo(document.head);var t,n=u()(".foundation-mq").css("font-family");t=r(n);for(var i in t)t.hasOwnProperty(i)&&e.queries.push({name:i,value:"only screen and (min-width: "+t[i]+")"});this.current=this._getCurrentSize(),this._watcher()},atLeast:function(e){var t=this.get(e);return!!t&&o(t).matches},is:function(e){return e=e.trim().split(" "),e.length>1&&"only"===e[1]?e[0]===this._getCurrentSize():this.atLeast(e[0])},get:function(e){for(var t in this.queries)if(this.queries.hasOwnProperty(t)){var n=this.queries[t];if(e===n.name)return n.value}return null},_getCurrentSize:function(){for(var e,t=0;t<this.queries.length;t++){var n=this.queries[t];o(n.value).matches&&(e=n)}return"object"==typeof e?e.name:e},_watcher:function(){var e=this;u()(window).off("resize.zf.mediaquery").on("resize.zf.mediaquery",function(){var t=e._getCurrentSize(),n=e.current;t!==n&&(e.current=t,u()(window).trigger("changed.zf.mediaquery",[t,n]))})}}}});
!function(n){function t(e){if(i[e])return i[e].exports;var o=i[e]={i:e,l:!1,exports:{}};return n[e].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var i={};t.m=n,t.c=i,t.i=function(n){return n},t.d=function(n,i,e){t.o(n,i)||Object.defineProperty(n,i,{configurable:!1,enumerable:!0,get:e})},t.n=function(n){var i=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(i,"a",i),i},t.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},t.p="",t(t.s=104)}({0:function(n,t){n.exports=jQuery},1:function(n,t){n.exports={Foundation:window.Foundation}},104:function(n,t,i){n.exports=i(38)},3:function(n,t){n.exports={rtl:window.Foundation.rtl,GetYoDigits:window.Foundation.GetYoDigits,transitionend:window.Foundation.transitionend}},38:function(n,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var e=i(1),o=(i.n(e),i(68));e.Foundation.Motion=o.a,e.Foundation.Move=o.b},68:function(n,t,i){"use strict";function e(n,t,i){function e(u){a||(a=u),r=u-a,i.apply(t),r<n?o=window.requestAnimationFrame(e,t):(window.cancelAnimationFrame(o),t.trigger("finished.zf.animate",[t]).triggerHandler("finished.zf.animate",[t]))}var o,r,a=null;if(0===n)return i.apply(t),void t.trigger("finished.zf.animate",[t]).triggerHandler("finished.zf.animate",[t]);o=window.requestAnimationFrame(e)}function o(n,t,e,o){function r(){n||t.hide(),d(),o&&o.apply(t)}function d(){t[0].style.transitionDuration=0,t.removeClass(c+" "+l+" "+e)}if(t=a()(t).eq(0),t.length){var c=n?s[0]:s[1],l=n?f[0]:f[1];d(),t.addClass(e).css("transition","none"),requestAnimationFrame(function(){t.addClass(c),n&&t.show()}),requestAnimationFrame(function(){t[0].offsetWidth,t.css("transition","").addClass(l)}),t.one(i.i(u.transitionend)(t),r)}}i.d(t,"b",function(){return e}),i.d(t,"a",function(){return d});var r=i(0),a=i.n(r),u=i(3),s=(i.n(u),["mui-enter","mui-leave"]),f=["mui-enter-active","mui-leave-active"],d={animateIn:function(n,t,i){o(!0,n,t,i)},animateOut:function(n,t,i){o(!1,n,t,i)}}}});
!function(n){function e(r){if(t[r])return t[r].exports;var u=t[r]={i:r,l:!1,exports:{}};return n[r].call(u.exports,u,u.exports,e),u.l=!0,u.exports}var t={};e.m=n,e.c=t,e.i=function(n){return n},e.d=function(n,t,r){e.o(n,t)||Object.defineProperty(n,t,{configurable:!1,enumerable:!0,get:r})},e.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(t,"a",t),t},e.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},e.p="",e(e.s=105)}({0:function(n,e){n.exports=jQuery},1:function(n,e){n.exports={Foundation:window.Foundation}},105:function(n,e,t){n.exports=t(39)},39:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=t(1),u=(t.n(r),t(69));r.Foundation.Nest=u.a},69:function(n,e,t){"use strict";t.d(e,"a",function(){return a});var r=t(0),u=t.n(r),a={Feather:function(n){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"zf";n.attr("role","menubar");var t=n.find("li").attr({role:"menuitem"}),r="is-"+e+"-submenu",a=r+"-item",i="is-"+e+"-submenu-parent",o="accordion"!==e;t.each(function(){var n=u()(this),t=n.children("ul");t.length&&(n.addClass(i),t.addClass("submenu "+r).attr({"data-submenu":""}),o&&(n.attr({"aria-haspopup":!0,"aria-label":n.children("a:first").text()}),"drilldown"===e&&n.attr({"aria-expanded":!1})),t.addClass("submenu "+r).attr({"data-submenu":"",role:"menu"}),"drilldown"===e&&t.attr({"aria-hidden":!0})),n.parent("[data-submenu]").length&&n.addClass("is-submenu-item "+a)})},Burn:function(n,e){var t="is-"+e+"-submenu",r=t+"-item",u="is-"+e+"-submenu-parent";n.find(">li, .menu, .menu > li").removeClass(t+" "+r+" "+u+" is-submenu-item submenu is-active").removeAttr("data-submenu").css("display","")}}}});
!function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=107)}({0:function(e,t){e.exports=jQuery},107:function(e,t,n){e.exports=n(41)},41:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=n.n(o),u=n(71);u.a.init(i.a),window.Foundation.Touch=u.a},71:function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(){this.removeEventListener("touchmove",u),this.removeEventListener("touchend",i),w=!1}function u(e){if(l.a.spotSwipe.preventDefault&&e.preventDefault(),w){var t,n=e.touches[0].pageX,o=(e.touches[0].pageY,s-n);p=(new Date).getTime()-h,Math.abs(o)>=l.a.spotSwipe.moveThreshold&&p<=l.a.spotSwipe.timeThreshold&&(t=o>0?"left":"right"),t&&(e.preventDefault(),i.call(this),l()(this).trigger("swipe",t).trigger("swipe"+t))}}function r(e){1==e.touches.length&&(s=e.touches[0].pageX,a=e.touches[0].pageY,w=!0,h=(new Date).getTime(),this.addEventListener("touchmove",u,!1),this.addEventListener("touchend",i,!1))}function c(){this.addEventListener&&this.addEventListener("touchstart",r,!1)}n.d(t,"a",function(){return v});var s,a,h,p,f=n(0),l=n.n(f),d=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),v={},w=!1,m=function(){function e(t){o(this,e),this.version="1.0.0",this.enabled="ontouchstart"in document.documentElement,this.preventDefault=!1,this.moveThreshold=75,this.timeThreshold=200,this.$=t,this._init()}return d(e,[{key:"_init",value:function(){var e=this.$;e.event.special.swipe={setup:c},e.each(["left","up","down","right"],function(){e.event.special["swipe"+this]={setup:function(){e(this).on("swipe",e.noop)}}})}}]),e}();v.setupSpotSwipe=function(e){e.spotSwipe=new m(e)},v.setupTouchHandler=function(e){e.fn.addTouch=function(){this.each(function(n,o){e(o).bind("touchstart touchmove touchend touchcancel",function(){t(event)})});var t=function(e){var t,n=e.changedTouches,o=n[0],i={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup"},u=i[e.type];"MouseEvent"in window&&"function"==typeof window.MouseEvent?t=new window.MouseEvent(u,{bubbles:!0,cancelable:!0,screenX:o.screenX,screenY:o.screenY,clientX:o.clientX,clientY:o.clientY}):(t=document.createEvent("MouseEvent"),t.initMouseEvent(u,!0,!0,window,1,o.screenX,o.screenY,o.clientX,o.clientY,!1,!1,!1,!1,0,null)),o.target.dispatchEvent(t)}}},v.init=function(e){void 0===e.spotSwipe&&(v.setupSpotSwipe(e),v.setupTouchHandler(e))}}});
!function(e){function t(r){if(i[r])return i[r].exports;var n=i[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var i={};t.m=e,t.c=i,t.i=function(e){return e},t.d=function(e,i,r){t.o(e,i)||Object.defineProperty(e,i,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var i=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(i,"a",i),i},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=108)}({0:function(e,t){e.exports=jQuery},1:function(e,t){e.exports={Foundation:window.Foundation}},108:function(e,t,i){e.exports=i(42)},4:function(e,t){e.exports={Motion:window.Foundation.Motion,Move:window.Foundation.Move}},42:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=i(1),n=(i.n(r),i(0)),s=i.n(n);i(7).a.init(s.a,r.Foundation)},7:function(e,t,i){"use strict";function r(e,t,i){var r=void 0,n=Array.prototype.slice.call(arguments,3);s()(window).off(t).on(t,function(t){r&&clearTimeout(r),r=setTimeout(function(){i.apply(null,n)},e||10)})}i.d(t,"a",function(){return c});var n=i(0),s=i.n(n),a=i(4),o=(i.n(a),function(){for(var e=["WebKit","Moz","O","Ms",""],t=0;t<e.length;t++)if(e[t]+"MutationObserver"in window)return window[e[t]+"MutationObserver"];return!1}()),l=function(e,t){e.data(t).split(" ").forEach(function(i){s()("#"+i)["close"===t?"trigger":"triggerHandler"](t+".zf.trigger",[e])})},c={Listeners:{Basic:{},Global:{}},Initializers:{}};c.Listeners.Basic={openListener:function(){l(s()(this),"open")},closeListener:function(){s()(this).data("close")?l(s()(this),"close"):s()(this).trigger("close.zf.trigger")},toggleListener:function(){s()(this).data("toggle")?l(s()(this),"toggle"):s()(this).trigger("toggle.zf.trigger")},closeableListener:function(e){e.stopPropagation();var t=s()(this).data("closable");""!==t?a.Motion.animateOut(s()(this),t,function(){s()(this).trigger("closed.zf")}):s()(this).fadeOut().trigger("closed.zf")},toggleFocusListener:function(){var e=s()(this).data("toggle-focus");s()("#"+e).triggerHandler("toggle.zf.trigger",[s()(this)])}},c.Initializers.addOpenListener=function(e){e.off("click.zf.trigger",c.Listeners.Basic.openListener),e.on("click.zf.trigger","[data-open]",c.Listeners.Basic.openListener)},c.Initializers.addCloseListener=function(e){e.off("click.zf.trigger",c.Listeners.Basic.closeListener),e.on("click.zf.trigger","[data-close]",c.Listeners.Basic.closeListener)},c.Initializers.addToggleListener=function(e){e.off("click.zf.trigger",c.Listeners.Basic.toggleListener),e.on("click.zf.trigger","[data-toggle]",c.Listeners.Basic.toggleListener)},c.Initializers.addCloseableListener=function(e){e.off("close.zf.trigger",c.Listeners.Basic.closeableListener),e.on("close.zf.trigger","[data-closeable], [data-closable]",c.Listeners.Basic.closeableListener)},c.Initializers.addToggleFocusListener=function(e){e.off("focus.zf.trigger blur.zf.trigger",c.Listeners.Basic.toggleFocusListener),e.on("focus.zf.trigger blur.zf.trigger","[data-toggle-focus]",c.Listeners.Basic.toggleFocusListener)},c.Listeners.Global={resizeListener:function(e){o||e.each(function(){s()(this).triggerHandler("resizeme.zf.trigger")}),e.attr("data-events","resize")},scrollListener:function(e){o||e.each(function(){s()(this).triggerHandler("scrollme.zf.trigger")}),e.attr("data-events","scroll")},closeMeListener:function(e,t){var i=e.namespace.split(".")[0];s()("[data-"+i+"]").not('[data-yeti-box="'+t+'"]').each(function(){var e=s()(this);e.triggerHandler("close.zf.trigger",[e])})}},c.Initializers.addClosemeListener=function(e){var t=s()("[data-yeti-box]"),i=["dropdown","tooltip","reveal"];if(e&&("string"==typeof e?i.push(e):"object"==typeof e&&"string"==typeof e[0]?i.concat(e):console.error("Plugin names must be strings")),t.length){var r=i.map(function(e){return"closeme.zf."+e}).join(" ");s()(window).off(r).on(r,c.Listeners.Global.closeMeListener)}},c.Initializers.addResizeListener=function(e){var t=s()("[data-resize]");t.length&&r(e,"resize.zf.trigger",c.Listeners.Global.resizeListener,t)},c.Initializers.addScrollListener=function(e){var t=s()("[data-scroll]");t.length&&r(e,"scroll.zf.trigger",c.Listeners.Global.scrollListener,t)},c.Initializers.addMutationEventsListener=function(e){if(!o)return!1;var t=e.find("[data-resize], [data-scroll], [data-mutate]"),i=function(e){var t=s()(e[0].target);switch(e[0].type){case"attributes":"scroll"===t.attr("data-events")&&"data-events"===e[0].attributeName&&t.triggerHandler("scrollme.zf.trigger",[t,window.pageYOffset]),"resize"===t.attr("data-events")&&"data-events"===e[0].attributeName&&t.triggerHandler("resizeme.zf.trigger",[t]),"style"===e[0].attributeName&&(t.closest("[data-mutate]").attr("data-events","mutate"),t.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger",[t.closest("[data-mutate]")]));break;case"childList":t.closest("[data-mutate]").attr("data-events","mutate"),t.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger",[t.closest("[data-mutate]")]);break;default:return!1}};if(t.length)for(var r=0;r<=t.length-1;r++){var n=new o(i);n.observe(t[r],{attributes:!0,childList:!0,characterData:!1,subtree:!0,attributeFilter:["data-events","style"]})}},c.Initializers.addSimpleListeners=function(){var e=s()(document);c.Initializers.addOpenListener(e),c.Initializers.addCloseListener(e),c.Initializers.addToggleListener(e),c.Initializers.addCloseableListener(e),c.Initializers.addToggleFocusListener(e)},c.Initializers.addGlobalListeners=function(){var e=s()(document);c.Initializers.addMutationEventsListener(e),c.Initializers.addResizeListener(),c.Initializers.addScrollListener(),c.Initializers.addClosemeListener()},c.init=function(e,t){if(void 0===e.triggersInitialized){e(document);"complete"===document.readyState?(c.Initializers.addSimpleListeners(),c.Initializers.addGlobalListeners()):e(window).on("load",function(){c.Initializers.addSimpleListeners(),c.Initializers.addGlobalListeners()}),e.triggersInitialized=!0}t&&(t.Triggers=c,t.IHearYou=c.Initializers.addGlobalListeners)}}});
!function(t){function e(n){if(i[n])return i[n].exports;var o=i[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var i={};e.m=t,e.c=i,e.i=function(t){return t},e.d=function(t,i,n){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=83)}({0:function(t,e){t.exports=jQuery},1:function(t,e){t.exports={Foundation:window.Foundation}},11:function(t,e,i){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function r(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function s(t,e){var i=e.indexOf(t);return i===e.length-1?e[0]:e[i+1]}i.d(e,"a",function(){return p});var a=i(8),l=(i.n(a),i(2)),u=(i.n(l),i(3)),c=(i.n(u),function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}()),f=["left","right","top","bottom"],d=["top","bottom","center"],h=["left","right","center"],g={left:d,right:d,top:h,bottom:h},p=function(t){function e(){return n(this,e),o(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return r(e,t),c(e,[{key:"_init",value:function(){this.triedPositions={},this.position="auto"===this.options.position?this._getDefaultPosition():this.options.position,this.alignment="auto"===this.options.alignment?this._getDefaultAlignment():this.options.alignment}},{key:"_getDefaultPosition",value:function(){return"bottom"}},{key:"_getDefaultAlignment",value:function(){switch(this.position){case"bottom":case"top":return i.i(u.rtl)()?"right":"left";case"left":case"right":return"bottom"}}},{key:"_reposition",value:function(){this._alignmentsExhausted(this.position)?(this.position=s(this.position,f),this.alignment=g[this.position][0]):this._realign()}},{key:"_realign",value:function(){this._addTriedPosition(this.position,this.alignment),this.alignment=s(this.alignment,g[this.position])}},{key:"_addTriedPosition",value:function(t,e){this.triedPositions[t]=this.triedPositions[t]||[],this.triedPositions[t].push(e)}},{key:"_positionsExhausted",value:function(){for(var t=!0,e=0;e<f.length;e++)t=t&&this._alignmentsExhausted(f[e]);return t}},{key:"_alignmentsExhausted",value:function(t){return this.triedPositions[t]&&this.triedPositions[t].length==g[t].length}},{key:"_getVOffset",value:function(){return this.options.vOffset}},{key:"_getHOffset",value:function(){return this.options.hOffset}},{key:"_setPosition",value:function(t,e,i){if("false"===t.attr("aria-expanded"))return!1;a.Box.GetDimensions(e),a.Box.GetDimensions(t);if(e.offset(a.Box.GetExplicitOffsets(e,t,this.position,this.alignment,this._getVOffset(),this._getHOffset())),!this.options.allowOverlap){for(var n=1e8,o={position:this.position,alignment:this.alignment};!this._positionsExhausted();){var r=a.Box.OverlapArea(e,i,!1,!1,this.options.allowBottomOverlap);if(0===r)return;r<n&&(n=r,o={position:this.position,alignment:this.alignment}),this._reposition(),e.offset(a.Box.GetExplicitOffsets(e,t,this.position,this.alignment,this._getVOffset(),this._getHOffset()))}this.position=o.position,this.alignment=o.alignment,e.offset(a.Box.GetExplicitOffsets(e,t,this.position,this.alignment,this._getVOffset(),this._getHOffset()))}}}]),e}(l.Plugin);p.defaults={position:"auto",alignment:"auto",allowOverlap:!1,allowBottomOverlap:!0,vOffset:0,hOffset:0}},17:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(1),o=(i.n(n),i(47));n.Foundation.plugin(o.a,"Dropdown")},2:function(t,e){t.exports={Plugin:window.Foundation.Plugin}},3:function(t,e){t.exports={rtl:window.Foundation.rtl,GetYoDigits:window.Foundation.GetYoDigits,transitionend:window.Foundation.transitionend}},4:function(t,e){t.exports={Motion:window.Foundation.Motion,Move:window.Foundation.Move}},47:function(t,e,i){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function r(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}i.d(e,"a",function(){return g});var s=i(0),a=i.n(s),l=i(5),u=(i.n(l),i(3)),c=(i.n(u),i(11)),f=i(7),d=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),h=function t(e,i,n){null===e&&(e=Function.prototype);var o=Object.getOwnPropertyDescriptor(e,i);if(void 0===o){var r=Object.getPrototypeOf(e);return null===r?void 0:t(r,i,n)}if("value"in o)return o.value;var s=o.get;if(void 0!==s)return s.call(n)},g=function(t){function e(){return n(this,e),o(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return r(e,t),d(e,[{key:"_setup",value:function(t,i){this.$element=t,this.options=a.a.extend({},e.defaults,this.$element.data(),i),this.className="Dropdown",f.a.init(a.a),this._init(),l.Keyboard.register("Dropdown",{ENTER:"open",SPACE:"open",ESCAPE:"close"})}},{key:"_init",value:function(){var t=this.$element.attr("id");this.$anchors=a()('[data-toggle="'+t+'"]').length?a()('[data-toggle="'+t+'"]'):a()('[data-open="'+t+'"]'),this.$anchors.attr({"aria-controls":t,"data-is-focus":!1,"data-yeti-box":t,"aria-haspopup":!0,"aria-expanded":!1}),this._setCurrentAnchor(this.$anchors.first()),this.options.parentClass?this.$parent=this.$element.parents("."+this.options.parentClass):this.$parent=null,this.$element.attr({"aria-hidden":"true","data-yeti-box":t,"data-resize":t,"aria-labelledby":this.$currentAnchor.id||i.i(u.GetYoDigits)(6,"dd-anchor")}),h(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"_init",this).call(this),this._events()}},{key:"_getDefaultPosition",value:function(){var t=this.$element[0].className.match(/(top|left|right|bottom)/g);return t?t[0]:"bottom"}},{key:"_getDefaultAlignment",value:function(){var t=/float-(\S+)/.exec(this.$currentAnchor.className);return t?t[1]:h(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"_getDefaultAlignment",this).call(this)}},{key:"_setPosition",value:function(){h(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"_setPosition",this).call(this,this.$currentAnchor,this.$element,this.$parent)}},{key:"_setCurrentAnchor",value:function(t){this.$currentAnchor=a()(t)}},{key:"_events",value:function(){var t=this;this.$element.on({"open.zf.trigger":this.open.bind(this),"close.zf.trigger":this.close.bind(this),"toggle.zf.trigger":this.toggle.bind(this),"resizeme.zf.trigger":this._setPosition.bind(this)}),this.$anchors.off("click.zf.trigger").on("click.zf.trigger",function(){t._setCurrentAnchor(this)}),this.options.hover&&(this.$anchors.off("mouseenter.zf.dropdown mouseleave.zf.dropdown").on("mouseenter.zf.dropdown",function(){t._setCurrentAnchor(this);var e=a()("body").data();void 0!==e.whatinput&&"mouse"!==e.whatinput||(clearTimeout(t.timeout),t.timeout=setTimeout(function(){t.open(),t.$anchors.data("hover",!0)},t.options.hoverDelay))}).on("mouseleave.zf.dropdown",function(){clearTimeout(t.timeout),t.timeout=setTimeout(function(){t.close(),t.$anchors.data("hover",!1)},t.options.hoverDelay)}),this.options.hoverPane&&this.$element.off("mouseenter.zf.dropdown mouseleave.zf.dropdown").on("mouseenter.zf.dropdown",function(){clearTimeout(t.timeout)}).on("mouseleave.zf.dropdown",function(){clearTimeout(t.timeout),t.timeout=setTimeout(function(){t.close(),t.$anchors.data("hover",!1)},t.options.hoverDelay)})),this.$anchors.add(this.$element).on("keydown.zf.dropdown",function(e){var i=a()(this);l.Keyboard.findFocusable(t.$element);l.Keyboard.handleKey(e,"Dropdown",{open:function(){i.is(t.$anchors)&&(t.open(),t.$element.attr("tabindex",-1).focus(),e.preventDefault())},close:function(){t.close(),t.$anchors.focus()}})})}},{key:"_addBodyHandler",value:function(){var t=a()(document.body).not(this.$element),e=this;t.off("click.zf.dropdown").on("click.zf.dropdown",function(i){e.$anchors.is(i.target)||e.$anchors.find(i.target).length||e.$element.find(i.target).length||(e.close(),t.off("click.zf.dropdown"))})}},{key:"open",value:function(){if(this.$element.trigger("closeme.zf.dropdown",this.$element.attr("id")),this.$anchors.addClass("hover").attr({"aria-expanded":!0}),this.$element.addClass("is-opening"),this._setPosition(),this.$element.removeClass("is-opening").addClass("is-open").attr({"aria-hidden":!1}),this.options.autoFocus){var t=l.Keyboard.findFocusable(this.$element);t.length&&t.eq(0).focus()}this.options.closeOnClick&&this._addBodyHandler(),this.options.trapFocus&&l.Keyboard.trapFocus(this.$element),this.$element.trigger("show.zf.dropdown",[this.$element])}},{key:"close",value:function(){if(!this.$element.hasClass("is-open"))return!1;this.$element.removeClass("is-open").attr({"aria-hidden":!0}),this.$anchors.removeClass("hover").attr("aria-expanded",!1),this.$element.trigger("hide.zf.dropdown",[this.$element]),this.options.trapFocus&&l.Keyboard.releaseFocus(this.$element)}},{key:"toggle",value:function(){if(this.$element.hasClass("is-open")){if(this.$anchors.data("hover"))return;this.close()}else this.open()}},{key:"_destroy",value:function(){this.$element.off(".zf.trigger").hide(),this.$anchors.off(".zf.dropdown"),a()(document.body).off("click.zf.dropdown")}}]),e}(c.a);g.defaults={parentClass:null,hoverDelay:250,hover:!1,hoverPane:!1,vOffset:0,hOffset:0,positionClass:"",position:"auto",alignment:"auto",allowOverlap:!1,allowBottomOverlap:!0,trapFocus:!1,autoFocus:!1,closeOnClick:!1}},5:function(t,e){t.exports={Keyboard:window.Foundation.Keyboard}},7:function(t,e,i){"use strict";function n(t,e,i){var n=void 0,o=Array.prototype.slice.call(arguments,3);r()(window).off(e).on(e,function(e){n&&clearTimeout(n),n=setTimeout(function(){i.apply(null,o)},t||10)})}i.d(e,"a",function(){return u});var o=i(0),r=i.n(o),s=i(4),a=(i.n(s),function(){for(var t=["WebKit","Moz","O","Ms",""],e=0;e<t.length;e++)if(t[e]+"MutationObserver"in window)return window[t[e]+"MutationObserver"];return!1}()),l=function(t,e){t.data(e).split(" ").forEach(function(i){r()("#"+i)["close"===e?"trigger":"triggerHandler"](e+".zf.trigger",[t])})},u={Listeners:{Basic:{},Global:{}},Initializers:{}};u.Listeners.Basic={openListener:function(){l(r()(this),"open")},closeListener:function(){r()(this).data("close")?l(r()(this),"close"):r()(this).trigger("close.zf.trigger")},toggleListener:function(){r()(this).data("toggle")?l(r()(this),"toggle"):r()(this).trigger("toggle.zf.trigger")},closeableListener:function(t){t.stopPropagation();var e=r()(this).data("closable");""!==e?s.Motion.animateOut(r()(this),e,function(){r()(this).trigger("closed.zf")}):r()(this).fadeOut().trigger("closed.zf")},toggleFocusListener:function(){var t=r()(this).data("toggle-focus");r()("#"+t).triggerHandler("toggle.zf.trigger",[r()(this)])}},u.Initializers.addOpenListener=function(t){t.off("click.zf.trigger",u.Listeners.Basic.openListener),t.on("click.zf.trigger","[data-open]",u.Listeners.Basic.openListener)},u.Initializers.addCloseListener=function(t){t.off("click.zf.trigger",u.Listeners.Basic.closeListener),t.on("click.zf.trigger","[data-close]",u.Listeners.Basic.closeListener)},u.Initializers.addToggleListener=function(t){t.off("click.zf.trigger",u.Listeners.Basic.toggleListener),t.on("click.zf.trigger","[data-toggle]",u.Listeners.Basic.toggleListener)},u.Initializers.addCloseableListener=function(t){t.off("close.zf.trigger",u.Listeners.Basic.closeableListener),t.on("close.zf.trigger","[data-closeable], [data-closable]",u.Listeners.Basic.closeableListener)},u.Initializers.addToggleFocusListener=function(t){t.off("focus.zf.trigger blur.zf.trigger",u.Listeners.Basic.toggleFocusListener),t.on("focus.zf.trigger blur.zf.trigger","[data-toggle-focus]",u.Listeners.Basic.toggleFocusListener)},u.Listeners.Global={resizeListener:function(t){a||t.each(function(){r()(this).triggerHandler("resizeme.zf.trigger")}),t.attr("data-events","resize")},scrollListener:function(t){a||t.each(function(){r()(this).triggerHandler("scrollme.zf.trigger")}),t.attr("data-events","scroll")},closeMeListener:function(t,e){var i=t.namespace.split(".")[0];r()("[data-"+i+"]").not('[data-yeti-box="'+e+'"]').each(function(){var t=r()(this);t.triggerHandler("close.zf.trigger",[t])})}},u.Initializers.addClosemeListener=function(t){var e=r()("[data-yeti-box]"),i=["dropdown","tooltip","reveal"];if(t&&("string"==typeof t?i.push(t):"object"==typeof t&&"string"==typeof t[0]?i.concat(t):console.error("Plugin names must be strings")),e.length){var n=i.map(function(t){return"closeme.zf."+t}).join(" ");r()(window).off(n).on(n,u.Listeners.Global.closeMeListener)}},u.Initializers.addResizeListener=function(t){var e=r()("[data-resize]");e.length&&n(t,"resize.zf.trigger",u.Listeners.Global.resizeListener,e)},u.Initializers.addScrollListener=function(t){var e=r()("[data-scroll]");e.length&&n(t,"scroll.zf.trigger",u.Listeners.Global.scrollListener,e)},u.Initializers.addMutationEventsListener=function(t){if(!a)return!1;var e=t.find("[data-resize], [data-scroll], [data-mutate]"),i=function(t){var e=r()(t[0].target);switch(t[0].type){case"attributes":"scroll"===e.attr("data-events")&&"data-events"===t[0].attributeName&&e.triggerHandler("scrollme.zf.trigger",[e,window.pageYOffset]),"resize"===e.attr("data-events")&&"data-events"===t[0].attributeName&&e.triggerHandler("resizeme.zf.trigger",[e]),"style"===t[0].attributeName&&(e.closest("[data-mutate]").attr("data-events","mutate"),e.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger",[e.closest("[data-mutate]")]));break;case"childList":e.closest("[data-mutate]").attr("data-events","mutate"),e.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger",[e.closest("[data-mutate]")]);break;default:return!1}};if(e.length)for(var n=0;n<=e.length-1;n++){var o=new a(i);o.observe(e[n],{attributes:!0,childList:!0,characterData:!1,subtree:!0,attributeFilter:["data-events","style"]})}},u.Initializers.addSimpleListeners=function(){var t=r()(document);u.Initializers.addOpenListener(t),u.Initializers.addCloseListener(t),u.Initializers.addToggleListener(t),u.Initializers.addCloseableListener(t),u.Initializers.addToggleFocusListener(t)},u.Initializers.addGlobalListeners=function(){var t=r()(document);u.Initializers.addMutationEventsListener(t),u.Initializers.addResizeListener(),u.Initializers.addScrollListener(),u.Initializers.addClosemeListener()},u.init=function(t,e){if(void 0===t.triggersInitialized){t(document);"complete"===document.readyState?(u.Initializers.addSimpleListeners(),u.Initializers.addGlobalListeners()):t(window).on("load",function(){u.Initializers.addSimpleListeners(),u.Initializers.addGlobalListeners()}),t.triggersInitialized=!0}e&&(e.Triggers=u,e.IHearYou=u.Initializers.addGlobalListeners)}},8:function(t,e){t.exports={Box:window.Foundation.Box}},83:function(t,e,i){t.exports=i(17)}});
!function(e){function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}var t={};n.m=e,n.c=t,n.i=function(e){return e},n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=84)}({0:function(e,n){e.exports=jQuery},1:function(e,n){e.exports={Foundation:window.Foundation}},18:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=t(1),i=(t.n(o),t(48));o.Foundation.plugin(i.a,"DropdownMenu")},2:function(e,n){e.exports={Plugin:window.Foundation.Plugin}},3:function(e,n){e.exports={rtl:window.Foundation.rtl,GetYoDigits:window.Foundation.GetYoDigits,transitionend:window.Foundation.transitionend}},48:function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function i(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function s(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}t.d(n,"a",function(){return h});var r=t(0),a=t.n(r),u=t(5),d=(t.n(u),t(9)),l=(t.n(d),t(8)),p=(t.n(l),t(3)),c=(t.n(p),t(2)),f=(t.n(c),function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}()),h=function(e){function n(){return o(this,n),i(this,(n.__proto__||Object.getPrototypeOf(n)).apply(this,arguments))}return s(n,e),f(n,[{key:"_setup",value:function(e,t){this.$element=e,this.options=a.a.extend({},n.defaults,this.$element.data(),t),this.className="DropdownMenu",this._init(),u.Keyboard.register("DropdownMenu",{ENTER:"open",SPACE:"open",ARROW_RIGHT:"next",ARROW_UP:"up",ARROW_DOWN:"down",ARROW_LEFT:"previous",ESCAPE:"close"})}},{key:"_init",value:function(){d.Nest.Feather(this.$element,"dropdown");var e=this.$element.find("li.is-dropdown-submenu-parent");this.$element.children(".is-dropdown-submenu-parent").children(".is-dropdown-submenu").addClass("first-sub"),this.$menuItems=this.$element.find('[role="menuitem"]'),this.$tabs=this.$element.children('[role="menuitem"]'),this.$tabs.find("ul.is-dropdown-submenu").addClass(this.options.verticalClass),"auto"===this.options.alignment?this.$element.hasClass(this.options.rightClass)||t.i(p.rtl)()||this.$element.parents(".top-bar-right").is("*")?(this.options.alignment="right",e.addClass("opens-left")):(this.options.alignment="left",e.addClass("opens-right")):"right"===this.options.alignment?e.addClass("opens-left"):e.addClass("opens-right"),this.changed=!1,this._events()}},{key:"_isVertical",value:function(){return"block"===this.$tabs.css("display")||"column"===this.$element.css("flex-direction")}},{key:"_isRtl",value:function(){return this.$element.hasClass("align-right")||t.i(p.rtl)()&&!this.$element.hasClass("align-left")}},{key:"_events",value:function(){var e=this,n="ontouchstart"in window||void 0!==window.ontouchstart,t="is-dropdown-submenu-parent",o=function(o){var i=a()(o.target).parentsUntil("ul","."+t),s=i.hasClass(t),r="true"===i.attr("data-is-click"),u=i.children(".is-dropdown-submenu");if(s)if(r){if(!e.options.closeOnClick||!e.options.clickOpen&&!n||e.options.forceFollow&&n)return;o.stopImmediatePropagation(),o.preventDefault(),e._hide(i)}else o.preventDefault(),o.stopImmediatePropagation(),e._show(u),i.add(i.parentsUntil(e.$element,"."+t)).attr("data-is-click",!0)};(this.options.clickOpen||n)&&this.$menuItems.on("click.zf.dropdownmenu touchstart.zf.dropdownmenu",o),e.options.closeOnClickInside&&this.$menuItems.on("click.zf.dropdownmenu",function(n){a()(this).hasClass(t)||e._hide()}),this.options.disableHover||this.$menuItems.on("mouseenter.zf.dropdownmenu",function(n){var o=a()(this);o.hasClass(t)&&(clearTimeout(o.data("_delay")),o.data("_delay",setTimeout(function(){e._show(o.children(".is-dropdown-submenu"))},e.options.hoverDelay)))}).on("mouseleave.zf.dropdownmenu",function(n){var o=a()(this);if(o.hasClass(t)&&e.options.autoclose){if("true"===o.attr("data-is-click")&&e.options.clickOpen)return!1;clearTimeout(o.data("_delay")),o.data("_delay",setTimeout(function(){e._hide(o)},e.options.closingTime))}}),this.$menuItems.on("keydown.zf.dropdownmenu",function(n){var t,o,i=a()(n.target).parentsUntil("ul",'[role="menuitem"]'),s=e.$tabs.index(i)>-1,r=s?e.$tabs:i.siblings("li").add(i);r.each(function(e){if(a()(this).is(i))return t=r.eq(e-1),void(o=r.eq(e+1))});var d=function(){o.children("a:first").focus(),n.preventDefault()},l=function(){t.children("a:first").focus(),n.preventDefault()},p=function(){var t=i.children("ul.is-dropdown-submenu");t.length&&(e._show(t),i.find("li > a:first").focus(),n.preventDefault())},c=function(){var t=i.parent("ul").parent("li");t.children("a:first").focus(),e._hide(t),n.preventDefault()},f={open:p,close:function(){e._hide(e.$element),e.$menuItems.eq(0).children("a").focus(),n.preventDefault()},handled:function(){n.stopImmediatePropagation()}};s?e._isVertical()?e._isRtl()?a.a.extend(f,{down:d,up:l,next:c,previous:p}):a.a.extend(f,{down:d,up:l,next:p,previous:c}):e._isRtl()?a.a.extend(f,{next:l,previous:d,down:p,up:c}):a.a.extend(f,{next:d,previous:l,down:p,up:c}):e._isRtl()?a.a.extend(f,{next:c,previous:p,down:d,up:l}):a.a.extend(f,{next:p,previous:c,down:d,up:l}),u.Keyboard.handleKey(n,"DropdownMenu",f)})}},{key:"_addBodyHandler",value:function(){var e=a()(document.body),n=this;e.off("mouseup.zf.dropdownmenu touchend.zf.dropdownmenu").on("mouseup.zf.dropdownmenu touchend.zf.dropdownmenu",function(t){n.$element.find(t.target).length||(n._hide(),e.off("mouseup.zf.dropdownmenu touchend.zf.dropdownmenu"))})}},{key:"_show",value:function(e){var n=this.$tabs.index(this.$tabs.filter(function(n,t){return a()(t).find(e).length>0})),t=e.parent("li.is-dropdown-submenu-parent").siblings("li.is-dropdown-submenu-parent");this._hide(t,n),e.css("visibility","hidden").addClass("js-dropdown-active").parent("li.is-dropdown-submenu-parent").addClass("is-active");var o=l.Box.ImNotTouchingYou(e,null,!0);if(!o){var i="left"===this.options.alignment?"-right":"-left",s=e.parent(".is-dropdown-submenu-parent");s.removeClass("opens"+i).addClass("opens-"+this.options.alignment),o=l.Box.ImNotTouchingYou(e,null,!0),o||s.removeClass("opens-"+this.options.alignment).addClass("opens-inner"),this.changed=!0}e.css("visibility",""),this.options.closeOnClick&&this._addBodyHandler(),this.$element.trigger("show.zf.dropdownmenu",[e])}},{key:"_hide",value:function(e,n){var t;if(t=e&&e.length?e:void 0!==n?this.$tabs.not(function(e,t){return e===n}):this.$element,t.hasClass("is-active")||t.find(".is-active").length>0){if(t.find("li.is-active").add(t).attr({"data-is-click":!1}).removeClass("is-active"),t.find("ul.js-dropdown-active").removeClass("js-dropdown-active"),this.changed||t.find("opens-inner").length){var o="left"===this.options.alignment?"right":"left";t.find("li.is-dropdown-submenu-parent").add(t).removeClass("opens-inner opens-"+this.options.alignment).addClass("opens-"+o),this.changed=!1}this.$element.trigger("hide.zf.dropdownmenu",[t])}}},{key:"_destroy",value:function(){this.$menuItems.off(".zf.dropdownmenu").removeAttr("data-is-click").removeClass("is-right-arrow is-left-arrow is-down-arrow opens-right opens-left opens-inner"),a()(document.body).off(".zf.dropdownmenu"),d.Nest.Burn(this.$element,"dropdown")}}]),n}(c.Plugin);h.defaults={disableHover:!1,autoclose:!0,hoverDelay:50,clickOpen:!1,closingTime:500,alignment:"auto",closeOnClick:!0,closeOnClickInside:!0,verticalClass:"vertical",rightClass:"align-right",forceFollow:!0}},5:function(e,n){e.exports={Keyboard:window.Foundation.Keyboard}},8:function(e,n){e.exports={Box:window.Foundation.Box}},84:function(e,n,t){e.exports=t(18)},9:function(e,n){e.exports={Nest:window.Foundation.Nest}}});
!function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=86)}({0:function(e,t){e.exports=jQuery},1:function(e,t){e.exports={Foundation:window.Foundation}},2:function(e,t){e.exports={Plugin:window.Foundation.Plugin}},20:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),i=(n.n(r),n(50));r.Foundation.plugin(i.a,"Interchange")},3:function(e,t){e.exports={rtl:window.Foundation.rtl,GetYoDigits:window.Foundation.GetYoDigits,transitionend:window.Foundation.transitionend}},50:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}n.d(t,"a",function(){return p});var a=n(0),u=n.n(a),s=n(6),c=(n.n(s),n(2)),l=(n.n(c),n(3)),f=(n.n(l),function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}()),p=function(e){function t(){return r(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return o(t,e),f(t,[{key:"_setup",value:function(e,n){this.$element=e,this.options=u.a.extend({},t.defaults,n),this.rules=[],this.currentPath="",this.className="Interchange",this._init(),this._events()}},{key:"_init",value:function(){s.MediaQuery._init();var e=this.$element[0].id||n.i(l.GetYoDigits)(6,"interchange");this.$element.attr({"data-resize":e,id:e}),this._addBreakpoints(),this._generateRules(),this._reflow()}},{key:"_events",value:function(){var e=this;this.$element.off("resizeme.zf.trigger").on("resizeme.zf.trigger",function(){return e._reflow()})}},{key:"_reflow",value:function(){var e;for(var t in this.rules)if(this.rules.hasOwnProperty(t)){var n=this.rules[t];window.matchMedia(n.query).matches&&(e=n)}e&&this.replace(e.path)}},{key:"_addBreakpoints",value:function(){for(var e in s.MediaQuery.queries)if(s.MediaQuery.queries.hasOwnProperty(e)){var n=s.MediaQuery.queries[e];t.SPECIAL_QUERIES[n.name]=n.value}}},{key:"_generateRules",value:function(e){var n,r=[];n=this.options.rules?this.options.rules:this.$element.data("interchange"),n="string"==typeof n?n.match(/\[.*?\]/g):n;for(var i in n)if(n.hasOwnProperty(i)){var o=n[i].slice(1,-1).split(", "),a=o.slice(0,-1).join(""),u=o[o.length-1];t.SPECIAL_QUERIES[u]&&(u=t.SPECIAL_QUERIES[u]),r.push({path:a,query:u})}this.rules=r}},{key:"replace",value:function(e){if(this.currentPath!==e){var t=this,n="replaced.zf.interchange";"IMG"===this.$element[0].nodeName?this.$element.attr("src",e).on("load",function(){t.currentPath=e}).trigger(n):e.match(/\.(gif|jpg|jpeg|png|svg|tiff)([?#].*)?/i)?(e=e.replace(/\(/g,"%28").replace(/\)/g,"%29"),this.$element.css({"background-image":"url("+e+")"}).trigger(n)):u.a.get(e,function(r){t.$element.html(r).trigger(n),u()(r).foundation(),t.currentPath=e})}}},{key:"_destroy",value:function(){this.$element.off("resizeme.zf.trigger")}}]),t}(c.Plugin);p.defaults={rules:null},p.SPECIAL_QUERIES={landscape:"screen and (orientation: landscape)",portrait:"screen and (orientation: portrait)",retina:"only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx)"}},6:function(e,t){e.exports={MediaQuery:window.Foundation.MediaQuery}},86:function(e,t,n){e.exports=n(20)}});
!function(t){function e(n){if(i[n])return i[n].exports;var s=i[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,e),s.l=!0,s.exports}var i={};e.m=t,e.c=i,e.i=function(t){return t},e.d=function(t,i,n){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=88)}({0:function(t,e){t.exports=jQuery},1:function(t,e){t.exports={Foundation:window.Foundation}},2:function(t,e){t.exports={Plugin:window.Foundation.Plugin}},22:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(1),s=(i.n(n),i(52));n.Foundation.plugin(s.a,"OffCanvas")},3:function(t,e){t.exports={rtl:window.Foundation.rtl,GetYoDigits:window.Foundation.GetYoDigits,transitionend:window.Foundation.transitionend}},4:function(t,e){t.exports={Motion:window.Foundation.Motion,Move:window.Foundation.Move}},5:function(t,e){t.exports={Keyboard:window.Foundation.Keyboard}},52:function(t,e,i){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function o(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}i.d(e,"a",function(){return g});var a=i(0),r=i.n(a),l=i(5),c=(i.n(l),i(6)),d=(i.n(c),i(3)),f=(i.n(d),i(2)),u=(i.n(f),i(7)),h=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),g=function(t){function e(){return n(this,e),s(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return o(e,t),h(e,[{key:"_setup",value:function(t,i){var n=this;this.className="OffCanvas",this.$element=t,this.options=r.a.extend({},e.defaults,this.$element.data(),i),this.contentClasses={base:[],reveal:[]},this.$lastTrigger=r()(),this.$triggers=r()(),this.position="left",this.$content=r()(),this.nested=!!this.options.nested,r()(["push","overlap"]).each(function(t,e){n.contentClasses.base.push("has-transition-"+e)}),r()(["left","right","top","bottom"]).each(function(t,e){n.contentClasses.base.push("has-position-"+e),n.contentClasses.reveal.push("has-reveal-"+e)}),u.a.init(r.a),c.MediaQuery._init(),this._init(),this._events(),l.Keyboard.register("OffCanvas",{ESCAPE:"close"})}},{key:"_init",value:function(){var t=this.$element.attr("id");if(this.$element.attr("aria-hidden","true"),this.options.contentId?this.$content=r()("#"+this.options.contentId):this.$element.siblings("[data-off-canvas-content]").length?this.$content=this.$element.siblings("[data-off-canvas-content]").first():this.$content=this.$element.closest("[data-off-canvas-content]").first(),this.options.contentId?this.options.contentId&&null===this.options.nested&&console.warn("Remember to use the nested option if using the content ID option!"):this.nested=0===this.$element.siblings("[data-off-canvas-content]").length,!0===this.nested&&(this.options.transition="overlap",this.$element.removeClass("is-transition-push")),this.$element.addClass("is-transition-"+this.options.transition+" is-closed"),this.$triggers=r()(document).find('[data-open="'+t+'"], [data-close="'+t+'"], [data-toggle="'+t+'"]').attr("aria-expanded","false").attr("aria-controls",t),this.position=this.$element.is(".position-left, .position-top, .position-right, .position-bottom")?this.$element.attr("class").match(/position\-(left|top|right|bottom)/)[1]:this.position,!0===this.options.contentOverlay){var e=document.createElement("div"),i="fixed"===r()(this.$element).css("position")?"is-overlay-fixed":"is-overlay-absolute";e.setAttribute("class","js-off-canvas-overlay "+i),this.$overlay=r()(e),"is-overlay-fixed"===i?r()(this.$overlay).insertAfter(this.$element):this.$content.append(this.$overlay)}this.options.isRevealed=this.options.isRevealed||new RegExp(this.options.revealClass,"g").test(this.$element[0].className),!0===this.options.isRevealed&&(this.options.revealOn=this.options.revealOn||this.$element[0].className.match(/(reveal-for-medium|reveal-for-large)/g)[0].split("-")[2],this._setMQChecker()),this.options.transitionTime&&this.$element.css("transition-duration",this.options.transitionTime),this._removeContentClasses()}},{key:"_events",value:function(){if(this.$element.off(".zf.trigger .zf.offcanvas").on({"open.zf.trigger":this.open.bind(this),"close.zf.trigger":this.close.bind(this),"toggle.zf.trigger":this.toggle.bind(this),"keydown.zf.offcanvas":this._handleKeyboard.bind(this)}),!0===this.options.closeOnClick){(this.options.contentOverlay?this.$overlay:this.$content).on({"click.zf.offcanvas":this.close.bind(this)})}}},{key:"_setMQChecker",value:function(){var t=this;r()(window).on("changed.zf.mediaquery",function(){c.MediaQuery.atLeast(t.options.revealOn)?t.reveal(!0):t.reveal(!1)}).one("load.zf.offcanvas",function(){c.MediaQuery.atLeast(t.options.revealOn)&&t.reveal(!0)})}},{key:"_removeContentClasses",value:function(t){"boolean"!=typeof t?this.$content.removeClass(this.contentClasses.base.join(" ")):!1===t&&this.$content.removeClass("has-reveal-"+this.position)}},{key:"_addContentClasses",value:function(t){this._removeContentClasses(t),"boolean"!=typeof t?this.$content.addClass("has-transition-"+this.options.transition+" has-position-"+this.position):!0===t&&this.$content.addClass("has-reveal-"+this.position)}},{key:"reveal",value:function(t){t?(this.close(),this.isRevealed=!0,this.$element.attr("aria-hidden","false"),this.$element.off("open.zf.trigger toggle.zf.trigger"),this.$element.removeClass("is-closed")):(this.isRevealed=!1,this.$element.attr("aria-hidden","true"),this.$element.off("open.zf.trigger toggle.zf.trigger").on({"open.zf.trigger":this.open.bind(this),"toggle.zf.trigger":this.toggle.bind(this)}),this.$element.addClass("is-closed")),this._addContentClasses(t)}},{key:"_stopScrolling",value:function(t){return!1}},{key:"_recordScrollable",value:function(t){var e=this;e.scrollHeight!==e.clientHeight&&(0===e.scrollTop&&(e.scrollTop=1),e.scrollTop===e.scrollHeight-e.clientHeight&&(e.scrollTop=e.scrollHeight-e.clientHeight-1)),e.allowUp=e.scrollTop>0,e.allowDown=e.scrollTop<e.scrollHeight-e.clientHeight,e.lastY=t.originalEvent.pageY}},{key:"_stopScrollPropagation",value:function(t){var e=this,i=t.pageY<e.lastY,n=!i;e.lastY=t.pageY,i&&e.allowUp||n&&e.allowDown?t.stopPropagation():t.preventDefault()}},{key:"open",value:function(t,e){if(!this.$element.hasClass("is-open")&&!this.isRevealed){var n=this;e&&(this.$lastTrigger=e),"top"===this.options.forceTo?window.scrollTo(0,0):"bottom"===this.options.forceTo&&window.scrollTo(0,document.body.scrollHeight),this.options.transitionTime&&"overlap"!==this.options.transition?this.$element.siblings("[data-off-canvas-content]").css("transition-duration",this.options.transitionTime):this.$element.siblings("[data-off-canvas-content]").css("transition-duration",""),this.$element.addClass("is-open").removeClass("is-closed"),this.$triggers.attr("aria-expanded","true"),this.$element.attr("aria-hidden","false").trigger("opened.zf.offcanvas"),this.$content.addClass("is-open-"+this.position),!1===this.options.contentScroll&&(r()("body").addClass("is-off-canvas-open").on("touchmove",this._stopScrolling),this.$element.on("touchstart",this._recordScrollable),this.$element.on("touchmove",this._stopScrollPropagation)),!0===this.options.contentOverlay&&this.$overlay.addClass("is-visible"),!0===this.options.closeOnClick&&!0===this.options.contentOverlay&&this.$overlay.addClass("is-closable"),!0===this.options.autoFocus&&this.$element.one(i.i(d.transitionend)(this.$element),function(){if(n.$element.hasClass("is-open")){var t=n.$element.find("[data-autofocus]");t.length?t.eq(0).focus():n.$element.find("a, button").eq(0).focus()}}),!0===this.options.trapFocus&&(this.$content.attr("tabindex","-1"),l.Keyboard.trapFocus(this.$element)),this._addContentClasses()}}},{key:"close",value:function(t){if(this.$element.hasClass("is-open")&&!this.isRevealed){var e=this;this.$element.removeClass("is-open"),this.$element.attr("aria-hidden","true").trigger("closed.zf.offcanvas"),this.$content.removeClass("is-open-left is-open-top is-open-right is-open-bottom"),!1===this.options.contentScroll&&(r()("body").removeClass("is-off-canvas-open").off("touchmove",this._stopScrolling),this.$element.off("touchstart",this._recordScrollable),this.$element.off("touchmove",this._stopScrollPropagation)),!0===this.options.contentOverlay&&this.$overlay.removeClass("is-visible"),!0===this.options.closeOnClick&&!0===this.options.contentOverlay&&this.$overlay.removeClass("is-closable"),this.$triggers.attr("aria-expanded","false"),!0===this.options.trapFocus&&(this.$content.removeAttr("tabindex"),l.Keyboard.releaseFocus(this.$element)),this.$element.one(i.i(d.transitionend)(this.$element),function(t){e.$element.addClass("is-closed"),e._removeContentClasses()})}}},{key:"toggle",value:function(t,e){this.$element.hasClass("is-open")?this.close(t,e):this.open(t,e)}},{key:"_handleKeyboard",value:function(t){var e=this;l.Keyboard.handleKey(t,"OffCanvas",{close:function(){return e.close(),e.$lastTrigger.focus(),!0},handled:function(){t.stopPropagation(),t.preventDefault()}})}},{key:"_destroy",value:function(){this.close(),this.$element.off(".zf.trigger .zf.offcanvas"),this.$overlay.off(".zf.offcanvas")}}]),e}(f.Plugin);g.defaults={closeOnClick:!0,contentOverlay:!0,contentId:null,nested:null,contentScroll:!0,transitionTime:null,transition:"push",forceTo:null,isRevealed:!1,revealOn:null,autoFocus:!0,revealClass:"reveal-for-",trapFocus:!1}},6:function(t,e){t.exports={MediaQuery:window.Foundation.MediaQuery}},7:function(t,e,i){"use strict";function n(t,e,i){var n=void 0,s=Array.prototype.slice.call(arguments,3);o()(window).off(e).on(e,function(e){n&&clearTimeout(n),n=setTimeout(function(){i.apply(null,s)},t||10)})}i.d(e,"a",function(){return c});var s=i(0),o=i.n(s),a=i(4),r=(i.n(a),function(){for(var t=["WebKit","Moz","O","Ms",""],e=0;e<t.length;e++)if(t[e]+"MutationObserver"in window)return window[t[e]+"MutationObserver"];return!1}()),l=function(t,e){t.data(e).split(" ").forEach(function(i){o()("#"+i)["close"===e?"trigger":"triggerHandler"](e+".zf.trigger",[t])})},c={Listeners:{Basic:{},Global:{}},Initializers:{}};c.Listeners.Basic={openListener:function(){l(o()(this),"open")},closeListener:function(){o()(this).data("close")?l(o()(this),"close"):o()(this).trigger("close.zf.trigger")},toggleListener:function(){o()(this).data("toggle")?l(o()(this),"toggle"):o()(this).trigger("toggle.zf.trigger")},closeableListener:function(t){t.stopPropagation();var e=o()(this).data("closable");""!==e?a.Motion.animateOut(o()(this),e,function(){o()(this).trigger("closed.zf")}):o()(this).fadeOut().trigger("closed.zf")},toggleFocusListener:function(){var t=o()(this).data("toggle-focus");o()("#"+t).triggerHandler("toggle.zf.trigger",[o()(this)])}},c.Initializers.addOpenListener=function(t){t.off("click.zf.trigger",c.Listeners.Basic.openListener),t.on("click.zf.trigger","[data-open]",c.Listeners.Basic.openListener)},c.Initializers.addCloseListener=function(t){t.off("click.zf.trigger",c.Listeners.Basic.closeListener),t.on("click.zf.trigger","[data-close]",c.Listeners.Basic.closeListener)},c.Initializers.addToggleListener=function(t){t.off("click.zf.trigger",c.Listeners.Basic.toggleListener),t.on("click.zf.trigger","[data-toggle]",c.Listeners.Basic.toggleListener)},c.Initializers.addCloseableListener=function(t){t.off("close.zf.trigger",c.Listeners.Basic.closeableListener),t.on("close.zf.trigger","[data-closeable], [data-closable]",c.Listeners.Basic.closeableListener)},c.Initializers.addToggleFocusListener=function(t){t.off("focus.zf.trigger blur.zf.trigger",c.Listeners.Basic.toggleFocusListener),t.on("focus.zf.trigger blur.zf.trigger","[data-toggle-focus]",c.Listeners.Basic.toggleFocusListener)},c.Listeners.Global={resizeListener:function(t){r||t.each(function(){o()(this).triggerHandler("resizeme.zf.trigger")}),t.attr("data-events","resize")},scrollListener:function(t){r||t.each(function(){o()(this).triggerHandler("scrollme.zf.trigger")}),t.attr("data-events","scroll")},closeMeListener:function(t,e){var i=t.namespace.split(".")[0];o()("[data-"+i+"]").not('[data-yeti-box="'+e+'"]').each(function(){var t=o()(this);t.triggerHandler("close.zf.trigger",[t])})}},c.Initializers.addClosemeListener=function(t){var e=o()("[data-yeti-box]"),i=["dropdown","tooltip","reveal"];if(t&&("string"==typeof t?i.push(t):"object"==typeof t&&"string"==typeof t[0]?i.concat(t):console.error("Plugin names must be strings")),e.length){var n=i.map(function(t){return"closeme.zf."+t}).join(" ");o()(window).off(n).on(n,c.Listeners.Global.closeMeListener)}},c.Initializers.addResizeListener=function(t){var e=o()("[data-resize]");e.length&&n(t,"resize.zf.trigger",c.Listeners.Global.resizeListener,e)},c.Initializers.addScrollListener=function(t){var e=o()("[data-scroll]");e.length&&n(t,"scroll.zf.trigger",c.Listeners.Global.scrollListener,e)},c.Initializers.addMutationEventsListener=function(t){if(!r)return!1;var e=t.find("[data-resize], [data-scroll], [data-mutate]"),i=function(t){var e=o()(t[0].target);switch(t[0].type){case"attributes":"scroll"===e.attr("data-events")&&"data-events"===t[0].attributeName&&e.triggerHandler("scrollme.zf.trigger",[e,window.pageYOffset]),"resize"===e.attr("data-events")&&"data-events"===t[0].attributeName&&e.triggerHandler("resizeme.zf.trigger",[e]),"style"===t[0].attributeName&&(e.closest("[data-mutate]").attr("data-events","mutate"),e.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger",[e.closest("[data-mutate]")]));break;case"childList":e.closest("[data-mutate]").attr("data-events","mutate"),e.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger",[e.closest("[data-mutate]")]);break;default:return!1}};if(e.length)for(var n=0;n<=e.length-1;n++){var s=new r(i);s.observe(e[n],{attributes:!0,childList:!0,characterData:!1,subtree:!0,attributeFilter:["data-events","style"]})}},c.Initializers.addSimpleListeners=function(){var t=o()(document);c.Initializers.addOpenListener(t),c.Initializers.addCloseListener(t),c.Initializers.addToggleListener(t),c.Initializers.addCloseableListener(t),c.Initializers.addToggleFocusListener(t)},c.Initializers.addGlobalListeners=function(){var t=o()(document);c.Initializers.addMutationEventsListener(t),c.Initializers.addResizeListener(),c.Initializers.addScrollListener(),c.Initializers.addClosemeListener()},c.init=function(t,e){if(void 0===t.triggersInitialized){t(document);"complete"===document.readyState?(c.Initializers.addSimpleListeners(),c.Initializers.addGlobalListeners()):t(window).on("load",function(){c.Initializers.addSimpleListeners(),c.Initializers.addGlobalListeners()}),t.triggersInitialized=!0}e&&(e.Triggers=c,e.IHearYou=c.Initializers.addGlobalListeners)}},88:function(t,e,i){t.exports=i(22)}});
!function(n){function e(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return n[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var t={};e.m=n,e.c=t,e.i=function(n){return n},e.d=function(n,t,i){e.o(n,t)||Object.defineProperty(n,t,{configurable:!1,enumerable:!0,get:i})},e.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(t,"a",t),t},e.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},e.p="",e(e.s=91)}({0:function(n,e){n.exports=jQuery},1:function(n,e){n.exports={Foundation:window.Foundation}},2:function(n,e){n.exports={Plugin:window.Foundation.Plugin}},25:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=t(1),o=(t.n(i),t(55));i.Foundation.plugin(o.a,"ResponsiveMenu")},3:function(n,e){n.exports={rtl:window.Foundation.rtl,GetYoDigits:window.Foundation.GetYoDigits,transitionend:window.Foundation.transitionend}},55:function(n,e,t){"use strict";function i(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}function o(n,e){if(!n)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?n:e}function r(n,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);n.prototype=Object.create(e&&e.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(n,e):n.__proto__=e)}t.d(e,"a",function(){return y});var u=t(0),s=t.n(u),a=t(6),l=(t.n(a),t(3)),c=(t.n(l),t(2)),d=(t.n(c),t(75)),f=(t.n(d),t(74)),p=(t.n(f),t(73)),h=(t.n(p),function(){function n(n,e){for(var t=0;t<e.length;t++){var i=e[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(n,i.key,i)}}return function(e,t,i){return t&&n(e.prototype,t),i&&n(e,i),e}}()),w={dropdown:{cssClass:"dropdown",plugin:d.DropdownMenu},drilldown:{cssClass:"drilldown",plugin:f.Drilldown},accordion:{cssClass:"accordion-menu",plugin:p.AccordionMenu}},y=function(n){function e(){return i(this,e),o(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return r(e,n),h(e,[{key:"_setup",value:function(n,e){this.$element=s()(n),this.rules=this.$element.data("responsive-menu"),this.currentMq=null,this.currentPlugin=null,this.className="ResponsiveMenu",this._init(),this._events()}},{key:"_init",value:function(){if(a.MediaQuery._init(),"string"==typeof this.rules){for(var n={},e=this.rules.split(" "),i=0;i<e.length;i++){var o=e[i].split("-"),r=o.length>1?o[0]:"small",u=o.length>1?o[1]:o[0];null!==w[u]&&(n[r]=w[u])}this.rules=n}s.a.isEmptyObject(this.rules)||this._checkMediaQueries(),this.$element.attr("data-mutate",this.$element.attr("data-mutate")||t.i(l.GetYoDigits)(6,"responsive-menu"))}},{key:"_events",value:function(){var n=this;s()(window).on("changed.zf.mediaquery",function(){n._checkMediaQueries()})}},{key:"_checkMediaQueries",value:function(){var n,e=this;s.a.each(this.rules,function(e){a.MediaQuery.atLeast(e)&&(n=e)}),n&&(this.currentPlugin instanceof this.rules[n].plugin||(s.a.each(w,function(n,t){e.$element.removeClass(t.cssClass)}),this.$element.addClass(this.rules[n].cssClass),this.currentPlugin&&this.currentPlugin.destroy(),this.currentPlugin=new this.rules[n].plugin(this.$element,{})))}},{key:"_destroy",value:function(){this.currentPlugin.destroy(),s()(window).off(".zf.ResponsiveMenu")}}]),e}(c.Plugin);y.defaults={}},6:function(n,e){n.exports={MediaQuery:window.Foundation.MediaQuery}},73:function(n,e){n.exports={AccordionMenu:window.Foundation.AccordionMenu}},74:function(n,e){n.exports={Drilldown:window.Foundation.Drilldown}},75:function(n,e){n.exports={DropdownMenu:window.Foundation.DropdownMenu}},91:function(n,e,t){n.exports=t(25)}});
!function(t){function e(n){if(i[n])return i[n].exports;var s=i[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,e),s.l=!0,s.exports}var i={};e.m=t,e.c=i,e.i=function(t){return t},e.d=function(t,i,n){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=96)}({0:function(t,e){t.exports=jQuery},1:function(t,e){t.exports={Foundation:window.Foundation}},2:function(t,e){t.exports={Plugin:window.Foundation.Plugin}},3:function(t,e){t.exports={rtl:window.Foundation.rtl,GetYoDigits:window.Foundation.GetYoDigits,transitionend:window.Foundation.transitionend}},30:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(1),s=(i.n(n),i(60));n.Foundation.plugin(s.a,"Sticky")},4:function(t,e){t.exports={Motion:window.Foundation.Motion,Move:window.Foundation.Move}},6:function(t,e){t.exports={MediaQuery:window.Foundation.MediaQuery}},60:function(t,e,i){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function o(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function r(t){return parseInt(window.getComputedStyle(document.body,null).fontSize,10)*t}i.d(e,"a",function(){return g});var a=i(0),c=i.n(a),l=i(3),u=(i.n(l),i(6)),f=(i.n(u),i(2)),h=(i.n(f),i(7)),d=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),g=function(t){function e(){return n(this,e),s(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return o(e,t),d(e,[{key:"_setup",value:function(t,i){this.$element=t,this.options=c.a.extend({},e.defaults,this.$element.data(),i),this.className="Sticky",h.a.init(c.a),this._init()}},{key:"_init",value:function(){u.MediaQuery._init();var t=this.$element.parent("[data-sticky-container]"),e=this.$element[0].id||i.i(l.GetYoDigits)(6,"sticky"),n=this;t.length?this.$container=t:(this.wasWrapped=!0,this.$element.wrap(this.options.container),this.$container=this.$element.parent()),this.$container.addClass(this.options.containerClass),this.$element.addClass(this.options.stickyClass).attr({"data-resize":e,"data-mutate":e}),""!==this.options.anchor&&c()("#"+n.options.anchor).attr({"data-mutate":e}),this.scrollCount=this.options.checkEvery,this.isStuck=!1,c()(window).one("load.zf.sticky",function(){n.containerHeight="none"==n.$element.css("display")?0:n.$element[0].getBoundingClientRect().height,n.$container.css("height",n.containerHeight),n.elemHeight=n.containerHeight,""!==n.options.anchor?n.$anchor=c()("#"+n.options.anchor):n._parsePoints(),n._setSizes(function(){var t=window.pageYOffset;n._calc(!1,t),n.isStuck||n._removeSticky(!(t>=n.topPoint))}),n._events(e.split("-").reverse().join("-"))})}},{key:"_parsePoints",value:function(){for(var t=""==this.options.topAnchor?1:this.options.topAnchor,e=""==this.options.btmAnchor?document.documentElement.scrollHeight:this.options.btmAnchor,i=[t,e],n={},s=0,o=i.length;s<o&&i[s];s++){var r;if("number"==typeof i[s])r=i[s];else{var a=i[s].split(":"),l=c()("#"+a[0]);r=l.offset().top,a[1]&&"bottom"===a[1].toLowerCase()&&(r+=l[0].getBoundingClientRect().height)}n[s]=r}this.points=n}},{key:"_events",value:function(t){var e=this,i=this.scrollListener="scroll.zf."+t;this.isOn||(this.canStick&&(this.isOn=!0,c()(window).off(i).on(i,function(t){0===e.scrollCount?(e.scrollCount=e.options.checkEvery,e._setSizes(function(){e._calc(!1,window.pageYOffset)})):(e.scrollCount--,e._calc(!1,window.pageYOffset))})),this.$element.off("resizeme.zf.trigger").on("resizeme.zf.trigger",function(i,n){e._eventsHandler(t)}),this.$element.on("mutateme.zf.trigger",function(i,n){e._eventsHandler(t)}),this.$anchor&&this.$anchor.on("mutateme.zf.trigger",function(i,n){e._eventsHandler(t)}))}},{key:"_eventsHandler",value:function(t){var e=this,i=this.scrollListener="scroll.zf."+t;e._setSizes(function(){e._calc(!1),e.canStick?e.isOn||e._events(t):e.isOn&&e._pauseListeners(i)})}},{key:"_pauseListeners",value:function(t){this.isOn=!1,c()(window).off(t),this.$element.trigger("pause.zf.sticky")}},{key:"_calc",value:function(t,e){if(t&&this._setSizes(),!this.canStick)return this.isStuck&&this._removeSticky(!0),!1;e||(e=window.pageYOffset),e>=this.topPoint?e<=this.bottomPoint?this.isStuck||this._setSticky():this.isStuck&&this._removeSticky(!1):this.isStuck&&this._removeSticky(!0)}},{key:"_setSticky",value:function(){var t=this,e=this.options.stickTo,i="top"===e?"marginTop":"marginBottom",n="top"===e?"bottom":"top",s={};s[i]=this.options[i]+"em",s[e]=0,s[n]="auto",this.isStuck=!0,this.$element.removeClass("is-anchored is-at-"+n).addClass("is-stuck is-at-"+e).css(s).trigger("sticky.zf.stuckto:"+e),this.$element.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd",function(){t._setSizes()})}},{key:"_removeSticky",value:function(t){var e=this.options.stickTo,i="top"===e,n={},s=(this.points?this.points[1]-this.points[0]:this.anchorHeight)-this.elemHeight,o=i?"marginTop":"marginBottom",r=t?"top":"bottom";n[o]=0,n.bottom="auto",n.top=t?0:s,this.isStuck=!1,this.$element.removeClass("is-stuck is-at-"+e).addClass("is-anchored is-at-"+r).css(n).trigger("sticky.zf.unstuckfrom:"+r)}},{key:"_setSizes",value:function(t){this.canStick=u.MediaQuery.is(this.options.stickyOn),this.canStick||t&&"function"==typeof t&&t();var e=this.$container[0].getBoundingClientRect().width,i=window.getComputedStyle(this.$container[0]),n=parseInt(i["padding-left"],10),s=parseInt(i["padding-right"],10);this.$anchor&&this.$anchor.length?this.anchorHeight=this.$anchor[0].getBoundingClientRect().height:this._parsePoints(),this.$element.css({"max-width":e-n-s+"px"});var o=this.$element[0].getBoundingClientRect().height||this.containerHeight;if("none"==this.$element.css("display")&&(o=0),this.containerHeight=o,this.$container.css({height:o}),this.elemHeight=o,!this.isStuck&&this.$element.hasClass("is-at-bottom")){var r=(this.points?this.points[1]-this.$container.offset().top:this.anchorHeight)-this.elemHeight;this.$element.css("top",r)}this._setBreakPoints(o,function(){t&&"function"==typeof t&&t()})}},{key:"_setBreakPoints",value:function(t,e){if(!this.canStick){if(!e||"function"!=typeof e)return!1;e()}var i=r(this.options.marginTop),n=r(this.options.marginBottom),s=this.points?this.points[0]:this.$anchor.offset().top,o=this.points?this.points[1]:s+this.anchorHeight,a=window.innerHeight;"top"===this.options.stickTo?(s-=i,o-=t+i):"bottom"===this.options.stickTo&&(s-=a-(t+n),o-=a-n),this.topPoint=s,this.bottomPoint=o,e&&"function"==typeof e&&e()}},{key:"_destroy",value:function(){this._removeSticky(!0),this.$element.removeClass(this.options.stickyClass+" is-anchored is-at-top").css({height:"",top:"",bottom:"","max-width":""}).off("resizeme.zf.trigger").off("mutateme.zf.trigger"),this.$anchor&&this.$anchor.length&&this.$anchor.off("change.zf.sticky"),c()(window).off(this.scrollListener),this.wasWrapped?this.$element.unwrap():this.$container.removeClass(this.options.containerClass).css({height:""})}}]),e}(f.Plugin);g.defaults={container:"<div data-sticky-container></div>",stickTo:"top",anchor:"",topAnchor:"",btmAnchor:"",marginTop:1,marginBottom:1,stickyOn:"medium",stickyClass:"sticky",containerClass:"sticky-container",checkEvery:-1}},7:function(t,e,i){"use strict";function n(t,e,i){var n=void 0,s=Array.prototype.slice.call(arguments,3);o()(window).off(e).on(e,function(e){n&&clearTimeout(n),n=setTimeout(function(){i.apply(null,s)},t||10)})}i.d(e,"a",function(){return l});var s=i(0),o=i.n(s),r=i(4),a=(i.n(r),function(){for(var t=["WebKit","Moz","O","Ms",""],e=0;e<t.length;e++)if(t[e]+"MutationObserver"in window)return window[t[e]+"MutationObserver"];return!1}()),c=function(t,e){t.data(e).split(" ").forEach(function(i){o()("#"+i)["close"===e?"trigger":"triggerHandler"](e+".zf.trigger",[t])})},l={Listeners:{Basic:{},Global:{}},Initializers:{}};l.Listeners.Basic={openListener:function(){c(o()(this),"open")},closeListener:function(){o()(this).data("close")?c(o()(this),"close"):o()(this).trigger("close.zf.trigger")},toggleListener:function(){o()(this).data("toggle")?c(o()(this),"toggle"):o()(this).trigger("toggle.zf.trigger")},closeableListener:function(t){t.stopPropagation();var e=o()(this).data("closable");""!==e?r.Motion.animateOut(o()(this),e,function(){o()(this).trigger("closed.zf")}):o()(this).fadeOut().trigger("closed.zf")},toggleFocusListener:function(){var t=o()(this).data("toggle-focus");o()("#"+t).triggerHandler("toggle.zf.trigger",[o()(this)])}},l.Initializers.addOpenListener=function(t){t.off("click.zf.trigger",l.Listeners.Basic.openListener),t.on("click.zf.trigger","[data-open]",l.Listeners.Basic.openListener)},l.Initializers.addCloseListener=function(t){t.off("click.zf.trigger",l.Listeners.Basic.closeListener),t.on("click.zf.trigger","[data-close]",l.Listeners.Basic.closeListener)},l.Initializers.addToggleListener=function(t){t.off("click.zf.trigger",l.Listeners.Basic.toggleListener),t.on("click.zf.trigger","[data-toggle]",l.Listeners.Basic.toggleListener)},l.Initializers.addCloseableListener=function(t){t.off("close.zf.trigger",l.Listeners.Basic.closeableListener),t.on("close.zf.trigger","[data-closeable], [data-closable]",l.Listeners.Basic.closeableListener)},l.Initializers.addToggleFocusListener=function(t){t.off("focus.zf.trigger blur.zf.trigger",l.Listeners.Basic.toggleFocusListener),t.on("focus.zf.trigger blur.zf.trigger","[data-toggle-focus]",l.Listeners.Basic.toggleFocusListener)},l.Listeners.Global={resizeListener:function(t){a||t.each(function(){o()(this).triggerHandler("resizeme.zf.trigger")}),t.attr("data-events","resize")},scrollListener:function(t){a||t.each(function(){o()(this).triggerHandler("scrollme.zf.trigger")}),t.attr("data-events","scroll")},closeMeListener:function(t,e){var i=t.namespace.split(".")[0];o()("[data-"+i+"]").not('[data-yeti-box="'+e+'"]').each(function(){var t=o()(this);t.triggerHandler("close.zf.trigger",[t])})}},l.Initializers.addClosemeListener=function(t){var e=o()("[data-yeti-box]"),i=["dropdown","tooltip","reveal"];if(t&&("string"==typeof t?i.push(t):"object"==typeof t&&"string"==typeof t[0]?i.concat(t):console.error("Plugin names must be strings")),e.length){var n=i.map(function(t){return"closeme.zf."+t}).join(" ");o()(window).off(n).on(n,l.Listeners.Global.closeMeListener)}},l.Initializers.addResizeListener=function(t){var e=o()("[data-resize]");e.length&&n(t,"resize.zf.trigger",l.Listeners.Global.resizeListener,e)},l.Initializers.addScrollListener=function(t){var e=o()("[data-scroll]");e.length&&n(t,"scroll.zf.trigger",l.Listeners.Global.scrollListener,e)},l.Initializers.addMutationEventsListener=function(t){if(!a)return!1;var e=t.find("[data-resize], [data-scroll], [data-mutate]"),i=function(t){var e=o()(t[0].target);switch(t[0].type){case"attributes":"scroll"===e.attr("data-events")&&"data-events"===t[0].attributeName&&e.triggerHandler("scrollme.zf.trigger",[e,window.pageYOffset]),"resize"===e.attr("data-events")&&"data-events"===t[0].attributeName&&e.triggerHandler("resizeme.zf.trigger",[e]),"style"===t[0].attributeName&&(e.closest("[data-mutate]").attr("data-events","mutate"),e.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger",[e.closest("[data-mutate]")]));break;case"childList":e.closest("[data-mutate]").attr("data-events","mutate"),e.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger",[e.closest("[data-mutate]")]);break;default:return!1}};if(e.length)for(var n=0;n<=e.length-1;n++){var s=new a(i);s.observe(e[n],{attributes:!0,childList:!0,characterData:!1,subtree:!0,attributeFilter:["data-events","style"]})}},l.Initializers.addSimpleListeners=function(){var t=o()(document);l.Initializers.addOpenListener(t),l.Initializers.addCloseListener(t),l.Initializers.addToggleListener(t),l.Initializers.addCloseableListener(t),l.Initializers.addToggleFocusListener(t)},l.Initializers.addGlobalListeners=function(){var t=o()(document);l.Initializers.addMutationEventsListener(t),l.Initializers.addResizeListener(),l.Initializers.addScrollListener(),l.Initializers.addClosemeListener()},l.init=function(t,e){if(void 0===t.triggersInitialized){t(document);"complete"===document.readyState?(l.Initializers.addSimpleListeners(),l.Initializers.addGlobalListeners()):t(window).on("load",function(){l.Initializers.addSimpleListeners(),l.Initializers.addGlobalListeners()}),t.triggersInitialized=!0}e&&(e.Triggers=l,e.IHearYou=l.Initializers.addGlobalListeners)}},96:function(t,e,i){t.exports=i(30)}});
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
