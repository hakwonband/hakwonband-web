(function($){
	// 레이어 띄우기
	var layer, layerBg;
	/**
	 * 아직 보여지고 있는지
	 */
	var isShow = false;

	$.dimPopup = $({});
	$.dimPopup.init = function(){
		layer = new createLayer();
		layerBg = new createLayerBg();
	};
	$.dimPopup.layerOpen = function( ele ) {
		if( isShow == false ) {
			layerBg.open();
			layer.open( ele );
		}
	};
	$.dimPopup.layerClose = function() {
		layerBg.close();
		layer.close();
	};

	$.fn.dimPopup = function(){}

	// 레이어생성함수
	function createLayer() {
		var $layer = undefined;

		this.open = function(ele) {
			$layer = $(ele);
			$layer.show().animate({'left':'0px'},500);
			this.position();
			$(window).bind("resize.dimPopup", this.position);
			isShow = true;
		};

		this.close = function(){
			if( $layer ) {
				$layer.animate({'left':'-181px'},300);
				$layer.hide(600, function() {
					isShow = false;
				});
				$layer = undefined;
			}
			$(window).unbind("resize.dimPopup");
		};

		this.position = function(){
			var scrollTop = $(document).scrollTop(),
				scrollLeft = $(document).scrollLeft();

			$layer.css({
				position : "absolute",
				top : 0 ,
				zIndex : 9999,
				height : $(window).height()
			});
		};
	};

	// 배경레이어생성함수
	function createLayerBg(){
		var $bg = $('<div id="dim_bg"></div>')
			.css({
				display : "none",
				position : "fixed",
				top : 0,
				left : 0,
				width : $(window).width(),
				height : $(window).height(),
				background : "#000",
				//overflow : "hidden",
				opacity : .6,
				zIndex : 1000
			}).appendTo("body");

		this.open = function() {
			if( $bg.is(':hidden') ) {
				$bg.show();
				$("html, body").attr("style","height:"+$(window).height()+"px; overflow:hidden");
				this.position();
				$(window).bind("resize.dimPopupBg", this.position);
			}
		};
		// 팝업 상태의 닫기 버튼 클릭시 레이어 view 닫힘
		this.close = function() {
			if( $bg.is(':visible') ) {
				$bg.hide();
				$("html, body").removeAttr("style");
			}
			$(window).unbind("resize.dimPopupBg");
		};

		this.position = function(){
			$bg.css({
				top : 0,
				left : 0,
				width : $(window).width(),
				height : $(window).height()
			});
		};
	};

	//resize
	$(window).resize(function() {
		$("html, body").removeAttr("style");
		$("#mypage").css("height",$(window).height());

		dim_blk = $("#dim_bg").css("display");
		if (dim_blk == "none") {
			$("html, body").removeAttr("style");
		} else {
			$("html, body").attr("style","height:"+$(window).height()+"px; overflow:hidden");
		}
	});

	$(document).ready(function(e) {
		$.dimPopup.init();
	});
})(jQuery);