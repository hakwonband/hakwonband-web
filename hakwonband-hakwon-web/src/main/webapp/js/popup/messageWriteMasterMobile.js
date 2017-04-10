/**
 * 학원 이벤트 서비스
 */
hakwonMainApp.service('messageMasterService', function(CommUtil) {
	console.log('hakwonMainApp messageMasterService call');

	var messageMasterService = {};

	/**
	 * 첨부파일 업로드 옵션 생성
	 */
	messageMasterService.getFileUploadOptions = function($scope, type) {
		// 파일 업로드 객체 생성
		var fileUploadOptions = new UploadOptions();
		fileUploadOptions.customExtraFields = {uploadType:CommonConstant.File.TYPE_MESSAGE};
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
	 * 원장님 반리스트 조회
	 */
	messageMasterService.masterClassList = function(callback) {
		var param = {hakwon_no:hakwonInfo.hakwon_no};
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/master/classList.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	}


	/**
	 * 메세지 대상 검색
	 */
	messageMasterService.masterMessageTargetSearch = function($scope, callback) {
		if( isNull($scope.searchText) ) {
			alert('검색어를 입력해 주세요.');
			$('input[name=searchText]').focus();
			return ;
		}

		var param = {hakwon_no:hakwonInfo.hakwon_no, searchText:$scope.searchText};
		CommUtil.colHttp({
			url			: contextPath+"/hakwon/message/masterSearch.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	};

	/**
	 * 사용자 대상 조회
	 */
	messageMasterService.targetUserSearch = function(userNoArray, callback) {
		var param = {
			hakwon_no : hakwonInfo.hakwon_no
			, targetUserNoArray : userNoArray
		};

		CommUtil.colHttp({
			url			: contextPath+"/hakwon/message/targetUserSearch.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	};

	/**
	 * 원장님 메세지 전송
	 */
	messageMasterService.masterMsgSend = function($scope, callback) {
		var reservationDate	= $('input[name=reservationDate]').val();
		var reservationTime	= $('input[name=reservationTime]').val();

		var messageContent = tinymce.activeEditor.getContent();
		var targetType = $scope.targetType;

		var targetClass = [];
		$('input[name=targetClass]:checked').each(function(idx, thisObj) {
			targetClass.push(this.value);
		});

		var targetUserType = [];
		$('input[name=targetUserType]:checked').each(function(idx, thisObj) {
			targetUserType.push(this.value);
		});

		var targetUserList = [];
		if( targetType == 'search' ) {
			for(var i=0; i<$scope.choiceSearchTarget.length; i++) {
				targetUserList.push($scope.choiceSearchTarget[i].user_no);
			}

			if( targetUserList.length == 0 ) {
				alert('발송 대상자를 검색해 주세요.');
				return ;
			}
		}

		if( !isNull(reservationDate) || !isNull(reservationTime) ) {
			if( isNull(reservationDate) || isNull(reservationTime) ) {
				alert('예약 날짜와 시간이 정확하지 않습니다.');
				return ;
			}
		}

		var fileListArray = [];
		$('div.file-box').each(function() {
			var dataFileNo = $(this).attr('data-file-no');
			fileListArray.push(dataFileNo);
		});

		var param = {
			hakwon_no : hakwonInfo.hakwon_no
			, fileListStr : fileListArray.toString()
			, messageContent : messageContent
			, targetClass : targetClass
			, targetUserType : targetUserType
			, targetType : targetType
			, targetUserList : targetUserList
			, reservationDate : reservationDate
			, reservationTime : reservationTime
		};

		CommUtil.colHttp({
			url			: contextPath+"/hakwon/message/masterSend.do"
			, header	: hakwonInfo.getHeader()
			, param		: param
			, callback	: callback
		});
	};

	return messageMasterService;
});


/**
 * 원장님 메세지 보내기
 */
hakwonMainApp.controller('messageWriteMasterController', function($scope, $location, $routeParams, $filter, $window, $timeout, CommUtil, messageMasterService) {
	console.log('messageWriteMasterController call~~~');

	$scope.CommUtil = CommUtil;

	/*	is Mobile	*/
	$scope.isMobile = isMobile.any();

	/*	학원번호	*/
	var hakwon_no = $routeParams.hakwon_no;
	hakwonInfo.hakwon_no = hakwon_no;

	/*	메세지 반 대상	*/
	var msg_class_no = $routeParams.msg_class_no;

	/*	메세지 개별 대상	*/
	var msg_user_no_array = $routeParams.msg_user_no_array;

	/*	타겟 타입 초기화	*/
	$scope.targetType = 'search';

	$scope.comm = comm;
	$scope.CommonConstant = CommonConstant;

	/*	검색 대상	*/
	$scope.search_user_list = [];
	$scope.choiceSearchTarget = [];

	$scope.fileList = [];

	if( msg_class_no ) {
		/*	선택된 반이 있으면 정회원 학생 선택	*/
		$scope.targetType = 'class';
	} else if( msg_user_no_array ) {
		/*	사용자 번호가 있으면 사용자 선택	*/
		$scope.targetType = 'search';
		messageMasterService.targetUserSearch(msg_user_no_array, function(data) {
			if( data.error ) {
				alert('사용자 대상 검색을 실패 했습니다.');
				return ;
			}
			$scope.search_user_list = [];
			var dataList = data.colData.dataList;
			if( dataList && dataList.length > 0 ) {

				comm.initRelationList(dataList);

				for(var i=0; i<dataList.length; i++) {
					$scope.choiceSearchTarget.push(dataList[i]);
				}
				$scope.search_result = '';
			} else {
				$scope.search_result = 'empty';
			}
		});
	}

	/**
	 * 메세지 대상 검색
	 */
	$scope.searchText = "";
	$scope.masterMessageTargetSearch = function() {
		messageMasterService.masterMessageTargetSearch($scope, function(data) {
			if( data.error ) {
				alert('사용자 검색을 실패 했습니다.');
				return ;
			}
			$scope.search_user_list = [];
			var dataList = data.colData.dataList;
			if( dataList && dataList.length > 0 ) {

				comm.initRelationList(dataList);

				for(var i=0; i<dataList.length; i++) {
					$scope.search_user_list.push(dataList[i]);
				}
				$scope.search_result = '';
			} else {
				$scope.search_result = 'empty';
			}
		});
	}

	/*	검색 대상 선택	*/
	$scope.searchTargetSelect = function(targetUser) {

		var chech_idx = _.find($scope.choiceSearchTarget, function(item) {
		    return item.user_no == targetUser.user_no;
		});
		if( chech_idx ) {
			alert('이미 추가된 사용자 입니다.');
		} else {
			$scope.choiceSearchTarget.push(targetUser);
		}
	}

	$scope.removeTargetSelect = function(targetUser) {
		$scope.choiceSearchTarget = _.reject($scope.choiceSearchTarget, function(item){ return item.user_no == targetUser.user_no; });
	}

	/**
	 * 메세지 발송
	 */
	$scope.messageSend = function() {
		messageMasterService.masterMsgSend($scope, function(data) {
			if( data.colData && data.colData.flag == 'success' ) {
				alert('메세지 전송을 성공 했습니다.');
				window.history.back();
				return false;
			} else {
				alert('메세지 전송을 실패 했습니다.');
				return ;
			}
		});
	}

	/**
	 * 취소
	 */
	$scope.cancelFun = function() {
		window.history.back();
		return false;
	}

	/**
	 * 파일 삭제
	 */
	$('#mainNgView').on(clickEvent, 'button.btn_file_del', function(e) {
		$(this).parents('div.file-box').remove();
	});

	/*	첨부파일 이미지 경로 처리	*/
	$scope.getAttachFileFullPath = function(filePath, fileType) {
		if( !fileType ) fileType = 'attachment';
		return CommUtil.createFileFullPath(filePath, fileType);
	};

	/*	첨부 파일 삭제 처리	*/
	$scope.removeAttachFile = function(fileNo) {
		$scope.fileList = _.filter($scope.fileList, function(item) {
			return item.file_no != fileNo;
		});
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

	/**
	 * 취소
	 */
	$('#mainNgView').on(clickEvent, 'button[data-act=reservationCancel]', function() {
		$('input[name=reservationDate]').val('');
		$('input[name=reservationTime]').val('');
	});

	$("#wrapper").show();

	/*	모바일 여부	*/
	$scope.isMobile = isMobile.any();

	var pageInit = function() {
		$('.i-checks').iCheck({
			checkboxClass: 'icheckbox_square-green'
		});
		/*	데이트 피커	*/
		$('#mainNgView input[name=reservationDate]').datepicker({
			keyboardNavigation: false,
			forceParse: false,
			autoclose: true,
			format: "yyyy-mm-dd"
		});

		if( window.PLATFORM ) {
			angular.element("input[data-act=file_upload]").click(function() {
				delete window.uploadCallBack;
				window.uploadCallBack = function(uploadJsonStr) {
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
				};
				var param = {
					fileType : 'all'
					, multipleYn : 'Y'
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
			$scope.fileUploadObj = angular.element("input[data-act=file_upload]").html5_upload(messageMasterService.getFileUploadOptions($scope));
		}


		/*	에디터 초기화 완료 후 value 셋팅	*/
		var editOptions = comm.getEditorOptions();
		editOptions.setup = function(ed) {
			ed.on('init', function(e) {
				//$('div.mce-toolbar-grp.mce-panel').hide();
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
	}

	/*	반 리스트 셋팅	*/
	messageMasterService.masterClassList(function(data) {
		var colData = data.colData;
		console.log('data', data);
		$scope.classList = colData.dataList;

		$timeout(function() {
			pageInit();
		},50);
	});
});