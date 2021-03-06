/**
 *
 * Add live SEO Validation to Yoast SEO while having custom ACF Fields.
 * Works also with Flexible Content and Repeater Fields.
 * https://github.com/dachcom-digital/acf-yoast-seo-validation.git
 *
 * Include this Javascript ONLY in BackEnd.
 *
 * @author: DACHCOM.DIGITAL | Stefan Hagspiel <shagspiel@dachcom.ch>
 * @version: 1.1.0
 *
 * All rights reserved.
 *
 */
(function ($) {

    var acfPlugin;    
    var registered = false;

    var AcfPlugin = function () {
        this.content = {};
        this.pluginName = 'acfPlugin';
    };

    $.fn.reverse = Array.prototype.reverse;

    /**
     * Set's the field content to use in the analysis
     *
     * @param {Object} $el The current element that was added or modified, as a
     * jQuery object
     */
    AcfPlugin.prototype.setContent = function ($el) {
        $el = $el['$el'];
        $el = $el.closest('[data-name][data-type][data-key]');

        var key = $($el).attr('data-key'),
            type = $($el).attr('data-type'),
            value = null;
            
        var $parents = $el.parents('[data-name][data-type][data-key],[data-id]');
        switch (type) {
            case 'text' :
                value = $el.find('input').val();
                if ($el.is("[class*='wrap-in-']")) {
                    var wrapMatch = $el.attr('class').match(/wrap-in-(\w+)/);
                    value = '<' + wrapMatch[1] + '>' + value + "</" + wrapMatch[1] + ">";
                }
                break;
            case 'image' :
                value = $el.find("img[src!='']").prop('outerHTML');
                break;
            case 'gallery' :
                value = '';
                $el.find("div.thumbnail > img").each(function () {
                    value += $(this).prop('outerHTML');
                });
                break;
            case 'textarea' :
            case 'wysiwyg' :         
                value = $el.find('textarea').val();
                break;
            case 'page_link':
                value = '<a href="' + $el.find('select').val() + '"></a>';
                break;
            case 'link':
                value = $el.find('a.link-url').outerHTML();
                break;
            default :
                value = null;
        }
        
        if (value !== null) {
          var parentContent = this.content;
          if ($parents.length > 0) {
            // loop through the parents, in reverse order (top-level elements first)
            $parents.get().reverse().forEach(function(element) {
              var $parent = $(element);
              // parent is either a row/layout (get the id) or a field (get the key)
              var id = $parent.is('[data-id]') ? $parent.attr('data-id') : $parent.attr('data-key');
              if (parentContent[id] === undefined) {
                parentContent[id] = {};
              }
              parentContent = parentContent[id];
            });
          }
          parentContent[key] = value;
          
          if(typeof YoastSEO !== "undefined"){  
            registerACFandYoast(this);
            YoastSEO.app.pluginReloaded(this.pluginName);
          }
        }
        
        return true;
    };

    /**
     * Delete an ACF-element: remove the element data from the content and update
     * Yoast.
     * @param {type} $el The removed element, either a repeater row or a layout
     */
    AcfPlugin.prototype.removeContent = function($el) {
      if ($el.attr('data-id') === 'acfcloneindex') {
        return; // adding an element triggers remove on the clone, ignore this
      }
      var $parents = $el.parents('[data-name][data-type][data-key],[data-id]');
      var parentContent = this.content;
      if ($parents.length > 0) {
        // loop through the parents, in reverse order (top-level elements first)
        $parents.reverse().each(function() {
          var $parent = $(this);
          // parent is either a row/layout (get the id) or a field (get the key)
          var id = $parent.is('[data-id]') ? $parent.attr('data-id') : $parent.attr('data-key');
          parentContent = parentContent[id];
          if (parentContent === undefined) {
            return false;
          }
        });
      }
      if (parentContent !== undefined) {
        delete parentContent[$el.attr('data-id')];
        
        if(typeof YoastSEO !== "undefined"){
          registerACFandYoast(this);
          YoastSEO.app.pluginReloaded(this.pluginName);
        }
        
      }
    };

    /**
     * Registers plugin to YoastSEO
     */
    AcfPlugin.prototype.registerPlugin = function () {
        YoastSEO.app.registerPlugin(this.pluginName, {status: 'ready'});
    };

    /**
     * Registers modifications to YoastSEO
     */
    AcfPlugin.prototype.registerModifications = function () {
        YoastSEO.app.registerModification('content', this.addAcfDataToContent.bind(this), this.pluginName, 10);
    };

    /**
     * Adds ACF Data to content
     *
     * @param {String} yoastContent The page content, to be passed to Yoast
     * @returns {String} The page content with added extra field contents
     */
    AcfPlugin.prototype.addAcfDataToContent = function (yoastContent) {
        if ($.isEmptyObject(this.content)) {
          return yoastContent;
        }
        yoastContent += '\n';
        $.each(this.content, function (key, value) {
          yoastContent = addSubContent(yoastContent, value);
        });
        return yoastContent;
    };

    function addSubContent(yoastContent, subContent) {
      if (typeof subContent === 'object') { // repeater or layout
        $.each(subContent, function(containerKey, containerValue) {
          if(typeof containerValue !== 'object'){
            yoastContent = addSubContent(yoastContent, containerValue);
          } else {
            $.each(containerValue, function(subkey, subvalue) {
              yoastContent = addSubContent(yoastContent, subvalue);
            });
          }
        });
      } else {
        yoastContent += subContent + '\n';
      }
      return yoastContent;
    }
    
    function registerACFandYoast(acfPlugin){
      if(!registered){
        acfPlugin.registerPlugin();
        acfPlugin.registerModifications();   
        registered = true;
      }
    }
    
    $(window).on('YoastSEO:ready', function () {     
      YoastSEO.app.pluginReloaded(acfPlugin.pluginName);   
    });

    if(typeof acf !== "undefined"){ 
      acfPlugin = new AcfPlugin();          
      acf.addAction('load_field', acfPlugin.setContent.bind(acfPlugin));
      acf.addAction('change', acfPlugin.setContent.bind(acfPlugin));
      acf.addAction('remove', acfPlugin.removeContent.bind(acfPlugin));
    }
    
    


}(jQuery));