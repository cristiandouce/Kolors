;(function($) {

  /**
   *  Plugin's name
   */
  var pluginName = 'Kolors';

  /**
   *  Plugin's key
   */
  var pluginKey = 'plugin_' + pluginName;

  /**
   *  Plugin's template
   */
  var KOLOR_TEMPLATE = '<li id="kolor-$kolor" style="background-color:#$kolor" class="$active" data-kolor="#$kolor"><span></span></li>';

  /**
   *  Plugin's default callbacks
   */
  var DEFAULT_CALLBACKS = {
    
  };

  /**
   *  Plugin's default css classes
   */
  var DEFAULT_CLASSES = {
      kolorList: "kolors"
    , kolorActive: "kactive"
  };

  /**
   *  Plugin's public methods
   */
  var methods = {
    init: function ( colors, options) {
      return this.each(function () {
        if (!$.data(this, pluginKey) && $.isArray(colors)) {
          $.data(this, pluginKey, new Kolors(this, colors, options));
        }
      });
    },

    setColor: function (color) {
      this.changeActiveTo(color);
    }, 

    addColor: function (color) {
      this.addToList(color);
    }, 

    removeColor: function (color) {
      this.removeFromList(color);
    },

    getColor: function () {
      return this.getSelected();
    }
  }

  /**
   *  Plugin's constructor
   */
  var Kolors = function(element, colors, options) {
    // saving element's reference
    this.element = element;

    // passing list of colors
    this.colors = colors;

    // Build settings object
    this.settings = {};

    // Build callbacks
    if(options.callbacks) {
      // Use custom callbacks
      this.settings.callbacks = $.extend({}, DEFAULT_CALLBACKS, options.callbacks);
    } else {
      this.settings.callbacks = DEFAULT_CALLBACKS;
    }

    // Build class names
    if(options.classes) {
        // Use custom class names
        this.settings.classes = $.extend({}, DEFAULT_CLASSES, options.classes);
    } else if(options.theme) {

        // Use theme-suffixed default class names
        $.each(DEFAULT_CLASSES, function(key, value) {
          this.settings.classes = {};
          this.settings.classes[key] = value + "-" + options.theme;
        });

    } else {
      this.settings.classes = DEFAULT_CLASSES;
    }

    if (options.defaultColor) {
      this.settings.defaultColor = options.defaultColor;
    };

    this._defaults = $.extend({}, { callbacks: DEFAULT_CALLBACKS}, {classes: DEFAULT_CLASSES});
    this._name = pluginName;

    this.init();
  };

  Kolors.prototype = {
    constructor: Kolors,

    init: function () {
        this.render();
        this.bindEvents();
    },

    render: function () {
      var html = '<ul class="$kolorList">'.replace('$kolorList', this.settings.classes.kolorList);
      
      for(var i = 0, j = this.colors.length; i<j ; i++) {
        var kolor = this.colors[i].replace('\#', '');
        html += KOLOR_TEMPLATE.replace('$active',!i ? this.settings.classes.kolorActive : '').replace(/\$kolor/g, kolor);
      }

      html += '</ul>';

      $(this.element).append(html);

      // if default color, set it or prepend
      // it in case it doesn't exists
      if(this.settings.defaultColor) {
        this.addToList(this.settings.defaultColor);
        this.changeActiveTo(this.settings.defaultColor);
      }
    },

    bindEvents: function () {
      var element = $(this.element);
      var self = this;
      
      element.find("ul").delegate("li","click", function() {
        var color = $(this).data("kolor");
        self.changeActiveTo(color);
        if (self.settings.callbacks.onColorClick) {
          self.settings.callbacks.onColorClick(color);
        }
      });
    },

    changeActiveTo: function (color) {
      var kolor = color.replace('\#','');
      var selector = 'li#kolor-' + kolor;
      var liClass = this.settings.classes.kolorActive;

      $(this.element).find("li." + liClass).removeClass(liClass);

      $(selector).addClass(liClass);
    },

    addToList: function (color) {
      var kolor = color.replace('\#','');
      var selector = 'li#kolor-' + kolor;

      if (!$(selector).length) {
        $(this.element).find('ul.' + this.settings.classes.kolorList).prepend(
        KOLOR_TEMPLATE.replace('$active','')
                    .replace(/\$kolor/g, kolor)
        );

        // this.changeActiveTo(kolor);
        return '#' + kolor;
      } else {
        // throw new Error('Color #$kolor already exists on the list'.replace('$kolor',kolor))
        return false;
      }
    },

    removeFromList: function (color) {
      var kolor = color.replace('\#','');
      var selector = 'li#kolor-' + kolor;
      var liClass = this.settings.classes.kolorActive;

      if ($(selector).length) {
        if ($(selector).hasClass(liClass)) {
          var nextKolor = $(selector).next("li").data("kolor");
          $(selector).remove();
          this.changeActiveTo(nextKolor);
        } else {
          $(selector).remove();
        }
        
        return '#' + kolor;
      }else {
        // throw new Error('Color $kolor does not exist on the list'.replace('$kolor', '#' + kolor));
        return false;
      }
    },

    getSelected: function () {
      return $(this.element).find("li." + this.settings.classes.kolorActive).data("kolor");
    }
  };

  /**
   *  Plugin's expose to jQuery
   */
  $.fn[pluginName] = function ( method ) {
    if(methods[method]) {
      return methods[method].apply($(this).data(pluginKey),  Array.prototype.slice.call(arguments, 1));
    } else {
      return methods.init.apply(this, arguments);
    }
  };
})(jQuery);


