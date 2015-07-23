/* 3D spinner carousel plugin - see https://github.com/andysellick/spinner for details */
(function (window,$) {
	var Plugin = function(elem,options){
		this.elem = elem;
		this.$elem = $(elem);
		this.options = options;
		this.zindexes = [];
	}

	Plugin.prototype = {
		init: function(){
            var thisobj = this;
            var zindexinc = 10;

            this.settings = $.extend({
                middleslidewidth: 40,
                    spinnerheight: 0,
                    animspeed: 500,
                    disableat: 767,
                    linkBtn: 1,
                    linkBtnClass: "btn btn-large",
                    linkBtnText: "View",
                    nav: 1,
                    navNextText: "Next",
                    navPrevText: "Previous"
            }, this.defaults, this.options);

            $(window).on('resize',function(){
                var $spinner = thisobj.$elem.find('.spinner');
                if($(window).width() < thisobj.settings.disableat){
                    if($spinner.hasClass('active')){
                        thisobj.destroy();
                    }
                }
                else {
                    if(!$spinner.hasClass('active')){
                        thisobj.init();
                    }
                }
                thisobj.setSpinnerHeight();
            });

            if($(window).width() > this.settings.disableat){
                var $spinner = this.$elem.find('.spinner');
                $spinner.addClass('active'); //FIXME need to only do this for desktop

                var $items = $spinner.find('li');
                var count = $items.length;
                var middle = Math.floor(count / 2);
                var curr = 0;
                
                //let's hack the z-index!
                var initialz = 10;
                var incrementz = 10;
                var counter = 0;
                
                $items.each(function(){
                    if(curr < middle){
                        $(this).addClass('left');
                    }
                    else if(curr > middle){
                        $(this).addClass('right');
                    }
                    else{
                        $(this).addClass('middle');
                    }
                    curr++;
                
                    $('<span/>').addClass('mask js-control active').appendTo($(this));
                    $(this).find('img').addClass('image');
                
                    //create array of ideal zindexes for later use
                    if(counter < (count / 2)){
                        thisobj.zindexes[counter] = initialz * (counter + 1);
                    }
                    else {
                        thisobj.zindexes[counter] = thisobj.zindexes[counter - 1] - incrementz;
                    }
                    counter++;
                });

                //create navigation controls
                var $navbar = $('<div/>').addClass('spinnernav').appendTo(this.$elem);
                if(this.settings.nav){
                    var $ctlprev = $('<a/>').addClass('js-control next active').html(this.settings.navPrevText).attr('data-dir','prev').attr('title',this.settings.navPrevText).appendTo($navbar);
                }
                if(this.settings.linkBtn){
                    var $linkbtn = $('<a/>').addClass('action').addClass(this.settings.linkBtnClass).html(this.settings.linkBtnText).attr('href',this.$elem.find('.middle > a').attr('href')).appendTo($navbar);
                }
                if(this.settings.nav){
                    var $ctlnext = $('<a/>').addClass('js-control prev active').html(this.settings.navNextText).attr('data-dir','next').attr('title',this.settings.navNextText).appendTo($navbar);
                }
                
                var leftpos = 0;
                var toppos = 0;
                var zindex = 1 * zindexinc;
                
                /* calculate positioning and layout of slides */
                var spaceonsides = (100 - this.settings.middleslidewidth) / 2; //this is the percentage space either side of the main slide. If the main slide is bigger, this reduces
                var incrementby = spaceonsides / middle;
                var slidewidth = (55 + (incrementby * (middle - 1))) / middle; //slides should occupy x% of the space either side, main slide overlaps from e.g. 30% to 70%
                
                $spinner.find('.left').each(function(){
                    Plugin.prototype.setupAttributes($(this),leftpos,toppos,slidewidth,zindex);
                    leftpos += incrementby;
                    toppos += incrementby;
                    zindex += (1 * zindexinc);
                });
                
                var middlez = zindex;
                zindex -= (1 * zindexinc);
                toppos -= 10;
                leftpos = 100 - leftpos - (slidewidth - incrementby); //okay that was complex

                $spinner.find('.right').each(function(){
                    Plugin.prototype.setupAttributes($(this),leftpos,toppos,slidewidth,zindex);
                    leftpos += incrementby;
                    toppos -= incrementby;
                    zindex -= (1 * zindexinc);
                });
                
                $spinner.find('.middle').css({
                    'top': 0,
                    'left': spaceonsides + '%',
                    'z-index': middlez, //((count + 2) / 2) * zindexinc,
                    'width': this.settings.middleslidewidth + '%'
                });
                
                this.$elem.on('click','.js-control.active',function(e){
                    e.preventDefault();
                    $('.js-control').removeClass('active');
                
                    var dir;
                    var loop = 0;
                
                    if($(this).attr('data-dir')){
                        dir = $(this).attr('data-dir');
                        loop = 1;
                    }
                    else {
                        loop = $(this).closest('li').index();
                        if(loop > middle){
                            loop = loop - middle;
                            dir = "next";
                        }
                        else if(loop < middle){
                            loop = middle - loop;
                            dir = "prev";
                        }
                        else {
                            loop = 0;
                        }
                    }
                    thisobj.triggerAnimation(loop,dir,zindexinc);
                });
                thisobj.setSpinnerHeight();
            }
            return this;
        },

        //set the height of the spinner
        setSpinnerHeight: function(){
            var h = this.settings.spinnerheight;
            if(!h){
                h = this.$elem.find('.spinner').find('.middle').outerHeight(true);
            }
            this.$elem.find('.spinner').css('height',h);
        },

        //do css setup of given left or right element
        setupAttributes: function(thisel,leftpos,toppos,slidewidth,zindex){
            thisel.css({
                'left': leftpos + "%",
                'top': toppos + "%",
                'width': slidewidth + "%",
                'z-index': zindex
            });
        },

        //below a given screen size, remove all plugin functionality
        destroy: function(){
            var $spinner = this.$elem.find('.spinner');
            $spinner.removeClass('active').css('height','auto');
            this.$elem.unbind('click');
            this.$elem.find('.spinnernav').remove();
            $spinner.find('li').each(function(){
                $(this).attr('class','').css({
                    'left': '',
                    'top': '',
                    'width': '',
                    'z-index': ''
                });
            });
            $spinner.find('.mask').remove();
            $spinner.find('.image').css({
                'opacity': '',
                'transform': ''
            });
        },

        //multi loop function to trigger animation multiple times if needed
        triggerAnimation: function(loop,dir,zindexinc){
            if(loop){
                this.animateSlide(loop,dir,zindexinc);
            }
            else {
                $('.js-control').addClass('active');
            }
        },
                
        //let's hack the z-index!
        hackZindexes: function(){
            var thisobj = this;
            var $spinner = this.$elem.find('.spinner');
            var $loopeditems = $spinner.find('li');
            $loopeditems.each(function(){
                $(this).css('z-index',thisobj.zindexes[$loopeditems.index($(this))]);
            });
        },

        //do main animation
        animateSlide: function(loop,dir,zindexinc){
            var $spinner = this.$elem.find('.spinner');
            var $loopeditems = $spinner.find('li');
            var count = $loopeditems.length;
            var middle = Math.floor(count / 2);

            //quick hack to fix the z-index for elements passing along the back
            if(dir == 'next'){ //left most element will move along the back to become right most element
                $loopeditems = $($spinner.find('li').get().reverse()); //we want to loop through all the items in reverse, so the 'next' one is actually the next one
            }
            var thisobj = this;
            var looponce = 1;
            //annoyingly we can't use $items here because by the time we've finished this, it is no longer accurate
            $loopeditems.each(function(){
                if(looponce){
                    looponce = 0; //only do this the first time
                    //now reshuffle the elements
                    if(dir == 'next'){
                        var tmpobj = $spinner.find('li').first();
                        tmpobj.appendTo($spinner);
                    }
                    else {
                        var tmpobj = $spinner.find('li').last();
                        tmpobj.prependTo($spinner);
                    }
                }

                var thispos = 0;
                if(dir == 'next'){
                    thispos = $loopeditems.length - $(this).index() - 1;
                }
                else {
                    thispos = $(this).index();
                }
                var targetitem;

                if(dir == 'next'){
                    if(thispos < $loopeditems.length - 1){
                        targetitem = $(this).prev();
                    }
                    else {
                        targetitem = $spinner.find('li').last();
                    }
                }
                else {
                    if(thispos < $loopeditems.length - 1){
                        targetitem = $(this).next();
                    }
                    else {
                        targetitem = $spinner.find('li').first();
                    }
                }
                
                //now update the visual appearance and position
                var targetclass = targetitem.attr('class');
                var targetleft = targetitem.css('left');
                var targettop = targetitem.css('top');
                var targetwidth = targetitem.css('width');

                //convert the numbers above to percentages to retain responsiveness
                var perc = thisobj.$elem.width() / 100;
                targetleft = parseInt(targetleft.split("px")) / perc + "%";
                targetwidth = parseInt(targetwidth.split("px")) / perc + "%";

                $(this).attr('data-pos',thispos);
                thisobj.hackZindexes();
                
                $(this).attr('class',targetclass).animate({
                    'left': targetleft,
                    'top': targettop,
                    'width': targetwidth
                },thisobj.settings.animspeed,"swing",function(){
                    //callback to initiate the next loop if moving more than one item
                    if(parseInt($(this).attr('data-pos')) == $loopeditems.length - 1){
                        thisobj.hackZindexes();
                        loop--;
                        thisobj.triggerAnimation(loop,dir,zindexinc);
                    }
                    //update main link
                    if(thisobj.settings.linkBtn){
                        thisobj.$elem.find('.action').attr('href',thisobj.$elem.find('.middle > a').attr('href'));
                    }
                });
            });
        }
    }

    $.fn.spinner = function(options){
        return this.each(function(){
            new Plugin(this,options).init();
        });
    }
    window.Plugin = Plugin;
})(window,jQuery);
