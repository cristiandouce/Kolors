;(function($) {

    // Create the defaults once
	var pluginName = 'Kolors';
    var PLUGIN_KEY = 'plugin_' + pluginName;


    var KOLOR_TEMPLATE = '<li id="kolor-$kolor" style="background-color:#$kolor" $active data-kolor="#$kolor"><span></span></li>';

    var	DEFAULT_SETTINGS = {
			callbacks: {}
		};

    var DEFAULT_CLASSES = {
        kolorList: "kolors"
    };

    var methods = {
        init: function ( colors, options) {
            return this.each(function () {
                if (!$.data(this, PLUGIN_KEY) && $.isArray(colors)) {
                    $.data(this, PLUGIN_KEY,
                    new Kolors( this, colors, options ));
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

	// The actual plugin constructor
	function Kolors( element, colors, options ) {

        this.element = element;

        this.colors = colors;

        this.callbacks = $.extend( {}, DEFAULT_SETTINGS.callbacks, options);

        this._defaults = DEFAULT_SETTINGS;
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
            var html = '<ul class="$kolorList">'.replace('$kolorList', DEFAULT_CLASSES.kolorList);
            
            for(var i = 0, j = this.colors.length; i<j ; i++) {

                var kolor = this.colors[i].replace('\#', '');

                html += KOLOR_TEMPLATE.replace('$active',!i ? 'class="active"' : '')
                        .replace(/\$kolor/g, kolor);
            }

            html += '</ul>';

            $(this.element).append(html);
        },

        bindEvents: function () {

            var element = $(this.element);
            var self = this;
            
            element.find("ul").delegate("li","click", function() {

                var color = $(this).attr('id').replace('kolor-','');

                self.changeActiveTo(color);

            });
        },

        changeActiveTo: function (color) {
            var kolor = color.replace('\#','');
            var selector = 'li#kolor-' + kolor;

            $(this.element).find("li.active").removeClass("active");

            $(selector).addClass("active");
        },

        addToList: function (color) {
            var kolor = color.replace('\#','');
            var selector = 'li#kolor-' + kolor;

            if (!$(selector).length) {
                $(this.element).find('ul.' + DEFAULT_CLASSES.kolorList).prepend(
                KOLOR_TEMPLATE.replace('$active','')
                            .replace(/\$kolor/g, kolor)
                );

                // this.changeActiveTo(kolor);
            } else {
                // throw new Error('Color #$kolor already exists on the list'.replace('$kolor',kolor))
            }
            
        },

        removeFromList: function (color) {
            var kolor = color.replace('\#','');
            var selector = 'li#kolor-' + kolor;

            if ($(selector).length) {
                if ($(selector).hasClass("active")) {
                    var nextKolor = $(selector).next("li").attr('id').replace('kolor-','');
                    $(selector).remove();
                    this.changeActiveTo(nextKolor);
                } else {
                    $(selector).remove();
                }
                
            }else {
                // throw new Error('Color $kolor does not exist on the list'.replace('$kolor', '#' + kolor));
            }
        },

        getSelected: function () {
            return $(this.element).find("li.active").data("kolor");
        }

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( method ) {
        if(methods[method]) {
            return methods[method].call($(this).data(PLUGIN_KEY),  Array.prototype.slice.call(arguments, 1));
        } else {
            return methods.init.apply(this, arguments);

        }

    };


})(jQuery);


