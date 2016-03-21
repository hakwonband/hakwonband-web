/**
 * 학원 공지사항 서비스
 */
hakwonMainApp.service('noticeService', function(CommUtil) {
	console.log('hakwonMainApp noticeService call');

	var noticeService = {};

	/**
	 * 첨부파일 업로드 옵션 생성
	 */
	noticeService.getFileUploadOptions = function($scope) {
		// 파일 업로드 객체 생성
		var fileUploadOptions = new UploadOptions();
		fileUploadOptions.customExtraFields = {uploadType:CommonConstant.File.TYPE_NOTICE};
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

					$scope.fileList.push(tempObj);
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
	noticeService.noticeDetail = function($scope) {
		if ($scope.isNewNotice) {
			/*	신규 작성시 에디터 초기화 완료 후 공백 셋팅	*/
			var editOptions = comm.getEditorOptions();
			editOptions.setup = function(ed) {
				ed.on("init", function(ed) {
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

			/*	신규 작성시 스위치 초기화	*/
			$scope.switchery = new Switchery($scope.elem, { color: '#1AB394' });
			return ;
		} else if (!$scope.isNewNotice && isNull($scope.noticeNo)) {
			alert('공지사항 정보가 올바르지 않습니다.');
			return ;
		}
		CommUtil.ajax({url:contextPath+"/hakwon/noticeDetail.do", param:{notice_no:$scope.noticeNo}, successFun:function(data) {
			try {
				var colData = data.colData;
				if( colData.result == CommonConstant.Flag.success ) {
					if( colData.noticeDetail.reservation_date_2 ) {
						colData.noticeDetail.reservation_date_2 = new Date(colData.noticeDetail.reservation_date);
					}

					$scope.noticeDetail			= colData.noticeDetail;
					$scope.replyList			= colData.replyList;
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
					};
					tinymce.init(editOptions);

					/*	댓글 가능여부 switchery.js를 $scope로 바인딩 및 초기화	*/
					if( $scope.elem ) {
						if ($scope.noticeDetail.reply_yn == 'N') {
							$scope.elem.checked = false;
						}
						$scope.switchery = new Switchery($scope.elem, { color: '#1AB394' });
					}

				} else {
					commProto.logger({noticeDetailError:data});
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
	noticeService.noticeCateList = function($scope) {
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
					//$scope.noticeCateItem = $scope.noticeCateList.length > 0 ? $scope.noticeCateList[0] : '';
				} else {
					alert('Server Response Error : ' + data.status);
					commProto.logger({noticeCateListError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/**
	 * 리플 삭제
	 */
	noticeService.replyDelete = function(reply_no, $scope) {
		if( window.confirm('리플을 삭제 하시겠습니까?') ) {
			CommUtil.ajax({url:contextPath+"/hakwon/reply/removeReply.do", param:{reply_no:reply_no}, successFun:function(data) {
				try {
					if( data.error ) {
						alert('리플 삭제를 실패 했습니다.');
						return false;
					}

					var colData = data.colData;
					if( colData.result == CommonConstant.Flag.success ) {
						$scope.replyList = _.reject($scope.replyList, {reply_no : reply_no});
					} else {
						alert('리플 삭제를 실패 했습니다.');
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		}
	};

	return noticeService;
});


/**
 * 학원 공지사항 리스트 컨트롤러
 */
hakwonMainApp.controller('noticeListController', function($scope, $location, $window, $routeParams, noticeService, CommUtil) {
	console.log('hakwonMainApp noticeListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'공지'}]);

		/*	is Mobile	*/
		$scope.isMobile = isMobile.any();

		/*	초기화	*/
		$scope.$on('$viewContentLoaded', function() {
			console.log('noticeListController $viewContentLoaded');

			if (!isNull($routeParams.hakwon_no)) {
				$scope.hakwonNo = $routeParams.hakwon_no;
			} else if (!isNull(hakwonInfo.hakwon_no)) {
				$scope.hakwonNo = hakwonInfo.hakwon_no;
			}

			$scope.noticeList 			= [];
			$scope.noticeListTotCount	= 0;
			$scope.page = $routeParams.page;
			if( isNull($scope.page) ) {
				$scope.page = 1;
			}

			/* 권한 체크 기능	*/
			$scope.checkAuthType		= comm.checkAuthType;

			/*	등록일 기준 신규 컨텐츠 체크	*/
			$scope.isNewItem			= comm.isNewItem;

			/*	학원 공지사항 리스트 정보조회	*/
			$scope.getNoticeList($scope.page);
		});

		/*	공지사항 리스트 조회	*/
		$scope.getNoticeList = function(pageNo) {
			if (isNull($scope.hakwonNo)) {
				alert('학원 정보가 올바르지 않습니다.');
				return ;
			}
			var params = {hakwon_no:$scope.hakwonNo, page_no: !isNull(pageNo) ? pageNo : 1};
			CommUtil.ajax({url:contextPath+"/hakwon/hakwonNoticeList.do", param: params, successFun:function(data) {
				try {
					var colData = data.colData;
					if( colData ) {
						$scope.noticeList			= CommUtil.createNewContent(colData.noticeList);
						$scope.noticeListTotCount	= colData.noticeListTotCount;
						$scope.pageInfo = CommUtil.getPagenationInfo(colData.noticeListTotCount, colData.pageScale, DefaultInfo.pageScale, $scope.page);

						$location.search('page', pageNo);
					} else {
						commProto.logger({hakwonNoticeListError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/*	페이지네이션 페이지 이동	*/
		$scope.movePage = function(page) {
			if ($scope.page === page) {
				return;
			}
			$scope.page = page;
			$scope.getNoticeList($scope.page);
		};

		/*	공지사항 등록 이동	*/
		$scope.goNoticeEdit = function() {
			$window.location.href = PageUrl.notice.edit+'?hakwon_no=' + $scope.hakwonNo;
		};

		/*	공지사항 상세 이동	*/
		$scope.goNoticeDetail = function(item) {
			$window.location.href = PageUrl.common.noticeDetail+'?hakwon_no=' + $scope.hakwonNo + '&notice_no=' + item.notice_no + '&page='+$scope.page;
		};

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 학원 공지사항 상세정보 컨트롤러
 */
hakwonMainApp.controller('noticeDetailController', function($scope, $location, $window, $routeParams, noticeService, CommUtil) {
	console.log('hakwonMainApp noticeDetailController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.common.noticeList+'?hakwon_no='+hakwonInfo.hakwon_no, title:'공지'}, {url:'#', title:'상세'}]);

		/*	데이터 초기화	*/
		$scope.hakwonNo 			= '';
		$scope.noticeNo 			= '';
		$scope.noticeDetail			= {};
		$scope.replyList			= [];
		$scope.fileList				= [];

		$scope.CommUtil = CommUtil;

		$scope.userAuth = userAuth;

		/* 권한 체크 기능	*/
		$scope.checkAuthType		= comm.checkAuthType;

		if (!isNull($routeParams.hakwon_no)) {
			$scope.hakwonNo = $routeParams.hakwon_no;
		} else if (!isNull(hakwonInfo.hakwon_no)) {
			$scope.hakwonNo = hakwonInfo.hakwon_no;
		}

		if (!isNull($routeParams.notice_no)) {
			$scope.noticeNo = $routeParams.notice_no;
		}

		$scope.page = $routeParams.page;
		if( isNull($scope.page) ) {
			$scope.page = 1;
		}

		$scope.replyInfo = {
			content_type		: '001',
			content_parent_no 	: $scope.noticeNo,
			reply_content		: '',
			title				: ''
		};

		/*	공지사항 상세정보 조회	*/
		$scope.getNoticeDetail = function() {
			if (isNull($scope.noticeNo)) {
				alert('공지사항 정보가 올바르지 않습니다.');
				return ;
			}
			CommUtil.ajax({url:contextPath+"/hakwon/noticeDetail.do", param:{notice_no:$scope.noticeNo}, successFun:function(data) {
				try {
					var colData = data.colData;
					if( colData.result == CommonConstant.Flag.success ) {
						$scope.noticeDetail			= colData.noticeDetail;
						$scope.replyList			= colData.replyList;
						$scope.fileList				= colData.fileList;

						setTimeout(function(){
							comm.contentImageReset();
						}, 50);
					} else {
						commProto.logger({noticeDetailError:data});
					}

					/*	video html replace	*/
					$scope.$$postDigest(comm.videoTagReplace);
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/*	공지사항 삭제하기	*/
		$scope.removeNotice = function() {
			if (isNull($scope.noticeNo)) {
				alert('공지사항 정보가 올바르지 않습니다.');
				return ;
			}
			if(confirm('공지사항을 삭제하시겠습니까?')) {
				CommUtil.ajax({url:contextPath+"/hakwon/master/removeNotice.do", param:{notice_no:$scope.noticeNo}, successFun:function(data) {
					try {
						var colData = data.colData;
						if( colData.result == CommonConstant.Flag.success ) {
							alert('공지사항을 삭제하였습니다.');
							$scope.goNoticeList();
						} else {
							commProto.logger({  Error:data});
						}
					} catch(ex) {
						commProto.errorDump({errorObj:ex});
					}
				}});
			}
		};

		/**
		 * 신규 댓글 조회, replyNo : 해당 댓글번호 이후것을 조회
		 * @param replyNo
		 */
		$scope.getNewReplyList = function(lastReply) {
			if (isNull($scope.noticeNo)) {
				alert('공지사항 정보가 올바르지 않습니다.');
				return ;
			}
			var params = {};
			params.content_type = '001';
			params.content_parent_no = $scope.noticeNo;
			params.reply_no = lastReply.reply_no;
			CommUtil.ajax({url:contextPath+'/hakwon/reply/newReplyList.do', param:params, successFun:function(data) {
				try {
					var colData = data.colData;
					if( colData.result = 'success' ) {
						$scope.replyList = _.uniq($scope.replyList.concat(colData.replyList));
					} else {
						alert('댓글 등록에 실패하였습니다. 잠시 후 다시 시도해주시기 바랍니다.');
						commProto.logger({removeReplyError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/**
		 * 댓글 등록
		 */
		$scope.registReplyContent = function() {
			if (isNull($scope.replyInfo.content_parent_no)) {
				alert('공지사항 정보가 올바르지 않습니다.');
				return ;
			}
			if (isNull($scope.replyInfo.reply_content)) {
				alert('댓글을 입력해 주세요.');
				return ;
			}
			CommUtil.ajax({url:contextPath+'/hakwon/reply/registReply.do', param:$scope.replyInfo, successFun:function(data) {
				try {
					if( data.colData.result = 'success' ) {
						$scope.replyInfo.reply_content = '';
						var lastReply = {reply_no: 0};
						if ($scope.replyList.length > 0) {
							lastReply = _.last($scope.replyList);
						}
						$scope.getNewReplyList(lastReply);
					} else {
						alert('댓글 등록에 실패하였습니다. 잠시 후 다시 시도해주시기 바랍니다.');
						commProto.logger({removeReplyError:data});
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

		/*	프로필 사진 경로 처리		*/
		$scope.getPhotoFileFullPath = function(filePath) {
			return CommUtil.createFileFullPath(filePath, 'photo');
		};

		/*	첨부파일 이미지 경로 처리	*/
		$scope.getUserGender = function(gender) {
			return CommUtil.createGenderName(gender);
		};

		/*	공지사항 수정하기 이동	*/
		$scope.goNoticeEdit = function() {
			$window.location.href = PageUrl.notice.edit+'?hakwon_no=' + $scope.hakwonNo + '&notice_no=' + $scope.noticeNo;
		};

		/*	공지사항 목록이동	*/
		$scope.goNoticeList = function() {
			$window.location.href = PageUrl.common.noticeList+'?hakwon_no=' + $scope.hakwonNo + '&page='+$scope.page;
		};

		/*	리플 삭제	*/
		$scope.replyDelete = function(replyNo) {
			noticeService.replyDelete(replyNo, $scope);
		};

		/*	공지사항 상세정보 조회	*/
		$scope.getNoticeDetail();

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 학원 공지사항 작성 - 수정
 */
hakwonMainApp.controller('noticeEditController', function($scope, $location, $window, $routeParams, noticeService, CommUtil, $timeout) {
	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit({isScrollTop:false});

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.common.noticeList+'?hakwon_no='+hakwonInfo.hakwon_no, title:'공지'}, {url:'#', title:'수정'}]);

		$("#wrapper").show();

		$scope.CommUtil = CommUtil;

		/*	is Mobile	*/
		$scope.isMobile = isMobile.any();

		/*	공지사항 상세정보 조회	*/
		$scope.getNoticeDetail = function() {
			noticeService.noticeDetail($scope);
		};

		/*	공지사항 카테고리 리스트 조회	*/
		$scope.getNoticeCateList = function() {
			noticeService.noticeCateList($scope);
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


			var reservationDate	= $('input[name=reservationDate]').val();
			var reservationTime	= $('input[name=reservationTime]').val();

			if (isNull($scope.hakwonNo)) {
				alert('학원 정보가 올바르지 않습니다.');
				return ;
			}
			if( isNull($scope.noticeDetail.title) ) {
				alert('제목을 입력해 주세요.');
				return ;
			}

			if( !isNull(reservationDate) || !isNull(reservationTime) ) {
				if( isNull(reservationDate) || isNull(reservationTime) ) {
					alert('예약 날짜와 시간이 정확하지 않습니다.');
					return ;
				}
			}

			if ($scope.isNewNotice) {
				apiUrl = '/hakwon/master/registHakwonNotice.do';
			} else {
				apiUrl = '/hakwon/master/editNotice.do'
			}

			var editContent = tinymce.activeEditor.getContent();
			editContent = editContent.replace(/><\/p>/g, ">&nbsp;</p>");

			params.hakwon_no 		= $scope.hakwonNo;
			params.notice_no 		= $scope.noticeNo;
			params.title 			= $scope.noticeDetail.title;
			params.content 			= editContent;
			params.file_no_list 	= fileNoList.toString();
			params.preview_content 	= params.content.substr(0, 50) + '...';
			params.reply_yn			= $scope.elem.checked ? 'Y' : 'N' ;

			params.reservationDate = reservationDate;
			params.reservationTime = reservationTime;

			CommUtil.ajax({url:contextPath+apiUrl, param:params, successFun:function(data) {
				try {
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
				var strImage = '<a href="'+ fullFilePath + '" target="_blank"><img src="'+ fullFilePath + '" width="'+editWidth+'" height="auto" data-img-no="'+fileNo+'" class="img-responsive"></a>';
			} else {
				var strImage = '<a href="'+ fullFilePath + '" target="_blank"><img src="'+ fullFilePath + '" data-img-no="'+fileNo+'" class="img-responsive"></a>';
			}
			tinymce.activeEditor.insertContent(strImage);
			tinymce.activeEditor.insertContent('<p><br />&nbsp;</p>');
			tinymce.activeEditor.focus();
		};

		/*	비디오 삽입	*/
		$('#mainNgView').on(clickEvent, 'div.file-box > div.file > div[data-file-type=video]', function() {
			var fileUrl = $(this).attr('data-file-url');
			var videoHtml = hakwonTmpl.common.videoHtml.replace('{{=videoUrl}}', fileUrl);
			tinymce.activeEditor.insertContent(videoHtml);
			tinymce.activeEditor.insertContent('<p><br />&nbsp;</p>');
			tinymce.activeEditor.focus();
		});

		/*	오디오 삽입	*/
		$('#mainNgView').on(clickEvent, 'div.file-box > div.file > div[data-file-type=audio]', function() {
			var fileUrl = $(this).attr('data-file-url');
			var audioHtml = '<p><audio src="'+fileUrl+'" preload="false" controls="true"></audio></p>';
			tinymce.activeEditor.insertContent(audioHtml);
			tinymce.activeEditor.insertContent('<p><br />&nbsp;</p>');
			tinymce.activeEditor.focus();
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
				$window.location.href = PageUrl.common.noticeList+'?hakwon_no=' + $scope.hakwonNo;
				return false;
			} else {
				$window.location.href = PageUrl.common.noticeDetail+'?hakwon_no=' + $scope.hakwonNo + '&notice_no=' + $scope.noticeNo;
				return false;
			}
		};

		/*	공지사항 목록이동	*/
		$scope.goNoticeList = function() {
			$window.location.href = PageUrl.common.noticeList+'?hakwon_no=' + $scope.hakwonNo;
			return false;
		};

		/*	youtube 삽입	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=youtubeInsert]', function() {
			var youtubeID = $('#mainNgView').find('input[name=youtubeID]').val();

			var youtubeHtml = '<a href="http://www.youtube.com/watch?v='+youtubeID+'"><img src="http://img.youtube.com/vi/'+youtubeID+'/0.jpg" class="img-responsive" alt="" data-video="youtube" data-id="'+youtubeID+'" /></a>';
			tinymce.activeEditor.insertContent(youtubeHtml);
			tinymce.activeEditor.insertContent('<p><br />&nbsp;</p>');
			tinymce.activeEditor.focus();
		});

		/*	취소	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=reservationCancel]', function() {
			$('input[name=reservationDate]').val('');
			$('input[name=reservationTime]').val('');
		});

		/*	초기화	*/
		$scope.$on('$viewContentLoaded', function() {
			console.log('noticeEditController $viewContentLoaded');

			/*	데이터 초기화	*/
			$scope.isNewNotice			= false;
			$scope.hakwonNo 			= '';
			$scope.noticeNo 			= '';
			$scope.noticeDetail			= {};
			$scope.replyList			= [];
			$scope.fileList				= [];

			/*	공지사항 작성시, 카테고리 리스트	*/
			$scope.noticeCateList 		= [];
			$scope.noticeCateItem 		= '';

			/* 권한 체크 기능	*/
			$scope.checkAuthType = comm.checkAuthType;

			/*	댓글 입력 정보	*/
			$scope.replyInfo = {
				reg_user_no			: '',
				content_type		: '001',
				content_parent_no 	: '',
				reply_content		: '',
				title				: ''
			};

			if (!isNull($routeParams.hakwon_no)) {
				$scope.hakwonNo = $routeParams.hakwon_no;
			} else if (!isNull(hakwonInfo.hakwon_no)) {
				$scope.hakwonNo = hakwonInfo.hakwon_no;
			}

			/*	공지사항 번호가 존재하면, 공지사항 수정. or 공지사항 등록 처리		*/
			if (!isNull($routeParams.notice_no)) {
				$scope.noticeNo = $routeParams.notice_no;
			} else {
				$scope.isNewNotice = true;
			}

			$timeout(function() {
				/*	데이트 피커	*/
				$('#mainNgView input[name=reservationDate]').datepicker({
					keyboardNavigation: false,
					forceParse: false,
					autoclose: true,
					format: "yyyy-mm-dd"
				});
			},50);
		});

		/*	파일 객체 초기화 및 데이터 호출		*/
		$scope.$$postDigest(function(){
			console.log('noticeEditController $$postDigest');

			/*	댓글 가능여부 switchery.js를 $scope로 바인딩 및 초기화	*/
			$scope.elem = document.querySelector('.js-switch');

			/*	학원 공지사항 상세정보조회	*/
			$scope.getNoticeDetail();

			/*	공지사항 카테고리 조회	*/
			$scope.getNoticeCateList();

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
							, param : {uploadType:CommonConstant.File.TYPE_NOTICE}
							, cookie : document.cookie
						}
					};
					window.PLATFORM.fileChooser(JSON.stringify(param));

					return false;
				});
			} else {
				$scope.fileUploadObj = angular.element("input[data-act=file_upload]").html5_upload(noticeService.getFileUploadOptions($scope));
			}

			$("html, body").scrollTop($('input[data-view=title]').offset().top-100);
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});
