/**
 * 관리자에게 문의 서비스
 */
hakwonMainApp.service('adminQuestionService', function($http, CommUtil) {
	console.log('hakwonMainApp adminQuestionService call', CommUtil);

	var adminQuestionService = {};

	/**
	 * 관리자 문의 검색
	 */
	adminQuestionService.adminQuestionList = function(pageNo) {
		if( !pageNo ) {
			pageNo = 1;
		}
		var param = {pageNo:pageNo, hakwon_no:hakwonInfo.hakwon_no};

		$.ajax({
			url: contextPath+"/hakwon/adminQuestion/list.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('관리자 문의 조회를 실패 했습니다.');
						return false;
					}

					var $mainEle = $('#mainNgView');

					var colData = data.colData;
					var $tableBody = $mainEle.find('div[data-view=data-div] table > tbody');
					if( colData.noticeList.length > 0 ) {
						$tableBody.html($.tmpl(hakwonTmpl.adminQuestion.listRow, colData));
					} else {
						$tableBody.html($.tmpl(hakwonTmpl.adminQuestion.listNoData));
					}

					/*	페이징 처리	*/
					hakwonCommon.genPageNav({target:$mainEle.find('div[data-view=page-nav]'), currentPageNo:pageNo, totalCount:colData.noticeCount, pageScale:colData.page_scale});
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/**
	 * 문의 하기 상세
	 */
	adminQuestionService.adminQuestionView = function(noticeNo) {
		var params = {notice_no:noticeNo, hakwon_no:hakwonInfo.hakwon_no};
		$.ajax({
			url: contextPath+"/hakwon/adminQuestion/view.do",
			type: "post",
			data: $.param(params, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('관리자 문의 조회를 실패 했습니다.');
						return false;
					}

					var colData = data.colData;
					$('#mainNgView div[data-view=data-view]').html($.tmpl(hakwonTmpl.adminQuestion.viewData, colData));
					$('#mainNgView div.comment_list').html($.tmpl(hakwonTmpl.adminQuestion.replyRow, colData));
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/**
	 * 관리자 문의 삭제
	 */
	adminQuestionService.adminQuestionDelete = function(noticeNo) {
		var params = {notice_no:noticeNo, hakwon_no:hakwonInfo.hakwon_no};
		$.ajax({
			url: contextPath+"/hakwon/adminQuestion/del.do",
			type: "post",
			data: $.param(params, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('관리자 문의 삭제를 실패 했습니다.');
						return false;
					}

					var colData = data.colData;
					if( colData.flag == CommonConstant.Flag.success ) {
						window.location.href = PageUrl.common.adminQuestionList+"?hakwon_no="+hakwonInfo.hakwon_no;
					} else {
						alert('관리자 문의 삭제를 실패 했습니다.');
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	}

	/**
	 * 관리자에게 문의 등록
	 */
	adminQuestionService.sendQuestion = function(params, callback) {
		$.ajax({
			url: contextPath+"/hakwon/adminQuestion/write.do",
			type: "post",
			data: $.param(params, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('관리자 문의 조회를 실패 했습니다.');
						return false;
					}
					if( callback ) {
						callback(data.colData);
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};
	/**
	 * 첨부파일 업로드 옵션 생성
	 */
	adminQuestionService.getFileUploadOptions = function($scope) {
		// 파일 업로드 객체 생성
		var fileUploadOptions = new UploadOptions();
		fileUploadOptions.customExtraFields = {uploadType:CommonConstant.File.TYPE_MESSAGE};
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

					$scope.fileList.push(tempObj);
					$scope.$$postDigest();
				}
			}
		};
		return fileUploadOptions;
	};


	/**
	 * 리플 등록
	 */
	adminQuestionService.replyWrite = function(noticeNo) {
		var replyContent = $('textarea[name=replyContent]').val();

		if( isNull(replyContent) ) {
			alert('리플을 입력해 주세요.');
			return false;
		}


		var params = {
			notice_no:noticeNo
			, hakwon_no:hakwonInfo.hakwon_no
			, reply_content:replyContent
			, content_type : '001'
			, content_parent_no : noticeNo
		};
		$.ajax({
			url: contextPath+"/hakwon/reply/registReply.do",
			type: "post",
			data: $.param(params, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('리플 등록을 실패 했습니다.');
						return false;
					}

					var colData = data.colData;
					if( colData.result == CommonConstant.Flag.success ) {
						$('textarea[name=replyContent]').val('');
						adminQuestionService.replyList(noticeNo);
					} else {
						alert('리플 등록을 실패 했습니다.');
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/**
	 * 신규 리플 조회
	 */
	adminQuestionService.replyList = function(noticeNo) {
		var reply_no =$('div.comment_list > div.feed-element:last').attr('data-reply-no');
		var params = {
			notice_no:noticeNo
			, hakwon_no:hakwonInfo.hakwon_no
			, content_type : '001'
			, content_parent_no : noticeNo
			, reply_no : reply_no
		};
		$.ajax({
			url: contextPath+"/hakwon/reply/newReplyList.do",
			type: "post",
			data: $.param(params, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('리플 조회를 실패 했습니다.');
						return false;
					}

					var colData = data.colData;
					$('#mainNgView div.comment_list').append($.tmpl(hakwonTmpl.adminQuestion.replyRow, colData));
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	return adminQuestionService;
});

/**
 * 관리자 문의 리스트
 */
hakwonMainApp.controller('adminQuestionListController', function($scope, $location, $routeParams, adminQuestionService, CommUtil) {
	console.log('hakwonMainApp adminQuestionListController call', $scope, $location, $routeParams, adminQuestionService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'관리자 문의'}]);

		$("#wrapper").show();

		var pageNo = $routeParams.pageNo;
		if( !pageNo ) {
			pageNo = 1;
		}

		/*	문의 등록	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=regist]', function() {
			window.location.href = PageUrl.message.adminQuestionRegist+"?hakwon_no="+hakwonInfo.hakwon_no;
		});

		$scope.$$postDigest(function(){
			console.log('$$postDigest');
			adminQuestionService.adminQuestionList(pageNo);
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 관리자에게 문의하기 보기
 */
hakwonMainApp.controller('adminQuestionViewController', function($scope, $location, $routeParams, adminQuestionService, CommUtil) {
	console.log('hakwonMainApp adminQuestionViewController call', $scope, $location, $routeParams, adminQuestionService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'관리자 문의'}]);

		$("#wrapper").show();

		var notice_no = $routeParams.notice_no;
		if( !notice_no ) {
			alert('올바르지 않은 접근 입니다.');
			window.history.back();
		}

		/*	리플 등록	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=replyWrite]', function() {
			adminQuestionService.replyWrite(notice_no);
		});

		/*	문의 삭제	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=noticeDel]', function() {
			if( window.confirm('삭제 하시겠습니까?') ) {
				adminQuestionService.adminQuestionDelete(notice_no);
			}
		});

		/*	문의 수정	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=noticeEdit]', function() {
			alert('준비 중 입니다.');
		});
		/*	문의 목록	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=list]', function() {
			commProto.hrefMove(PageUrl.common.adminQuestionList+'?hakwon_no='+hakwonInfo.hakwon_no);
		});


		$scope.$$postDigest(function(){
			console.log('$$postDigest');

			adminQuestionService.adminQuestionView(notice_no);
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 관리자에게 문의하기 등록
 */
hakwonMainApp.controller('registQuestionController', function($scope, $location, $routeParams, adminQuestionService, CommUtil) {
	console.log('hakwonMainApp registQuestionController call', $scope, $location, $routeParams, adminQuestionService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'메세지'}, {url:'#', title:'관리자에게 문의 하기'}]);

		$("#wrapper").show();

		$scope.hakwon_no 		= $routeParams.hakwon_no;
		$scope.fileList			= [];

		/*	초기화	*/
		$scope.$$postDigest(function(){
			console.log('registQuestionController $$postDigest');

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

								$scope.fileList.push(tempObj);
								$scope.$digest();
							}
						} catch(e) {
							alert('파일 업로드를 실패 했습니다.');
						}
					};
					var param = {
						fileType : 'all'
						, multipleYn : 'N'
						, callBack : 'uploadCallBack'
						, upload : {
							url : window.location.protocol+'//'+window.location.host+uploadUrl
							, param : {uploadType:CommonConstant.File.TYPE_MESSAGE}
							, cookie : document.cookie
						}
					};
					window.PLATFORM.fileChooser(JSON.stringify(param));

					return false;
				});
			} else {
				$scope.fileUploadObj = angular.element("input[data-act=file_upload]").html5_upload(adminQuestionService.getFileUploadOptions($scope));
			}
		});

		/* 보내기	*/
		$scope.sendQuestion = function() {
			if (isNull($scope.content)) {
				alert('내용을 입력하세요.');
				return;
			}
			var apiUrl		= '',
				fileNoList	= _.pluck($scope.fileList, 'file_no'),
				params		= {};

			params.hakwon_no 		= $scope.hakwon_no;
			params.content 			= $scope.content.trim();
			params.title			= $scope.title;
			params.preview_content	= params.content.substr(0, 50) + '...';
			params.file_no_list 	= fileNoList.toString();
			params.user_no_list		= [1];

			adminQuestionService.sendQuestion(params, function(colData) {
				alert('관리자에게 메시지를 발송했습니다.');
				$scope.content = '';
				$scope.fileList = [];

				window.location.href = PageUrl.common.adminQuestionList+"?hakwon_no="+hakwonInfo.hakwon_no;
			});
		};

		/*	첨부파일 이미지 경로 처리	*/
		$scope.getAttachFileFullPath = function(filePath) {
			return CommUtil.createFileFullPath(filePath, 'attachment');
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
			var strImage = '<img src="'+ fullFilePath + '" data-img-no="'+fileNo+'" target="_blank" class="img-responsive">';
			tinymce.activeEditor.insertContent(strImage);
		};

		/*	첨부 파일 삭제 처리	*/
		$scope.removeAttachFile = function(fileNo) {
			$scope.fileList = _.filter($scope.fileList, function(item) {
				return item.file_no != fileNo;
			});
		};

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});