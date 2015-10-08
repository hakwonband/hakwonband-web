
/**
 * 메세지 서비스
 */
hakwonMainApp.service('messageSendSerivce', function($http, CommUtil) {
	console.log('hakwonMainApp messageSendSerivce call');

	var messageSendSerivce = {};


	/**
	 * 메세지 대상 검색
	 */
	messageSendSerivce.messageTargetSearch = function() {
		var searchText = $('input[name=searchText]').val();
		if( isNull(searchText) ) {
			alert('검색어를 입력해 주세요.');
			$('input[name=searchText]').focus();
			return ;
		}
		$.ajax({
			url: contextPath+"/manager/message/targetSearch.do",
			type: "post",
			data: $.param({searchText:searchText}, true),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('사용자 검색을 실패 했습니다.');
						return ;
					}
					var dataList = data.colData.dataList;
					if( dataList && dataList.length > 0 ) {

						comm.initRelationList(dataList);

						var searchList = [];
						for(var i=0; i<dataList.length; i++) {
							var searchUser = dataList[i];

							searchList.push(searchUser);
						}
						$('#mainNgView ul.search_name_list').html($.tmpl(hakwonTmpl.message.searchData, {searchList:searchList}));
					} else {
						$('#mainNgView ul.search_name_list').html('<li>검색된 학원이 없습니다.</li>');
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
	 * 사용자 대상 조회
	 */
	messageSendSerivce.targetUserSearch = function(userNoArray) {
		var param = {
			targetUserNoArray : userNoArray
		};

		$.ajax({
			url: contextPath+"/manager/message/targetUserSearch.do",
			type: "post",
			data: $.param(param, true),
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
	 * 메세지 전송
	 */
	messageSendSerivce.masterMsgSend = function() {
		$('button[data-act=messageSend]').attr('disabled', true);

		var messageContent = $('textarea[name=messageContent]').val();
		var targetType = $('select[name=targetType]').val();

		var targetClass = [];
		var targetHakwonList = [];
		$('ul.chosen_select > li').each(function() {
			var dataUserInfo = $(this).attr('data-hakwon-no');
			targetHakwonList.push(dataUserInfo);
		});

		if( targetType == 'search' ) {
			if( targetHakwonList.length == 0 ) {
				alert('발송 대상자를 검색해 주세요.');
				$('button[data-act=messageSend]').attr('disabled', false);
				return ;
			}
		}

		var fileListArray = [];
		$('div.file-box').each(function() {
			var dataFileNo = $(this).attr('data-file-no');
			fileListArray.push(dataFileNo);
		});

		var param = {
			fileListStr : fileListArray.toString()
			, messageContent : messageContent
			, targetType : targetType
			, targetHakwonList : targetHakwonList
		};

		$.ajax({
			url: contextPath+"/manager/message/send.do",
			type: "post",
			data: $.param(param, true),
			complete : function(){ $('button[data-act=messageSend]').attr('disabled', false); },
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('메세지 전송을 실패 했습니다.');
						return ;
					}

					alert('메세지 전송을 성공 했습니다.');

					window.location.href = PageUrl.message.masterSend+'?'+new Date().toString();
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	return messageSendSerivce;
});


/**
 * 메세지 보내기
 */
hakwonMainApp.controller('messageSendController', function($scope, $location, $routeParams, messageSendSerivce, CommUtil) {
	console.log('hakwonMainApp messageSendController call', $scope, $location, $routeParams, messageSendSerivce, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'메세지'}, {url:'#', title:'메세지 보내기'}]);


		/*	메세지 개별 대상	*/
		var msg_user_no_array = $routeParams.msg_user_no_array;


		/**
		 * 타겟 타입
		 * search
		 */
		var targetType = $routeParams.targetType;
		if( !targetType ) {
			targetType = 'class';
		}

		/**
		 * 대상 변경시
		 */
		$('#mainNgView').on('change', 'select[name=targetType]', function() {
			$('div[data-target-form=Y]').hide();
			$('div[data-target-type='+this.value+']').show();

			$('#mainNgView .i-checks').iCheck('uncheck');
		});

		/**
		 * 메세지 대상 검색
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=messageTargetSearch]', messageSendSerivce.messageTargetSearch);
		$('#mainNgView').on('keypress', 'input[name=searchText]', function( event ) {
			if ( event.which == 13 ) {
				messageSendSerivce.messageTargetSearch();
				event.preventDefault();
			}
		});

		/**
		 * 검색 대상 삭제
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=choiceTargetDel]', function() {
			$(this.parentNode).remove();
		});

		/**
		 * 메세지 발송
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=messageSend]', messageSendSerivce.masterMsgSend);

		/**
		 * 취소
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=cancel]', function() {
			commProto.hrefMove(PageUrl.main);
		});

		/**
		 * 파일 삭제
		 */
		$('#mainNgView').on(clickEvent, 'button.btn_file_del', function() {
			$(this).parents('div.file-box').remove();
		});

		/**
		 * 대상 선택
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=target]', function() {
			var dataVal = $(this).attr('data-val');
			var dataValArray = dataVal.split(CommonConstant.ChDiv.CH_DEL);
			var target = {
				user_no : dataValArray[1]
				, user_name : dataValArray[0]
				, hakwon_no : dataValArray[2]
				, hakwon_name : dataValArray[3]
			};
			if( $('#mainNgView ul.chosen_select > li[data-hakwon-no='+target.hakwon_no+']').length > 0 ) {
				alert('이미 추가된 사용자 입니다.');
			} else {
				$('#mainNgView ul.chosen_select').append($.tmpl(hakwonTmpl.message.choiceTarget, {target:target}));
			}
		});


		$("#wrapper").show();
		/*	초기화	*/
		$scope.$$postDigest(function(){
			console.log('messageTeacherSendController $$postDigest');

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
								$('#mainNgView div.attachment').append($.tmpl(hakwonTmpl.message.attchFile, {fileInfo:fileInfo}));
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
						console.log(this.uploadFileArray);
						for (var i = 0; i < this.uploadFileArray.length; i++) {
							var fileInfo = this.uploadFileArray[i];

							$('#mainNgView div.attachment').append($.tmpl(hakwonTmpl.message.attchFile, {fileInfo:fileInfo}));
						}
					}
				};

				$("input[data-act=file_upload]").html5_upload(messageUploadOptions);
			}
			$('div[data-target-form=Y]').hide();
			$('div[data-target-type='+targetType+']').show();

			console.log('msg_user_no_array : ' + msg_user_no_array);
			if( msg_user_no_array ) {
				/*	사용자 번호가 있으면 사용자 선택	*/
				$('#mainNgView select[name=targetType]').val('search').trigger('change');
				messageSendSerivce.targetUserSearch(msg_user_no_array);
			}
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});