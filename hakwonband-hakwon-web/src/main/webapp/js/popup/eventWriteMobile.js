/**
 * 학원 공지사항 서비스
 */
hakwonMainApp.service('eventService', function(CommUtil) {
	console.log('hakwonMainApp eventService call');

	var eventService = {};

	/**
	 * 첨부파일 업로드 옵션 생성
	 */
	eventService.getFileUploadOptions = function($scope, type) {
		// 파일 업로드 객체 생성
		var fileUploadOptions = new UploadOptions();
		fileUploadOptions.customExtraFields = {uploadType:CommonConstant.File.TYPE_EVENT};
		if( type == 'youtube' ) {
			fileUploadOptions.customExtraFields.youtube = 'true';
		}
		fileUploadOptions.onFinish = function(event, total) {
			if (this.errorFileArray.length + this.errorCount > 0) {
				alert('첨부파일 업로드를 실패 했습니다.');
			} else {
				/********************
				 * fileNo
				 * filePath
				 * thumbFilePath
				 * fileName
				 * imageYn
				 ********************/

				for (var i = 0; i < this.uploadFileArray.length; i++) {
					var fileInfo = this.uploadFileArray[i];

					// 임시 파일 object
					var tempObj = {
						file_no 			: '',
						file_parent_type	: '',
						file_name			: '',
						save_file_name		: '',
						file_size			: '',
						file_ext_type		: '',
						file_ext			: '',
						file_path_prefix	: '',
						file_path			: '',
						image_yn			: '',
						thumb_file_path		: '',
						reg_date			: ''
					};

					tempObj.file_no		= fileInfo.fileNo;
					tempObj.file_name	= fileInfo.fileName;
					tempObj.file_path	= fileInfo.filePath;
					tempObj.image_yn	= fileInfo.imageYn;
					tempObj.mime_type	= fileInfo.mimeType;
					tempObj.youtube_id	= fileInfo.youtubeId;

					if( fileInfo.imageYn == 'Y' ) {
						$scope.fileList.push(tempObj);

						var fullFilePath = HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.filePath;
						var fileNo = fileInfo.fileNo;
						if( isMobile.any() ) {
							var editWidth = $('[data-lib=editor]').width();
							var strImage = '<p><a href="'+ fullFilePath + '" target="_blank"><img src="'+ fullFilePath + '" width="'+editWidth+'" height="auto" data-img-no="'+fileNo+'" class="img-responsive"></a></p><p>&nbsp;</p>';
						} else {
							var strImage = '<p><a href="'+ fullFilePath + '" target="_blank"><img src="'+ fullFilePath + '" data-img-no="'+fileNo+'" class="img-responsive"></a></p><p>&nbsp;</p>';
						}
						tinymce.activeEditor.insertContent(strImage);
					} else if( tempObj.youtube_id ) {
						var youtubeHtml = '<p><a href="http://www.youtube.com/watch?v='+tempObj.youtube_id+'"><img src="http://img.youtube.com/vi/'+tempObj.youtube_id+'/0.jpg" class="img-responsive" alt="" data-video="youtube" data-id="'+tempObj.youtube_id+'" /></a></p><p>&nbsp;</p>';
						tinymce.activeEditor.insertContent(youtubeHtml);
					} else {
						$scope.fileList.push(tempObj);
					}

					setTimeout(function(){
						var $contents = $('#'+tinymce.activeEditor.iframeElement.id).contents();
						$contents.scrollTop($contents.height());
						tinymce.activeEditor.focus();
					}, 500);
					$scope.$digest();
				}
			}
		};
		return fileUploadOptions;
	};

	/**
	 * 공지사항 상세정보 조회
	 * @param $scope
	 */
	eventService.eventDetail = function($scope, isMobile) {
		if ($scope.isNewEvent) {
			/*	신규 작성시 에디터 초기화 완료 후 공백 셋팅	*/
			var editOptions = comm.getEditorOptions();
			editOptions.setup = function(ed) {
				ed.on("init", function() {
					tinymce.activeEditor.setContent(' ');

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

				ed.addButton('hakwonupload', {
					text: 'file',
					icon: false,
					onclick: function () {
						angular.element("input[data-act=file_upload]").trigger('click');
					}
				});

				ed.addButton('hakwonyoutube', {
					text: 'youtube',
					icon: false,
					onclick: function () {
						angular.element("input[data-act=youtube_upload]").trigger('click');
					}
				});
			};
			tinymce.init(editOptions);

			/*	신규 작성시 스위치 초기화	*/
			$scope.switchery_reply = new Switchery($scope.reply_yn, { color: '#1AB394' });
			$scope.switchery_mobile_push_yn = new Switchery($scope.mobile_push_yn, { color: '#1AB394' });
			$scope.switchery_file = new Switchery($scope.file_view, { color: '#1AB394' });
			return ;
		} else if (!$scope.isNewEvent && isNull($scope.eventNo)) {
			alert('이벤트 정보가 올바르지 않습니다.');
			return ;
		}

		var param = {
			hakwon_no : $scope.hakwonNo
			, event_no : $scope.eventNo
		};

		CommUtil.ajax({url:contextPath+"/hakwon/event/view.do", param:param, successFun:function(data) {
			var colData = data.colData;
			if( colData.result == CommonConstant.Flag.success ) {
				if( colData.noticeDetail.reservation_date_2 ) {
					colData.noticeDetail.reservation_date_2 = new Date(colData.noticeDetail.reservation_date);
				}

				if( colData.eventInfo.recommend_yn == 'Y' ) {
					if( !colData.recommendList ) {
						colData.recommendList = [];
					}
				}

				$scope.fileList				= colData.fileList;

				/*	에디터 초기화 완료 후 value 셋팅	*/
				var editOptions = comm.getEditorOptions();
				editOptions.setup = function(ed) {
					ed.on("init", function(ed) {
						if (!_.isUndefined(colData.noticeDetail.content) && colData.noticeDetail.content) {
							tinymce.activeEditor.setContent(colData.noticeDetail.content);
						} else {
							tinymce.activeEditor.setContent(' ');
						}
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

					ed.addButton('hakwonupload', {
						text: 'file',
						icon: false,
						onclick: function () {
							angular.element("input[data-act=file_upload]").trigger('click');
						}
					});

					ed.addButton('hakwonyoutube', {
						text: 'youtube',
						icon: false,
						onclick: function () {
							angular.element("input[data-act=youtube_upload]").trigger('click');
						}
					});
				};
				tinymce.init(editOptions);
			} else {
				commProto.logger({eventDetailError:data});
			}
		}});
	};

	return eventService;
});


/**
 * 이벤트 쓰기
 */
hakwonMainApp.controller('eventWriteController', function($scope, $location, $routeParams, $filter, $window, CommUtil, eventService) {
	console.log('eventWriteController call~~~');

	$scope.CommUtil = CommUtil;

	/*	is Mobile	*/
	$scope.isMobile = isMobile.any();

	/*	초기화	*/
	{
		/*	데이터 초기화	*/
		$scope.isNewEvent			= false;
		$scope.hakwonNo 			= '';
		$scope.eventNo 				= '';
		$scope.eventDetail			= {
			start_date : null,
			end_date : null
		};
		$scope.replyList			= [];
		$scope.fileList				= [];

		$scope.mobile_push_yn = true;

		/* 권한 체크 기능	*/
		$scope.checkAuthType = comm.checkAuthType;

		if( isNull($routeParams.hakwon_no) ) {
			window.history.back();
			return ;
		}
		$scope.hakwonNo = $routeParams.hakwon_no;

		/*	공지사항 번호가 존재하면, 공지사항 수정. or 공지사항 등록 처리		*/
		if (!isNull($routeParams.notice_no)) {
			$scope.eventNo = $routeParams.notice_no;
		} else {
			$scope.isNewEvent = true;
		}
	}

	/*	공지사항 상세정보 조회	*/
	$scope.getEventDetail = function() {
		eventService.eventDetail($scope, true);
	};

	/*	공지사항 수정 및 등록 처리		*/
	$scope.editConfirm = function() {
		var apiUrl		= '',
			fileNoList	= _.pluck($scope.fileList, 'file_no'),
			params		= {};


		var reservationDate	= $('input[name=reservationDate]').val();
		var reservationTime	= $('input[name=reservationTime]').val();

		if (isNull($scope.hakwonNo)) {
			alert('학원 정보가 올바르지 않습니다.');
			return ;
		}
		if( isNull($scope.eventDetail.title) ) {
			alert('제목을 입력해 주세요.');
			return ;
		}

		if( !isNull(reservationDate) || !isNull(reservationTime) ) {
			if( isNull(reservationDate) || isNull(reservationTime) ) {
				alert('예약 날짜와 시간이 정확하지 않습니다.');
				return ;
			}
		}

		if ($scope.isNewEvent) {
			apiUrl = '/hakwon/master/registEvent.do';
		} else {
			apiUrl = '/hakwon/master/editEvent.do'
		}

		var editContent = tinymce.activeEditor.getContent();
		editContent = editContent.replace(/><\/p>/g, ">&nbsp;</p>");

		params.hakwon_no 		= $scope.hakwonNo;
		params.event_no 		= $scope.eventNo;
		params.title 			= $scope.eventDetail.title;
		params.content 			= editContent;
		params.file_no_list 	= fileNoList.toString();
		params.preview_content 	= params.content.substr(0, 50) + '...';

		CommUtil.ajax({url:contextPath+apiUrl, param:params, successFun:function(data) {
			var colData = data.colData;
			if( colData.result == CommonConstant.Flag.success ) {
				alert('이벤트가 저장되었습니다.');
				$scope.editCancel();
			} else {
				commProto.logger({eventDetailError:data});
			}
		}});
	};

	/*	첨부파일 이미지 경로 처리	*/
	$scope.getAttachFileFullPath = function(filePath, fileType) {
		if( !fileType ) fileType = 'attachment';
		return CommUtil.createFileFullPath(filePath, fileType);
	};

	/*	첨부파일 10개 제한 처리	*/
	$scope.checkMaxFileCnt = function(e) {
		if ($scope.fileList.length >= 10) {
			alert('첨부파일은 10개까지만 등록이 가능합니다.');
			e.preventDefault();
			return false;
		}
	};

	/*	이미지 클릭시 에디터에 이미지 첨부	*/
	$scope.insertImageToEditor = function(filePath, fileNo) {
		var fullFilePath = $scope.getAttachFileFullPath(filePath);

		if( isMobile.any() ) {
			var editWidth = $('[data-lib=editor]').width();
			var strImage = '<p><a href="'+ fullFilePath + '" target="_blank"><img src="'+ fullFilePath + '" width="'+editWidth+'" height="auto" data-img-no="'+fileNo+'" class="img-responsive"></a></p><p>&nbsp;</p>';
		} else {
			var strImage = '<p><a href="'+ fullFilePath + '" target="_blank"><img src="'+ fullFilePath + '" data-img-no="'+fileNo+'" class="img-responsive"></a></p><p>&nbsp;</p>';
		}
		tinymce.activeEditor.insertContent(strImage);
		setTimeout(function(){
			var $contents = $('#'+tinymce.activeEditor.iframeElement.id).contents();
			$contents.scrollTop($contents.height());
			tinymce.activeEditor.focus();
		}, 500);
	};

	/*	비디오 삽입	*/
	$('#mainNgView').on(clickEvent, 'div.file-box > div.file > div[data-file-type=video]', function() {
		var fileUrl = $(this).attr('data-file-url');
		var videoHtml = hakwonTmpl.common.videoHtml.replace('{{=videoUrl}}', fileUrl);
		tinymce.activeEditor.insertContent(videoHtml);
		setTimeout(function(){
			var $contents = $('#'+tinymce.activeEditor.iframeElement.id).contents();
			$contents.scrollTop($contents.height());
			tinymce.activeEditor.focus();
		}, 500);
	});

	$('#mainNgView').on(clickEvent, 'div.file-box > div.file > div[data-file-type=youtube]', function() {
		var youtubeID = $(this).attr('data-youtube-id');
		var youtubeHtml = '<p><a href="http://www.youtube.com/watch?v='+youtubeID+'"><img src="http://img.youtube.com/vi/'+youtubeID+'/0.jpg" class="img-responsive" alt="" data-video="youtube" data-id="'+youtubeID+'" /></a></p><p>&nbsp;</p>';
		tinymce.activeEditor.insertContent(youtubeHtml);
		setTimeout(function(){
			var $contents = $('#'+tinymce.activeEditor.iframeElement.id).contents();
			$contents.scrollTop($contents.height());
			tinymce.activeEditor.focus();
		}, 500);
	});

	/*	오디오 삽입	*/
	$('#mainNgView').on(clickEvent, 'div.file-box > div.file > div[data-file-type=audio]', function() {
		var fileUrl = $(this).attr('data-file-url');
		var audioHtml = '<p><audio src="'+fileUrl+'" preload="false" controls="true"></audio></p><p>&nbsp;</p>';
		tinymce.activeEditor.insertContent(audioHtml);
		setTimeout(function(){
			var $contents = $('#'+tinymce.activeEditor.iframeElement.id).contents();
			$contents.scrollTop($contents.height());
			tinymce.activeEditor.focus();
		}, 500);
	});

	/*	첨부 파일 삭제 처리	*/
	$scope.removeAttachFile = function(fileNo) {
		$scope.fileList = _.filter($scope.fileList, function(item) {
			return item.file_no != fileNo;
		});
	};

	/*	공지사항 등록 - 수정 취소	*/
	$scope.editCancel = function() {
		window.history.back();
		return false;
	};

	/*	youtube 삽입	*/
	$scope.youtubeID = '';
	$scope.youtubeInsert = function() {
		var youtubeID = $scope.youtubeID;

		var youtubeHtml = '<p><a href="http://www.youtube.com/watch?v='+youtubeID+'"><img src="http://img.youtube.com/vi/'+youtubeID+'/0.jpg" class="img-responsive" alt="" data-video="youtube" data-id="'+youtubeID+'" /></a></p><p>&nbsp;</p>';
		tinymce.activeEditor.insertContent(youtubeHtml);
		setTimeout(function(){
			var $contents = $('#'+tinymce.activeEditor.iframeElement.id).contents();
			$contents.scrollTop($contents.height());
			tinymce.activeEditor.focus();
		}, 500);
	}

	/*	파일 객체 초기화 및 데이터 호출		*/
	$scope.$$postDigest(function(){
		/*	학원 공지사항 상세정보조회	*/
		$scope.getEventDetail();

		/*	파일 업로드 객체 생성		*/
		if( window.PLATFORM ) {
			angular.element("input[data-act=file_upload]").click(function() {
				delete window.uploadCallBack;
				window.uploadCallBack = function(uploadJsonStr) {
					try {
						var resultObj = JSON.parse(uploadJsonStr);
						if( resultObj.error ) {
							alert('파일 업로드를 실패 했습니다.');
						} else {
							var fileInfo = resultObj.colData;
							var tempObj = {};
							tempObj.file_no		= fileInfo.fileNo;
							tempObj.file_name	= fileInfo.fileName;
							tempObj.file_path	= fileInfo.filePath;
							tempObj.image_yn	= fileInfo.imageYn;
							tempObj.mime_type	= fileInfo.mimeType;

							$scope.fileList.push(tempObj);

							if( fileInfo.imageYn == 'Y' ) {
								var fullFilePath = HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.filePath;
								var fileNo = fileInfo.fileNo;

								if( isMobile.any() ) {
									var editWidth = $('[data-lib=editor]').width();
									var strImage = '<p><a href="'+ fullFilePath + '" target="_blank"><img src="'+ fullFilePath + '" width="'+editWidth+'" height="auto" data-img-no="'+fileNo+'" class="img-responsive"></a></p><p>&nbsp;</p>';
								} else {
									var strImage = '<p><a href="'+ fullFilePath + '" target="_blank"><img src="'+ fullFilePath + '" data-img-no="'+fileNo+'" class="img-responsive"></a></p><p>&nbsp;</p>';
								}
								tinymce.activeEditor.insertContent(strImage);
								setTimeout(function(){
									var $contents = $('#'+tinymce.activeEditor.iframeElement.id).contents();
									$contents.scrollTop($contents.height());
									tinymce.activeEditor.focus();
								}, 500);
							}

							$scope.$digest();
						}
					} catch(e) {
						alert('파일 업로드를 실패 했습니다.');
					}
				};
				var fileParam = {
					fileType : 'all'
					, multipleYn : 'Y'
					, callBack : 'uploadCallBack'
					, upload : {
						url : window.location.protocol+'//'+window.location.host+uploadUrl
						, param : {uploadType:CommonConstant.File.TYPE_NOTICE}
						, cookie : document.cookie
					}
				};
				window.PLATFORM.fileChooser(JSON.stringify(fileParam));

				return false;
			});

			angular.element("input[data-act=youtube_upload]").click(function() {
				delete window.uploadCallBack;
				window.uploadCallBack = function(uploadJsonStr) {
					try {
						var resultObj = JSON.parse(uploadJsonStr);
						if( resultObj.error ) {
							alert('파일 업로드를 실패 했습니다.');
						} else {
							var fileInfo = resultObj.colData;
							var tempObj = {};
							tempObj.file_no		= fileInfo.fileNo;
							tempObj.file_name	= fileInfo.fileName;
							tempObj.file_path	= fileInfo.filePath;
							tempObj.image_yn	= fileInfo.imageYn;
							tempObj.mime_type	= fileInfo.mimeType;
							tempObj.youtube_id	= fileInfo.youtubeId;

							//$scope.fileList.push(tempObj);

							if( tempObj.youtube_id ) {
								var youtubeHtml = '<p><a href="http://www.youtube.com/watch?v='+tempObj.youtube_id+'"><img src="http://img.youtube.com/vi/'+tempObj.youtube_id+'/0.jpg" class="img-responsive" alt="" data-video="youtube" data-id="'+tempObj.youtube_id+'" /></a></p><p>&nbsp;</p>';
								tinymce.activeEditor.insertContent(youtubeHtml);
								setTimeout(function(){
									var $contents = $('#'+tinymce.activeEditor.iframeElement.id).contents();
									$contents.scrollTop($contents.height());
									tinymce.activeEditor.focus();
								}, 500);
							}
							$scope.$digest();
						}
					} catch(e) {
						alert('파일 업로드를 실패 했습니다.');
					}
				};
				var youtubeParam = {
					fileType : 'all'
					, multipleYn : 'Y'
					, callBack : 'uploadCallBack'
					, upload : {
						url : window.location.protocol+'//'+window.location.host+uploadUrl
						, param : {uploadType:CommonConstant.File.TYPE_NOTICE, youtube:'true'}
						, cookie : document.cookie
					}
				};
				window.PLATFORM.fileChooser(JSON.stringify(youtubeParam));

				return false;
			});
		} else {
			$scope.fileUploadObj = angular.element("input[data-act=file_upload]").html5_upload(eventService.getFileUploadOptions($scope));

			$scope.youtubeUploadObj = angular.element("input[data-act=youtube_upload]").html5_upload(eventService.getFileUploadOptions($scope, 'youtube'));
		}
	});
});