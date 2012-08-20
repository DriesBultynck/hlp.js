/*
-- AUTHORS --
Dries Bultynck - driesbultynck.be
Ruben Taelman - rubensworks.net
Samuel Debruyn - about.me/samueldebruyn

-- NOTICE --
1) Please don't mess up this test file with things we don't need for the plugin.
2) Keep plugin code in the external file 'hlp.js'.
3) Use comments like this one.

-- TO DO --

1) Cleaning up code with focus on SPEED!!
   Chaching? > http://jquery-howto.blogspot.com/2008/12/caching-in-jquery.html
   
2) Find something to load the sites in the frameholder faster > CPU power? Prerender for Chrome? Other possibilities?
3) Mobile popup for images & urls
4) tracking outboundlinks > GA

*/

//Detection of active domain
this.getDomain = function(url){return url.match(/:\/\/(.[^/]+)/)[1];}
this.activeDomainCSS = function(){
	$("a[href^=\"http://\"]:not([href*=\""+document.domain+"\"])").addClass('HLP_preview');
	$("img[src^=\"http://\"]:not([src*=\""+document.domain+"\"])").addClass('HLP_zoom');
	$("a[href^=\"http://\"]:not([href*=\""+document.domain+"\"]) img").removeClass();//does not work in Chrome
}

//Global vars
var c, height, width, deviceAgent, agentID; 

//Mobile device detection
deviceAgent = navigator.userAgent.toLowerCase();
agentID = deviceAgent.match(/(iphone|ipod|ipad)/);//delete safari!!!

//Do magic
this.urlPreview = function(options){
		settings = jQuery.extend({
			//popupId: "hlp",
			maxWidth: 600,
			maxHeight: 320,
			xOffset: 0,
			yOffset: 15,
			popupCSS: {'border':'1px solid #000', 'background':'#fff', 'color':'#000', 'padding':'5px 7px 3px 7px', 'overflow':'hidden', 'position':'absolute', 'cursor':'pointer'},
			//loadingMessage: "<div id='loading'> Loading </div>"
			loadingMessage: "<div id='loading'><img src='loading.gif' alt='loading'/></div>"
		}, options);
		
		/*
		//Create our popup element
		popup =
		$("<div />")
		.css(settings.popupCSS)
		.attr("id", settings.popupId)
		.appendTo("body").hide();
		
		//Attach hover events that manage the popup
		$(this)
		.hover(setPopup)
		.mousemove(updatePopupPosition)
		.mouseout(hidePopup);
		
		*/

		//Set size of popup
		var docHeight = document.body.clientHeight, docWidth = document.body.clientWidth, body = $('body');
		
		if(docHeight > settings.maxHeight){height = settings.maxHeight;}else{height = docHeight;}
		if(docWidth/2 > settings.maxWidth){width = settings.maxWidth;}else{width = docWidth/2;}

	//Simsalabim with images
	$("img.HLP_zoom").hover(function(e){
		this.t = this.alt;
		this.alt = "";	
		var c = (this.t != "") ? "" + this.t : "";
		body.append("<div id='popup' style='height:" + height + c.height + "px;width:" + width + "px;'></div>")
			.append(settings.loadingMessage);
			
		$("#loading")
			.css(settings.popupCSS)
			.css("top",(e.pageY + settings.xOffset) + "px")
			.css("left",(e.pageX + settings.yOffset) + "px")
		
		$("#popup")
			.css(settings.popupCSS)
			.css("top",(e.pageY - settings.xOffset) + "px")
			.css("left",(e.pageX + settings.yOffset) + "px")			
			.append("<div>Alt attr.: " + c + "</div><iframe onload=\"$('#popup').fadeIn('fast');\" id='zoom' src='" + this.src + "' scrolling='no' border='0' margin='0' padding='0' style='height:"+ height + "px;width:" + width + "px;'></iframe>");
			preload();
    },
	function(){
		this.title = this.t;	
		$("#popup").remove();
		$("#loading").remove();
    });	
	$("img.HLP_zoom").mousemove(function(e){
		$("#popup")
			.css(settings.popupCSS)
			.css("top",(e.pageY - settings.xOffset) + "px")
			.css("left",(e.pageX + settings.yOffset) + "px")
			updatePopupPosition(e);
	});	
	
	function preload(){
			$.ajax({
 					url: this.href,
 					beforeSend: function() {
  						$("#popup").css('display','none')
  						$("#loading").css('display','visible');
 					},
 					complete: function() {
  						$("#popup").css('display','visible')
						$("#loading").css('display','none');
 					},
					success:function(){
						$("#popup").css('display','visible')
						$("#loading").css('display','none');
					}
				});
		}
		
	//Simsalabim with outbounding links
	$("a.HLP_preview").hover(function(e){
		if(document.domain!=getDomain(this.href)){
			this.focus();
			this.t = this.title;
			this.title = "";	
			c = (this.t != "") ? "" + this.t : "";
			var movieUrl = this.href;  
			if(movieUrl.match('http://(www.)?youtube|youtu\.be')){
    			youtube_id = movieUrl.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
    			movieUrl = "http://www.youtube.com/embed/"+youtube_id;
    			this.href=movieUrl;
    		}
    		if(movieUrl.match('vimeo.*')){
    			vimeo_id = movieUrl.split(/(\d+)/)[1];
    			movieUrl = "http://player.vimeo.com/video/"+vimeo_id;
    			this.href=movieUrl;
    		}	
			$(this)
				.append("<div id='popup' style='height:" + height + c.height + "px;width:" + width + "px;'></div>")
				.append(settings.loadingMessage);
			
			$("#loading")
				.css(settings.popupCSS)
				.css("top",(e.pageY + settings.xOffset) + "px")
				.css("left",(e.pageX + settings.yOffset) + "px")
			
			$("#popup")
				.css(settings.popupCSS)
				.css("top",(e.pageY + settings.xOffset) + "px")
				.css("left",(e.pageX + settings.yOffset) + "px")
				.append("<div>Title attr.: " + c + "</div><iframe onload=\"$('#popup').fadeIn('fast');\" id='preview' src='" + this.href + "' scrolling='no' border='0' margin='0' padding='0' height='" + height +"px;' width='" + width + "px;'></iframe>");
				
				$.ajax({
 					url: this.href,
 					beforeSend: function() {
  						$("#popup").css('display','none')
  						$("#loading").css('display','visible');
 					},
 					complete: function() {
  						$("#popup").css('display','visible')
						$("#loading").css('display','none');
 					},
					success:function(){
						$("#popup").css('display','visible')
						$("#loading").css('display','none');
					}
				});
			
			}
    },
	function(){
		this.title = this.t;	
		$("#popup").remove();
		$("#loading").remove();
    });	
	$("a.HLP_preview").mousemove(function(e){
		$("#popup")
			.css(settings.popupCSS)
			.css("top",(e.pageY - settings.xOffset) + "px")
			.css("left",(e.pageX + settings.yOffset) + "px")
			updatePopupPosition(e);
	});
	
	
	function getWindowSize() {
			return {
				scrollLeft: $(window).scrollLeft(),
				scrollTop: $(window).scrollTop(),
				width: $(window).width(),
				height: $(window).height()
			};
		}
		
	function getPopupSize() {
			return {
				width: $("#popup").width(),
				height: $("#popup").height()
			};
		}
		
	function updatePopupPosition(e)
		{
			var windowSize = getWindowSize();
			var popupSize = getPopupSize();
			if (windowSize.width + windowSize.scrollLeft < e.pageX + popupSize.width + settings.xOffset){
				$("#popup").css("left", e.pageX - popupSize.width - settings.xOffset);
			} else {
				$("#popup").css("left", e.pageX + settings.xOffset);
			}
			if (windowSize.height + windowSize.scrollTop < e.pageY + popupSize.height + settings.yOffset){
				$("#popup").css("top", e.pageY - popupSize.height - settings.yOffset);
			} else {
				$("#popup").css("top", e.pageY + settings.yOffset -10); //10 as bottom margin for popups
			}
		}
		
};

/**
 * Adds buttons to all anchors to show preview when clicked.
 */
this.prepareMobile = function(){
	
	$('a.HLP_preview').each(function(index) {
		if(document.domain!=getDomain(this.href))
    		$(this).parent().append("<a class='mobilepreview' href='#' title='"+this.title+"'> Click to preview</a>");
			jQuery.data(document.body, this.title, this.href);
  	});
	
	$('.mobilepreview').live('click', function() {
	//$(".mobilepreview").click(function(e){
	  //this.title=$(this).parent().title;
	  //this.href=$(this).parent().href;
	  $("body").append("<div id='mobileframeholder' style='height:85%;width:100%;position:absolute;top:0;left:0;background:white'></div>");
	  $("#mobileframeholder").prepend("<iframe src='" + jQuery.data(document.body, this.title) + "' scrolling='no' border='0' margin='0' padding='0' style='width:100%;height:100%;'></iframe>");
	  $("#mobileframeholder").prepend("<span class='closemobilepreview'>X</span><h1 style='text-align:center'>"+this.title+"</h1>");
			
	});
	
	$('.closemobilepreview').live('click', function() {
	  $("#mobileframeholder").remove();	
	});
}

$(document).ready(function(){
	activeDomainCSS();	
	if(agentID){
		prepareMobile();
	}else{
	urlPreview();
	}
});


//switch position of popup




		