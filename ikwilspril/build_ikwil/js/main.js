!function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)}(function(i){"use strict";var e=window.Slick||{};(e=function(){var e=0;return function(t,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(t),appendDots:i(t),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(t),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(t).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,void 0!==document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=e++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}}()).prototype.activateADA=function(){this.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):!0===o?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),!0===s.options.rtl&&!1===s.options.vertical&&(e=-e),!1===s.transformsEnabled?!1===s.options.vertical?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):!1===s.cssTransitions?(!0===s.options.rtl&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),!1===s.options.vertical?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),!1===s.options.vertical?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this.getNavTarget();null!==t&&"object"==typeof t&&t.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};!1===e.options.fade?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(!1===i.options.infinite&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1==0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;!0===e.options.arrows&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),!0!==e.options.infinite&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(!0===o.options.dots){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),!0!==e.options.centerMode&&!0!==e.options.swipeToSlide||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),!0===e.options.draggable&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>1){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(!1===r.originalSettings.mobileFirst?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||!1===l||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!=0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t;if(e=this.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var o in e){if(i<e[o]){i=t;break}t=e[o]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),!0===e.options.accessibility&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),!0===e.options.arrows&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),!0===e.options.accessibility&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),!0===e.options.accessibility&&e.$list.off("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>1&&((i=e.$slides.children().children()).removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){!1===this.shouldClick&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;!1===t.cssTransitions?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;!1===e.cssTransitions?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*",function(t){t.stopImmediatePropagation();var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&(e.focussed=o.is(":focus"),e.autoPlay())},0)})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){return this.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(!0===i.options.infinite)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(!0===i.options.centerMode)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),!0===n.options.infinite?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,!0===n.options.vertical&&!0===n.options.centerMode&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!=0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),!0===n.options.centerMode&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:!0===n.options.centerMode&&!0===n.options.infinite?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:!0===n.options.centerMode&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=!1===n.options.vertical?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,!0===n.options.variableWidth&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,!0===n.options.centerMode&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){return this.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(!1===e.options.infinite?i=e.slideCount:(t=-1*e.options.slidesToScroll,o=-1*e.options.slidesToScroll,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o=this;return t=!0===o.options.centerMode?o.slideWidth*Math.floor(o.options.slidesToShow/2):0,!0===o.options.swipeToSlide?(o.$slideTrack.find(".slick-slide").each(function(s,n){if(n.offsetLeft-t+i(n).outerWidth()/2>-1*o.swipeLeft)return e=n,!1}),Math.abs(i(e).attr("data-slick-index")-o.currentSlide)||1):o.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){this.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),!0===t.options.accessibility&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),-1!==s&&i(this).attr({"aria-describedby":"slick-slide-control"+e.instanceUid+s})}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.$slides.eq(s).attr("tabindex",0);e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),!0===i.options.accessibility&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;!0===e.options.dots&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),!0===e.options.accessibility&&e.$dots.on("keydown.slick",e.keyHandler)),!0===e.options.dots&&!0===e.options.pauseOnDotsHover&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),!0===e.options.accessibility&&e.$list.on("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&!0===e.options.accessibility?e.changeSlide({data:{message:!0===e.options.rtl?"next":"previous"}}):39===i.keyCode&&!0===e.options.accessibility&&e.changeSlide({data:{message:!0===e.options.rtl?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||n.$slider.attr("data-sizes"),r=document.createElement("img");r.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),n.$slider.trigger("lazyLoaded",[n,e,t])})},r.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),n.$slider.trigger("lazyLoadError",[n,e,t])},r.src=t})}var t,o,s,n=this;if(!0===n.options.centerMode?!0===n.options.infinite?s=(o=n.currentSlide+(n.options.slidesToShow/2+1))+n.options.slidesToShow+2:(o=Math.max(0,n.currentSlide-(n.options.slidesToShow/2+1)),s=n.options.slidesToShow/2+1+2+n.currentSlide):(o=n.options.infinite?n.options.slidesToShow+n.currentSlide:n.currentSlide,s=Math.ceil(o+n.options.slidesToShow),!0===n.options.fade&&(o>0&&o--,s<=n.slideCount&&s++)),t=n.$slider.find(".slick-slide").slice(o,s),"anticipated"===n.options.lazyLoad)for(var r=o-1,l=s,d=n.$slider.find(".slick-slide"),a=0;a<n.options.slidesToScroll;a++)r<0&&(r=n.slideCount-1),t=(t=t.add(d.eq(r))).add(d.eq(l)),r--,l++;e(t),n.slideCount<=n.options.slidesToShow?e(n.$slider.find(".slick-slide")):n.currentSlide>=n.slideCount-n.options.slidesToShow?e(n.$slider.find(".slick-cloned").slice(0,n.options.slidesToShow)):0===n.currentSlide&&e(n.$slider.find(".slick-cloned").slice(-1*n.options.slidesToShow))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){this.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;t.unslicked||(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),!0===t.options.accessibility&&(t.initADA(),t.options.focusOnChange&&i(t.$slides.get(t.currentSlide)).attr("tabindex",0).focus()))},e.prototype.prev=e.prototype.slickPrev=function(){this.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),(r=document.createElement("img")).onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),!0===l.options.adaptiveHeight&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;if(i="boolean"==typeof i?!0===(e=i)?0:o.slideCount-1:!0===e?--i:i,o.slideCount<1||i<0||i>o.slideCount-1)return!1;o.unload(),!0===t?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,o.reinit()},e.prototype.setCSS=function(i){var e,t,o=this,s={};!0===o.options.rtl&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,!1===o.transformsEnabled?o.$slideTrack.css(s):(s={},!1===o.cssTransitions?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;!1===i.options.vertical?!0===i.options.centerMode&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),!0===i.options.centerMode&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),!1===i.options.vertical&&!1===i.options.variableWidth?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):!0===i.options.variableWidth?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();!1===i.options.variableWidth&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,!0===t.options.rtl?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":void 0!==arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),!1===i.options.fade?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=!0===i.options.vertical?"top":"left","top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||!0===i.options.useCSS&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&!1!==i.animType&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&!1!==i.animType},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),!0===n.options.centerMode){var r=n.options.slidesToShow%2==0?1:0;e=Math.floor(n.options.slidesToShow/2),!0===n.options.infinite&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=!0===n.options.infinite?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(!0===s.options.fade&&(s.options.centerMode=!1),!0===s.options.infinite&&!1===s.options.fade&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=!0===s.options.centerMode?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));s||(s=0),t.slideCount<=t.options.slidesToShow?t.slideHandler(s,!1,!0):t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(!0===a.animating&&!0===a.options.waitForAnimate||!0===a.options.fade&&a.currentSlide===i))if(!1===e&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,!1===a.options.infinite&&!1===a.options.centerMode&&(i<0||i>a.getDotCount()*a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else if(!1===a.options.infinite&&!0===a.options.centerMode&&(i<0||i>a.slideCount-a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else{if(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!=0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!=0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=(l=a.getNavTarget()).slick("getSlick")).slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide),a.updateDots(),a.updateArrows(),!0===a.options.fade)return!0!==t?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight();!0!==t?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)}},e.prototype.startLoad=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),(o=Math.round(180*t/Math.PI))<0&&(o=360-Math.abs(o)),o<=45&&o>=0?!1===s.options.rtl?"left":"right":o<=360&&o>=315?!1===s.options.rtl?"left":"right":o>=135&&o<=225?!1===s.options.rtl?"right":"left":!0===s.options.verticalSwiping?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(!0===o.touchObject.edgeHit&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(!1===e.options.swipe||"ontouchend"in document&&!1===e.options.swipe||!1===e.options.draggable&&-1!==i.type.indexOf("mouse")))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,!0===e.options.verticalSwiping&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(!0===l.options.verticalSwiping&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(!1===l.options.rtl?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),!0===l.options.verticalSwiping&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,!1===l.options.infinite&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),!1===l.options.vertical?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,!0===l.options.verticalSwiping&&(l.swipeLeft=e+o*s),!0!==l.options.fade&&!1!==l.options.touchMove&&(!0===l.animating?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;if(t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow)return t.touchObject={},!1;void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,t.dragging=!0},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i=this;Math.floor(i.options.slidesToShow/2),!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&!i.options.infinite&&(i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===i.currentSlide?(i.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-i.options.slidesToShow&&!1===i.options.centerMode?(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-1&&!0===i.options.centerMode&&(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||void 0===s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),void 0!==t)return t;return o}});

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


    // map.set('styles', [
    //   {
    //     "stylers": [
    //     { "saturation": -100 },
    //     { "gamma": 0.89 },
    //     { "visibility": "on" }
    //   ]
    // }
    // ]);

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
        path: "M0,7c0,4.3,5,7.8,6.6,8.7c0.2,0.1,0.6,0.1,0.9,0c1.5-1,6.6-4.5,6.6-8.7c0-3.8-3.2-7-7-7 C3.2,0,0,3.2,0,7z M7,10c-1.7,0-3-1.3-3-3s1.3-3,3-3c1.7,0,3,1.3,3,3S8.7,10,7,10z",
        fillColor: '#00ACA8',
        fillOpacity: 1,
        anchor: new google.maps.Point(10, 10),
        strokeWeight: 0,
        scale: 3.5
      }
      // create marker
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      draggable: false,
      icon: icon
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

		// More than 1 marker
		if( map.markers.length > 1 )
		{
			// set center of map
		    map.setCenter( bounds.getCenter() );
		    map.setZoom( 9 );
		}
		else
		{
			// fit to bounds
			map.setCenter( bounds.getCenter() );
			map.setZoom( 13 );
		}

	}

/* modernizr 3.5.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-flexbox-scriptdefer-setclasses !*/
!function(e,n,t){function r(e,n){return typeof e===n}function o(){var e,n,t,o,s,i,l;for(var a in S)if(S.hasOwnProperty(a)){if(e=[],n=S[a],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(o=r(n.fn,"function")?n.fn():n.fn,s=0;s<e.length;s++)i=e[s],l=i.split("."),1===l.length?Modernizr[l[0]]=o:(!Modernizr[l[0]]||Modernizr[l[0]]instanceof Boolean||(Modernizr[l[0]]=new Boolean(Modernizr[l[0]])),Modernizr[l[0]][l[1]]=o),C.push((o?"":"no-")+l.join("-"))}}function s(e){var n=x.className,t=Modernizr._config.classPrefix||"";if(_&&(n=n.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(r,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),_?x.className.baseVal=n:x.className=n)}function i(e,n){return!!~(""+e).indexOf(n)}function l(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):_?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function a(e){return e.replace(/([a-z])-([a-z])/g,function(e,n,t){return n+t.toUpperCase()}).replace(/^-/,"")}function f(e,n){return function(){return e.apply(n,arguments)}}function u(e,n,t){var o;for(var s in e)if(e[s]in n)return t===!1?e[s]:(o=n[e[s]],r(o,"function")?f(o,t||n):o);return!1}function c(e){return e.replace(/([A-Z])/g,function(e,n){return"-"+n.toLowerCase()}).replace(/^ms-/,"-ms-")}function d(n,t,r){var o;if("getComputedStyle"in e){o=getComputedStyle.call(e,n,t);var s=e.console;if(null!==o)r&&(o=o.getPropertyValue(r));else if(s){var i=s.error?"error":"log";s[i].call(s,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else o=!t&&n.currentStyle&&n.currentStyle[r];return o}function p(){var e=n.body;return e||(e=l(_?"svg":"body"),e.fake=!0),e}function m(e,t,r,o){var s,i,a,f,u="modernizr",c=l("div"),d=p();if(parseInt(r,10))for(;r--;)a=l("div"),a.id=o?o[r]:u+(r+1),c.appendChild(a);return s=l("style"),s.type="text/css",s.id="s"+u,(d.fake?d:c).appendChild(s),d.appendChild(c),s.styleSheet?s.styleSheet.cssText=e:s.appendChild(n.createTextNode(e)),c.id=u,d.fake&&(d.style.background="",d.style.overflow="hidden",f=x.style.overflow,x.style.overflow="hidden",x.appendChild(d)),i=t(c,e),d.fake?(d.parentNode.removeChild(d),x.style.overflow=f,x.offsetHeight):c.parentNode.removeChild(c),!!i}function y(n,r){var o=n.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(c(n[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var s=[];o--;)s.push("("+c(n[o])+":"+r+")");return s=s.join(" or "),m("@supports ("+s+") { #modernizr { position: absolute; } }",function(e){return"absolute"==d(e,null,"position")})}return t}function v(e,n,o,s){function f(){c&&(delete N.style,delete N.modElem)}if(s=r(s,"undefined")?!1:s,!r(o,"undefined")){var u=y(e,o);if(!r(u,"undefined"))return u}for(var c,d,p,m,v,g=["modernizr","tspan","samp"];!N.style&&g.length;)c=!0,N.modElem=l(g.shift()),N.style=N.modElem.style;for(p=e.length,d=0;p>d;d++)if(m=e[d],v=N.style[m],i(m,"-")&&(m=a(m)),N.style[m]!==t){if(s||r(o,"undefined"))return f(),"pfx"==n?m:!0;try{N.style[m]=o}catch(h){}if(N.style[m]!=v)return f(),"pfx"==n?m:!0}return f(),!1}function g(e,n,t,o,s){var i=e.charAt(0).toUpperCase()+e.slice(1),l=(e+" "+P.join(i+" ")+i).split(" ");return r(n,"string")||r(n,"undefined")?v(l,n,o,s):(l=(e+" "+z.join(i+" ")+i).split(" "),u(l,n,t))}function h(e,n,r){return g(e,t,t,n,r)}var C=[],S=[],w={_version:"3.5.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){S.push({name:e,fn:n,options:t})},addAsyncTest:function(e){S.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=w,Modernizr=new Modernizr;var x=n.documentElement,_="svg"===x.nodeName.toLowerCase(),b="Moz O ms Webkit",P=w._config.usePrefixes?b.split(" "):[];w._cssomPrefixes=P;var z=w._config.usePrefixes?b.toLowerCase().split(" "):[];w._domPrefixes=z,Modernizr.addTest("scriptdefer","defer"in l("script"));var E={elem:l("modernizr")};Modernizr._q.push(function(){delete E.elem});var N={style:E.elem.style};Modernizr._q.unshift(function(){delete N.style}),w.testAllProps=g,w.testAllProps=h,Modernizr.addTest("flexbox",h("flexBasis","1px",!0)),o(),s(C),delete w.addTest,delete w.addAsyncTest;for(var T=0;T<Modernizr._q.length;T++)Modernizr._q[T]();e.Modernizr=Modernizr}(window,document);

!function(e,n){"function"==typeof define&&define.amd?define(n):"object"==typeof exports?module.exports=n(require,exports,module):e.ouibounce=n()}(this,function(e,n,o){return function(e,n){"use strict";function o(e,n){return"undefined"==typeof e?n:e}function i(e){var n=24*e*60*60*1e3,o=new Date;return o.setTime(o.getTime()+n),"; expires="+o.toUTCString()}function t(){s()||(L.addEventListener("mouseleave",u),L.addEventListener("mouseenter",r),L.addEventListener("keydown",c))}function u(e){e.clientY>k||(D=setTimeout(m,y))}function r(){D&&(clearTimeout(D),D=null)}function c(e){g||e.metaKey&&76===e.keyCode&&(g=!0,D=setTimeout(m,y))}function d(e,n){return a()[e]===n}function a(){for(var e=document.cookie.split("; "),n={},o=e.length-1;o>=0;o--){var i=e[o].split("=");n[i[0]]=i[1]}return n}function s(){return d(T,"true")&&!v}function m(){s()||(e&&(e.style.display="block"),E(),f())}function f(e){var n=e||{};"undefined"!=typeof n.cookieExpire&&(b=i(n.cookieExpire)),n.sitewide===!0&&(w=";path=/"),"undefined"!=typeof n.cookieDomain&&(x=";domain="+n.cookieDomain),"undefined"!=typeof n.cookieName&&(T=n.cookieName),document.cookie=T+"=true"+b+x+w,L.removeEventListener("mouseleave",u),L.removeEventListener("mouseenter",r),L.removeEventListener("keydown",c)}var l=n||{},v=l.aggressive||!1,k=o(l.sensitivity,20),p=o(l.timer,1e3),y=o(l.delay,0),E=l.callback||function(){},b=i(l.cookieExpire)||"",x=l.cookieDomain?";domain="+l.cookieDomain:"",T=l.cookieName?l.cookieName:"viewedOuibounceModal",w=l.sitewide===!0?";path=/":"",D=null,L=document.documentElement;setTimeout(t,p);var g=!1;return{fire:m,disable:f,isDisabled:s}}});
/**
 * what-input - A global utility for tracking the current input method (mouse, keyboard or touch).
 * @version v5.0.2
 * @link https://github.com/ten1seven/what-input
 * @license MIT
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("whatInput",[],t):"object"==typeof exports?exports.whatInput=t():e.whatInput=t()}(this,function(){return function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return e[o].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t){"use strict";e.exports=function(){var e=document.documentElement,t=null,n="initial",o=n,i=["input","select","textarea"],r=[],u=[16,17,18,91,93],d={keydown:"keyboard",keyup:"keyboard",mousedown:"mouse",mousemove:"mouse",MSPointerDown:"pointer",MSPointerMove:"pointer",pointerdown:"pointer",pointermove:"pointer",touchstart:"touch"},a=!1,s=!1,c={x:null,y:null},p={2:"touch",3:"touch",4:"mouse"},w=!1;try{var f=Object.defineProperty({},"passive",{get:function(){w=!0}});window.addEventListener("test",null,f)}catch(e){}var v=function(){var e=!!w&&{passive:!0};window.PointerEvent?(window.addEventListener("pointerdown",l),window.addEventListener("pointermove",h)):window.MSPointerEvent?(window.addEventListener("MSPointerDown",l),window.addEventListener("MSPointerMove",h)):(window.addEventListener("mousedown",l),window.addEventListener("mousemove",h),"ontouchstart"in window&&(window.addEventListener("touchstart",L,e),window.addEventListener("touchend",L))),window.addEventListener(g(),h,e),window.addEventListener("keydown",l),window.addEventListener("keyup",l),window.addEventListener("focusin",y),window.addEventListener("focusout",E)},l=function(e){if(!a){var t=e.which,r=d[e.type];"pointer"===r&&(r=x(e));var s="keyboard"===r&&t&&-1===u.indexOf(t)||"mouse"===r||"touch"===r;if(n!==r&&s&&(n=r,m("input")),o!==r&&s){var c=document.activeElement;c&&c.nodeName&&-1===i.indexOf(c.nodeName.toLowerCase())&&(o=r,m("intent"))}}},m=function(t){e.setAttribute("data-what"+t,"input"===t?n:o),b(t)},h=function(e){if(k(e),!a&&!s){var t=d[e.type];"pointer"===t&&(t=x(e)),o!==t&&(o=t,m("intent"))}},y=function(n){t=n.target.nodeName.toLowerCase(),e.setAttribute("data-whatelement",t),n.target.classList&&n.target.classList.length&&e.setAttribute("data-whatclasses",n.target.classList.toString().replace(" ",","))},E=function(){t=null,e.removeAttribute("data-whatelement"),e.removeAttribute("data-whatclasses")},L=function(e){"touchstart"===e.type?(a=!1,l(e)):a=!0},x=function(e){return"number"==typeof e.pointerType?p[e.pointerType]:"pen"===e.pointerType?"touch":e.pointerType},g=function(){return"onwheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll"},b=function(e){for(var t=0,i=r.length;t<i;t++)r[t].type===e&&r[t].fn.call(void 0,"input"===e?n:o)},M=function(e){for(var t=0,n=r.length;t<n;t++)if(r[t].fn===e)return t},k=function(e){c.x!==e.screenX||c.y!==e.screenY?(s=!1,c.x=e.screenX,c.y=e.screenY):s=!0};return"addEventListener"in window&&Array.prototype.indexOf&&function(){d[g()]="mouse",v(),m("input"),m("intent")}(),{ask:function(e){return"intent"===e?o:n},element:function(){return t},ignoreKeys:function(e){u=e},registerOnChange:function(e,t){r.push({fn:e,type:t||"input"})},unRegisterOnChange:function(e){var t=M(e);t&&r.splice(t,1)}}}()}])});

!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n(require("jquery")):"function"==typeof define&&define.amd?define(["jquery"],n):"object"==typeof exports?exports["foundation.core"]=n(require("jquery")):(t.__FOUNDATION_EXTERNAL__=t.__FOUNDATION_EXTERNAL__||{},t.__FOUNDATION_EXTERNAL__["foundation.core"]=n(t.jQuery))}(window,function(e){return function(e){var o={};function r(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=o,r.d=function(t,n,e){r.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:e})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(n,t){if(1&t&&(n=r(n)),8&t)return n;if(4&t&&"object"==typeof n&&n&&n.__esModule)return n;var e=Object.create(null);if(r.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:n}),2&t&&"string"!=typeof n)for(var o in n)r.d(e,o,function(t){return n[t]}.bind(null,o));return e},r.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(n,"a",n),n},r.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},r.p="",r(r.s=0)}({"./js/entries/plugins/foundation.core.js":function(t,n,e){"use strict";e.r(n);var o=e("jquery"),r=e.n(o),i=e("./js/foundation.core.js");e.d(n,"Foundation",function(){return i.Foundation});var a=e("./js/foundation.core.plugin.js"),u=e("./js/foundation.core.utils.js");e.d(n,"Plugin",function(){return a.Plugin}),e.d(n,"rtl",function(){return u.rtl}),e.d(n,"GetYoDigits",function(){return u.GetYoDigits}),e.d(n,"RegExpEscape",function(){return u.RegExpEscape}),e.d(n,"transitionend",function(){return u.transitionend}),e.d(n,"onLoad",function(){return u.onLoad}),e.d(n,"ignoreMousedisappear",function(){return u.ignoreMousedisappear}),i.Foundation.addToJquery(r.a),i.Foundation.Plugin=a.Plugin,i.Foundation.rtl=u.rtl,i.Foundation.GetYoDigits=u.GetYoDigits,i.Foundation.transitionend=u.transitionend,i.Foundation.RegExpEscape=u.RegExpEscape,i.Foundation.onLoad=u.onLoad,window.Foundation=i.Foundation},"./js/foundation.core.js":function(t,n,e){"use strict";e.r(n),e.d(n,"Foundation",function(){return s});var o=e("jquery"),i=e.n(o),r=e("./js/foundation.core.utils.js"),a=e("./js/foundation.util.mediaQuery.js");function u(t){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var s={version:"6.5.1",_plugins:{},_uuids:[],plugin:function(t,n){var e=n||c(t),o=d(e);this._plugins[o]=this[e]=t},registerPlugin:function(t,n){var e=n?d(n):c(t.constructor).toLowerCase();t.uuid=Object(r.GetYoDigits)(6,e),t.$element.attr("data-".concat(e))||t.$element.attr("data-".concat(e),t.uuid),t.$element.data("zfPlugin")||t.$element.data("zfPlugin",t),t.$element.trigger("init.zf.".concat(e)),this._uuids.push(t.uuid)},unregisterPlugin:function(t){var n=d(c(t.$element.data("zfPlugin").constructor));for(var e in this._uuids.splice(this._uuids.indexOf(t.uuid),1),t.$element.removeAttr("data-".concat(n)).removeData("zfPlugin").trigger("destroyed.zf.".concat(n)),t)t[e]=null},reInit:function(t){var n=t instanceof i.a;try{if(n)t.each(function(){i()(this).data("zfPlugin")._init()});else{var e=u(t),o=this;({object:function(t){t.forEach(function(t){t=d(t),i()("[data-"+t+"]").foundation("_init")})},string:function(){t=d(t),i()("[data-"+t+"]").foundation("_init")},undefined:function(){this.object(Object.keys(o._plugins))}})[e](t)}}catch(t){console.error(t)}finally{return t}},reflow:function(o,t){void 0===t?t=Object.keys(this._plugins):"string"==typeof t&&(t=[t]);var r=this;i.a.each(t,function(t,n){var e=r._plugins[n];i()(o).find("[data-"+n+"]").addBack("[data-"+n+"]").each(function(){var t=i()(this),o={};if(t.data("zfPlugin"))console.warn("Tried to initialize "+n+" on an element that already has a Foundation plugin.");else{if(t.attr("data-options"))t.attr("data-options").split(";").forEach(function(t,n){var e=t.split(":").map(function(t){return t.trim()});e[0]&&(o[e[0]]=function(t){{if("true"===t)return!0;if("false"===t)return!1;if(!isNaN(1*t))return parseFloat(t)}return t}(e[1]))});try{t.data("zfPlugin",new e(i()(this),o))}catch(t){console.error(t)}finally{return}}})})},getFnName:c,addToJquery:function(i){return i.fn.foundation=function(e){var t=u(e),n=i(".no-js");if(n.length&&n.removeClass("no-js"),"undefined"===t)a.MediaQuery._init(),s.reflow(this);else{if("string"!==t)throw new TypeError("We're sorry, ".concat(t," is not a valid parameter. You must use a string representing the method you wish to invoke."));var o=Array.prototype.slice.call(arguments,1),r=this.data("zfPlugin");if(void 0===r||void 0===r[e])throw new ReferenceError("We're sorry, '"+e+"' is not an available method for "+(r?c(r):"this element")+".");1===this.length?r[e].apply(r,o):this.each(function(t,n){r[e].apply(i(n).data("zfPlugin"),o)})}return this},i}};function c(t){if(void 0!==Function.prototype.name)return void 0===t.prototype?t.constructor.name:t.prototype.constructor.name;var n=/function\s([^(]{1,})\(/.exec(t.toString());return n&&1<n.length?n[1].trim():""}function d(t){return t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}s.util={throttle:function(e,o){var r=null;return function(){var t=this,n=arguments;null===r&&(r=setTimeout(function(){e.apply(t,n),r=null},o))}}},window.Foundation=s,function(){Date.now&&window.Date.now||(window.Date.now=Date.now=function(){return(new Date).getTime()});for(var t=["webkit","moz"],n=0;n<t.length&&!window.requestAnimationFrame;++n){var e=t[n];window.requestAnimationFrame=window[e+"RequestAnimationFrame"],window.cancelAnimationFrame=window[e+"CancelAnimationFrame"]||window[e+"CancelRequestAnimationFrame"]}if(/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)||!window.requestAnimationFrame||!window.cancelAnimationFrame){var o=0;window.requestAnimationFrame=function(t){var n=Date.now(),e=Math.max(o+16,n);return setTimeout(function(){t(o=e)},e-n)},window.cancelAnimationFrame=clearTimeout}window.performance&&window.performance.now||(window.performance={start:Date.now(),now:function(){return Date.now()-this.start}})}(),Function.prototype.bind||(Function.prototype.bind=function(t){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var n=Array.prototype.slice.call(arguments,1),e=this,o=function(){},r=function(){return e.apply(this instanceof o?this:t,n.concat(Array.prototype.slice.call(arguments)))};return this.prototype&&(o.prototype=this.prototype),r.prototype=new o,r})},"./js/foundation.core.plugin.js":function(t,n,e){"use strict";e.r(n),e.d(n,"Plugin",function(){return o});e("jquery");var r=e("./js/foundation.core.utils.js");function i(t,n){for(var e=0;e<n.length;e++){var o=n[e];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}var o=function(){function o(t,n){!function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}(this,o),this._setup(t,n);var e=u(this);this.uuid=Object(r.GetYoDigits)(6,e),this.$element.attr("data-".concat(e))||this.$element.attr("data-".concat(e),this.uuid),this.$element.data("zfPlugin")||this.$element.data("zfPlugin",this),this.$element.trigger("init.zf.".concat(e))}var t,n,e;return t=o,(n=[{key:"destroy",value:function(){this._destroy();var t=u(this);for(var n in this.$element.removeAttr("data-".concat(t)).removeData("zfPlugin").trigger("destroyed.zf.".concat(t)),this)this[n]=null}}])&&i(t.prototype,n),e&&i(t,e),o}();function a(t){return t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function u(t){return void 0!==t.constructor.name?a(t.constructor.name):a(t.className)}},"./js/foundation.core.utils.js":function(t,n,e){"use strict";e.r(n),e.d(n,"rtl",function(){return r}),e.d(n,"GetYoDigits",function(){return i}),e.d(n,"RegExpEscape",function(){return a}),e.d(n,"transitionend",function(){return u}),e.d(n,"onLoad",function(){return c}),e.d(n,"ignoreMousedisappear",function(){return d});var o=e("jquery"),s=e.n(o);function r(){return"rtl"===s()("html").attr("dir")}function i(t,n){return t=t||6,Math.round(Math.pow(36,t+1)-Math.random()*Math.pow(36,t)).toString(36).slice(1)+(n?"-".concat(n):"")}function a(t){return t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")}function u(t){var n,e={transition:"transitionend",WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend"},o=document.createElement("div");for(var r in e)void 0!==o.style[r]&&(n=e[r]);return n||(n=setTimeout(function(){t.triggerHandler("transitionend",[t])},1),"transitionend")}function c(t,n){var e="complete"===document.readyState,o=(e?"_didLoad":"load")+".zf.util.onLoad",r=function(){return t.triggerHandler(o)};return t&&(n&&t.one(o,n),e?setTimeout(r):s()(window).one("load",r)),o}function d(i){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},n=t.ignoreLeaveWindow,a=void 0!==n&&n,e=t.ignoreReappear,u=void 0!==e&&e;return function(n){for(var t=arguments.length,e=new Array(1<t?t-1:0),o=1;o<t;o++)e[o-1]=arguments[o];var r=i.bind.apply(i,[this,n].concat(e));if(null!==n.relatedTarget)return r();setTimeout(function(){if(!a&&document.hasFocus&&!document.hasFocus())return r();u||s()(document).one("mouseenter",function(t){s()(n.currentTarget).has(t.target).length||(n.relatedTarget=t.target,r())})},0)}}},"./js/foundation.util.mediaQuery.js":function(t,n,e){"use strict";e.r(n),e.d(n,"MediaQuery",function(){return a});var o=e("jquery"),i=e.n(o);function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}window.matchMedia||(window.matchMedia=function(){var n=window.styleMedia||window.media;if(!n){var e,o=document.createElement("style"),t=document.getElementsByTagName("script")[0];o.type="text/css",o.id="matchmediajs-test",t?t.parentNode.insertBefore(o,t):document.head.appendChild(o),e="getComputedStyle"in window&&window.getComputedStyle(o,null)||o.currentStyle,n={matchMedium:function(t){var n="@media "+t+"{ #matchmediajs-test { width: 1px; } }";return o.styleSheet?o.styleSheet.cssText=n:o.textContent=n,"1px"===e.width}}}return function(t){return{matches:n.matchMedium(t||"all"),media:t||"all"}}}());var a={queries:[],current:"",_init:function(){i()("meta.foundation-mq").length||i()('<meta class="foundation-mq">').appendTo(document.head);var t,n,e,o=i()(".foundation-mq").css("font-family");for(var r in e={},t="string"==typeof(n=o)&&(n=n.trim().slice(1,-1))?e=n.split("&").reduce(function(t,n){var e=n.replace(/\+/g," ").split("="),o=e[0],r=e[1];return o=decodeURIComponent(o),r=void 0===r?null:decodeURIComponent(r),t.hasOwnProperty(o)?Array.isArray(t[o])?t[o].push(r):t[o]=[t[o],r]:t[o]=r,t},{}):e)t.hasOwnProperty(r)&&this.queries.push({name:r,value:"only screen and (min-width: ".concat(t[r],")")});this.current=this._getCurrentSize(),this._watcher()},atLeast:function(t){var n=this.get(t);return!!n&&window.matchMedia(n).matches},is:function(t){return 1<(t=t.trim().split(" ")).length&&"only"===t[1]?t[0]===this._getCurrentSize():this.atLeast(t[0])},get:function(t){for(var n in this.queries)if(this.queries.hasOwnProperty(n)){var e=this.queries[n];if(t===e.name)return e.value}return null},_getCurrentSize:function(){for(var t,n=0;n<this.queries.length;n++){var e=this.queries[n];window.matchMedia(e.value).matches&&(t=e)}return"object"===r(t)?t.name:t},_watcher:function(){var e=this;i()(window).off("resize.zf.mediaquery").on("resize.zf.mediaquery",function(){var t=e._getCurrentSize(),n=e.current;t!==n&&(e.current=t,i()(window).trigger("changed.zf.mediaquery",[t,n]))})}}},0:function(t,n,e){t.exports=e("./js/entries/plugins/foundation.core.js")},jquery:function(t,n){t.exports=e}})});
//# sourceMappingURL=foundation.core.min.js.map

!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("./foundation.core"),require("./foundation.core.utils")):"function"==typeof define&&define.amd?define(["./foundation.core","./foundation.core.utils"],e):"object"==typeof exports?exports["foundation.util.box"]=e(require("./foundation.core"),require("./foundation.core.utils")):(t.__FOUNDATION_EXTERNAL__=t.__FOUNDATION_EXTERNAL__||{},t.__FOUNDATION_EXTERNAL__["foundation.util.box"]=e(t.__FOUNDATION_EXTERNAL__["foundation.core"],t.__FOUNDATION_EXTERNAL__["foundation.core"]))}(window,function(o,i){return function(o){var i={};function n(t){if(i[t])return i[t].exports;var e=i[t]={i:t,l:!1,exports:{}};return o[t].call(e.exports,e,e.exports,n),e.l=!0,e.exports}return n.m=o,n.c=i,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=21)}({"./foundation.core":function(t,e){t.exports=o},"./foundation.core.utils":function(t,e){t.exports=i},"./js/entries/plugins/foundation.util.box.js":function(t,e,o){"use strict";o.r(e);var i=o("./foundation.core");o.d(e,"Foundation",function(){return i.Foundation});var n=o("./js/foundation.util.box.js");o.d(e,"Box",function(){return n.Box}),i.Foundation.Box=n.Box},"./js/foundation.util.box.js":function(t,e,o){"use strict";o.r(e),o.d(e,"Box",function(){return i});var r=o("./foundation.core.utils"),i={ImNotTouchingYou:function(t,e,o,i,n){return 0===f(t,e,o,i,n)},OverlapArea:f,GetDimensions:l,GetOffsets:function(t,e,o,i,n,f){switch(console.log("NOTE: GetOffsets is deprecated in favor of GetExplicitOffsets and will be removed in 6.5"),o){case"top":return Object(r.rtl)()?s(t,e,"top","left",i,n,f):s(t,e,"top","right",i,n,f);case"bottom":return Object(r.rtl)()?s(t,e,"bottom","left",i,n,f):s(t,e,"bottom","right",i,n,f);case"center top":return s(t,e,"top","center",i,n,f);case"center bottom":return s(t,e,"bottom","center",i,n,f);case"center left":return s(t,e,"left","center",i,n,f);case"center right":return s(t,e,"right","center",i,n,f);case"left bottom":return s(t,e,"bottom","left",i,n,f);case"right bottom":return s(t,e,"bottom","right",i,n,f);case"center":return{left:$eleDims.windowDims.offset.left+$eleDims.windowDims.width/2-$eleDims.width/2+n,top:$eleDims.windowDims.offset.top+$eleDims.windowDims.height/2-($eleDims.height/2+i)};case"reveal":return{left:($eleDims.windowDims.width-$eleDims.width)/2+n,top:$eleDims.windowDims.offset.top+i};case"reveal full":return{left:$eleDims.windowDims.offset.left,top:$eleDims.windowDims.offset.top};default:return{left:Object(r.rtl)()?$anchorDims.offset.left-$eleDims.width+$anchorDims.width-n:$anchorDims.offset.left+n,top:$anchorDims.offset.top+$anchorDims.height+i}}},GetExplicitOffsets:s};function f(t,e,o,i,n){var f,r,s,u,c=l(t);if(e){var a=l(e);r=a.height+a.offset.top-(c.offset.top+c.height),f=c.offset.top-a.offset.top,s=c.offset.left-a.offset.left,u=a.width+a.offset.left-(c.offset.left+c.width)}else r=c.windowDims.height+c.windowDims.offset.top-(c.offset.top+c.height),f=c.offset.top-c.windowDims.offset.top,s=c.offset.left-c.windowDims.offset.left,u=c.windowDims.width-(c.offset.left+c.width);return r=n?0:Math.min(r,0),f=Math.min(f,0),s=Math.min(s,0),u=Math.min(u,0),o?s+u:i?f+r:Math.sqrt(f*f+r*r+s*s+u*u)}function l(t){if((t=t.length?t[0]:t)===window||t===document)throw new Error("I'm sorry, Dave. I'm afraid I can't do that.");var e=t.getBoundingClientRect(),o=t.parentNode.getBoundingClientRect(),i=document.body.getBoundingClientRect(),n=window.pageYOffset,f=window.pageXOffset;return{width:e.width,height:e.height,offset:{top:e.top+n,left:e.left+f},parentDims:{width:o.width,height:o.height,offset:{top:o.top+n,left:o.left+f}},windowDims:{width:i.width,height:i.height,offset:{top:n,left:f}}}}function s(t,e,o,i,n,f,r){var s,u,c=l(t),a=e?l(e):null;switch(o){case"top":s=a.offset.top-(c.height+n);break;case"bottom":s=a.offset.top+a.height+n;break;case"left":u=a.offset.left-(c.width+f);break;case"right":u=a.offset.left+a.width+f}switch(o){case"top":case"bottom":switch(i){case"left":u=a.offset.left+f;break;case"right":u=a.offset.left-c.width+a.width-f;break;case"center":u=r?f:a.offset.left+a.width/2-c.width/2+f}break;case"right":case"left":switch(i){case"bottom":s=a.offset.top-n+a.height-c.height;break;case"top":s=a.offset.top+n;break;case"center":s=a.offset.top+n+a.height/2-c.height/2}}return{top:s,left:u}}},21:function(t,e,o){t.exports=o("./js/entries/plugins/foundation.util.box.js")}})});
//# sourceMappingURL=foundation.util.box.min.js.map

!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n(require("./foundation.core"),require("./foundation.core.utils"),require("jquery")):"function"==typeof define&&define.amd?define(["./foundation.core","./foundation.core.utils","jquery"],n):"object"==typeof exports?exports["foundation.util.keyboard"]=n(require("./foundation.core"),require("./foundation.core.utils"),require("jquery")):(e.__FOUNDATION_EXTERNAL__=e.__FOUNDATION_EXTERNAL__||{},e.__FOUNDATION_EXTERNAL__["foundation.util.keyboard"]=n(e.__FOUNDATION_EXTERNAL__["foundation.core"],e.__FOUNDATION_EXTERNAL__["foundation.core"],e.jQuery))}(window,function(t,o,r){return function(t){var o={};function r(e){if(o[e])return o[e].exports;var n=o[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=t,r.c=o,r.d=function(e,n,t){r.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(n,e){if(1&e&&(n=r(n)),8&e)return n;if(4&e&&"object"==typeof n&&n&&n.__esModule)return n;var t=Object.create(null);if(r.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:n}),2&e&&"string"!=typeof n)for(var o in n)r.d(t,o,function(e){return n[e]}.bind(null,o));return t},r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,"a",n),n},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},r.p="",r(r.s=23)}({"./foundation.core":function(e,n){e.exports=t},"./foundation.core.utils":function(e,n){e.exports=o},"./js/entries/plugins/foundation.util.keyboard.js":function(e,n,t){"use strict";t.r(n);var o=t("./foundation.core");t.d(n,"Foundation",function(){return o.Foundation});var r=t("./js/foundation.util.keyboard.js");t.d(n,"Keyboard",function(){return r.Keyboard}),o.Foundation.Keyboard=r.Keyboard},"./js/foundation.util.keyboard.js":function(e,n,t){"use strict";t.r(n),t.d(n,"Keyboard",function(){return c});var o=t("jquery"),a=t.n(o),f=t("./foundation.core.utils"),r={9:"TAB",13:"ENTER",27:"ESCAPE",32:"SPACE",35:"END",36:"HOME",37:"ARROW_LEFT",38:"ARROW_UP",39:"ARROW_RIGHT",40:"ARROW_DOWN"},d={};function u(e){return!!e&&e.find("a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]").filter(function(){return!(!a()(this).is(":visible")||a()(this).attr("tabindex")<0)})}function i(e){var n=r[e.which||e.keyCode]||String.fromCharCode(e.which).toUpperCase();return n=n.replace(/\W+/,""),e.shiftKey&&(n="SHIFT_".concat(n)),e.ctrlKey&&(n="CTRL_".concat(n)),e.altKey&&(n="ALT_".concat(n)),n=n.replace(/_$/,"")}var c={keys:function(e){var n={};for(var t in e)n[e[t]]=e[t];return n}(r),parseKey:i,handleKey:function(e,n,t){var o,r=d[n],u=this.parseKey(e);if(!r)return console.warn("Component not defined!");if((o=t[(void 0===r.ltr?r:Object(f.rtl)()?a.a.extend({},r.ltr,r.rtl):a.a.extend({},r.rtl,r.ltr))[u]])&&"function"==typeof o){var i=o.apply();(t.handled||"function"==typeof t.handled)&&t.handled(i)}else(t.unhandled||"function"==typeof t.unhandled)&&t.unhandled()},findFocusable:u,register:function(e,n){d[e]=n},trapFocus:function(e){var n=u(e),t=n.eq(0),o=n.eq(-1);e.on("keydown.zf.trapfocus",function(e){e.target===o[0]&&"TAB"===i(e)?(e.preventDefault(),t.focus()):e.target===t[0]&&"SHIFT_TAB"===i(e)&&(e.preventDefault(),o.focus())})},releaseFocus:function(e){e.off("keydown.zf.trapfocus")}}},23:function(e,n,t){e.exports=t("./js/entries/plugins/foundation.util.keyboard.js")},jquery:function(e,n){e.exports=r}})});
//# sourceMappingURL=foundation.util.keyboard.min.js.map

!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("./foundation.core"),require("jquery")):"function"==typeof define&&define.amd?define(["./foundation.core","jquery"],t):"object"==typeof exports?exports["foundation.util.mediaQuery"]=t(require("./foundation.core"),require("jquery")):(e.__FOUNDATION_EXTERNAL__=e.__FOUNDATION_EXTERNAL__||{},e.__FOUNDATION_EXTERNAL__["foundation.util.mediaQuery"]=t(e.__FOUNDATION_EXTERNAL__["foundation.core"],e.jQuery))}(window,function(n,r){return function(n){var r={};function i(e){if(r[e])return r[e].exports;var t=r[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,i),t.l=!0,t.exports}return i.m=n,i.c=r,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(n,r,function(e){return t[e]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=24)}({"./foundation.core":function(e,t){e.exports=n},"./js/entries/plugins/foundation.util.mediaQuery.js":function(e,t,n){"use strict";n.r(t);var r=n("./foundation.core");n.d(t,"Foundation",function(){return r.Foundation});var i=n("./js/foundation.util.mediaQuery.js");n.d(t,"MediaQuery",function(){return i.MediaQuery}),r.Foundation.MediaQuery=i.MediaQuery,r.Foundation.MediaQuery._init()},"./js/foundation.util.mediaQuery.js":function(e,t,n){"use strict";n.r(t),n.d(t,"MediaQuery",function(){return u});var r=n("jquery"),o=n.n(r);function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}window.matchMedia||(window.matchMedia=function(){var t=window.styleMedia||window.media;if(!t){var n,r=document.createElement("style"),e=document.getElementsByTagName("script")[0];r.type="text/css",r.id="matchmediajs-test",e?e.parentNode.insertBefore(r,e):document.head.appendChild(r),n="getComputedStyle"in window&&window.getComputedStyle(r,null)||r.currentStyle,t={matchMedium:function(e){var t="@media "+e+"{ #matchmediajs-test { width: 1px; } }";return r.styleSheet?r.styleSheet.cssText=t:r.textContent=t,"1px"===n.width}}}return function(e){return{matches:t.matchMedium(e||"all"),media:e||"all"}}}());var u={queries:[],current:"",_init:function(){o()("meta.foundation-mq").length||o()('<meta class="foundation-mq">').appendTo(document.head);var e,t,n,r=o()(".foundation-mq").css("font-family");for(var i in n={},e="string"==typeof(t=r)&&(t=t.trim().slice(1,-1))?n=t.split("&").reduce(function(e,t){var n=t.replace(/\+/g," ").split("="),r=n[0],i=n[1];return r=decodeURIComponent(r),i=void 0===i?null:decodeURIComponent(i),e.hasOwnProperty(r)?Array.isArray(e[r])?e[r].push(i):e[r]=[e[r],i]:e[r]=i,e},{}):n)e.hasOwnProperty(i)&&this.queries.push({name:i,value:"only screen and (min-width: ".concat(e[i],")")});this.current=this._getCurrentSize(),this._watcher()},atLeast:function(e){var t=this.get(e);return!!t&&window.matchMedia(t).matches},is:function(e){return 1<(e=e.trim().split(" ")).length&&"only"===e[1]?e[0]===this._getCurrentSize():this.atLeast(e[0])},get:function(e){for(var t in this.queries)if(this.queries.hasOwnProperty(t)){var n=this.queries[t];if(e===n.name)return n.value}return null},_getCurrentSize:function(){for(var e,t=0;t<this.queries.length;t++){var n=this.queries[t];window.matchMedia(n.value).matches&&(e=n)}return"object"===i(e)?e.name:e},_watcher:function(){var n=this;o()(window).off("resize.zf.mediaquery").on("resize.zf.mediaquery",function(){var e=n._getCurrentSize(),t=n.current;e!==t&&(n.current=e,o()(window).trigger("changed.zf.mediaquery",[e,t]))})}}},24:function(e,t,n){e.exports=n("./js/entries/plugins/foundation.util.mediaQuery.js")},jquery:function(e,t){e.exports=r}})});
//# sourceMappingURL=foundation.util.mediaQuery.min.js.map

!function(n,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("./foundation.core"),require("./foundation.core.utils"),require("jquery")):"function"==typeof define&&define.amd?define(["./foundation.core","./foundation.core.utils","jquery"],t):"object"==typeof exports?exports["foundation.util.motion"]=t(require("./foundation.core"),require("./foundation.core.utils"),require("jquery")):(n.__FOUNDATION_EXTERNAL__=n.__FOUNDATION_EXTERNAL__||{},n.__FOUNDATION_EXTERNAL__["foundation.util.motion"]=t(n.__FOUNDATION_EXTERNAL__["foundation.core"],n.__FOUNDATION_EXTERNAL__["foundation.core"],n.jQuery))}(window,function(e,o,i){return function(e){var o={};function i(n){if(o[n])return o[n].exports;var t=o[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,i),t.l=!0,t.exports}return i.m=e,i.c=o,i.d=function(n,t,e){i.o(n,t)||Object.defineProperty(n,t,{enumerable:!0,get:e})},i.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},i.t=function(t,n){if(1&n&&(t=i(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(i.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)i.d(e,o,function(n){return t[n]}.bind(null,o));return e},i.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return i.d(t,"a",t),t},i.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},i.p="",i(i.s=25)}({"./foundation.core":function(n,t){n.exports=e},"./foundation.core.utils":function(n,t){n.exports=o},"./js/entries/plugins/foundation.util.motion.js":function(n,t,e){"use strict";e.r(t);var o=e("./foundation.core");e.d(t,"Foundation",function(){return o.Foundation});var i=e("./js/foundation.util.motion.js");e.d(t,"Motion",function(){return i.Motion}),e.d(t,"Move",function(){return i.Move}),o.Foundation.Motion=i.Motion,o.Foundation.Move=i.Move},"./js/foundation.util.motion.js":function(n,t,e){"use strict";e.r(t),e.d(t,"Move",function(){return r}),e.d(t,"Motion",function(){return i});var o=e("jquery"),a=e.n(o),f=e("./foundation.core.utils"),c=["mui-enter","mui-leave"],d=["mui-enter-active","mui-leave-active"],i={animateIn:function(n,t,e){u(!0,n,t,e)},animateOut:function(n,t,e){u(!1,n,t,e)}};function r(e,o,i){var r,u,a=null;if(0===e)return i.apply(o),void o.trigger("finished.zf.animate",[o]).triggerHandler("finished.zf.animate",[o]);r=window.requestAnimationFrame(function n(t){a||(a=t),u=t-a,i.apply(o),u<e?r=window.requestAnimationFrame(n,o):(window.cancelAnimationFrame(r),o.trigger("finished.zf.animate",[o]).triggerHandler("finished.zf.animate",[o]))})}function u(n,t,e,o){if((t=a()(t).eq(0)).length){var i=n?c[0]:c[1],r=n?d[0]:d[1];u(),t.addClass(e).css("transition","none"),requestAnimationFrame(function(){t.addClass(i),n&&t.show()}),requestAnimationFrame(function(){t[0].offsetWidth,t.css("transition","").addClass(r)}),t.one(Object(f.transitionend)(t),function(){n||t.hide();u(),o&&o.apply(t)})}function u(){t[0].style.transitionDuration=0,t.removeClass("".concat(i," ").concat(r," ").concat(e))}}},25:function(n,t,e){n.exports=e("./js/entries/plugins/foundation.util.motion.js")},jquery:function(n,t){n.exports=i}})});
//# sourceMappingURL=foundation.util.motion.min.js.map

!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("./foundation.core"),require("jquery")):"function"==typeof define&&define.amd?define(["./foundation.core","jquery"],t):"object"==typeof exports?exports["foundation.util.nest"]=t(require("./foundation.core"),require("jquery")):(e.__FOUNDATION_EXTERNAL__=e.__FOUNDATION_EXTERNAL__||{},e.__FOUNDATION_EXTERNAL__["foundation.util.nest"]=t(e.__FOUNDATION_EXTERNAL__["foundation.core"],e.jQuery))}(window,function(n,r){return function(n){var r={};function o(e){if(r[e])return r[e].exports;var t=r[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,o),t.l=!0,t.exports}return o.m=n,o.c=r,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=26)}({"./foundation.core":function(e,t){e.exports=n},"./js/entries/plugins/foundation.util.nest.js":function(e,t,n){"use strict";n.r(t);var r=n("./foundation.core");n.d(t,"Foundation",function(){return r.Foundation});var o=n("./js/foundation.util.nest.js");n.d(t,"Nest",function(){return o.Nest}),r.Foundation.Nest=o.Nest},"./js/foundation.util.nest.js":function(e,t,n){"use strict";n.r(t),n.d(t,"Nest",function(){return o});var r=n("jquery"),a=n.n(r),o={Feather:function(e){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"zf";e.attr("role","menubar");var t=e.find("li").attr({role:"menuitem"}),r="is-".concat(n,"-submenu"),o="".concat(r,"-item"),u="is-".concat(n,"-submenu-parent"),i="accordion"!==n;t.each(function(){var e=a()(this),t=e.children("ul");t.length&&(e.addClass(u),t.addClass("submenu ".concat(r)).attr({"data-submenu":""}),i&&(e.attr({"aria-haspopup":!0,"aria-label":e.children("a:first").text()}),"drilldown"===n&&e.attr({"aria-expanded":!1})),t.addClass("submenu ".concat(r)).attr({"data-submenu":"",role:"menubar"}),"drilldown"===n&&t.attr({"aria-hidden":!0})),e.parent("[data-submenu]").length&&e.addClass("is-submenu-item ".concat(o))})},Burn:function(e,t){var n="is-".concat(t,"-submenu"),r="".concat(n,"-item"),o="is-".concat(t,"-submenu-parent");e.find(">li, > li > ul, .menu, .menu > li, [data-submenu] > li").removeClass("".concat(n," ").concat(r," ").concat(o," is-submenu-item submenu is-active")).removeAttr("data-submenu").css("display","")}}},26:function(e,t,n){e.exports=n("./js/entries/plugins/foundation.util.nest.js")},jquery:function(e,t){e.exports=r}})});
//# sourceMappingURL=foundation.util.nest.min.js.map

!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("./foundation.core"),require("jquery")):"function"==typeof define&&define.amd?define(["./foundation.core","jquery"],t):"object"==typeof exports?exports["foundation.util.touch"]=t(require("./foundation.core"),require("jquery")):(e.__FOUNDATION_EXTERNAL__=e.__FOUNDATION_EXTERNAL__||{},e.__FOUNDATION_EXTERNAL__["foundation.util.touch"]=t(e.__FOUNDATION_EXTERNAL__["foundation.core"],e.jQuery))}(window,function(n,o){return function(n){var o={};function i(e){if(o[e])return o[e].exports;var t=o[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,i),t.l=!0,t.exports}return i.m=n,i.c=o,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(n,o,function(e){return t[e]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=28)}({"./foundation.core":function(e,t){e.exports=n},"./js/entries/plugins/foundation.util.touch.js":function(e,t,n){"use strict";n.r(t);var o=n("jquery"),i=n.n(o),u=n("./js/foundation.util.touch.js");n.d(t,"Touch",function(){return u.Touch});var r=n("./foundation.core");n.d(t,"Foundation",function(){return r.Foundation}),u.Touch.init(i.a),window.Foundation.Touch=u.Touch},"./js/foundation.util.touch.js":function(e,t,n){"use strict";n.r(t),n.d(t,"Touch",function(){return f});var o=n("jquery"),i=n.n(o);function u(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}var r,c,s,a,f={},p=!1,d=!1;function l(e){if(this.removeEventListener("touchmove",h),this.removeEventListener("touchend",l),!d){var t=i.a.Event("tap",a||e);i()(this).trigger(t)}a=null,d=p=!1}function h(e){if(i.a.spotSwipe.preventDefault&&e.preventDefault(),p){var t,n=e.touches[0].pageX,o=(e.touches[0].pageY,r-n);d=!0,s=(new Date).getTime()-c,Math.abs(o)>=i.a.spotSwipe.moveThreshold&&s<=i.a.spotSwipe.timeThreshold&&(t=0<o?"left":"right"),t&&(e.preventDefault(),l.apply(this,arguments),i()(this).trigger(i.a.Event("swipe",e),t).trigger(i.a.Event("swipe".concat(t),e)))}}function v(e){1==e.touches.length&&(r=e.touches[0].pageX,e.touches[0].pageY,a=e,d=!(p=!0),c=(new Date).getTime(),this.addEventListener("touchmove",h,!1),this.addEventListener("touchend",l,!1))}function w(){this.addEventListener&&this.addEventListener("touchstart",v,!1)}var m=function(){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),this.version="1.0.0",this.enabled="ontouchstart"in document.documentElement,this.preventDefault=!1,this.moveThreshold=75,this.timeThreshold=200,this.$=e,this._init()}var e,n,o;return e=t,(n=[{key:"_init",value:function(){var e=this.$;e.event.special.swipe={setup:w},e.event.special.tap={setup:w},e.each(["left","up","down","right"],function(){e.event.special["swipe".concat(this)]={setup:function(){e(this).on("swipe",e.noop)}}})}}])&&u(e.prototype,n),o&&u(e,o),t}();f.setupSpotSwipe=function(e){e.spotSwipe=new m(e)},f.setupTouchHandler=function(o){o.fn.addTouch=function(){this.each(function(e,t){o(t).bind("touchstart touchmove touchend touchcancel",function(e){n(e)})});var n=function(e){var t,n=e.changedTouches[0],o={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup"}[e.type];"MouseEvent"in window&&"function"==typeof window.MouseEvent?t=new window.MouseEvent(o,{bubbles:!0,cancelable:!0,screenX:n.screenX,screenY:n.screenY,clientX:n.clientX,clientY:n.clientY}):(t=document.createEvent("MouseEvent")).initMouseEvent(o,!0,!0,window,1,n.screenX,n.screenY,n.clientX,n.clientY,!1,!1,!1,!1,0,null),n.target.dispatchEvent(t)}}},f.init=function(e){void 0===e.spotSwipe&&(f.setupSpotSwipe(e),f.setupTouchHandler(e))}},28:function(e,t,n){e.exports=n("./js/entries/plugins/foundation.util.touch.js")},jquery:function(e,t){e.exports=o}})});
//# sourceMappingURL=foundation.util.touch.min.js.map

!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("./foundation.core"),require("./foundation.core.utils"),require("./foundation.util.motion"),require("jquery")):"function"==typeof define&&define.amd?define(["./foundation.core","./foundation.core.utils","./foundation.util.motion","jquery"],t):"object"==typeof exports?exports["foundation.util.triggers"]=t(require("./foundation.core"),require("./foundation.core.utils"),require("./foundation.util.motion"),require("jquery")):(e.__FOUNDATION_EXTERNAL__=e.__FOUNDATION_EXTERNAL__||{},e.__FOUNDATION_EXTERNAL__["foundation.util.triggers"]=t(e.__FOUNDATION_EXTERNAL__["foundation.core"],e.__FOUNDATION_EXTERNAL__["foundation.core"],e.__FOUNDATION_EXTERNAL__["foundation.util.motion"],e.jQuery))}(window,function(i,r,n,o){return function(i){var r={};function n(e){if(r[e])return r[e].exports;var t=r[e]={i:e,l:!1,exports:{}};return i[e].call(t.exports,t,t.exports,n),t.l=!0,t.exports}return n.m=i,n.c=r,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=29)}({"./foundation.core":function(e,t){e.exports=i},"./foundation.core.utils":function(e,t){e.exports=r},"./foundation.util.motion":function(e,t){e.exports=n},"./js/entries/plugins/foundation.util.triggers.js":function(e,t,i){"use strict";i.r(t);var r=i("./foundation.core");i.d(t,"Foundation",function(){return r.Foundation});var n=i("jquery"),o=i.n(n),s=i("./js/foundation.util.triggers.js");i.d(t,"Triggers",function(){return s.Triggers}),s.Triggers.init(o.a,r.Foundation)},"./js/foundation.util.triggers.js":function(e,t,i){"use strict";i.r(t),i.d(t,"Triggers",function(){return c});var r=i("jquery"),o=i.n(r),n=i("./foundation.core.utils"),s=i("./foundation.util.motion");function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var l=function(){for(var e=["WebKit","Moz","O","Ms",""],t=0;t<e.length;t++)if("".concat(e[t],"MutationObserver")in window)return window["".concat(e[t],"MutationObserver")];return!1}(),u=function(t,i){t.data(i).split(" ").forEach(function(e){o()("#".concat(e))["close"===i?"trigger":"triggerHandler"]("".concat(i,".zf.trigger"),[t])})},c={Listeners:{Basic:{},Global:{}},Initializers:{}};function f(t,e,i){var r,n=Array.prototype.slice.call(arguments,3);o()(window).off(e).on(e,function(e){r&&clearTimeout(r),r=setTimeout(function(){i.apply(null,n)},t||10)})}c.Listeners.Basic={openListener:function(){u(o()(this),"open")},closeListener:function(){o()(this).data("close")?u(o()(this),"close"):o()(this).trigger("close.zf.trigger")},toggleListener:function(){o()(this).data("toggle")?u(o()(this),"toggle"):o()(this).trigger("toggle.zf.trigger")},closeableListener:function(e){e.stopPropagation();var t=o()(this).data("closable");""!==t?s.Motion.animateOut(o()(this),t,function(){o()(this).trigger("closed.zf")}):o()(this).fadeOut().trigger("closed.zf")},toggleFocusListener:function(){var e=o()(this).data("toggle-focus");o()("#".concat(e)).triggerHandler("toggle.zf.trigger",[o()(this)])}},c.Initializers.addOpenListener=function(e){e.off("click.zf.trigger",c.Listeners.Basic.openListener),e.on("click.zf.trigger","[data-open]",c.Listeners.Basic.openListener)},c.Initializers.addCloseListener=function(e){e.off("click.zf.trigger",c.Listeners.Basic.closeListener),e.on("click.zf.trigger","[data-close]",c.Listeners.Basic.closeListener)},c.Initializers.addToggleListener=function(e){e.off("click.zf.trigger",c.Listeners.Basic.toggleListener),e.on("click.zf.trigger","[data-toggle]",c.Listeners.Basic.toggleListener)},c.Initializers.addCloseableListener=function(e){e.off("close.zf.trigger",c.Listeners.Basic.closeableListener),e.on("close.zf.trigger","[data-closeable], [data-closable]",c.Listeners.Basic.closeableListener)},c.Initializers.addToggleFocusListener=function(e){e.off("focus.zf.trigger blur.zf.trigger",c.Listeners.Basic.toggleFocusListener),e.on("focus.zf.trigger blur.zf.trigger","[data-toggle-focus]",c.Listeners.Basic.toggleFocusListener)},c.Listeners.Global={resizeListener:function(e){l||e.each(function(){o()(this).triggerHandler("resizeme.zf.trigger")}),e.attr("data-events","resize")},scrollListener:function(e){l||e.each(function(){o()(this).triggerHandler("scrollme.zf.trigger")}),e.attr("data-events","scroll")},closeMeListener:function(e,t){var i=e.namespace.split(".")[0];o()("[data-".concat(i,"]")).not('[data-yeti-box="'.concat(t,'"]')).each(function(){var e=o()(this);e.triggerHandler("close.zf.trigger",[e])})}},c.Initializers.addClosemeListener=function(e){var t=o()("[data-yeti-box]"),i=["dropdown","tooltip","reveal"];if(e&&("string"==typeof e?i.push(e):"object"===a(e)&&"string"==typeof e[0]?i.concat(e):console.error("Plugin names must be strings")),t.length){var r=i.map(function(e){return"closeme.zf.".concat(e)}).join(" ");o()(window).off(r).on(r,c.Listeners.Global.closeMeListener)}},c.Initializers.addResizeListener=function(e){var t=o()("[data-resize]");t.length&&f(e,"resize.zf.trigger",c.Listeners.Global.resizeListener,t)},c.Initializers.addScrollListener=function(e){var t=o()("[data-scroll]");t.length&&f(e,"scroll.zf.trigger",c.Listeners.Global.scrollListener,t)},c.Initializers.addMutationEventsListener=function(e){if(!l)return!1;var t=e.find("[data-resize], [data-scroll], [data-mutate]"),i=function(e){var t=o()(e[0].target);switch(e[0].type){case"attributes":"scroll"===t.attr("data-events")&&"data-events"===e[0].attributeName&&t.triggerHandler("scrollme.zf.trigger",[t,window.pageYOffset]),"resize"===t.attr("data-events")&&"data-events"===e[0].attributeName&&t.triggerHandler("resizeme.zf.trigger",[t]),"style"===e[0].attributeName&&(t.closest("[data-mutate]").attr("data-events","mutate"),t.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger",[t.closest("[data-mutate]")]));break;case"childList":t.closest("[data-mutate]").attr("data-events","mutate"),t.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger",[t.closest("[data-mutate]")]);break;default:return!1}};if(t.length)for(var r=0;r<=t.length-1;r++){new l(i).observe(t[r],{attributes:!0,childList:!0,characterData:!1,subtree:!0,attributeFilter:["data-events","style"]})}},c.Initializers.addSimpleListeners=function(){var e=o()(document);c.Initializers.addOpenListener(e),c.Initializers.addCloseListener(e),c.Initializers.addToggleListener(e),c.Initializers.addCloseableListener(e),c.Initializers.addToggleFocusListener(e)},c.Initializers.addGlobalListeners=function(){var e=o()(document);c.Initializers.addMutationEventsListener(e),c.Initializers.addResizeListener(),c.Initializers.addScrollListener(),c.Initializers.addClosemeListener()},c.init=function(e,t){Object(n.onLoad)(e(window),function(){!0!==e.triggersInitialized&&(c.Initializers.addSimpleListeners(),c.Initializers.addGlobalListeners(),e.triggersInitialized=!0)}),t&&(t.Triggers=c,t.IHearYou=c.Initializers.addGlobalListeners)}},29:function(e,t,i){e.exports=i("./js/entries/plugins/foundation.util.triggers.js")},jquery:function(e,t){e.exports=o}})});
//# sourceMappingURL=foundation.util.triggers.min.js.map

!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n(require("./foundation.core"),require("./foundation.core.plugin"),require("./foundation.core.utils"),require("./foundation.util.keyboard"),require("./foundation.util.nest"),require("jquery")):"function"==typeof define&&define.amd?define(["./foundation.core","./foundation.core.plugin","./foundation.core.utils","./foundation.util.keyboard","./foundation.util.nest","jquery"],n):"object"==typeof exports?exports["foundation.accordionMenu"]=n(require("./foundation.core"),require("./foundation.core.plugin"),require("./foundation.core.utils"),require("./foundation.util.keyboard"),require("./foundation.util.nest"),require("jquery")):(e.__FOUNDATION_EXTERNAL__=e.__FOUNDATION_EXTERNAL__||{},e.__FOUNDATION_EXTERNAL__["foundation.accordionMenu"]=n(e.__FOUNDATION_EXTERNAL__["foundation.core"],e.__FOUNDATION_EXTERNAL__["foundation.core"],e.__FOUNDATION_EXTERNAL__["foundation.core"],e.__FOUNDATION_EXTERNAL__["foundation.util.keyboard"],e.__FOUNDATION_EXTERNAL__["foundation.util.nest"],e.jQuery))}(window,function(t,i,o,u,r,a){return function(t){var i={};function o(e){if(i[e])return i[e].exports;var n=i[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,o),n.l=!0,n.exports}return o.m=t,o.c=i,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(n,e){if(1&e&&(n=o(n)),8&e)return n;if(4&e&&"object"==typeof n&&n&&n.__esModule)return n;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:n}),2&e&&"string"!=typeof n)for(var i in n)o.d(t,i,function(e){return n[e]}.bind(null,i));return t},o.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="",o(o.s=2)}({"./foundation.core":function(e,n){e.exports=t},"./foundation.core.plugin":function(e,n){e.exports=i},"./foundation.core.utils":function(e,n){e.exports=o},"./foundation.util.keyboard":function(e,n){e.exports=u},"./foundation.util.nest":function(e,n){e.exports=r},"./js/entries/plugins/foundation.accordionMenu.js":function(e,n,t){"use strict";t.r(n);var i=t("./foundation.core");t.d(n,"Foundation",function(){return i.Foundation});var o=t("./js/foundation.accordionMenu.js");t.d(n,"AccordionMenu",function(){return o.AccordionMenu}),i.Foundation.plugin(o.AccordionMenu,"AccordionMenu")},"./js/foundation.accordionMenu.js":function(e,n,t){"use strict";t.r(n),t.d(n,"AccordionMenu",function(){return h});var i=t("jquery"),a=t.n(i),s=t("./foundation.util.keyboard"),r=t("./foundation.util.nest"),l=t("./foundation.core.utils"),u=t("./foundation.core.plugin");function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,n){for(var t=0;t<n.length;t++){var i=n[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function d(e,n){return!n||"object"!==o(n)&&"function"!=typeof n?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):n}function f(e){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function p(e,n){return(p=Object.setPrototypeOf||function(e,n){return e.__proto__=n,e})(e,n)}var h=function(e){function t(){return function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,t),d(this,f(t).apply(this,arguments))}var n,i,o;return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),n&&p(e,n)}(t,u["Plugin"]),n=t,(i=[{key:"_setup",value:function(e,n){this.$element=e,this.options=a.a.extend({},t.defaults,this.$element.data(),n),this.className="AccordionMenu",this._init(),s.Keyboard.register("AccordionMenu",{ENTER:"toggle",SPACE:"toggle",ARROW_RIGHT:"open",ARROW_UP:"up",ARROW_DOWN:"down",ARROW_LEFT:"close",ESCAPE:"closeAll"})}},{key:"_init",value:function(){r.Nest.Feather(this.$element,"accordion");var u=this;this.$element.find("[data-submenu]").not(".is-active").slideUp(0),this.$element.attr({role:"tree","aria-multiselectable":this.options.multiOpen}),this.$menuLinks=this.$element.find(".is-accordion-submenu-parent"),this.$menuLinks.each(function(){var e=this.id||Object(l.GetYoDigits)(6,"acc-menu-link"),n=a()(this),t=n.children("[data-submenu]"),i=t[0].id||Object(l.GetYoDigits)(6,"acc-menu"),o=t.hasClass("is-active");u.options.parentLink&&n.children("a").clone().prependTo(t).wrap('<li data-is-parent-link class="is-submenu-parent-item is-submenu-item is-accordion-submenu-item"></li>');u.options.submenuToggle?(n.addClass("has-submenu-toggle"),n.children("a").after('<button id="'+e+'" class="submenu-toggle" aria-controls="'+i+'" aria-expanded="'+o+'" title="'+u.options.submenuToggleText+'"><span class="submenu-toggle-text">'+u.options.submenuToggleText+"</span></button>")):n.attr({"aria-controls":i,"aria-expanded":o,id:e}),t.attr({"aria-labelledby":e,"aria-hidden":!o,role:"group",id:i})}),this.$element.find("li").attr({role:"treeitem"});var e=this.$element.find(".is-active");if(e.length){u=this;e.each(function(){u.down(a()(this))})}this._events()}},{key:"_events",value:function(){var r=this;this.$element.find("li").each(function(){var n=a()(this).children("[data-submenu]");n.length&&(r.options.submenuToggle?a()(this).children(".submenu-toggle").off("click.zf.accordionMenu").on("click.zf.accordionMenu",function(e){r.toggle(n)}):a()(this).children("a").off("click.zf.accordionMenu").on("click.zf.accordionMenu",function(e){e.preventDefault(),r.toggle(n)}))}).on("keydown.zf.accordionmenu",function(n){var t,i,o=a()(this),u=o.parent("ul").children("li"),e=o.children("[data-submenu]");u.each(function(e){if(a()(this).is(o))return t=u.eq(Math.max(0,e-1)).find("a").first(),i=u.eq(Math.min(e+1,u.length-1)).find("a").first(),a()(this).children("[data-submenu]:visible").length&&(i=o.find("li:first-child").find("a").first()),a()(this).is(":first-child")?t=o.parents("li").first().find("a").first():t.parents("li").first().children("[data-submenu]:visible").length&&(t=t.parents("li").find("li:last-child").find("a").first()),void(a()(this).is(":last-child")&&(i=o.parents("li").first().next("li").find("a").first()))}),s.Keyboard.handleKey(n,"AccordionMenu",{open:function(){e.is(":hidden")&&(r.down(e),e.find("li").first().find("a").first().focus())},close:function(){e.length&&!e.is(":hidden")?r.up(e):o.parent("[data-submenu]").length&&(r.up(o.parent("[data-submenu]")),o.parents("li").first().find("a").first().focus())},up:function(){return t.focus(),!0},down:function(){return i.focus(),!0},toggle:function(){return!r.options.submenuToggle&&(o.children("[data-submenu]").length?(r.toggle(o.children("[data-submenu]")),!0):void 0)},closeAll:function(){r.hideAll()},handled:function(e){e&&n.preventDefault(),n.stopImmediatePropagation()}})})}},{key:"hideAll",value:function(){this.up(this.$element.find("[data-submenu]"))}},{key:"showAll",value:function(){this.down(this.$element.find("[data-submenu]"))}},{key:"toggle",value:function(e){e.is(":animated")||(e.is(":hidden")?this.down(e):this.up(e))}},{key:"down",value:function(e){var n=this;this.options.multiOpen||this.up(this.$element.find(".is-active").not(e.parentsUntil(this.$element).add(e))),e.addClass("is-active").attr({"aria-hidden":!1}),this.options.submenuToggle?e.prev(".submenu-toggle").attr({"aria-expanded":!0}):e.parent(".is-accordion-submenu-parent").attr({"aria-expanded":!0}),e.slideDown(this.options.slideSpeed,function(){n.$element.trigger("down.zf.accordionMenu",[e])})}},{key:"up",value:function(e){var n=this,t=e.find("[data-submenu]"),i=e.add(t);t.slideUp(0),i.removeClass("is-active").attr("aria-hidden",!0),this.options.submenuToggle?i.prev(".submenu-toggle").attr("aria-expanded",!1):i.parent(".is-accordion-submenu-parent").attr("aria-expanded",!1),e.slideUp(this.options.slideSpeed,function(){n.$element.trigger("up.zf.accordionMenu",[e])})}},{key:"_destroy",value:function(){this.$element.find("[data-submenu]").slideDown(0).css("display",""),this.$element.find("a").off("click.zf.accordionMenu"),this.$element.find("[data-is-parent-link]").detach(),this.options.submenuToggle&&(this.$element.find(".has-submenu-toggle").removeClass("has-submenu-toggle"),this.$element.find(".submenu-toggle").remove()),r.Nest.Burn(this.$element,"accordion")}}])&&c(n.prototype,i),o&&c(n,o),t}();h.defaults={parentLink:!1,slideSpeed:250,submenuToggle:!1,submenuToggleText:"Toggle menu",multiOpen:!0}},2:function(e,n,t){e.exports=t("./js/entries/plugins/foundation.accordionMenu.js")},jquery:function(e,n){e.exports=a}})});
//# sourceMappingURL=foundation.accordionMenu.min.js.map

!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("./foundation.core"),require("./foundation.core.plugin"),require("./foundation.core.utils"),require("./foundation.util.box"),require("./foundation.util.keyboard"),require("./foundation.util.nest"),require("jquery")):"function"==typeof define&&define.amd?define(["./foundation.core","./foundation.core.plugin","./foundation.core.utils","./foundation.util.box","./foundation.util.keyboard","./foundation.util.nest","jquery"],t):"object"==typeof exports?exports["foundation.drilldown"]=t(require("./foundation.core"),require("./foundation.core.plugin"),require("./foundation.core.utils"),require("./foundation.util.box"),require("./foundation.util.keyboard"),require("./foundation.util.nest"),require("jquery")):(e.__FOUNDATION_EXTERNAL__=e.__FOUNDATION_EXTERNAL__||{},e.__FOUNDATION_EXTERNAL__["foundation.drilldown"]=t(e.__FOUNDATION_EXTERNAL__["foundation.core"],e.__FOUNDATION_EXTERNAL__["foundation.core"],e.__FOUNDATION_EXTERNAL__["foundation.core"],e.__FOUNDATION_EXTERNAL__["foundation.util.box"],e.__FOUNDATION_EXTERNAL__["foundation.util.keyboard"],e.__FOUNDATION_EXTERNAL__["foundation.util.nest"],e.jQuery))}(window,function(n,i,o,r,a,s,l){return function(n){var i={};function o(e){if(i[e])return i[e].exports;var t=i[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,o),t.l=!0,t.exports}return o.m=n,o.c=i,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)o.d(n,i,function(e){return t[e]}.bind(null,i));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=3)}({"./foundation.core":function(e,t){e.exports=n},"./foundation.core.plugin":function(e,t){e.exports=i},"./foundation.core.utils":function(e,t){e.exports=o},"./foundation.util.box":function(e,t){e.exports=r},"./foundation.util.keyboard":function(e,t){e.exports=a},"./foundation.util.nest":function(e,t){e.exports=s},"./js/entries/plugins/foundation.drilldown.js":function(e,t,n){"use strict";n.r(t);var i=n("./foundation.core");n.d(t,"Foundation",function(){return i.Foundation});var o=n("./js/foundation.drilldown.js");n.d(t,"Drilldown",function(){return o.Drilldown}),i.Foundation.plugin(o.Drilldown,"Drilldown")},"./js/foundation.drilldown.js":function(e,t,n){"use strict";n.r(t),n.d(t,"Drilldown",function(){return m});var i=n("jquery"),a=n.n(i),s=n("./foundation.util.keyboard"),r=n("./foundation.util.nest"),l=n("./foundation.core.utils"),u=n("./foundation.util.box"),d=n("./foundation.core.plugin");function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function f(e,t){return!t||"object"!==o(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function h(e,t){return(h=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var m=function(e){function n(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n),f(this,p(n).apply(this,arguments))}var t,i,o;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&h(e,t)}(n,d["Plugin"]),t=n,(i=[{key:"_setup",value:function(e,t){this.$element=e,this.options=a.a.extend({},n.defaults,this.$element.data(),t),this.className="Drilldown",this._init(),s.Keyboard.register("Drilldown",{ENTER:"open",SPACE:"open",ARROW_RIGHT:"next",ARROW_UP:"up",ARROW_DOWN:"down",ARROW_LEFT:"previous",ESCAPE:"close",TAB:"down",SHIFT_TAB:"up"})}},{key:"_init",value:function(){r.Nest.Feather(this.$element,"drilldown"),this.options.autoApplyClass&&this.$element.addClass("drilldown"),this.$element.attr({role:"tree","aria-multiselectable":!1}),this.$submenuAnchors=this.$element.find("li.is-drilldown-submenu-parent").children("a"),this.$submenus=this.$submenuAnchors.parent("li").children("[data-submenu]").attr("role","group"),this.$menuItems=this.$element.find("li").not(".js-drilldown-back").attr("role","treeitem").find("a"),this.$currentMenu=this.$element,this.$element.attr("data-mutate",this.$element.attr("data-drilldown")||Object(l.GetYoDigits)(6,"drilldown")),this._prepareMenu(),this._registerEvents(),this._keyboardEvents()}},{key:"_prepareMenu",value:function(){var n=this;this.$submenuAnchors.each(function(){var e=a()(this),t=e.parent();n.options.parentLink&&e.clone().prependTo(t.children("[data-submenu]")).wrap('<li data-is-parent-link class="is-submenu-parent-item is-submenu-item is-drilldown-submenu-item" role="menuitem"></li>'),e.data("savedHref",e.attr("href")).removeAttr("href").attr("tabindex",0),e.children("[data-submenu]").attr({"aria-hidden":!0,tabindex:0,role:"group"}),n._events(e)}),this.$submenus.each(function(){var e=a()(this);if(!e.find(".js-drilldown-back").length)switch(n.options.backButtonPosition){case"bottom":e.append(n.options.backButton);break;case"top":e.prepend(n.options.backButton);break;default:console.error("Unsupported backButtonPosition value '"+n.options.backButtonPosition+"'")}n._back(e)}),this.$submenus.addClass("invisible"),this.options.autoHeight||this.$submenus.addClass("drilldown-submenu-cover-previous"),this.$element.parent().hasClass("is-drilldown")||(this.$wrapper=a()(this.options.wrapper).addClass("is-drilldown"),this.options.animateHeight&&this.$wrapper.addClass("animate-height"),this.$element.wrap(this.$wrapper)),this.$wrapper=this.$element.parent(),this.$wrapper.css(this._getMaxDims())}},{key:"_resize",value:function(){this.$wrapper.css({"max-width":"none","min-height":"none"}),this.$wrapper.css(this._getMaxDims())}},{key:"_events",value:function(n){var i=this;n.off("click.zf.drilldown").on("click.zf.drilldown",function(e){if(a()(e.target).parentsUntil("ul","li").hasClass("is-drilldown-submenu-parent")&&(e.stopImmediatePropagation(),e.preventDefault()),i._show(n.parent("li")),i.options.closeOnClick){var t=a()("body");t.off(".zf.drilldown").on("click.zf.drilldown",function(e){e.target===i.$element[0]||a.a.contains(i.$element[0],e.target)||(e.preventDefault(),i._hideAll(),t.off(".zf.drilldown"))})}})}},{key:"_registerEvents",value:function(){this.options.scrollTop&&(this._bindHandler=this._scrollTop.bind(this),this.$element.on("open.zf.drilldown hide.zf.drilldown closed.zf.drilldown",this._bindHandler)),this.$element.on("mutateme.zf.trigger",this._resize.bind(this))}},{key:"_scrollTop",value:function(){var e=this,t=""!=e.options.scrollTopElement?a()(e.options.scrollTopElement):e.$element,n=parseInt(t.offset().top+e.options.scrollTopOffset,10);a()("html, body").stop(!0).animate({scrollTop:n},e.options.animationDuration,e.options.animationEasing,function(){this===a()("html")[0]&&e.$element.trigger("scrollme.zf.drilldown")})}},{key:"_keyboardEvents",value:function(){var e=this;this.$menuItems.add(this.$element.find(".js-drilldown-back > a, .is-submenu-parent-item > a")).on("keydown.zf.drilldown",function(t){var n,i,o=a()(this),r=o.parent("li").parent("ul").children("li").children("a");r.each(function(e){if(a()(this).is(o))return n=r.eq(Math.max(0,e-1)),void(i=r.eq(Math.min(e+1,r.length-1)))}),s.Keyboard.handleKey(t,"Drilldown",{next:function(){if(o.is(e.$submenuAnchors))return e._show(o.parent("li")),o.parent("li").one(Object(l.transitionend)(o),function(){o.parent("li").find("ul li a").not(".js-drilldown-back a").first().focus()}),!0},previous:function(){return e._hide(o.parent("li").parent("ul")),o.parent("li").parent("ul").one(Object(l.transitionend)(o),function(){setTimeout(function(){o.parent("li").parent("ul").parent("li").children("a").first().focus()},1)}),!0},up:function(){return n.focus(),!o.is(e.$element.find("> li:first-child > a"))},down:function(){return i.focus(),!o.is(e.$element.find("> li:last-child > a"))},close:function(){o.is(e.$element.find("> li > a"))||(e._hide(o.parent().parent()),o.parent().parent().siblings("a").focus())},open:function(){return(!e.options.parentLink||!o.attr("href"))&&(o.is(e.$menuItems)?o.is(e.$submenuAnchors)?(e._show(o.parent("li")),o.parent("li").one(Object(l.transitionend)(o),function(){o.parent("li").find("ul li a").not(".js-drilldown-back a").first().focus()}),!0):void 0:(e._hide(o.parent("li").parent("ul")),o.parent("li").parent("ul").one(Object(l.transitionend)(o),function(){setTimeout(function(){o.parent("li").parent("ul").parent("li").children("a").first().focus()},1)}),!0))},handled:function(e){e&&t.preventDefault(),t.stopImmediatePropagation()}})})}},{key:"_hideAll",value:function(){var t=this.$element.find(".is-drilldown-submenu.is-active").addClass("is-closing");this.options.autoHeight&&this.$wrapper.css({height:t.parent().closest("ul").data("calcHeight")}),t.one(Object(l.transitionend)(t),function(e){t.removeClass("is-active is-closing")}),this.$element.trigger("closed.zf.drilldown")}},{key:"_back",value:function(n){var i=this;n.off("click.zf.drilldown"),n.children(".js-drilldown-back").on("click.zf.drilldown",function(e){e.stopImmediatePropagation(),i._hide(n);var t=n.parent("li").parent("ul").parent("li");t.length&&i._show(t)})}},{key:"_menuLinkEvents",value:function(){var t=this;this.$menuItems.not(".is-drilldown-submenu-parent").off("click.zf.drilldown").on("click.zf.drilldown",function(e){setTimeout(function(){t._hideAll()},0)})}},{key:"_setShowSubMenuClasses",value:function(e,t){e.addClass("is-active").removeClass("invisible").attr("aria-hidden",!1),e.parent("li").attr("aria-expanded",!0),!0===t&&this.$element.trigger("open.zf.drilldown",[e])}},{key:"_setHideSubMenuClasses",value:function(e,t){e.removeClass("is-active").addClass("invisible").attr("aria-hidden",!0),e.parent("li").attr("aria-expanded",!1),!0===t&&e.trigger("hide.zf.drilldown",[e])}},{key:"_showMenu",value:function(n,i){var o=this;if(this.$element.find('li[aria-expanded="true"] > ul[data-submenu]').each(function(e){o._setHideSubMenuClasses(a()(this))}),(this.$currentMenu=n).is("[data-drilldown]"))return!0===i&&n.find('li[role="treeitem"] > a').first().focus(),void(this.options.autoHeight&&this.$wrapper.css("height",n.data("calcHeight")));var r=n.children().first().parentsUntil("[data-drilldown]","[data-submenu]");r.each(function(e){0===e&&o.options.autoHeight&&o.$wrapper.css("height",a()(this).data("calcHeight"));var t=e==r.length-1;!0===t&&a()(this).one(Object(l.transitionend)(a()(this)),function(){!0===i&&n.find('li[role="treeitem"] > a').first().focus()}),o._setShowSubMenuClasses(a()(this),t)})}},{key:"_show",value:function(e){var t=e.children("[data-submenu]");e.attr("aria-expanded",!0),(this.$currentMenu=t).addClass("is-active").removeClass("invisible").attr("aria-hidden",!1),this.options.autoHeight&&this.$wrapper.css({height:t.data("calcHeight")}),this.$element.trigger("open.zf.drilldown",[e])}},{key:"_hide",value:function(e){this.options.autoHeight&&this.$wrapper.css({height:e.parent().closest("ul").data("calcHeight")});e.parent("li").attr("aria-expanded",!1),e.attr("aria-hidden",!0),e.addClass("is-closing").one(Object(l.transitionend)(e),function(){e.removeClass("is-active is-closing"),e.blur().addClass("invisible")}),e.trigger("hide.zf.drilldown",[e])}},{key:"_getMaxDims",value:function(){var t=0,e={},n=this;return this.$submenus.add(this.$element).each(function(){a()(this).children("li").length;var e=u.Box.GetDimensions(this).height;t=t<e?e:t,n.options.autoHeight&&a()(this).data("calcHeight",e)}),this.options.autoHeight?e.height=this.$currentMenu.data("calcHeight"):e["min-height"]="".concat(t,"px"),e["max-width"]="".concat(this.$element[0].getBoundingClientRect().width,"px"),e}},{key:"_destroy",value:function(){this.options.scrollTop&&this.$element.off(".zf.drilldown",this._bindHandler),this._hideAll(),this.$element.off("mutateme.zf.trigger"),r.Nest.Burn(this.$element,"drilldown"),this.$element.unwrap().find(".js-drilldown-back, .is-submenu-parent-item").remove().end().find(".is-active, .is-closing, .is-drilldown-submenu").removeClass("is-active is-closing is-drilldown-submenu").end().find("[data-submenu]").removeAttr("aria-hidden tabindex role"),this.$submenuAnchors.each(function(){a()(this).off(".zf.drilldown")}),this.$element.find("[data-is-parent-link]").detach(),this.$submenus.removeClass("drilldown-submenu-cover-previous invisible"),this.$element.find("a").each(function(){var e=a()(this);e.removeAttr("tabindex"),e.data("savedHref")&&e.attr("href",e.data("savedHref")).removeData("savedHref")})}}])&&c(t.prototype,i),o&&c(t,o),n}();m.defaults={autoApplyClass:!0,backButton:'<li class="js-drilldown-back"><a tabindex="0">Back</a></li>',backButtonPosition:"top",wrapper:"<div></div>",parentLink:!1,closeOnClick:!1,autoHeight:!1,animateHeight:!1,scrollTop:!1,scrollTopElement:"",scrollTopOffset:0,animationDuration:500,animationEasing:"swing"}},3:function(e,t,n){e.exports=n("./js/entries/plugins/foundation.drilldown.js")},jquery:function(e,t){e.exports=l}})});
//# sourceMappingURL=foundation.drilldown.min.js.map

!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n(require("./foundation.core"),require("./foundation.core.plugin"),require("./foundation.core.utils"),require("./foundation.util.mediaQuery"),require("jquery")):"function"==typeof define&&define.amd?define(["./foundation.core","./foundation.core.plugin","./foundation.core.utils","./foundation.util.mediaQuery","jquery"],n):"object"==typeof exports?exports["foundation.interchange"]=n(require("./foundation.core"),require("./foundation.core.plugin"),require("./foundation.core.utils"),require("./foundation.util.mediaQuery"),require("jquery")):(e.__FOUNDATION_EXTERNAL__=e.__FOUNDATION_EXTERNAL__||{},e.__FOUNDATION_EXTERNAL__["foundation.interchange"]=n(e.__FOUNDATION_EXTERNAL__["foundation.core"],e.__FOUNDATION_EXTERNAL__["foundation.core"],e.__FOUNDATION_EXTERNAL__["foundation.core"],e.__FOUNDATION_EXTERNAL__["foundation.util.mediaQuery"],e.jQuery))}(window,function(t,r,o,i,u){return function(t){var r={};function o(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,o),n.l=!0,n.exports}return o.m=t,o.c=r,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(n,e){if(1&e&&(n=o(n)),8&e)return n;if(4&e&&"object"==typeof n&&n&&n.__esModule)return n;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:n}),2&e&&"string"!=typeof n)for(var r in n)o.d(t,r,function(e){return n[e]}.bind(null,r));return t},o.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="",o(o.s=7)}({"./foundation.core":function(e,n){e.exports=t},"./foundation.core.plugin":function(e,n){e.exports=r},"./foundation.core.utils":function(e,n){e.exports=o},"./foundation.util.mediaQuery":function(e,n){e.exports=i},"./js/entries/plugins/foundation.interchange.js":function(e,n,t){"use strict";t.r(n);var r=t("./foundation.core");t.d(n,"Foundation",function(){return r.Foundation});var o=t("./js/foundation.interchange.js");t.d(n,"Interchange",function(){return o.Interchange}),r.Foundation.plugin(o.Interchange,"Interchange")},"./js/foundation.interchange.js":function(e,n,t){"use strict";t.r(n),t.d(n,"Interchange",function(){return p});var r=t("jquery"),o=t.n(r),i=t("./foundation.util.mediaQuery"),u=t("./foundation.core.plugin"),c=t("./foundation.core.utils");function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function f(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function s(e,n){return!n||"object"!==a(n)&&"function"!=typeof n?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):n}function l(e){return(l=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function d(e,n){return(d=Object.setPrototypeOf||function(e,n){return e.__proto__=n,e})(e,n)}var p=function(e){function a(){return function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,a),s(this,l(a).apply(this,arguments))}var n,t,r;return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),n&&d(e,n)}(a,u["Plugin"]),n=a,(t=[{key:"_setup",value:function(e,n){this.$element=e,this.options=o.a.extend({},a.defaults,n),this.rules=[],this.currentPath="",this.className="Interchange",this._init(),this._events()}},{key:"_init",value:function(){i.MediaQuery._init();var e=this.$element[0].id||Object(c.GetYoDigits)(6,"interchange");this.$element.attr({"data-resize":e,id:e}),this._addBreakpoints(),this._generateRules(),this._reflow()}},{key:"_events",value:function(){var e=this;this.$element.off("resizeme.zf.trigger").on("resizeme.zf.trigger",function(){return e._reflow()})}},{key:"_reflow",value:function(){var e;for(var n in this.rules)if(this.rules.hasOwnProperty(n)){var t=this.rules[n];window.matchMedia(t.query).matches&&(e=t)}e&&this.replace(e.path)}},{key:"_addBreakpoints",value:function(){for(var e in i.MediaQuery.queries)if(i.MediaQuery.queries.hasOwnProperty(e)){var n=i.MediaQuery.queries[e];a.SPECIAL_QUERIES[n.name]=n.value}}},{key:"_generateRules",value:function(e){var n,t=[];for(var r in n="string"==typeof(n=this.options.rules?this.options.rules:this.$element.data("interchange"))?n.match(/\[.*?, .*?\]/g):n)if(n.hasOwnProperty(r)){var o=n[r].slice(1,-1).split(", "),i=o.slice(0,-1).join(""),u=o[o.length-1];a.SPECIAL_QUERIES[u]&&(u=a.SPECIAL_QUERIES[u]),t.push({path:i,query:u})}this.rules=t}},{key:"replace",value:function(n){if(this.currentPath!==n){var t=this,r="replaced.zf.interchange";"IMG"===this.$element[0].nodeName?this.$element.attr("src",n).on("load",function(){t.currentPath=n}).trigger(r):n.match(/\.(gif|jpg|jpeg|png|svg|tiff)([?#].*)?/i)?(n=n.replace(/\(/g,"%28").replace(/\)/g,"%29"),this.$element.css({"background-image":"url("+n+")"}).trigger(r)):o.a.get(n,function(e){t.$element.html(e).trigger(r),o()(e).foundation(),t.currentPath=n})}}},{key:"_destroy",value:function(){this.$element.off("resizeme.zf.trigger")}}])&&f(n.prototype,t),r&&f(n,r),a}();p.defaults={rules:null},p.SPECIAL_QUERIES={landscape:"screen and (orientation: landscape)",portrait:"screen and (orientation: portrait)",retina:"only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx)"}},7:function(e,n,t){e.exports=t("./js/entries/plugins/foundation.interchange.js")},jquery:function(e,n){e.exports=u}})});
//# sourceMappingURL=foundation.interchange.min.js.map

!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("./foundation.core.utils"),require("./foundation.core"),require("jquery"),require("./foundation.util.keyboard"),require("./foundation.util.mediaQuery"),require("./foundation.core.plugin"),require("./foundation.util.motion")):"function"==typeof define&&define.amd?define(["./foundation.core.utils","./foundation.core","jquery","./foundation.util.keyboard","./foundation.util.mediaQuery","./foundation.core.plugin","./foundation.util.motion"],e):"object"==typeof exports?exports["foundation.offcanvas"]=e(require("./foundation.core.utils"),require("./foundation.core"),require("jquery"),require("./foundation.util.keyboard"),require("./foundation.util.mediaQuery"),require("./foundation.core.plugin"),require("./foundation.util.motion")):(t.__FOUNDATION_EXTERNAL__=t.__FOUNDATION_EXTERNAL__||{},t.__FOUNDATION_EXTERNAL__["foundation.offcanvas"]=e(t.__FOUNDATION_EXTERNAL__["foundation.core"],t.__FOUNDATION_EXTERNAL__["foundation.core"],t.jQuery,t.__FOUNDATION_EXTERNAL__["foundation.util.keyboard"],t.__FOUNDATION_EXTERNAL__["foundation.util.mediaQuery"],t.__FOUNDATION_EXTERNAL__["foundation.core"],t.__FOUNDATION_EXTERNAL__["foundation.util.motion"]))}(window,function(n,i,o,s,r,a,l){return function(n){var i={};function o(t){if(i[t])return i[t].exports;var e=i[t]={i:t,l:!1,exports:{}};return n[t].call(e.exports,e,e.exports,o),e.l=!0,e.exports}return o.m=n,o.c=i,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)o.d(n,i,function(t){return e[t]}.bind(null,i));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=9)}({"./foundation.core":function(t,e){t.exports=i},"./foundation.core.plugin":function(t,e){t.exports=a},"./foundation.core.utils":function(t,e){t.exports=n},"./foundation.util.keyboard":function(t,e){t.exports=s},"./foundation.util.mediaQuery":function(t,e){t.exports=r},"./foundation.util.motion":function(t,e){t.exports=l},"./js/entries/plugins/foundation.offcanvas.js":function(t,e,n){"use strict";n.r(e);var i=n("./foundation.core");n.d(e,"Foundation",function(){return i.Foundation});var o=n("./js/foundation.offcanvas.js");n.d(e,"OffCanvas",function(){return o.OffCanvas}),i.Foundation.plugin(o.OffCanvas,"OffCanvas")},"./js/foundation.offcanvas.js":function(t,e,n){"use strict";n.r(e),n.d(e,"OffCanvas",function(){return p});var i=n("jquery"),s=n.n(i),r=n("./foundation.core.utils"),a=n("./foundation.util.keyboard"),l=n("./foundation.util.mediaQuery"),c=n("./foundation.core.plugin"),u=n("./js/foundation.util.triggers.js");function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function f(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function d(t,e){return!e||"object"!==o(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function h(t){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function g(t,e){return(g=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var p=function(t){function i(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,i),d(this,h(i).apply(this,arguments))}var e,n,o;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&g(t,e)}(i,c["Plugin"]),e=i,(n=[{key:"_setup",value:function(t,e){var n=this;this.className="OffCanvas",this.$element=t,this.options=s.a.extend({},i.defaults,this.$element.data(),e),this.contentClasses={base:[],reveal:[]},this.$lastTrigger=s()(),this.$triggers=s()(),this.position="left",this.$content=s()(),this.nested=!!this.options.nested,s()(["push","overlap"]).each(function(t,e){n.contentClasses.base.push("has-transition-"+e)}),s()(["left","right","top","bottom"]).each(function(t,e){n.contentClasses.base.push("has-position-"+e),n.contentClasses.reveal.push("has-reveal-"+e)}),u.Triggers.init(s.a),l.MediaQuery._init(),this._init(),this._events(),a.Keyboard.register("OffCanvas",{ESCAPE:"close"})}},{key:"_init",value:function(){var t=this.$element.attr("id");if(this.$element.attr("aria-hidden","true"),this.options.contentId?this.$content=s()("#"+this.options.contentId):this.$element.siblings("[data-off-canvas-content]").length?this.$content=this.$element.siblings("[data-off-canvas-content]").first():this.$content=this.$element.closest("[data-off-canvas-content]").first(),this.options.contentId?this.options.contentId&&null===this.options.nested&&console.warn("Remember to use the nested option if using the content ID option!"):this.nested=0===this.$element.siblings("[data-off-canvas-content]").length,!0===this.nested&&(this.options.transition="overlap",this.$element.removeClass("is-transition-push")),this.$element.addClass("is-transition-".concat(this.options.transition," is-closed")),this.$triggers=s()(document).find('[data-open="'+t+'"], [data-close="'+t+'"], [data-toggle="'+t+'"]').attr("aria-expanded","false").attr("aria-controls",t),this.position=this.$element.is(".position-left, .position-top, .position-right, .position-bottom")?this.$element.attr("class").match(/position\-(left|top|right|bottom)/)[1]:this.position,!0===this.options.contentOverlay){var e=document.createElement("div"),n="fixed"===s()(this.$element).css("position")?"is-overlay-fixed":"is-overlay-absolute";e.setAttribute("class","js-off-canvas-overlay "+n),this.$overlay=s()(e),"is-overlay-fixed"===n?s()(this.$overlay).insertAfter(this.$element):this.$content.append(this.$overlay)}var i=new RegExp(Object(r.RegExpEscape)(this.options.revealClass)+"([^\\s]+)","g").exec(this.$element[0].className);i&&(this.options.isRevealed=!0,this.options.revealOn=this.options.revealOn||i[1]),!0===this.options.isRevealed&&this.options.revealOn&&(this.$element.first().addClass("".concat(this.options.revealClass).concat(this.options.revealOn)),this._setMQChecker()),this.options.transitionTime&&this.$element.css("transition-duration",this.options.transitionTime),this._removeContentClasses()}},{key:"_events",value:function(){(this.$element.off(".zf.trigger .zf.offcanvas").on({"open.zf.trigger":this.open.bind(this),"close.zf.trigger":this.close.bind(this),"toggle.zf.trigger":this.toggle.bind(this),"keydown.zf.offcanvas":this._handleKeyboard.bind(this)}),!0===this.options.closeOnClick)&&(this.options.contentOverlay?this.$overlay:this.$content).on({"click.zf.offcanvas":this.close.bind(this)})}},{key:"_setMQChecker",value:function(){var t=this;this.onLoadListener=Object(r.onLoad)(s()(window),function(){l.MediaQuery.atLeast(t.options.revealOn)&&t.reveal(!0)}),s()(window).on("changed.zf.mediaquery",function(){l.MediaQuery.atLeast(t.options.revealOn)?t.reveal(!0):t.reveal(!1)})}},{key:"_removeContentClasses",value:function(t){"boolean"!=typeof t?this.$content.removeClass(this.contentClasses.base.join(" ")):!1===t&&this.$content.removeClass("has-reveal-".concat(this.position))}},{key:"_addContentClasses",value:function(t){this._removeContentClasses(t),"boolean"!=typeof t?this.$content.addClass("has-transition-".concat(this.options.transition," has-position-").concat(this.position)):!0===t&&this.$content.addClass("has-reveal-".concat(this.position))}},{key:"reveal",value:function(t){t?(this.close(),this.isRevealed=!0,this.$element.attr("aria-hidden","false"),this.$element.off("open.zf.trigger toggle.zf.trigger"),this.$element.removeClass("is-closed")):(this.isRevealed=!1,this.$element.attr("aria-hidden","true"),this.$element.off("open.zf.trigger toggle.zf.trigger").on({"open.zf.trigger":this.open.bind(this),"toggle.zf.trigger":this.toggle.bind(this)}),this.$element.addClass("is-closed")),this._addContentClasses(t)}},{key:"_stopScrolling",value:function(t){return!1}},{key:"_recordScrollable",value:function(t){var e=this;e.scrollHeight!==e.clientHeight&&(0===e.scrollTop&&(e.scrollTop=1),e.scrollTop===e.scrollHeight-e.clientHeight&&(e.scrollTop=e.scrollHeight-e.clientHeight-1)),e.allowUp=0<e.scrollTop,e.allowDown=e.scrollTop<e.scrollHeight-e.clientHeight,e.lastY=t.originalEvent.pageY}},{key:"_stopScrollPropagation",value:function(t){var e=t.pageY<this.lastY,n=!e;this.lastY=t.pageY,e&&this.allowUp||n&&this.allowDown?t.stopPropagation():t.preventDefault()}},{key:"open",value:function(t,e){if(!this.$element.hasClass("is-open")&&!this.isRevealed){var n=this;e&&(this.$lastTrigger=e),"top"===this.options.forceTo?window.scrollTo(0,0):"bottom"===this.options.forceTo&&window.scrollTo(0,document.body.scrollHeight),this.options.transitionTime&&"overlap"!==this.options.transition?this.$element.siblings("[data-off-canvas-content]").css("transition-duration",this.options.transitionTime):this.$element.siblings("[data-off-canvas-content]").css("transition-duration",""),this.$element.addClass("is-open").removeClass("is-closed"),this.$triggers.attr("aria-expanded","true"),this.$element.attr("aria-hidden","false"),this.$content.addClass("is-open-"+this.position),!1===this.options.contentScroll&&(s()("body").addClass("is-off-canvas-open").on("touchmove",this._stopScrolling),this.$element.on("touchstart",this._recordScrollable),this.$element.on("touchmove",this._stopScrollPropagation)),!0===this.options.contentOverlay&&this.$overlay.addClass("is-visible"),!0===this.options.closeOnClick&&!0===this.options.contentOverlay&&this.$overlay.addClass("is-closable"),!0===this.options.autoFocus&&this.$element.one(Object(r.transitionend)(this.$element),function(){if(n.$element.hasClass("is-open")){var t=n.$element.find("[data-autofocus]");t.length?t.eq(0).focus():n.$element.find("a, button").eq(0).focus()}}),!0===this.options.trapFocus&&(this.$content.attr("tabindex","-1"),a.Keyboard.trapFocus(this.$element)),this._addContentClasses(),this.$element.trigger("opened.zf.offcanvas")}}},{key:"close",value:function(t){if(this.$element.hasClass("is-open")&&!this.isRevealed){var e=this;this.$element.removeClass("is-open"),this.$element.attr("aria-hidden","true").trigger("closed.zf.offcanvas"),this.$content.removeClass("is-open-left is-open-top is-open-right is-open-bottom"),!1===this.options.contentScroll&&(s()("body").removeClass("is-off-canvas-open").off("touchmove",this._stopScrolling),this.$element.off("touchstart",this._recordScrollable),this.$element.off("touchmove",this._stopScrollPropagation)),!0===this.options.contentOverlay&&this.$overlay.removeClass("is-visible"),!0===this.options.closeOnClick&&!0===this.options.contentOverlay&&this.$overlay.removeClass("is-closable"),this.$triggers.attr("aria-expanded","false"),!0===this.options.trapFocus&&(this.$content.removeAttr("tabindex"),a.Keyboard.releaseFocus(this.$element)),this.$element.one(Object(r.transitionend)(this.$element),function(t){e.$element.addClass("is-closed"),e._removeContentClasses()})}}},{key:"toggle",value:function(t,e){this.$element.hasClass("is-open")?this.close(t,e):this.open(t,e)}},{key:"_handleKeyboard",value:function(t){var e=this;a.Keyboard.handleKey(t,"OffCanvas",{close:function(){return e.close(),e.$lastTrigger.focus(),!0},handled:function(){t.stopPropagation(),t.preventDefault()}})}},{key:"_destroy",value:function(){this.close(),this.$element.off(".zf.trigger .zf.offcanvas"),this.$overlay.off(".zf.offcanvas"),this.onLoadListener&&s()(window).off(this.onLoadListener)}}])&&f(e.prototype,n),o&&f(e,o),i}();p.defaults={closeOnClick:!0,contentOverlay:!0,contentId:null,nested:null,contentScroll:!0,transitionTime:null,transition:"push",forceTo:null,isRevealed:!1,revealOn:null,autoFocus:!0,revealClass:"reveal-for-",trapFocus:!1}},"./js/foundation.util.triggers.js":function(t,e,n){"use strict";n.r(e),n.d(e,"Triggers",function(){return u});var i=n("jquery"),s=n.n(i),o=n("./foundation.core.utils"),r=n("./foundation.util.motion");function a(t){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var l=function(){for(var t=["WebKit","Moz","O","Ms",""],e=0;e<t.length;e++)if("".concat(t[e],"MutationObserver")in window)return window["".concat(t[e],"MutationObserver")];return!1}(),c=function(e,n){e.data(n).split(" ").forEach(function(t){s()("#".concat(t))["close"===n?"trigger":"triggerHandler"]("".concat(n,".zf.trigger"),[e])})},u={Listeners:{Basic:{},Global:{}},Initializers:{}};function f(e,t,n){var i,o=Array.prototype.slice.call(arguments,3);s()(window).off(t).on(t,function(t){i&&clearTimeout(i),i=setTimeout(function(){n.apply(null,o)},e||10)})}u.Listeners.Basic={openListener:function(){c(s()(this),"open")},closeListener:function(){s()(this).data("close")?c(s()(this),"close"):s()(this).trigger("close.zf.trigger")},toggleListener:function(){s()(this).data("toggle")?c(s()(this),"toggle"):s()(this).trigger("toggle.zf.trigger")},closeableListener:function(t){t.stopPropagation();var e=s()(this).data("closable");""!==e?r.Motion.animateOut(s()(this),e,function(){s()(this).trigger("closed.zf")}):s()(this).fadeOut().trigger("closed.zf")},toggleFocusListener:function(){var t=s()(this).data("toggle-focus");s()("#".concat(t)).triggerHandler("toggle.zf.trigger",[s()(this)])}},u.Initializers.addOpenListener=function(t){t.off("click.zf.trigger",u.Listeners.Basic.openListener),t.on("click.zf.trigger","[data-open]",u.Listeners.Basic.openListener)},u.Initializers.addCloseListener=function(t){t.off("click.zf.trigger",u.Listeners.Basic.closeListener),t.on("click.zf.trigger","[data-close]",u.Listeners.Basic.closeListener)},u.Initializers.addToggleListener=function(t){t.off("click.zf.trigger",u.Listeners.Basic.toggleListener),t.on("click.zf.trigger","[data-toggle]",u.Listeners.Basic.toggleListener)},u.Initializers.addCloseableListener=function(t){t.off("close.zf.trigger",u.Listeners.Basic.closeableListener),t.on("close.zf.trigger","[data-closeable], [data-closable]",u.Listeners.Basic.closeableListener)},u.Initializers.addToggleFocusListener=function(t){t.off("focus.zf.trigger blur.zf.trigger",u.Listeners.Basic.toggleFocusListener),t.on("focus.zf.trigger blur.zf.trigger","[data-toggle-focus]",u.Listeners.Basic.toggleFocusListener)},u.Listeners.Global={resizeListener:function(t){l||t.each(function(){s()(this).triggerHandler("resizeme.zf.trigger")}),t.attr("data-events","resize")},scrollListener:function(t){l||t.each(function(){s()(this).triggerHandler("scrollme.zf.trigger")}),t.attr("data-events","scroll")},closeMeListener:function(t,e){var n=t.namespace.split(".")[0];s()("[data-".concat(n,"]")).not('[data-yeti-box="'.concat(e,'"]')).each(function(){var t=s()(this);t.triggerHandler("close.zf.trigger",[t])})}},u.Initializers.addClosemeListener=function(t){var e=s()("[data-yeti-box]"),n=["dropdown","tooltip","reveal"];if(t&&("string"==typeof t?n.push(t):"object"===a(t)&&"string"==typeof t[0]?n.concat(t):console.error("Plugin names must be strings")),e.length){var i=n.map(function(t){return"closeme.zf.".concat(t)}).join(" ");s()(window).off(i).on(i,u.Listeners.Global.closeMeListener)}},u.Initializers.addResizeListener=function(t){var e=s()("[data-resize]");e.length&&f(t,"resize.zf.trigger",u.Listeners.Global.resizeListener,e)},u.Initializers.addScrollListener=function(t){var e=s()("[data-scroll]");e.length&&f(t,"scroll.zf.trigger",u.Listeners.Global.scrollListener,e)},u.Initializers.addMutationEventsListener=function(t){if(!l)return!1;var e=t.find("[data-resize], [data-scroll], [data-mutate]"),n=function(t){var e=s()(t[0].target);switch(t[0].type){case"attributes":"scroll"===e.attr("data-events")&&"data-events"===t[0].attributeName&&e.triggerHandler("scrollme.zf.trigger",[e,window.pageYOffset]),"resize"===e.attr("data-events")&&"data-events"===t[0].attributeName&&e.triggerHandler("resizeme.zf.trigger",[e]),"style"===t[0].attributeName&&(e.closest("[data-mutate]").attr("data-events","mutate"),e.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger",[e.closest("[data-mutate]")]));break;case"childList":e.closest("[data-mutate]").attr("data-events","mutate"),e.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger",[e.closest("[data-mutate]")]);break;default:return!1}};if(e.length)for(var i=0;i<=e.length-1;i++){new l(n).observe(e[i],{attributes:!0,childList:!0,characterData:!1,subtree:!0,attributeFilter:["data-events","style"]})}},u.Initializers.addSimpleListeners=function(){var t=s()(document);u.Initializers.addOpenListener(t),u.Initializers.addCloseListener(t),u.Initializers.addToggleListener(t),u.Initializers.addCloseableListener(t),u.Initializers.addToggleFocusListener(t)},u.Initializers.addGlobalListeners=function(){var t=s()(document);u.Initializers.addMutationEventsListener(t),u.Initializers.addResizeListener(),u.Initializers.addScrollListener(),u.Initializers.addClosemeListener()},u.init=function(t,e){Object(o.onLoad)(t(window),function(){!0!==t.triggersInitialized&&(u.Initializers.addSimpleListeners(),u.Initializers.addGlobalListeners(),t.triggersInitialized=!0)}),e&&(e.Triggers=u,e.IHearYou=u.Initializers.addGlobalListeners)}},9:function(t,e,n){t.exports=n("./js/entries/plugins/foundation.offcanvas.js")},jquery:function(t,e){t.exports=o}})});
//# sourceMappingURL=foundation.offcanvas.min.js.map

!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("./foundation.core.utils"),require("./foundation.core"),require("jquery"),require("./foundation.util.keyboard"),require("./foundation.util.mediaQuery"),require("./foundation.util.motion"),require("./foundation.core.plugin")):"function"==typeof define&&define.amd?define(["./foundation.core.utils","./foundation.core","jquery","./foundation.util.keyboard","./foundation.util.mediaQuery","./foundation.util.motion","./foundation.core.plugin"],t):"object"==typeof exports?exports["foundation.reveal"]=t(require("./foundation.core.utils"),require("./foundation.core"),require("jquery"),require("./foundation.util.keyboard"),require("./foundation.util.mediaQuery"),require("./foundation.util.motion"),require("./foundation.core.plugin")):(e.__FOUNDATION_EXTERNAL__=e.__FOUNDATION_EXTERNAL__||{},e.__FOUNDATION_EXTERNAL__["foundation.reveal"]=t(e.__FOUNDATION_EXTERNAL__["foundation.core"],e.__FOUNDATION_EXTERNAL__["foundation.core"],e.jQuery,e.__FOUNDATION_EXTERNAL__["foundation.util.keyboard"],e.__FOUNDATION_EXTERNAL__["foundation.util.mediaQuery"],e.__FOUNDATION_EXTERNAL__["foundation.util.motion"],e.__FOUNDATION_EXTERNAL__["foundation.core"]))}(window,function(i,n,o,s,r,a,l){return function(i){var n={};function o(e){if(n[e])return n[e].exports;var t=n[e]={i:e,l:!1,exports:{}};return i[e].call(t.exports,t,t.exports,o),t.l=!0,t.exports}return o.m=i,o.c=n,o.d=function(e,t,i){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(o.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)o.d(i,n,function(e){return t[e]}.bind(null,n));return i},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=14)}({"./foundation.core":function(e,t){e.exports=n},"./foundation.core.plugin":function(e,t){e.exports=l},"./foundation.core.utils":function(e,t){e.exports=i},"./foundation.util.keyboard":function(e,t){e.exports=s},"./foundation.util.mediaQuery":function(e,t){e.exports=r},"./foundation.util.motion":function(e,t){e.exports=a},"./js/entries/plugins/foundation.reveal.js":function(e,t,i){"use strict";i.r(t);var n=i("./foundation.core");i.d(t,"Foundation",function(){return n.Foundation});var o=i("./js/foundation.reveal.js");i.d(t,"Reveal",function(){return o.Reveal}),n.Foundation.plugin(o.Reveal,"Reveal")},"./js/foundation.reveal.js":function(e,t,i){"use strict";i.r(t),i.d(t,"Reveal",function(){return v});var n=i("jquery"),r=i.n(n),s=i("./foundation.core.utils"),a=i("./foundation.util.keyboard"),l=i("./foundation.util.mediaQuery"),c=i("./foundation.util.motion"),u=i("./foundation.core.plugin"),d=i("./js/foundation.util.triggers.js");function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function f(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function h(e,t){return!t||"object"!==o(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function g(e,t){return(g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var v=function(e){function i(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),h(this,p(i).apply(this,arguments))}var t,n,o;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&g(e,t)}(i,u["Plugin"]),t=i,(n=[{key:"_setup",value:function(e,t){this.$element=e,this.options=r.a.extend({},i.defaults,this.$element.data(),t),this.className="Reveal",this._init(),d.Triggers.init(r.a),a.Keyboard.register("Reveal",{ESCAPE:"close"})}},{key:"_init",value:function(){var e=this;l.MediaQuery._init(),this.id=this.$element.attr("id"),this.isActive=!1,this.cached={mq:l.MediaQuery.current},this.$anchor=r()('[data-open="'.concat(this.id,'"]')).length?r()('[data-open="'.concat(this.id,'"]')):r()('[data-toggle="'.concat(this.id,'"]')),this.$anchor.attr({"aria-controls":this.id,"aria-haspopup":!0,tabindex:0}),(this.options.fullScreen||this.$element.hasClass("full"))&&(this.options.fullScreen=!0,this.options.overlay=!1),this.options.overlay&&!this.$overlay&&(this.$overlay=this._makeOverlay(this.id)),this.$element.attr({role:"dialog","aria-hidden":!0,"data-yeti-box":this.id,"data-resize":this.id}),this.$overlay?this.$element.detach().appendTo(this.$overlay):(this.$element.detach().appendTo(r()(this.options.appendTo)),this.$element.addClass("without-overlay")),this._events(),this.options.deepLink&&window.location.hash==="#".concat(this.id)&&(this.onLoadListener=Object(s.onLoad)(r()(window),function(){return e.open()}))}},{key:"_makeOverlay",value:function(){var e="";return this.options.additionalOverlayClasses&&(e=" "+this.options.additionalOverlayClasses),r()("<div></div>").addClass("reveal-overlay"+e).appendTo(this.options.appendTo)}},{key:"_updatePosition",value:function(){var e,t=this.$element.outerWidth(),i=r()(window).width(),n=this.$element.outerHeight(),o=r()(window).height(),s=null;e="auto"===this.options.hOffset?parseInt((i-t)/2,10):parseInt(this.options.hOffset,10),"auto"===this.options.vOffset?s=o<n?parseInt(Math.min(100,o/10),10):parseInt((o-n)/4,10):null!==this.options.vOffset&&(s=parseInt(this.options.vOffset,10)),null!==s&&this.$element.css({top:s+"px"}),this.$overlay&&"auto"===this.options.hOffset||(this.$element.css({left:e+"px"}),this.$element.css({margin:"0px"}))}},{key:"_events",value:function(){var i=this,n=this;this.$element.on({"open.zf.trigger":this.open.bind(this),"close.zf.trigger":function(e,t){if(e.target===n.$element[0]||r()(e.target).parents("[data-closable]")[0]===t)return i.close.apply(i)},"toggle.zf.trigger":this.toggle.bind(this),"resizeme.zf.trigger":function(){n._updatePosition()}}),this.options.closeOnClick&&this.options.overlay&&this.$overlay.off(".zf.reveal").on("click.zf.reveal",function(e){e.target!==n.$element[0]&&!r.a.contains(n.$element[0],e.target)&&r.a.contains(document,e.target)&&n.close()}),this.options.deepLink&&r()(window).on("hashchange.zf.reveal:".concat(this.id),this._handleState.bind(this))}},{key:"_handleState",value:function(e){window.location.hash!=="#"+this.id||this.isActive?this.close():this.open()}},{key:"_disableScroll",value:function(e){e=e||r()(window).scrollTop(),r()(document).height()>r()(window).height()&&r()("html").css("top",-e)}},{key:"_enableScroll",value:function(e){e=e||parseInt(r()("html").css("top")),r()(document).height()>r()(window).height()&&(r()("html").css("top",""),r()(window).scrollTop(-e))}},{key:"open",value:function(){var e=this,t="#".concat(this.id);this.options.deepLink&&window.location.hash!==t&&(window.history.pushState?this.options.updateHistory?window.history.pushState({},"",t):window.history.replaceState({},"",t):window.location.hash=t),this.$activeAnchor=r()(document.activeElement).is(this.$anchor)?r()(document.activeElement):this.$anchor,this.isActive=!0,this.$element.css({visibility:"hidden"}).show().scrollTop(0),this.options.overlay&&this.$overlay.css({visibility:"hidden"}).show(),this._updatePosition(),this.$element.hide().css({visibility:""}),this.$overlay&&(this.$overlay.css({visibility:""}).hide(),this.$element.hasClass("fast")?this.$overlay.addClass("fast"):this.$element.hasClass("slow")&&this.$overlay.addClass("slow")),this.options.multipleOpened||this.$element.trigger("closeme.zf.reveal",this.id),this._disableScroll();var i=this;if(this.options.animationIn){this.options.overlay&&c.Motion.animateIn(this.$overlay,"fade-in"),c.Motion.animateIn(this.$element,this.options.animationIn,function(){e.$element&&(e.focusableElements=a.Keyboard.findFocusable(e.$element),i.$element.attr({"aria-hidden":!1,tabindex:-1}).focus(),i._addGlobalClasses(),a.Keyboard.trapFocus(i.$element))})}else this.options.overlay&&this.$overlay.show(0),this.$element.show(this.options.showDelay);this.$element.attr({"aria-hidden":!1,tabindex:-1}).focus(),a.Keyboard.trapFocus(this.$element),this._addGlobalClasses(),this._addGlobalListeners(),this.$element.trigger("open.zf.reveal")}},{key:"_addGlobalClasses",value:function(){var e=function(){r()("html").toggleClass("zf-has-scroll",!!(r()(document).height()>r()(window).height()))};this.$element.on("resizeme.zf.trigger.revealScrollbarListener",function(){return e()}),e(),r()("html").addClass("is-reveal-open")}},{key:"_removeGlobalClasses",value:function(){this.$element.off("resizeme.zf.trigger.revealScrollbarListener"),r()("html").removeClass("is-reveal-open"),r()("html").removeClass("zf-has-scroll")}},{key:"_addGlobalListeners",value:function(){var t=this;this.$element&&(this.focusableElements=a.Keyboard.findFocusable(this.$element),this.options.overlay||!this.options.closeOnClick||this.options.fullScreen||r()("body").on("click.zf.reveal",function(e){e.target!==t.$element[0]&&!r.a.contains(t.$element[0],e.target)&&r.a.contains(document,e.target)&&t.close()}),this.options.closeOnEsc&&r()(window).on("keydown.zf.reveal",function(e){a.Keyboard.handleKey(e,"Reveal",{close:function(){t.options.closeOnEsc&&t.close()}})}))}},{key:"close",value:function(){if(!this.isActive||!this.$element.is(":visible"))return!1;var t=this;function e(){var e=parseInt(r()("html").css("top"));0===r()(".reveal:visible").length&&t._removeGlobalClasses(),a.Keyboard.releaseFocus(t.$element),t.$element.attr("aria-hidden",!0),t._enableScroll(e),t.$element.trigger("closed.zf.reveal")}if(this.options.animationOut?(this.options.overlay&&c.Motion.animateOut(this.$overlay,"fade-out"),c.Motion.animateOut(this.$element,this.options.animationOut,e)):(this.$element.hide(this.options.hideDelay),this.options.overlay?this.$overlay.hide(0,e):e()),this.options.closeOnEsc&&r()(window).off("keydown.zf.reveal"),!this.options.overlay&&this.options.closeOnClick&&r()("body").off("click.zf.reveal"),this.$element.off("keydown.zf.reveal"),this.options.resetOnClose&&this.$element.html(this.$element.html()),this.isActive=!1,t.options.deepLink&&window.location.hash==="#".concat(this.id))if(window.history.replaceState){var i=window.location.pathname+window.location.search;this.options.updateHistory?window.history.pushState({},"",i):window.history.replaceState("",document.title,i)}else window.location.hash="";this.$activeAnchor.focus()}},{key:"toggle",value:function(){this.isActive?this.close():this.open()}},{key:"_destroy",value:function(){this.options.overlay&&(this.$element.appendTo(r()(this.options.appendTo)),this.$overlay.hide().off().remove()),this.$element.hide().off(),this.$anchor.off(".zf"),r()(window).off(".zf.reveal:".concat(this.id)),this.onLoadListener&&r()(window).off(this.onLoadListener),0===r()(".reveal:visible").length&&this._removeGlobalClasses()}}])&&f(t.prototype,n),o&&f(t,o),i}();v.defaults={animationIn:"",animationOut:"",showDelay:0,hideDelay:0,closeOnClick:!0,closeOnEsc:!0,multipleOpened:!1,vOffset:"auto",hOffset:"auto",fullScreen:!1,overlay:!0,resetOnClose:!1,deepLink:!1,updateHistory:!1,appendTo:"body",additionalOverlayClasses:""}},"./js/foundation.util.triggers.js":function(e,t,i){"use strict";i.r(t),i.d(t,"Triggers",function(){return u});var n=i("jquery"),s=i.n(n),o=i("./foundation.core.utils"),r=i("./foundation.util.motion");function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var l=function(){for(var e=["WebKit","Moz","O","Ms",""],t=0;t<e.length;t++)if("".concat(e[t],"MutationObserver")in window)return window["".concat(e[t],"MutationObserver")];return!1}(),c=function(t,i){t.data(i).split(" ").forEach(function(e){s()("#".concat(e))["close"===i?"trigger":"triggerHandler"]("".concat(i,".zf.trigger"),[t])})},u={Listeners:{Basic:{},Global:{}},Initializers:{}};function d(t,e,i){var n,o=Array.prototype.slice.call(arguments,3);s()(window).off(e).on(e,function(e){n&&clearTimeout(n),n=setTimeout(function(){i.apply(null,o)},t||10)})}u.Listeners.Basic={openListener:function(){c(s()(this),"open")},closeListener:function(){s()(this).data("close")?c(s()(this),"close"):s()(this).trigger("close.zf.trigger")},toggleListener:function(){s()(this).data("toggle")?c(s()(this),"toggle"):s()(this).trigger("toggle.zf.trigger")},closeableListener:function(e){e.stopPropagation();var t=s()(this).data("closable");""!==t?r.Motion.animateOut(s()(this),t,function(){s()(this).trigger("closed.zf")}):s()(this).fadeOut().trigger("closed.zf")},toggleFocusListener:function(){var e=s()(this).data("toggle-focus");s()("#".concat(e)).triggerHandler("toggle.zf.trigger",[s()(this)])}},u.Initializers.addOpenListener=function(e){e.off("click.zf.trigger",u.Listeners.Basic.openListener),e.on("click.zf.trigger","[data-open]",u.Listeners.Basic.openListener)},u.Initializers.addCloseListener=function(e){e.off("click.zf.trigger",u.Listeners.Basic.closeListener),e.on("click.zf.trigger","[data-close]",u.Listeners.Basic.closeListener)},u.Initializers.addToggleListener=function(e){e.off("click.zf.trigger",u.Listeners.Basic.toggleListener),e.on("click.zf.trigger","[data-toggle]",u.Listeners.Basic.toggleListener)},u.Initializers.addCloseableListener=function(e){e.off("close.zf.trigger",u.Listeners.Basic.closeableListener),e.on("close.zf.trigger","[data-closeable], [data-closable]",u.Listeners.Basic.closeableListener)},u.Initializers.addToggleFocusListener=function(e){e.off("focus.zf.trigger blur.zf.trigger",u.Listeners.Basic.toggleFocusListener),e.on("focus.zf.trigger blur.zf.trigger","[data-toggle-focus]",u.Listeners.Basic.toggleFocusListener)},u.Listeners.Global={resizeListener:function(e){l||e.each(function(){s()(this).triggerHandler("resizeme.zf.trigger")}),e.attr("data-events","resize")},scrollListener:function(e){l||e.each(function(){s()(this).triggerHandler("scrollme.zf.trigger")}),e.attr("data-events","scroll")},closeMeListener:function(e,t){var i=e.namespace.split(".")[0];s()("[data-".concat(i,"]")).not('[data-yeti-box="'.concat(t,'"]')).each(function(){var e=s()(this);e.triggerHandler("close.zf.trigger",[e])})}},u.Initializers.addClosemeListener=function(e){var t=s()("[data-yeti-box]"),i=["dropdown","tooltip","reveal"];if(e&&("string"==typeof e?i.push(e):"object"===a(e)&&"string"==typeof e[0]?i.concat(e):console.error("Plugin names must be strings")),t.length){var n=i.map(function(e){return"closeme.zf.".concat(e)}).join(" ");s()(window).off(n).on(n,u.Listeners.Global.closeMeListener)}},u.Initializers.addResizeListener=function(e){var t=s()("[data-resize]");t.length&&d(e,"resize.zf.trigger",u.Listeners.Global.resizeListener,t)},u.Initializers.addScrollListener=function(e){var t=s()("[data-scroll]");t.length&&d(e,"scroll.zf.trigger",u.Listeners.Global.scrollListener,t)},u.Initializers.addMutationEventsListener=function(e){if(!l)return!1;var t=e.find("[data-resize], [data-scroll], [data-mutate]"),i=function(e){var t=s()(e[0].target);switch(e[0].type){case"attributes":"scroll"===t.attr("data-events")&&"data-events"===e[0].attributeName&&t.triggerHandler("scrollme.zf.trigger",[t,window.pageYOffset]),"resize"===t.attr("data-events")&&"data-events"===e[0].attributeName&&t.triggerHandler("resizeme.zf.trigger",[t]),"style"===e[0].attributeName&&(t.closest("[data-mutate]").attr("data-events","mutate"),t.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger",[t.closest("[data-mutate]")]));break;case"childList":t.closest("[data-mutate]").attr("data-events","mutate"),t.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger",[t.closest("[data-mutate]")]);break;default:return!1}};if(t.length)for(var n=0;n<=t.length-1;n++){new l(i).observe(t[n],{attributes:!0,childList:!0,characterData:!1,subtree:!0,attributeFilter:["data-events","style"]})}},u.Initializers.addSimpleListeners=function(){var e=s()(document);u.Initializers.addOpenListener(e),u.Initializers.addCloseListener(e),u.Initializers.addToggleListener(e),u.Initializers.addCloseableListener(e),u.Initializers.addToggleFocusListener(e)},u.Initializers.addGlobalListeners=function(){var e=s()(document);u.Initializers.addMutationEventsListener(e),u.Initializers.addResizeListener(),u.Initializers.addScrollListener(),u.Initializers.addClosemeListener()},u.init=function(e,t){Object(o.onLoad)(e(window),function(){!0!==e.triggersInitialized&&(u.Initializers.addSimpleListeners(),u.Initializers.addGlobalListeners(),e.triggersInitialized=!0)}),t&&(t.Triggers=u,t.IHearYou=u.Initializers.addGlobalListeners)}},14:function(e,t,i){e.exports=i("./js/entries/plugins/foundation.reveal.js")},jquery:function(e,t){e.exports=o}})});
//# sourceMappingURL=foundation.reveal.min.js.map

"use strict";

Foundation.Interchange.SPECIAL_QUERIES["smallretina"] =
  "only screen and (min-width: 1px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 1px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 1px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 1px) and (min-device-pixel-ratio: 2), only screen and (min-width: 1px) and (min-resolution: 192dpi), only screen and (min-width: 1px) and (min-resolution: 2dppx)";
Foundation.Interchange.SPECIAL_QUERIES["mediumretina"] =
  "only screen and (min-width: 641px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 641px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 641px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 641px) and (min-device-pixel-ratio: 2), only screen and (min-width: 641px) and (min-resolution: 192dpi), only screen and (min-width: 641px) and (min-resolution: 2dppx)";
Foundation.Interchange.SPECIAL_QUERIES["largeretina"] =
  "only screen and (min-width: 1025px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 1025px) and (min-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (min-resolution: 192dpi), only screen and (min-width: 1025px) and (min-resolution: 2dppx)";
Foundation.Interchange.SPECIAL_QUERIES["xlargeretina"] =
  "only screen and (min-width: 1921px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 1921px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 1921px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 1921px) and (min-device-pixel-ratio: 2), only screen and (min-width: 1921px) and (min-resolution: 192dpi), only screen and (min-width: 1921px) and (min-resolution: 2dppx)";


function isHighDensity() {
  return (
    (window.matchMedia &&
      (window.matchMedia(
        "only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)"
      ).matches ||
        window.matchMedia(
          "only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)"
        ).matches)) ||
    (window.devicePixelRatio && window.devicePixelRatio > 1.3)
  );
}

function isRetina() {
  return (
    (window.matchMedia &&
      (window.matchMedia(
        "only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)"
      ).matches ||
        window.matchMedia(
          "only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)"
        ).matches)) ||
    (window.devicePixelRatio && window.devicePixelRatio >= 2)
  );
}

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

$.fn.toggleHidden = function() {
  return this.each(function(index, element) {
    var $element = $(element);
    if ($element.attr('hidden')) {
      $element.removeAttr('hidden');
    } else {
      $element.attr('hidden', '');
    }
  });
};

$.fn.lazyInterchange = function() {
  var selectors = this.each(function() {
    if ($(this).attr('data-lazy')){
      $(this).attr('data-interchange',$(this).attr('data-lazy'));
      $(this).removeAttr('data-lazy');
      $(this).foundation();
      $(this).addClass('image-loaded');
    }
  });
  return selectors;
};

function do_unveil(){
  $('img.lazy, .bg-lazy').unveil(200,function(){
    $(this).lazyInterchange();
    if ($(this).hasClass('.bg-lazy')) {
      $(this).removeAttr('src');
    }
  });
}

function set_cookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function get_cookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
"use strict";

// Function to make whole div's clickable using href from the link inside the div
// To do this: add data-href attribute to div you want to make clickable
$(document).on('click tap', '[data-href]', function (e) {
  e.preventDefault();

  // Find link href of first a tag in div
  var href = $(this).find('a:first').attr('href');
  window.open(href, '_self');
});


"use strict";

var zipcodeInputClass   = '.auto-zipcode';
var numberInputClass    = '.auto-zipcode';
var streetClass         = '.auto-street';
var cityClass           = '.auto-city';

function doAddressCall(form) {
  var postcode = form.find(zipcodeInputClass).val();
  var number = form.find(numberInputClass).val();

  if (number.length > 0 && postcode.match(/^\d{4}[\s-]?[a-zA-Z]{2}[\s-]?$/g)) {
    console.log("Connecting to postcode API");

    $.ajax({
      type: 'POST',
      url: ajax_object.ajax_url,
      dataType: 'html',
      data: {
        'action': 'get_address',
        'postcode_check': postcode.replace(/ /g, ''),
        'number_check': number.replace(/ /g, ''),
      },
      success: function(returned_data) {

        var data = $.parseJSON(returned_data);
        if (typeof data.street !== 'undefined' && typeof data.city !== 'undefined') {
          form.find(streetClass).val(data.street);
          form.find(cityClass).val(data.city);
        } else {
          form.find(streetClass).removeClass('hide');
          form.find(cityClass).removeClass('hide');
        }
      },
      error: function(xhr, error){
        console.debug(xhr); console.debug(error);
        // No correct output
        form.find(streetClass).removeClass('hide');
        form.find(cityClass).removeClass('hide');
      },
    });
  }
}

$(function() {
  $('body').on('keyup', zipcodeInputClass + ',' + numberInputClass, debounce(function () {
    var form = $(this).closest('form');
    doAddressCall(form);
  }, 1000));
});
"use strict";

// document ready
$(function() {

});

"use strict";

// document ready
$(function() {
  do_unveil(); // initialize lazyloading
});

"use strict";

// document ready
$(function() {

  var sectionClass        = '.section';
  var postContainerClass  = '.post-container';
  var cardClass           = '.card';
  var loadMoreButtonClass = '.load-more-posts';
  var filterCheckClass    = '.filter';

  var filterSearchId      = '#filter-search';
  var filterSortId        = '#filter-sort';

  function toggleLoader(el){
    el.toggleClass('loader-active');
  }

  function toggleButton(el, action){
    if (el.hasClass('hide')){
      el.removeClass('hide'); // Remove initial hiding class because we don't need it anymore
    }

    if (action === 'show'){
      el.show();
    } else if (action === 'hide'){
      el.hide();
    } else {
      el.toggle();
    }
  }

  function ajax_load_more(container, button, post_type, section, current_posts, replace){
    var filter = [];
    var order = '';
    var search = '';

    if (filterCheckClass) {
      var checked = section.find('input' + filterCheckClass + ':checked');
      for (var idx = 0; idx < checked.length; idx++) {
        filter.push(checked[idx].value);
      }
    }

    // Add loader
    toggleLoader(container);
    toggleButton(button, 'hide');

    if (replace){ // Replace all current posts so start at 0
      current_posts = 0;
    }

    if (filterSearchId) {
      search = section.find(filterSearchId).val();
    }

    if (filterSortId) {
      order = section.find(filterSortId).val();
    }

    var ajax_data = {
      action: 'load_more_posts',
      post_type: post_type,
      count: current_posts,
      filter: filter,
      search: search,
      order: order
    };

    $.ajax({
      type: 'POST',
      url: ajax_object.ajax_url,
      dataType: 'html',
      data: ajax_data,
      timeout: 10000,
      success: function(data){
        data = JSON.parse(data);

        if (data.html) {
          if (replace){
            container.html(data.html);
          } else {
            container.append(data.html);
          }
        } else {
          if (replace){
            container.html('<div class="column"><p>Er zijn geen berichten gevonden.</p></div>');
          } else {
            container.append('<div class="column"><p>Er zijn geen berichten gevonden.</p></div>');
          }
        }

        // Remove loader
        toggleLoader(container);

        // Unveil
        do_unveil();

        // Interchange
        container.find('.initialize-interchange').foundation();
        container.find('.initialize-interchange').removeClass('initialize-interchange');
        // do_unveil();
        current_posts = container.find(cardClass).length;
        if (typeof data.count !== 'undefined' && button !== ''){
          if ( current_posts < data.count){
            toggleButton(button, 'show');
          }
        }
      },
      error: function(errorThrown){
        container.append("<div class='load__warning'>Onbekende fout, vernieuw de pagina en probeer het nog eens</div>");
        console.log('Error');
        console.log(errorThrown); // error
      }
    });
  }

  // order
  // --------
  $(sectionClass + ' select' + filterSortId).on('change', function(e){

    var section = $(this).closest(sectionClass);
    var button = section.find('a' + loadMoreButtonClass);
    var container = section.find(postContainerClass);
    var post_type = section.attr('data-type');

    ajax_load_more(container, button, post_type, section, 0, true);

  });

  // search
  // --------
  $(sectionClass + ' input' + filterSearchId).on('keyup', debounce(function(e) {

    var section = $(this).closest(sectionClass);
    var button = section.find('a' + loadMoreButtonClass);
    var container = section.find(postContainerClass);
    var post_type = section.attr('data-type');

    ajax_load_more(container, button, post_type, section, 0, true);

  }, 500));

  // filter
  // --------
  $(sectionClass + ' input' + filterCheckClass).on('click', function(e){
    var section = $(this).closest(sectionClass);
    var button = section.find('a' + loadMoreButtonClass);
    var container = section.find(postContainerClass);
    var post_type = section.attr('data-type');

    ajax_load_more(container, button, post_type, section, 0, true);
  });

  // load more
  // --------
  $(loadMoreButtonClass).on('click', function(e){
    e.preventDefault();
    $('.load__warning').remove();

    var button = $(this);
    var section = $(this).closest(sectionClass);
    var post_type = section.attr('data-type');
    var container = section.find(postContainerClass);
    var current_posts = container.find(cardClass).length;

    if (current_posts <= 0) {
      return;
    }
    ajax_load_more(container, button, post_type, section, current_posts, false);
  });


  // Add class for styling purposes (iPad/iPhone fix)
  $('.filter-list div').on('click', function() {
    var checkbox = $(this).find('input.filter');

    if ($('html').attr('data-whatinput') === 'touch') {
      if (checkbox.attr('checked')) {
        checkbox.attr('checked', false);
      } else {
        checkbox.attr('checked', true);
      }
    }
  });

});

"use strict";

$(function() {

  // navicon toggle
  //---------------
  $('#navicon').on("click", function() {
    if ($('.mobile-menu-container.is-overlay').length > 0) {
      // Is overlay menu
      $(this).toggleClass('is-active');
      $('.mobile-menu-container').toggleClass('is-visible');
      $('body').toggleClass('off-canvas-open stop-scrolling');
    }
  });

  // Off canvas mobile menu
  $('#offCanvasMainMenu').on('closed.zf.offcanvas', function(){
    $('.mobile-navigation #navicon').removeClass('is-active');
  });

  $('#offCanvasMainMenu').on('opened.zf.offcanvas', function(){
    $('.mobile-navigation #navicon').addClass('is-active');
  });

  // Header height and position
  //---------------
  var header = $('#header').outerHeight();
  var wpAdminbar = $('#wpadminbar').height();

  if (wpAdminbar > 0) {
    var headerHeight =  header + wpAdminbar;
    $('.header').addClass('fixed-top'); // add class to change top position

    if (Foundation.MediaQuery.atLeast('large')) {
      $('.header').removeClass('fixed-top');
    }
  } else {
    var headerHeight = header;
  }

  $('.mobile-menu-container').css('height', 'calc(100% - ' + headerHeight + 'px)');

  $(window).resize(function() {
    // Update header heights on resize window
    header = $('#header').outerHeight();
    wpAdminbar = $('#wpadminbar').height();
    headerHeight =  header + wpAdminbar;

    // Add padding to body for sticky header (for mobile menu devices only)
    if (Foundation.MediaQuery.is('medium down')) {
      $('body').addClass('spacing-top');
      if (wpAdminbar > 0) {
        $('.header').addClass('fixed-top');
      }
    }

    if (Foundation.MediaQuery.atLeast('large')) {
      $('body').removeClass('spacing-top');
      $('.header').removeClass('fixed-top');
    }
  });

  // Sticky header
  //---------------
  var topbar = $('.topbar').outerHeight();
  $(window).scroll(function() {
    var scroll = $(window).scrollTop();

    // check if scrolled past topbar
    if (scroll >= topbar) {
      $('.header').addClass('sticky-header');
      $('body').addClass('has-fixed-nav');
      $('#main').addClass('spacing-top');

      if (wpAdminbar > 0) {
        $('.header').addClass('wp-admin-position');
      }
    } else {
      $('.header').removeClass('sticky-header wp-admin-position');
      $('body').removeClass('has-fixed-nav');
      $('#main').removeClass('spacing-top');
    }
  });

});
"use strict";

// document ready
$(function() {

  // Popup on page load
  $('.load-reveal').each(function(){
    $(this).foundation('open');
  });

  // Popup on page leave
  $('.leave-reveal').each(function() {
    var reveal = $(this);
    if (typeof ouibounce !== "undefined") {
      var _ouibounce = ouibounce(false, {
        aggressive: false,
        sitewide: true,
        callback: function() {
          reveal.foundation('open');
        }
      });
    } else {
      console.log('Can\'t load popup on leave. Ouibounce not defined');
    }
  });

});

"use strict";

// document ready
$(function() {

  // smoothscroll to hash
  var scrollToTopH = 140;
  $('a[href*=\\#]').not('.no-scroll').on('click', function(event) {
    if ($(this.hash).length > 0) {
      event.preventDefault();
      $('html,body').animate({
        scrollTop: $(this.hash).offset().top - scrollToTopH
      }, 500);
    }
  });
});

'use strict';

$('div[class^=nrdq-slider]').each(function() {
  var slider = $(this);

  slider.slick({
    lazyLoad: 'ondemand',
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
  });
});
"use strict";

// document ready
$(function() {

  // social sharers
  $('ul.social-share > li > a').on('click', function() {
    window.Sharer.init();
  });
});

"use strict";

// Initialize Foundation
$(document).foundation();