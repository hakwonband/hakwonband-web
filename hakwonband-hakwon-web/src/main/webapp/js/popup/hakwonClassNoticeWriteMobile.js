hakwonMainApp.service('classService', function(CommUtil) {
	console.log('hakwonMainApp classService call');

	var classService = {};

	/**
	 * 첨부파일 업로드 옵션 생성
	 */
	classService.getFileUploadOptions = function($scope, type, youtube_type) {
		var uploadTypeObj = {
			uploadType	: type
			, hakwonNo	: $scope.hakwonNo
			, classNo	: $scope.classNo
		};

		var msg = '첨부 파일 업로드를 실패 했습니다.';
		if (type == CommonConstant.File.TYPE_CLASS_LOGO) {
			msg = '반 로고 업로드를 실패 했습니다.';
		}

		// 파일 업로드 객체 생성
		var fileUploadOptions = new UploadOptions();
		fileUploadOptions.customExtraFields = uploadTypeObj;
		if( youtube_type == 'youtube' ) {
			fileUploadOptions.customExtraFields.youtube = 'true';
		}
		fileUploadOptions.onFinish = function(event, total) {
			if (this.errorFileArray.length + this.errorCount > 0) {
				alert(msg);
			} else {
				/********************
				 * fileNo
				 * filePath
				 * thumbFilePath
				 * fileName
				 * imageYn
				 ********************/

				/*	반 로고 파일 업로드	*/
				if (type == CommonConstant.File.TYPE_CLASS_LOGO ) {
					for (var i = 0; i < this.uploadFileArray.length; i++) {
						var fileInfo = this.uploadFileArray[i];
						if (fileInfo.imageYn == 'Y') {
							$('img[data-view=class_logo_preview]').attr('src', HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.filePath).attr('data-file-no', fileInfo.fileNo);
						} else {
							alert('이미지 파일이 아닙니다.');
						}
					}
				/*	첨부 파일 업로드	*/
				} else {
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

						if( type != CommonConstant.File.TYPE_CLASS_LOGO && fileInfo.imageYn == 'Y' ) {
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
	 * 반 공지사항 상세조회
	 * @param $scope
	 */
	classService.classNoticeDetail = function($scope) {
		if (isNull($scope.noticeNo)) {
			alert('학원 번호가 올바르지 않습니다.');
			return ;
		}
		CommUtil.ajax({url:contextPath+"/hakwon/noticeDetail.do", param:{notice_no: $scope.noticeNo}, successFun:function(data) {
			try {
				if( data.error ) {
					alert('공지 조회를 실패 했습니다.');
					return ;
				}
				var colData = data.colData;
				if( colData ) {
					$scope.noticeDetail			= colData.noticeDetail;
					$scope.replyList			= colData.replyList;
					$scope.fileList				= colData.fileList;
					$scope.classNoticeReaderList= colData.classNoticeReaderList;

					$scope.all_student_count = 0;
					$scope.read_student_count = 0;
					$scope.all_parent_count = 0;
					$scope.read_parent_count = 0;
					for(var i=0; i<colData.classNoticeReaderList.length; i++) {
						if( colData.classNoticeReaderList[i].user_type == '006' ) {
							$scope.all_student_count++;
							if( colData.classNoticeReaderList[i].read_date ) {
								$scope.read_student_count++;
							}

						} else if( colData.classNoticeReaderList[i].user_type == '005' ) {
							$scope.all_parent_count++;
							if( colData.classNoticeReaderList[i].read_date ) {
								$scope.read_parent_count++;
							}
						}
					}

					setTimeout(function(){
						comm.contentImageReset();
					}, 50);
				} else {
					commProto.logger({hakwonDetailError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/**
	 * 공지사항 작성시, 카테고리 리스트 조회
	 * @param $scope
	 */
	classService.noticeCateList = function($scope) {
		if (isNull($scope.hakwonNo)) {
			alert('학원 정보가 올바르지 않습니다.');
			return ;
		}
		CommUtil.ajax({url:contextPath+"/hakwon/noticeCateList.do", param:{hakwon_no: $scope.hakwonNo}, successFun:function(data) {
			try {
				if( data.error ) {
					alert('공지사항 카테고리 정보 조회를 실패 했습니다.');
					return ;
				}
				var colData = data.colData;
				if( colData.result == CommonConstant.Flag.success ) {
					$scope.noticeCateList = colData.noticeCateList;
				} else {
					alert('Server Response Error : ' + data.status);
					commProto.logger({noticeCateListError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	return classService;
});


/**
 * 학원 공지 쓰기
 */
hakwonMainApp.controller('hakwonClassNoticeWriteController', function($scope, $location, $routeParams, $filter, $timeout, CommUtil, classService) {
	$scope.CommUtil = CommUtil;

	/*	데이터 초기화	*/
	$scope.isNewNotice			= false;
	$scope.hakwonNo 			= '';
	$scope.classNo	 			= '';
	$scope.noticeNo 			= '';
	$scope.noticeDetail			= {};
	$scope.replyList			= [];
	$scope.fileList				= [];

	/*	공지사항 작성시, 카테고리 리스트	*/
	$scope.noticeCateList 		= [];
	$scope.noticeCateItem 		= '';

	/*	대상	*/
	$scope.noticeTargetUser 		= '';

	/*	is Mobile	*/
	$scope.isMobile = isMobile.any();

	if( isNull($routeParams.hakwon_no) || isNull($routeParams.class_no) ) {
		if( window.PLATFORM ) {
			window.history.back(-2);
		} else if( getBrowser() == 'iosApp' ) {
			window.history.back();
		} else {
			window.close();
		}
		return ;
	}
	$scope.hakwonNo = $routeParams.hakwon_no;
	$scope.classNo = $routeParams.class_no;

	/*	공지사항 번호가 존재하면, 공지사항 수정. or 공지사항 등록 처리		*/
	if (!isNull($routeParams.notice_no)) {
		$scope.noticeNo = $routeParams.notice_no;
	} else {
		$scope.isNewNotice = true;
	}

	/*	youtube 삽입	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=youtubeInsert]', function() {
		var youtubeID = $('#mainNgView').find('input[name=youtubeID]').val();

		var youtubeHtml = '<p><a href="http://www.youtube.com/watch?v='+youtubeID+'"><img src="http://img.youtube.com/vi/'+youtubeID+'/0.jpg" class="img-responsive" alt="" data-video="youtube" data-id="'+youtubeID+'" /></a></p><p>&nbsp;</p>';
		tinymce.activeEditor.insertContent(youtubeHtml);
		setTimeout(function(){
			var $contents = $('#'+tinymce.activeEditor.iframeElement.id).contents();
			$contents.scrollTop($contents.height());
			tinymce.activeEditor.focus();
		}, 500);
	});

	/*	파일 객체 초기화 및 데이터 호출		*/
	$scope.$$postDigest(function() {
		console.log('noticeEditController $$postDigest');

		/*	댓글 가능여부 switchery.js를 $scope로 바인딩 및 초기화	*/
		$scope.reply_yn = document.querySelector('input[name=reply_yn]');
		$scope.mobile_push_yn = document.querySelector('input[name=mobile_push_yn]');
		$scope.file_view = document.querySelector('input[name=file_view]');

		/*	반 공지사항 상세정보조회	*/
		$scope.getClassNoticeDetail();

		/*	공지사항 작성시, 카테고리 조회*/
		$scope.getNoticeCateList();

		$timeout(function() {
			/*	데이트 피커	*/
			$('#mainNgView input[name=reservationDate]').datepicker({
				keyboardNavigation: false,
				forceParse: false,
				autoclose: true,
				format: "yyyy-mm-dd"
			});

			if( isMobile.any() && $(window).width()< 1024 ) {
				$(document).scrollTop($('input[data-view=title]').offset().top);
			}
		},50);

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
						, param : {
							uploadType : CommonConstant.File.TYPE_NOTICE
							, hakwonNo : $scope.hakwonNo
							, classNo : $scope.classNo
						}
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

//							$scope.fileList.push(tempObj);

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
			$scope.fileUploadObj = angular.element("input[data-act=file_upload]").html5_upload(classService.getFileUploadOptions($scope, CommonConstant.File.TYPE_NOTICE));

			$scope.youtubeUploadObj = angular.element("input[data-act=youtube_upload]").html5_upload(classService.getFileUploadOptions($scope, CommonConstant.File.TYPE_NOTICE, 'youtube'));
		}
	});

	/*	공지사항 상세정보 조회	*/
	$scope.getClassNoticeDetail = function() {
		if ($scope.isNewNotice) {
			/*	신규 작성시 에디터 초기화 완료 후 공백 셋팅	*/
			var editOptions = comm.getEditorOptions();
			editOptions.setup = function (ed) {
				ed.on("init", function () {
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

			$scope.switchery_reply = new Switchery($scope.reply_yn, { color: '#1AB394' });
			$scope.switchery_mobile_push_yn = new Switchery($scope.mobile_push_yn, { color: '#1AB394' });
			$scope.switchery_file = new Switchery($scope.file_view, { color: '#1AB394' });
			return;
		}
		if (!$scope.isNewNotice && isNull($scope.noticeNo)) {
			alert('공지사항 정보가 올바르지 않습니다.');
			return ;
		}
		CommUtil.ajax({url:contextPath+"/hakwon/noticeDetail.do", param:{notice_no:$scope.noticeNo}, successFun:function(data) {
			try {
				if( data.error ) {
					alert('공지 조회를 실패 했습니다.');
					return ;
				}

				if ($scope.isNewNotice) {
					$scope.noticeDetail.content = ' ';
					tinymce.activeEditor.setContent($scope.noticeDetail.content);
					return;
				}
				var colData = data.colData;
				if( colData.result == CommonConstant.Flag.success ) {
					if( colData.noticeDetail.reservation_date_2 ) {
						colData.noticeDetail.reservation_date_2 = new Date(colData.noticeDetail.reservation_date);
					}
					$scope.noticeDetail			= colData.noticeDetail;
					$scope.replyList			= colData.replyList;
					$scope.fileList				= colData.fileList;

					$scope.noticeTargetUser = $scope.noticeDetail.target_user;

					/*	신규 작성시 에디터 초기화 완료 후 공백 셋팅	*/
					var editOptions = comm.getEditorOptions();
					editOptions.setup = function(ed) {
						ed.on("init", function() {
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

					/*	댓글 가능여부 switchery.js를 $scope로 바인딩 및 초기화	*/
					if( $scope.reply_yn ) {
						if ($scope.noticeDetail.reply_yn == 'N') {
							$scope.reply_yn.checked = false;
						}
						$scope.switchery_reply = new Switchery($scope.reply_yn, { color: '#1AB394' });
					}
					if( $scope.file_view ) {
						if ($scope.noticeDetail.is_file_view == '0') {
							$scope.file_view.checked = false;
						}
						$scope.switchery_file = new Switchery($scope.file_view, { color: '#1AB394' });
					}
				} else {
					commProto.logger({noticeDetailError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/*	공지사항 카테고리 리스트 조회	*/
	$scope.getNoticeCateList = function() {
		classService.noticeCateList($scope);
	};

	/*	공지사항 카테고리 변경시 현재 제목 변경	*/
	$scope.changeNoticeCate = function() {
		var beforeTitle = !isNull($scope.noticeDetail.title) ? $scope.noticeDetail.title : '';
		$scope.noticeDetail.title = '[' + $scope.noticeCateItem.cate_name + '] ' + beforeTitle;
	};

	/*	공지사항 수정 및 등록 처리		*/
	$scope.editConfirm = function() {
		var apiUrl		= '',
			fileNoList	= _.pluck($scope.fileList, 'file_no'),
			params		= {};

		if (isNull($scope.classNo)) {
			alert('반 정보가 올바르지 않습니다.');
			return ;
		}
		if( isNull($scope.noticeDetail.title) ) {
			alert('제목을 입력해 주세요.');
			return ;
		}

		var reservationDate	= $('input[name=reservationDate]').val();
		var reservationTime	= $('input[name=reservationTime]').val();

		if( !isNull(reservationDate) || !isNull(reservationTime) ) {
			if( isNull(reservationDate) || isNull(reservationTime) ) {
				alert('예약 날짜와 시간이 정확하지 않습니다.');
				return ;
			}
		}

		if ($scope.isNewNotice) {
			if (userAuth.userType == '003') {
				apiUrl = '/hakwon/master/registClassNotice.do';
			} else if (userAuth.userType == '004') {
				apiUrl = '/hakwon/teacher/registClassNotice.do';
			}
		} else {
			if (userAuth.userType == '003') {
				apiUrl = '/hakwon/master/editNotice.do';
			} else if (userAuth.userType == '004') {
				apiUrl = '/hakwon/teacher/editClassNotice.do';
			}
		}

		var editContent = tinymce.activeEditor.getContent();
		editContent = editContent.replace(/><\/p>/g, ">&nbsp;</p>");

		params.class_no 		= $scope.classNo;
		params.notice_no 		= $scope.noticeNo;
		params.title 			= $scope.noticeDetail.title;
		params.content 			= editContent;
		params.file_no_list 	= fileNoList.toString();
		params.preview_content 	= params.content.substr(0, 50) + '...';
		params.reply_yn			= $scope.reply_yn.checked ? 'Y' : 'N' ;

		if ($scope.isNewNotice) {
			params.mobile_push_yn	= $scope.mobile_push_yn.checked ? 'Y' : 'N' ;
		}

		params.is_file_view		= $scope.file_view.checked ? '1' : '0' ;
		params.target_user		= $scope.noticeTargetUser;

		params.reservationDate = reservationDate;
		params.reservationTime = reservationTime;

		CommUtil.ajax({url:contextPath+apiUrl, param:params, successFun:function(data) {
			try {
				if( data.error ) {
					alert('공지사항 저장을 실패 했습니다.');
					return ;
				}

				var colData = data.colData;
				if( colData.result == CommonConstant.Flag.success ) {
					alert('공지사항이 저장되었습니다.');
					$scope.editCancel();
				} else {
					commProto.logger({noticeDetailError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
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

	/*	취소	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=reservationCancel]', function() {
		$('input[name=reservationDate]').val('');
		$('input[name=reservationTime]').val('');
	});

	/*	첨부 파일 삭제 처리	*/
	$scope.removeAttachFile = function(fileNo) {
		$scope.fileList = _.filter($scope.fileList, function(item) {
			return item.file_no != fileNo;
		});
	};

	/*	공지사항 등록 - 수정 취소	*/
	$scope.editCancel = function() {
		if ($scope.isNewNotice) {
			if( window.PLATFORM ) {
				window.history.back(-2);
				window.opener.location.hash = '#/class/noticeList?hakwon_no=' + $scope.hakwonNo + '&class_no=' + $scope.classNo;
			} else if( getBrowser() == 'iosApp' ) {
				window.history.back();
			} else {
				window.opener.location.hash = '#/class/noticeList?hakwon_no=' + $scope.hakwonNo + '&class_no=' + $scope.classNo;
				window.close();
			}
			return false;
		} else {
			if( window.PLATFORM ) {
				window.history.back(-2);
				window.opener.location.hash = '#/class/noticeDetail?hakwon_no=' + $scope.hakwonNo + '&class_no=' + $scope.classNo + '&notice_no=' + $scope.noticeNo;
			} else if( getBrowser() == 'iosApp' ) {
				window.history.back();
			} else {
				window.opener.location.hash = '#/class/noticeDetail?hakwon_no=' + $scope.hakwonNo + '&class_no=' + $scope.classNo + '&notice_no=' + $scope.noticeNo;
				window.close();
			}
			return false;
		}
	};
});