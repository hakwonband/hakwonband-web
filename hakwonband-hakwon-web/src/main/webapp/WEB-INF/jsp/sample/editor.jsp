<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>샘플 입니다.</title>

	<%@ include file="/WEB-INF/jsp/include/commonHeader.jspf" %>
	<script type="text/javascript" src="<%=jsPath%>/lib/bumworld.html5.upload.js"></script>

<script type="text/javascript">
</script>

</head>
<body>

<button type="button" onclick="getContent()">조회</button>
<button type="button" onclick="insertContent()">컨텐츠 삽입</button>
<button type="button" onclick="setContent()">컨텐츠 불러오기</button>
<button type="button" onclick="getContent()">컨텐츠 내용 보기(console에서)</button>
<input id="content_file_upload" type="file" multiple>
<textarea data-lib="editor" rows="10" cols="100" style="width:100%; height:412px;"></textarea>
<script type="text/javascript">
	window.onload = function() {
		editorLoad();

		/*********
		 * 파일 업로드 구현
		 *********/
		var contentUploadOptions = new UploadOptions();
		/*	form 파라미터	*/
		contentUploadOptions.customExtraFields = {content_type:'002'};
		contentUploadOptions.onStart = function(event, total) {
			console.log('onStart');
			this.errorCount = 0;
			return true;
		};
		contentUploadOptions.onProgress = function(event, progress, name, number, total) {
			console.log('onProgress', name, number);
		};
		contentUploadOptions.setName = function(text) {
			console.log('setName', text);
		};
		contentUploadOptions.setStatus = function(text) {
			console.log('setStatus', text);
		};
		contentUploadOptions.setProgress = function(val) {
			console.log("val : " + val);
		};
		contentUploadOptions.onFinishOne = function(event, response, name, number, total) {
			console.log('response : ' + response);
/*
			var responseJson = JSON.parse(response);
			if( responseJson.flag == 'success' ) {
				contentFileArray.push(responseJson.file_no);

				var writeHtml = '';
				if( responseJson.image_yn == 'Y' ) {
					writeHtml += '<li class="o" data-file-no="'+responseJson.file_no+'">';
					writeHtml += '	<img src="'+HakwonConstant.FileServer.DOWN_URL+'/attatch/thumb/'+responseJson.file_no+'" alt="'+responseJson.file_name+'">';
					writeHtml += '	<button type="button" data-role="remove">삭제</button>';
					writeHtml += '</li>';
					$('#writeForm ul[data-role=content_img]').append(writeHtml);
				} else {
					writeHtml += '<li class="o" data-file-no="'+responseJson.file_no+'">';
					writeHtml += '	<i class="fa fa-paperclip"></i> <span class="fn">'+responseJson.file_name+'</span>';
					writeHtml += '	<button type="button" data-role="remove">삭제</button>';
					writeHtml += '</li>';
					$('#writeForm ul[data-role=content_file]').append(writeHtml);
				}
			} else {
				/ *	실패	* /
				console.error('responseJson', responseJson);
				this.errorCount++;
			}
*/
		};
		contentUploadOptions.onError = function(event, name, error) {
			alert('error while uploading file ' + name);
		};
		$("#content_file_upload").html5_upload(contentUploadOptions);
	};

	function editorLoad() {
		var tinymceConstInitOptios = jQuery.extend(true, {}, tinymceConst.initOptios);
		tinymceConstInitOptios.setup = function(ed) {
			ed.on('LoadContent', function(e) {
				console.log('LoadContent event', e);
			}).on('init', function(e) {
				console.log('LoadContent init', e);
			}).on('KeyDown', function(e) {
				var thisEditor = this;
				var keyCode = undefined;
				if (e.keyCode) keyCode = e.keyCode;
				else if (e.which) keyCode = e.which;

				if(keyCode == 9 && !e.altKey && !e.ctrlKey) {
					if (e.shiftKey) {
						thisEditor.execCommand('Outdent');
					} else {
						thisEditor.execCommand('Indent');
					}

					return tinymce.dom.Event.cancel(e);
				}
			});
		};
		tinymce.init(tinymceConstInitOptios);
	}

	/**
	 * 에디터 정보 조회
	 **/
	function getContent() {
		var contentHtml = tinymce.activeEditor.getContent();
		console.log(contentHtml);
	}

	/**
	 * 에디터에 내용 삽입
	 *
	 **/
	function insertContent() {
		var insertHtml = "<img src='http://bumworld.dayindayout.co.kr/wp-content/uploads/2014/07/IMG_6565.jpg' data-img-type='attch_img' data-img-no='1000'>";
		tinymce.activeEditor.insertContent(insertHtml);
	}

	/**
	 * 에디터에 데이타 불러오기
	 **/
	function setContent() {
		tinymce.activeEditor.setContent('불러오는 신규 컨텐츠 입니다.');
	}
</script>
</body>
</html>