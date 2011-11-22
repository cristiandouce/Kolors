;(function($) {

    // Create the defaults once
	var pluginName = 'Kolors',
		defaults = {
			callbacks: {}
		};

	// The actual plugin constructor
	function Kolors( element, colors, options ) {
		this.element = element;
		this.colors = colors;


		this.callbacks = $.extend( {}, defaults.callbacks, options);

		this._defaults = defaults;
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
            var html = '<ul class="kolors">';
            var template = '<li style="background-color:$color;" $active><span></span></li>';
            
            for(var i = 0, j = this.colors.length; i<j ; i++) {
                html += template.replace('$color',this.colors[i])
                        .replace('$active',!i ? 'class="active"' : '');
            }
            html += '</ul>';

            $(this.element).append(html);
        },

        bindEvents: function () {

            var element = $(this.element);
            var self = this;
            
            element.find("ul").delegate("li","click", function() {
                element.find("li.active").removeClass("active");
                $(this).addClass("active");
                var color = $(this).css('backgroundColor');
                if (self.callbacks.onColorClick) {
                    self.callbacks.onColorClick(color);
                }

            });
        }

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( colors, options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Kolors( this, colors, options ));
            }
        });
    };


})(jQuery);


