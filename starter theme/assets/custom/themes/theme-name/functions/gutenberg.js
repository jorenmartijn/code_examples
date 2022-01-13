/**
 * Anchors.
 */

// Variables.
const { includes } = lodash;
var el = wp.element.createElement;
var RichText = wp.editor.RichText;
var MediaUpload = wp.editor.MediaUpload;
var AlignmentToolbar = wp.editor.AlignmentToolbar;
var BlockControls = wp.editor.BlockControls;

// Add anchor support to these blocks.
const anchorBlocks = [
  'core/columns',
  'acf/hero',
];

// remove border radius button
document.querySelectorAll('.components-range-control__slider').forEach(function(el) {
  el.style.display = 'none';
});

// Attributes.
wp.hooks.addFilter(
  'blocks.registerBlockType',
  'nrdq/anchors',
  ( props, name ) => {
    if ( ! includes( anchorBlocks, name ) ) {
      return props;
    }

    const supports = {
      ...props.supports,
      anchor: true,
    };
    props = { ...props, supports };

    const attributes = {
      ...props.attributes,
      anchor: {
        type: 'string',
        source: 'attribute',
        attribute: 'id',
        selector: '*',
      },
    };
    props = { ...props, attributes };

    return props;
  }
);

// lock template sidebar functionality

( function( wp ) {
  var registerPlugin = wp.plugins.registerPlugin;
  var PluginSidebar = wp.editPost.PluginSidebar;
  var el = wp.element.createElement;
  var ToggleControl = wp.components.ToggleControl;
  var withSelect = wp.data.withSelect;
  var withDispatch = wp.data.withDispatch;
  var compose = wp.compose.compose;

  var MetaBlockField = compose(
    withDispatch( function( dispatch, props ) {
      return {
        setMetaFieldValue: function( value ) {
          dispatch( 'core/editor' ).editPost(
            { meta: { [ props.fieldName ]: value } }
          );
        }
      }
    } ),
    withSelect( function( select, props ) {
      return {
        metaFieldValue: select( 'core/editor' )
          .getEditedPostAttribute( 'meta' )
          [ props.fieldName ],
      }
    } )
  )( function( props ) {
    return el( ToggleControl, {
      label: 'Lock template',
      value: props.metaFieldValue,
      checked: props.metaFieldValue,
      onChange: ( value ) => {
        props.setMetaFieldValue( value );
        templateLockFunction(value);
      },
    } );
  } );

  registerPlugin( 'nrdq-lock-template-sidebar', {
    render: function() {
      return el( PluginSidebar,
        {
          name: 'nrdq-lock-template',
          icon: 'lock',
          title: 'NRDQ lock template',
        },
        el( 'div',
          { className: 'components-panel__body is-opened' },
          el( MetaBlockField,
            { fieldName: 'nrdq_template_lock' }
          )
        )
      );
    }
  } );

} )( window.wp );

function templateLockFunction(value = '') {
  if(value === '') {
    value = wp.data.select( 'core/editor' ).getCurrentPost().meta.nrdq_template_lock
  }
  if(value == false) {
    if (document.getElementById("template-lock")) {
      document.getElementById("template-lock").remove();
    }
  } else {
    if (document.getElementById("template-lock")) {

    } else {
      var css = '.editor-block-mover { display: none!important; } .block-editor-inserter__toggle { display: none; }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

      head.appendChild(style);

      style.type = 'text/css';
      style.id = 'template-lock';
      if (style.styleSheet){
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }
  }
  return null;
}

wp.domReady( function() {
  templateLockFunction()
} );

// remove unwated blocks from gutenberg
wp.domReady( function() {
  // get all gutenberg blocknames
  var registeredBlocks = wp.data.select( 'core/blocks' ).getBlockTypes();
  var registeredBlocksClean = registeredBlocks.map(a => a.name);
  registeredBlocksClean.splice( registeredBlocksClean.indexOf('yoast/how-to-block'), 1 );

  // remove unwanted embeds - filter
  function embedFilter(value) {
    return value.startsWith("core-embed");
  }
  var filteredEmbeds = registeredBlocksClean.filter(embedFilter);

  // remove unwanted embeds - function
  wp.blocks.unregisterBlockType("core/embed");
  filteredEmbeds.forEach(element => wp.blocks.unregisterBlockType(element));

  // remove unwanted yoast blocks - filter
  function yoastFilter(value) {
    return value.startsWith("yoast");
  }
  var filteredYoast = registeredBlocksClean.filter(yoastFilter);
  filteredYoast.push("yoast/how-to-block");

  // remove unwanted yoast blocks - function
  filteredYoast.forEach(element => wp.blocks.unregisterBlockType(element));

  // remove unwanted core blocks - filter
  filteredCore = [
    "core/verse",
    "core/rss",
    "core/search",
    "core/tag-cloud",
    "core/latest-comments",
    "core/latest-posts",
    "core/pullquote",
    "core/calendar",
    "core/archives",
    "core/categories",
    "core/code",
    "core/html",
    "core/preformatted",
    "core/nextpage",
    "core/more",
    "core/audio",
    "core/video",
    "core/file",
  ];

  // remove unwanted yoast blocks - function
  filteredCore.forEach(element => wp.blocks.unregisterBlockType(element));
} );

const setExtraPropsToBlockType = (props, blockType, attributes) => {
  const notDefined = (typeof props.className === 'undefined' || !props.className) ? true : false

  if (blockType.name === 'core/heading') {
    return Object.assign(props, {
      className: notDefined ? `title` : `title ${props.className}`,
    });
  }

  if (blockType.name === 'core/list') {
    return Object.assign(props, {
      className: notDefined ? `list` : `list ${props.className}`,
      value: attributes.values.replace(/<li>/g, `<li class="list-item is-item-${props.tagName}">`),
    });
  }

  if (blockType.name === 'core/paragraph') {
    return Object.assign(props, {
      className: notDefined ? 'post__paragraph' : `post__paragraph ${props.className}`,
    });
  }

  return props;
};

wp.hooks.addFilter(
  'blocks.getSaveContent.extraProps',
  'gutenberg/block-filters',
  setExtraPropsToBlockType
);

const setClassToBlockWithDefaultClassName = (className, blockName) => {
  if (blockName === 'core/quote') {
    return 'blockquote';
  }

  return className;
};

wp.hooks.addFilter(
  'blocks.getBlockDefaultClassName',
  'gutenberg/block-filters',
  setClassToBlockWithDefaultClassName
);


// Gutenberg button settings
wp.domReady( () => {
  wp.blocks.unregisterBlockStyle(
    'core/button',
    [ 'default', 'outline', 'squared', 'fill' ]
  );

  wp.blocks.registerBlockStyle( 'core/button', [
    {
      name: 'btn-primary',
      label: 'Primary button',
      isDefault: true,
    },
    {
      name: 'btn-secondary',
      label: 'Secondary button'
    }
  ]);

  wp.blocks.unregisterBlockStyle(
    'core/group',
    [ 'default']
  );

  wp.blocks.registerBlockStyle(
    'core/group',
    [
      {
        name: 'row',
        label: 'Container',
        isDefault: true,
      },
      {
        name: 'small',
        label: 'Smalle container breedte',
      },
      {
        name: 'expanded',
        label: 'Volle breedte',
      },
    ]
  );

  wp.blocks.registerBlockStyle(
    'core/list',
    [
      {
        name: 'bullet',
        label: 'Bullet lijst',
        isDefault: true,
      }
    ]
  );

} );

