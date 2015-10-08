/**
 * 시작 구분자
 */
var CH_STX = String.fromCharCode('0x02');
/**
 * 데이터 항목 구분자
 */
var CH_DEL = String.fromCharCode('0x0B');
/**
 * 그룹 구분자
 */
var CH_GRP = String.fromCharCode('0x12');
/**
 * 종료 구분자
 */
var CH_ETX = String.fromCharCode('0x03');


/**
 * tinymce 상수
 */
var tinymceConst = {
	plugins : [
		'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker'
		, 'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking'
		, 'table contextmenu directionality emoticons template textcolor paste fullpage textcolor'
	]
	, toolbar1 : 'fontselect fontsizeselect | bold italic underline strikethrough forecolor backcolor '
		+'| alignleft aligncenter alignright alignjustify | styleselect | bullist numlist | link charmap emoticons | code '
	, valid_elements : 'div[align|style],ol,ul,li,dl,dt,dd,table,hr,a[href|target=_blank],em,address,img[src|width|height|data-img-type|data-img-no|data-mce-src|style],input,button,select,textarea,table,p,h1,h2,h3,h4,h5,h6,tr,th,td[style],thead,tbody,legend,button,select,blockquote,em,span[style],q,i,article,section,br,strong/b,pre[contenteditable|class]'
};
tinymceConst.initOptios = {
	selector: "textarea[data-lib=editor]"
	, inline_styles : true
	, plugins: tinymceConst.plugins
	, valid_elements : tinymceConst.valid_elements
	, apply_source_formatting : true
	, forced_root_block : false
	, mode : "textareas"
	, language : "ko_KR"
	, menubar: false
	, statusbar: false
	, toolbar_items_size: 'small'
	, toolbar1: tinymceConst.toolbar1
	, object_resizing : 'img'
	, webkit_fake_resize : 1
	, paste_preprocess : function(pl, o) {
		console.debug('paste');
	}
};

/**
 * 스토리지 상수
 */
var storageConst = {
	upload_max_size : 1024*300
};