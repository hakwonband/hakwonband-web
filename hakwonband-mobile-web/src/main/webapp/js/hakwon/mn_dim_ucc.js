(function($){
	// 레이어 띄우기
	var layer, layerBg;

	$.dimPopup_ucc = $({});
	$.dimPopup_ucc.init = function(){
		layer = new createLayer();
		layerBg = new createLayerBg();
	}
	$.dimPopup_ucc.layerOpen = function( ele ){
		layerBg.open();
		layer.open( ele );
	}
	$.dimPopup_ucc.layerClose = function(){
		layerBg.close();
		layer.close();
	}
	
	$.fn.dimPopup_ucc = function(){
		return this.each(function(){
			
		});
	}
	
	// 레이어생성함수
	function createLayer(){
		var $layer = "";
		
		this.open = function(ele){
			$layer = $(ele);
			$layer.fadeIn("slow");
			this.position();
			$(window).bind("resize.dimPopup_ucc", this.position);
		}
		
		this.close = function(){
			if( $layer ){
				$layer.fadeOut("slow");
				$layer = "";
			}
			$(window).unbind("resize.dimPopup_ucc");
		}
		
		this.position = function(){
			var scrollTop = $(document).scrollTop(),
				scrollLeft = $(document).scrollLeft();
				//t = scrollTop + $(window).height()/2,
				//l = scrollLeft + $(window).width()/2;

			$layer.css({
				position : "fixed",
				top : $(window).height()/2 - $("#ucc").height()/2,
				left : $(window).width()/2 - $("#ucc").width()/2 ,
				zIndex : 9999
			});
		}
	}

	// 배경레이어생성함수
	function createLayerBg(){
		var $bg = $('<div id="dim_bg"></div>')
			.css({
				display : "none",
				position : "fixed", 
				top : 0,
				left : 0,
				width : $(document).width(),
				height : $(document).height(),
				background : "black",
				opacity : .0,
				zIndex : 1000
			})
			.appendTo("body");

		this.open = function(){
			if( $bg.is(':hidden') ){
				$bg.css({ display : "block", opacity : 0 }).animate({ opacity : .6 }, "slow");
				//$("select").css({ visibility : "hidden" });
				
				this.position();
				$(window).bind("resize.dimPopup_uccBg", this.position);
			}
		}
		// 팝업 상태의 닫기 버튼 클릭시 레이어 view 닫힘
		this.close = function(){
			if( $bg.is(':visible') ){
				$bg.fadeOut("slow");
				$//("select").css({ visibility : "" });
			}
			$(window).unbind("resize.dimPopup_uccBg");
		}

		this.position = function(){
			$bg.css({
				top : 0,
				left : 0,
				width : $(document).width(),
				height : $(document).height()
			});
		}
	}


	$(document).ready(function(e) {
		$.dimPopup_ucc.init();
	});
	
})(jQuery);


