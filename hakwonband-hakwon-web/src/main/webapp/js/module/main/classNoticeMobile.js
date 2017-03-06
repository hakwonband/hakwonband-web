/**
 * 반 공지사항 작성 - 수정 - 모바일
 */
hakwonMainApp.controller('classNoticeEditMobileController', function($scope, $location, $window, $routeParams, $timeout, classService, classFactory, CommUtil, $timeout) {
	console.log('hakwonMainApp classNoticeEditMobileController call');

	/*	페이지 초기화 호출	*/
	hakwonCommon.pageInit({isScrollTop:false});

	$("#wrapper").show();

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

	$scope.reply_yn = true;
	$scope.file_view = true;
	$scope.mobile_push_yn = true;

	/*	대상	*/
	$scope.noticeTargetUser 		= '';

	/*	is Mobile	*/
	$scope.isMobile = isMobile.any();

	if (!isNull($routeParams.hakwon_no)) {
		$scope.hakwonNo = $routeParams.hakwon_no;
	} else if (!isNull(hakwonInfo.hakwon_no)) {
		$scope.hakwonNo = hakwonInfo.hakwon_no;
	}

	if (!isNull($routeParams.class_no)) {
		$scope.classNo = $routeParams.class_no;
	}

	/*	공지사항 번호가 존재하면, 공지사항 수정. or 공지사항 등록 처리		*/
	if (!isNull($routeParams.notice_no)) {
		$scope.noticeNo = $routeParams.notice_no;
	} else {
		$scope.isNewNotice = true;
	}

	/*	youtube 삽입	*/
	$scope.youtubeInsert = function() {
		var youtubeID = $('#mainNgView').find('input[name=youtubeID]').val();

		var youtubeHtml = '<p><a href="http://www.youtube.com/watch?v='+youtubeID+'"><img src="http://img.youtube.com/vi/'+youtubeID+'/0.jpg" class="img-responsive" alt="" data-video="youtube" data-id="'+youtubeID+'" /></a></p><p>&nbsp;</p>';
		tinymce.activeEditor.insertContent(youtubeHtml);
		tinymce.activeEditor.focus();
	}

	/*	파일 객체 초기화 및 데이터 호출		*/
	$scope.$$postDigest(function() {
		console.log('noticeEditController $$postDigest');

		/*	반 공지사항 상세정보조회	*/
		$scope.getClassNoticeDetail();

		/*	공지사항 작성시, 카테고리 조회*/
		$scope.getNoticeCateList();

		$timeout(function() {
			if( isMobile.any() && $(window).width()< 1024 ) {
				$(document).scrollTop($('input[data-view=title]').offset().top);
			}
		},50);

		/*	파일 업로드 객체 생성		*/
		if( comm.isAndroidUploader() ) {
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
							}

							$scope.$digest();
						}
					} catch(e) {
						alert('파일 업로드를 실패 했습니다.');
					}
				};
				var param = {
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
				window.PLATFORM.fileChooser(JSON.stringify(param));

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
							}
							$scope.$digest();
						}
					} catch(e) {
						alert('파일 업로드를 실패 했습니다.');
					}
				};
				var param = {
					fileType : 'all'
					, multipleYn : 'Y'
					, callBack : 'uploadCallBack'
					, upload : {
						url : window.location.protocol+'//'+window.location.host+uploadUrl
						, param : {uploadType:CommonConstant.File.TYPE_NOTICE, youtube:'true'}
						, cookie : document.cookie
					}
				};
				window.PLATFORM.fileChooser(JSON.stringify(param));

				return false;
			});
		} else {
			$scope.fileUploadObj = angular.element("input[data-act=file_upload]").html5_upload(classService.getFileUploadOptions($scope, CommonConstant.File.TYPE_NOTICE));

			$scope.fileUploadObj = angular.element("input[data-act=youtube_upload]").html5_upload(classService.getFileUploadOptions($scope, CommonConstant.File.TYPE_NOTICE, 'youtube'));
		}
	});

	/*	공지사항 상세정보 조회	*/
	$scope.getClassNoticeDetail = function() {
		if ($scope.isNewNotice) {
			/*	신규 작성시 에디터 초기화 완료 후 공백 셋팅	*/
			var editOptions = comm.getEditorOptions();
			editOptions.setup = function (ed) {
				ed.on("init", function (ed) {
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
			};
			tinymce.init(editOptions);
			return;
		}
		if (!$scope.isNewNotice && isNull($scope.noticeNo)) {
			alert('공지사항 정보가 올바르지 않습니다.');
			return ;
		}
		CommUtil.ajax({url:contextPath+"/hakwon/noticeDetail.do", param:{notice_no:$scope.noticeNo}, successFun:function(data) {
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
				};
				tinymce.init(editOptions);

				/*	댓글 가능여부 switchery.js를 $scope로 바인딩 및 초기화	*/
				if ($scope.noticeDetail.reply_yn == 'Y') {
					$scope.reply_yn = true;
				} else {
					$scope.reply_yn = false;
				}

				if ($scope.noticeDetail.is_file_view == '1') {
					$scope.file_view = true;
				} else {
					$scope.file_view = false;
				}
			} else {
				commProto.logger({noticeDetailError:data});
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
		params.reply_yn			= $scope.reply_yn ? 'Y' : 'N' ;

		if ($scope.isNewNotice) {
			params.mobile_push_yn	= $scope.mobile_push_yn ? 'Y' : 'N' ;
		}

		params.is_file_view		= $scope.file_view ? '1' : '0' ;
		params.target_user		= $scope.noticeTargetUser;

		params.reservationDate = reservationDate;
		params.reservationTime = reservationTime;

		CommUtil.ajax({url:contextPath+apiUrl, param:params, successFun:function(data) {
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
		tinymce.activeEditor.focus();
	};

	/*	비디오 삽입	*/
	$('#mainNgView').on(clickEvent, 'div.file-box > div.file > div[data-file-type=video]', function() {
		var fileUrl = $(this).attr('data-file-url');
		var videoHtml = hakwonTmpl.common.videoHtml.replace('{{=videoUrl}}', fileUrl);
		tinymce.activeEditor.insertContent(videoHtml);
		tinymce.activeEditor.focus();
	});
	$('#mainNgView').on(clickEvent, 'div.file-box > div.file > div[data-file-type=youtube]', function() {
		var youtubeID = $(this).attr('data-youtube-id');
		var youtubeHtml = '<p><a href="http://www.youtube.com/watch?v='+youtubeID+'"><img src="http://img.youtube.com/vi/'+youtubeID+'/0.jpg" class="img-responsive" alt="" data-video="youtube" data-id="'+youtubeID+'" /></a></p><p>&nbsp;</p>';
		tinymce.activeEditor.insertContent(youtubeHtml);
		tinymce.activeEditor.focus();
	});
	/*	오디오 삽입	*/
	$('#mainNgView').on(clickEvent, 'div.file-box > div.file > div[data-file-type=audio]', function() {
		var fileUrl = $(this).attr('data-file-url');
		var audioHtml = '<p><audio src="'+fileUrl+'" preload="false" controls="true"></audio></p><p>&nbsp;</p>';
		tinymce.activeEditor.insertContent(audioHtml);
		tinymce.activeEditor.focus();
	});

	/*	취소	*/
	$scope.reservationCancel = function() {
		$('input[name=reservationDate]').val('');
		$('input[name=reservationTime]').val('');
	}

	/*	첨부 파일 삭제 처리	*/
	$scope.removeAttachFile = function(fileNo) {
		$scope.fileList = _.filter($scope.fileList, function(item) {
			return item.file_no != fileNo;
		});
	};

	/*	공지사항 등록 - 수정 취소	*/
	$scope.editCancel = function() {
		if ($scope.isNewNotice) {
			$window.location.href = PageUrl.common.classNoticeList+'?hakwon_no=' + $scope.hakwonNo + '&class_no=' + $scope.classNo;
			return false;
		} else {
			$window.location.href = PageUrl.common.classNoticeDetail+'?hakwon_no=' + $scope.hakwonNo + '&class_no=' + $scope.classNo + '&notice_no=' + $scope.noticeNo;
			return false;
		}
	};
});