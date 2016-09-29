
/**
 * 메세지 서비스
 */
hakwonMainApp.service('messageSendMasterSerivce', function($http, CommUtil) {
	console.log('hakwonMainApp messageSendMasterSerivce call');

	var messageSendMasterSerivce = {};

	/**
	 * 원장님 반리스트 조회
	 */
	messageSendMasterSerivce.masterClassList = function(callback) {
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
	messageSendMasterSerivce.masterMessageTargetSearch = function($scope, callback) {
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
	messageSendMasterSerivce.targetUserSearch = function(userNoArray) {
		var param = {
			hakwon_no : hakwonInfo.hakwon_no
			, targetUserNoArray : userNoArray
		};

		$.ajax({
			url: contextPath+"/hakwon/message/targetUserSearch.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('사용자 대상 검색을 실패 했습니다.');
						return ;
					}
					if( data.colData.dataList && data.colData.dataList.length > 0 ) {
						for(var i=0; i<data.colData.dataList.length; i++) {
							var tempUserInfo = data.colData.dataList[i];

							$('#mainNgView ul.chosen_select').append($.tmpl(hakwonTmpl.message.choiceTarget, {target:tempUserInfo}));
						}
					} else {
						alert('검색된 사용자가 없습니다.');
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
	 * 원장님 메세지 전송
	 */
	messageSendMasterSerivce.masterMsgSend = function($scope, callback) {
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

	return messageSendMasterSerivce;
});


/**
 * 원장님 메세지 보내기
 */
hakwonMainApp.controller('messageMasterSendController', function($scope, $location, $routeParams, messageSendMasterSerivce, CommUtil, $timeout) {
	console.log('hakwonMainApp messageMasterSendController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	학원번호	*/
		var hakwon_no = $routeParams.hakwon_no;

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'메세지'}, {url:'#', title:'원장님 메세지 보내기'}]);


		/*	메세지 반 대상	*/
		var msg_class_no = $routeParams.msg_class_no;

		/*	메세지 개별 대상	*/
		var msg_user_no_array = $routeParams.msg_user_no_array;

		/*	타겟 타입 초기화	*/
		$scope.targetType = 'class';

		if( msg_class_no ) {
			/*	선택된 반이 있으면 정회원 학생 선택	*/
			$scope.targetType = 'class';
		} else if( msg_user_no_array ) {
			/*	사용자 번호가 있으면 사용자 선택	*/
			$scope.targetType = 'search';
			messageSendMasterSerivce.targetUserSearch(msg_user_no_array);
		}

		$scope.comm = comm;
		$scope.CommonConstant = CommonConstant;

		/**
		 * 메세지 대상 검색
		 */
		$scope.searchText = "";
		$scope.search_user_list = [];
		$scope.masterMessageTargetSearch = function() {
			messageSendMasterSerivce.masterMessageTargetSearch($scope, function(data) {
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
		$scope.choiceSearchTarget = [];
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
			messageSendMasterSerivce.masterMsgSend($scope, function(data){
				if( data.error ) {
					alert('메세지 전송을 실패 했습니다.');
					return ;
				}

				alert('메세지 전송을 성공 했습니다.');
				commProto.hrefMove(PageUrl.message.masterSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&'+new Date().toString());
			});
		}

		/**
		 * 취소
		 */
		$scope.cancelFun = function() {
			commProto.hrefMove(PageUrl.main+'?hakwon_no='+hakwon_no);
		}

		/**
		 * 파일 삭제
		 */
		$('#mainNgView').on(clickEvent, 'button.btn_file_del', function(e) {
			$(this).parents('div.file-box').remove();
		});

		/**
		 * 파일 클릭
		 */
		$('#mainNgView').on(clickEvent, 'div.file-box', function(e) {
			if( e.target.className.indexOf('btn_file_del') >= 0 ) return ;

			var fileType	= $(this).attr('data-file-type');
			var fullFilePath= $(this).attr('data-file-url');
			var fileNo		= $(this).attr('data-file-no');
			if( fileType == 'img' ) {
				if( isMobile.any() ) {
					var editWidth = $('[data-lib=editor]').width();
					var strImage = '<a href="'+ fullFilePath + '" target="_blank"><img src="'+ fullFilePath + '" width="'+editWidth+'" height="auto" data-img-no="'+fileNo+'" class="img-responsive"></a>';
				} else {
					var strImage = '<a href="'+ fullFilePath + '" target="_blank"><img src="'+ fullFilePath + '" data-img-no="'+fileNo+'" class="img-responsive"></a>';
				}
				tinymce.activeEditor.insertContent(strImage);
			} else if( fileType == 'audio' ) {
				var audioHtml = '<p><audio src="'+fullFilePath+'" preload="false" controls="true"></audio></p>';
				tinymce.activeEditor.insertContent(audioHtml);
			} else if( fileType == 'video' ) {
				var videoHtml = hakwonTmpl.common.videoHtml.replace('{{=videoUrl}}', fullFilePath);
				tinymce.activeEditor.insertContent(videoHtml);
			}
			tinymce.activeEditor.insertContent('<p><br />&nbsp;</p>');
			tinymce.activeEditor.focus();
		});

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
								fileInfo.extType = CommUtil.isFileType(fileInfo.imageYn, fileInfo.mimeType);
								$('#mainNgView div.attachment').append($.tmpl(hakwonTmpl.message.attchFile, {fileInfo:fileInfo}));

								if( fileInfo.imageYn == 'Y' ) {
									var fullFilePath = HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.filePath;
									var fileNo = fileInfo.fileNo;

									if( isMobile.any() ) {
										var editWidth = $('[data-lib=editor]').width();
										var strImage = '<a href="'+ fullFilePath + '" target="_blank"><img src="'+ fullFilePath + '" width="'+editWidth+'" height="auto" data-img-no="'+fileNo+'" class="img-responsive"></a>';
									} else {
										var strImage = '<a href="'+ fullFilePath + '" target="_blank"><img src="'+ fullFilePath + '" data-img-no="'+fileNo+'" class="img-responsive"></a>';
									}
									tinymce.activeEditor.insertContent(strImage);
								}
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
							, param : {uploadType:CommonConstant.File.TYPE_MESSAGE}
							, cookie : document.cookie
						}
					};
					window.PLATFORM.fileChooser(JSON.stringify(param));

					return false;
				});
			} else {
				var messageUploadOptions = new UploadOptions();
				messageUploadOptions.customExtraFields = {'uploadType' : CommonConstant.File.TYPE_MESSAGE};
				messageUploadOptions.onFinish = function(event, total) {
					if (this.errorFileArray.length + this.errorCount > 0) {
						alert('메세지 파일 업로드를 실패 했습니다.');
					} else {
						for (var i = 0; i < this.uploadFileArray.length; i++) {
							var fileInfo = this.uploadFileArray[i];

							fileInfo.extType = CommUtil.isFileType(fileInfo.imageYn, fileInfo.mimeType);
							$('#mainNgView div.attachment').append($.tmpl(hakwonTmpl.message.attchFile, {fileInfo:fileInfo}));

							if( fileInfo.imageYn == 'Y' ) {
								var fullFilePath = HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.filePath;
								var fileNo = fileInfo.fileNo;

								if( isMobile.any() ) {
									var editWidth = $('[data-lib=editor]').width();
									var strImage = '<a href="'+ fullFilePath + '" target="_blank"><img src="'+ fullFilePath + '" width="'+editWidth+'" height="auto" data-img-no="'+fileNo+'" class="img-responsive"></a>';
								} else {
									var strImage = '<a href="'+ fullFilePath + '" target="_blank"><img src="'+ fullFilePath + '" data-img-no="'+fileNo+'" class="img-responsive"></a>';
								}
								tinymce.activeEditor.insertContent(strImage);
							}
						}
					}
				};

				$("input[data-act=file_upload]").html5_upload(messageUploadOptions);
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
		messageSendMasterSerivce.masterClassList(function(data) {
			var colData = data.colData;
			console.log('data', data);
			$scope.classList = colData.dataList;

			$timeout(function() {
				pageInit();
			},50);
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});