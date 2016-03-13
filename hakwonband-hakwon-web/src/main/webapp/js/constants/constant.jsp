<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="
	hakwonband.common.constant.*
	, hakwonband.hakwon.common.constant.*
" %>

var contextPath = '<%=contextPath%>';
var imgPath		= '<%=imgPath%>';
var jsPath		= '<%=jsPath%>';
var cssPath		= '<%=cssPath%>';

var pageModule = {};

var HakwonConstant = <%=HakwonConstant.getConstantJson()%>;
var CommonConstant = <%=CommonConstant.getConstantJson()%>;

/*	upload url	*/
var uploadUrl = contextPath + '/hakwon/upload.do';

/*	angularjs 헤더	*/
var angularHeaders = {'Content-Type':'application/x-www-form-urlencoded', 'X-Requested-With':'XMLHttpRequest'};

/**
 * tinymce 상수
 */
var tinymceConst = {
	plugins : [
		'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker'
		, 'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking'
		, 'table directionality emoticons template textcolor paste fullpage textcolor'
	]
	, toolbar1 : 'fontselect fontsizeselect | bold italic underline strikethrough forecolor backcolor '
		+'| alignleft aligncenter alignright alignjustify | styleselect | bullist numlist | link charmap emoticons | fullscreen | code '
	, toolbar_mobile : 'bold italic underline strikethrough forecolor backcolor alignleft aligncenter alignright alignjustify'
	, valid_elements : 'iframe[width|height|src|frameborder|allowfullscreen|style|data-type],video[width|height|controls],div[align|style],ol,ul,li,dl,dt,dd,table,hr,a[href|target=_blank],em,address,img[src|width|height|data-img-type|data-img-no|data-mce-src|style|class],input,button,select,textarea,table,p[style],h1,h2,h3,h4,h5,h6,tr,th,td[style],thead,tbody,legend,button,select,blockquote,em,span[style],q,i,article,section,br,strong/b,pre[contenteditable|class],audio[src|preload|controls],source[src|type]'
	, extended_valid_elements : "a[name|href|target|title|onclick|target=_blank],img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name|style],table[style|class|border=2|width|cellspacing|cellpadding|bgcolor],colgroup,col[style|width],tbody,tr[style|class],td[style|class|colspan|rowspan|width|height],hr[class|width|size|noshade],font[face|size|color|style],span[class|align|style]"
};
tinymceConst.initOptios = {
	selector: "textarea[data-lib=editor]"
	, inline_styles : true
	, plugins: tinymceConst.plugins
	, valid_elements : tinymceConst.valid_elements
	, extended_valid_elements : tinymceConst.extended_valid_elements
	, apply_source_formatting : true
	, forced_root_block : false
	, force_p_newlines : false
	, force_br_newlines : true
	, mode : "textareas"
	, language : "ko_KR"
	, menubar: false
	, statusbar: true
	, toolbar_items_size: 'small'
	, toolbar1: tinymceConst.toolbar1
	, object_resizing : 'img'
	, webkit_fake_resize : 1
	, paste_preprocess : function(pl, o) {
		console.debug('paste');
	}
	, init_instance_callback : function(inst) {
		console.log('init_instance_callback');
	}
	, convert_urls : 0
	, remove_script_host : 0
};