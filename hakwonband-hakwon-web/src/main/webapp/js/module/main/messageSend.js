
/**
 * 메세지 서비스
 */
hakwonMainApp.service('messageSendSerivce', function($http, CommUtil) {
	console.log('hakwonMainApp messageSendSerivce call');

	var messageSendSerivce = {};

	/**
	 * 선생님 반리스트 조회
	 */
	messageSendSerivce.teacherClassList = function(callBackFun) {
		$.ajax({
			url: contextPath+"/hakwon/teacher/classList.do",
			type: "post",
			data: $.param({hakwon_no:hakwonInfo.hakwon_no}, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;
					$('#mainNgView div.ibox').html($.tmpl(hakwonTmpl.message.teacherSend, {classList:colData.dataList}));
					callBackFun();
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
	 * 원장님 반리스트 조회
	 */
	messageSendSerivce.masterClassList = function(callBackFun) {
		$.ajax({
			url: contextPath+"/hakwon/master/classList.do",
			type: "post",
			data: $.param({hakwon_no:hakwonInfo.hakwon_no}, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;
					$('#mainNgView div.ibox').html($.tmpl(hakwonTmpl.message.masterSend, {classList:colData.dataList}));
					callBackFun();
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
	 * 메세지 대상 검색
	 */
	messageSendSerivce.masterMessageTargetSearch = function() {
		var searchText = $('input[name=searchText]').val();
		if( isNull(searchText) ) {
			alert('검색어를 입력해 주세요.');
			$('input[name=searchText]').focus();
			return ;
		}
		$.ajax({
			url: contextPath+"/hakwon/message/masterSearch.do",
			type: "post",
			data: $.param({hakwon_no:hakwonInfo.hakwon_no, searchText:searchText}, true),
			headers : hakwonInfo.getHeader(),
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
						$('#mainNgView ul.search_name_list').html('<li>검색된 학생이 없습니다.</li>');
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
	 * 메세지 대상 검색
	 */
	messageSendSerivce.teacherMessageTargetSearch = function() {
		var searchText = $('input[name=searchText]').val();
		if( isNull(searchText) ) {
			alert('검색어를 입력해 주세요.');
			$('input[name=searchText]').focus();
			return ;
		}
		$.ajax({
			url: contextPath+"/hakwon/message/teacherSearchStudent.do",
			type: "post",
			data: $.param({hakwon_no:hakwonInfo.hakwon_no, searchText:searchText}, true),
			headers : hakwonInfo.getHeader(),
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
						$('#mainNgView ul.search_name_list').html('<li>검색된 학생이 없습니다.</li>');
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
	 * 선생님 메세지 전송
	 */
	messageSendSerivce.teacherMsgSend = function() {
		$('button[data-act=messageSend]').attr('disabled', true);

		var reservationDate	= $('input[name=reservationDate]').val();
		var reservationTime	= $('input[name=reservationTime]').val();

		//var messageContent = $('textarea[name=messageContent]').val();
		var messageContent = tinymce.activeEditor.getContent();
		messageContent = messageContent.replace(/><\/p>/g, ">&nbsp;</p>");
		var classTarget = $('select[name=classTarget]').val();
		var targetType = $('select[name=targetType]').val();

		if( classTarget != 'search' ) {
			var dataCount = $('select[name=classTarget] > option:selected').attr('data-count');
			if( dataCount == 0 ) {
				alert('반에 학생들이 없습니다.');
				$('button[data-act=messageSend]').attr('disabled', false);
				return ;
			}
		}

		var targetUserList = [];
		$('ul.chosen_select > li').each(function() {
			var dataUserNo = $(this).attr('data-user-no');
			targetUserList.push(dataUserNo);
		});

		if( classTarget == 'search' ) {
			if( targetUserList.length == 0 ) {
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

		if( !isNull(reservationDate) || !isNull(reservationTime) ) {
			if( isNull(reservationDate) || isNull(reservationTime) ) {
				alert('예약 날짜와 시간이 정확하지 않습니다.');
				return ;
			}
		}

		var param = {
			hakwon_no : hakwonInfo.hakwon_no
			, fileListStr : fileListArray.toString()
			, messageContent : messageContent
			, classTarget : classTarget
			, targetType : targetType
			, targetUserList : targetUserList
			, reservationDate : reservationDate
			, reservationTime : reservationTime
		};

		$.ajax({
			url: contextPath+"/hakwon/message/teacherSend.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			complete : function(){ $('button[data-act=messageSend]').attr('disabled', false); },
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('메세지 전송을 실패 했습니다.');
						return ;
					}
					alert('메세지 전송을 성공 했습니다.');
					tinymce.activeEditor.destroy();
					window.location.href = PageUrl.message.teacherSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&'+new Date().toString();
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
	messageSendSerivce.masterMsgSend = function() {
		$('button[data-act=messageSend]').attr('disabled', true);

		var reservationDate	= $('input[name=reservationDate]').val();
		var reservationTime	= $('input[name=reservationTime]').val();

//		var messageContent = $('textarea[name=messageContent]').val();
		var messageContent = tinymce.activeEditor.getContent();
		messageContent = messageContent.replace(/><\/p>/g, ">&nbsp;</p>");
		var targetType = $('select[name=targetType]').val();

		var targetClass = [];
		$('input[name=targetClass]:checked').each(function(idx, thisObj) {
			targetClass.push(this.value);
		});

		var targetUserType = [];
		$('input[name=targetUserType]:checked').each(function(idx, thisObj) {
			targetUserType.push(this.value);
		});

		var targetUserList = [];
		$('ul.chosen_select > li').each(function() {
			var dataUserNo = $(this).attr('data-user-no');
			targetUserList.push(dataUserNo);
		});

		if( targetType == 'search' ) {
			if( targetUserList.length == 0 ) {
				alert('발송 대상자를 검색해 주세요.');
				$('button[data-act=messageSend]').attr('disabled', false);
				return ;
			}
		}

		if( !isNull(reservationDate) || !isNull(reservationTime) ) {
			if( isNull(reservationDate) || isNull(reservationTime) ) {
				alert('예약 날짜와 시간이 정확하지 않습니다.');
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

		$.ajax({
			url: contextPath+"/hakwon/message/masterSend.do",
			type: "post",
			data: $.param(param, true),
			complete : function(){ $('button[data-act=messageSend]').attr('disabled', false); },
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('메세지 전송을 실패 했습니다.');
						return ;
					}

					alert('메세지 전송을 성공 했습니다.');
					tinymce.activeEditor.destroy();
					window.location.href = PageUrl.message.masterSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&'+new Date().toString();
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
 * 원장님 메세지 보내기
 */
hakwonMainApp.controller('messageMasterSendController', function($scope, $location, $routeParams, messageSendSerivce, CommUtil) {
	console.log('hakwonMainApp messageMasterSendController call', $scope, $location, $routeParams, messageSendSerivce, CommUtil);

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


		/**
		 * 타겟 타입
		 * class, userGroup, search
		 */
		var targetType = $routeParams.targetType;
		if( !targetType ) {
			targetType = 'class';
		}

		/**
		 * 대상 변경시
		 */
		$('#mainNgView').on('change', 'select[name=targetType]', function() {
			console.log('this.value : ' + this.value);

			$('div[data-target-form=Y]').hide();
			$('div[data-target-type='+this.value+']').show();

			if( this.value == 'userGroup' ) {
				$('div[data-target-user=user]').show();
				$('div[data-target-user=user] label[for=check_category_04]').show();
				$('div[data-target-user=user] label[for=check_category_05]').show();
			} else if( this.value == 'class' ) {
				$('div[data-target-user=user] label[for=check_category_04]').hide();
				$('div[data-target-user=user] label[for=check_category_05]').hide();
			}

			$('#mainNgView .i-checks').iCheck('uncheck');
		});

		/**
		 * 메세지 대상 검색
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=messageTargetSearch]', messageSendSerivce.masterMessageTargetSearch);
		$('#mainNgView').on('keypress', 'input[name=searchText]', function( event ) {
			if ( event.which == 13 ) {
				messageSendSerivce.masterMessageTargetSearch();
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
			commProto.hrefMove(PageUrl.main+'?hakwon_no='+hakwon_no);
		});

		/**
		 * 파일 삭제
		 */
		$('#mainNgView').on(clickEvent, 'button.btn_file_del', function() {
			$(this).parents('div.file-box').remove();
		});

		/**
		 * 파일 클릭
		 */
		$('#mainNgView').on(clickEvent, 'div.file-box', function() {
			var fileType	= $(this).attr('data-file-type');
			var fullFilePath= $(this).attr('data-file-url');
			var fileNo		= $(this).attr('data-file-no');
			if( fileType == 'img' ) {
				var strImage = '<img src="'+ fullFilePath + '" data-img-no="'+fileNo+'" class="img-responsive">';
				tinymce.activeEditor.insertContent(strImage);
			} else if( fileType == 'audio' ) {
				var audioHtml = '<p><audio src="'+fullFilePath+'" preload="false" controls="true">지원하지 않는 포멧 입니다.</audio></p>';
				tinymce.activeEditor.insertContent(audioHtml);
			} else if( fileType == 'video' ) {
				var videoHtml = hakwonTmpl.common.videoHtml.replace('{{=videoUrl}}', fullFilePath);
				tinymce.activeEditor.insertContent(videoHtml);
			}
		});

		/**
		 * 취소
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=reservationCancel]', function() {
			$('input[name=reservationDate]').val('');
			$('input[name=reservationTime]').val('');
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
			};
			if( $('#mainNgView ul.chosen_select > li[data-user-no='+dataValArray[1]+']').length > 0 ) {
				alert('이미 추가된 사용자 입니다.');
			} else {
				$('#mainNgView ul.chosen_select').append($.tmpl(hakwonTmpl.message.choiceTarget, {target:target}));
			}
		});


		$("#wrapper").show();
		/*	초기화	*/
		$scope.$$postDigest(function(){
			console.log('messageTeacherSendController $$postDigest');

			/*	반 리스트 셋팅	*/
			messageSendSerivce.masterClassList(function() {

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

				$('label[data-type=targetUserType]').on('ifChecked ifUnchecked', function(event){
					if( $(this).attr('data-value') == 'search' ) {
						if( event.type == 'ifChecked' ) {
							$('div[data-view=classDiv]').hide();

							$('select[name=targetType]').attr('disabled', true);
							$('div[data-view=searchDiv]').show();
							$('div[data-view=searchTarget]').show();
							$('div[data-view=searchResult]').show();
							$('input[name=searchText]').val('');

							$('ul.search_name_list > li').remove();
							$('ul.chosen_select > li').remove();

							$('input[value=student]').iCheck('disable');
							$('input[value=parent]').iCheck('disable');
							$('input[value=nonStudent]').iCheck('disable');
							$('input[value=nonParent]').iCheck('disable');
							$('input[value=teacher]').iCheck('disable');
						} else if( event.type == 'ifUnchecked' ) {
							$('div[data-view=classDiv]').show();

							$('select[name=targetType]').attr('disabled', false);
							$('div[data-view=searchDiv]').hide();
							$('div[data-view=searchTarget]').hide();
							$('div[data-view=searchResult]').hide();
							$('input[name=searchText]').val('');

							$('ul.search_name_list > li').remove();
							$('ul.chosen_select > li').remove();

							$('input[value=student]').iCheck('enable');
							$('input[value=parent]').iCheck('enable');
							$('input[value=nonStudent]').iCheck('enable');
							$('input[value=nonParent]').iCheck('enable');
							$('input[value=teacher]').iCheck('enable');
						}
					}
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
					var messageUploadOptions = new UploadOptions();
					messageUploadOptions.customExtraFields = {'uploadType' : CommonConstant.File.TYPE_MESSAGE};
					messageUploadOptions.onFinish = function(event, total) {
						if (this.errorFileArray.length + this.errorCount > 0) {
							alert('메세지 파일 업로드를 실패 했습니다.');
						} else {
							console.log(this.uploadFileArray);
							for (var i = 0; i < this.uploadFileArray.length; i++) {
								var fileInfo = this.uploadFileArray[i];

								fileInfo.extType = CommUtil.isFileType(fileInfo.imageYn, fileInfo.mimeType);
								$('#mainNgView div.attachment').append($.tmpl(hakwonTmpl.message.attchFile, {fileInfo:fileInfo}));
							}
						}
					};

					$("input[data-act=file_upload]").html5_upload(messageUploadOptions);
				}
				$('div[data-target-form=Y]').hide();
				$('div[data-target-type='+targetType+']').show();

				if( msg_class_no ) {
					/*	선택된 반이 있으면 정회원 학생 선택	*/
					$('#mainNgView select[name=targetType]').val('class').trigger('change');
				} else if( msg_user_no_array ) {
					/*	사용자 번호가 있으면 사용자 선택	*/
					$('#mainNgView select[name=targetType]').val('search').trigger('change');
					messageSendSerivce.targetUserSearch(msg_user_no_array);
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
			});
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});



/**
 * 선생님 메세지 보내기
 */
hakwonMainApp.controller('messageTeacherSendController', function($scope, $location, $routeParams, messageSendSerivce, CommUtil) {
	console.log('hakwonMainApp messageTeacherSendController call', $scope, $location, $routeParams, messageSendSerivce, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	학원번호	*/
		var hakwon_no = $routeParams.hakwon_no;

		/*	메세지 반 대상	*/
		var msg_class_no = $routeParams.msg_class_no;

		/*	메세지 개별 대상	*/
		var msg_user_no_array = $routeParams.msg_user_no_array;

		/**
		 * 타겟 타입
		 * class, userGroup, search
		 */
		var targetType = $routeParams.targetType;
		if( !targetType ) {
			targetType = 'class';
		}

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'메세지'}, {url:'#', title:'선생님 메세지 보내기'}]);

		/*	반 리스트	*/
		$('#mainNgView').on('change', 'select[name=classTarget]', function() {
			if( this.value == 'search' ) {
				$('select[name=targetType]').attr('disabled', true);
				$('div[data-view=searchDiv]').show();
				$('div[data-view=searchTarget]').show();
				$('div[data-view=searchResult]').show();
				$('input[name=searchText]').val('');

				$('ul.search_name_list > li').remove();
				$('ul.chosen_select > li').remove();
			} else {
				$('select[name=targetType]').attr('disabled', false);
				$('div[data-view=searchDiv]').hide();
				$('div[data-view=searchTarget]').hide();
				$('div[data-view=searchResult]').hide();
				$('input[name=searchText]').val('');

				$('ul.search_name_list > li').remove();
				$('ul.chosen_select > li').remove();
			}
		});

		/**
		 * 메세지 대상 검색
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=messageTargetSearch]', messageSendSerivce.teacherMessageTargetSearch);
		$('#mainNgView').on('keypress', 'input[name=searchText]', function( event ) {
			if ( event.which == 13 ) {
				messageSendSerivce.teacherMessageTargetSearch();
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
		 * 예약 취소
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=reservationCancel]', function() {
			$('input[name=reservationDate]').val('');
			$('input[name=reservationTime]').val('');
		});

		/**
		 * 메세지 발송
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=messageSend]', messageSendSerivce.teacherMsgSend);

		/**
		 * 파일 클릭
		 */
		$('#mainNgView').on(clickEvent, 'div.file-box', function() {
			var fileType	= $(this).attr('data-file-type');
			var fullFilePath= $(this).attr('data-file-url');
			var fileNo		= $(this).attr('data-file-no');
			if( fileType == 'img' ) {
				var strImage = '<img src="'+ fullFilePath + '" data-img-no="'+fileNo+'" class="img-responsive">';
				tinymce.activeEditor.insertContent(strImage);
			} else if( fileType == 'audio' ) {
				var audioHtml = '<p><audio src="'+fullFilePath+'" preload="false" controls="true">지원하지 않는 포멧 입니다.</audio></p>';
				tinymce.activeEditor.insertContent(audioHtml);
			} else if( fileType == 'video' ) {
				var videoHtml = hakwonTmpl.common.videoHtml.replace('{{=videoUrl}}', fullFilePath);
				tinymce.activeEditor.insertContent(videoHtml);
			}
		});

		/**
		 * 취소
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=cancel]', function() {
			commProto.hrefMove(PageUrl.main+'?hakwon_no='+hakwon_no);
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
			};
			if( $('#mainNgView ul.chosen_select > li[data-user-no='+dataValArray[1]+']').length > 0 ) {
				alert('이미 추가된 사용자 입니다.');
			} else {
				$('#mainNgView ul.chosen_select').append($.tmpl(hakwonTmpl.message.choiceTarget, {target:target}));
			}
		});


		$("#wrapper").show();
		/*	초기화	*/
		$scope.$$postDigest(function(){
			console.log('messageTeacherSendController $$postDigest');

			/*	반 리스트 셋팅	*/
			messageSendSerivce.teacherClassList(function() {

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

				$('label[data-type=targetUserType]').on('ifChecked ifUnchecked', function(event){
					if( $(this).attr('data-value') == 'search' ) {
						if( event.type == 'ifChecked' ) {
							$('div[data-view=classDiv]').hide();

							$('select[name=targetType]').attr('disabled', true);
							$('div[data-view=searchDiv]').show();
							$('div[data-view=searchTarget]').show();
							$('div[data-view=searchResult]').show();
							$('input[name=searchText]').val('');

							$('ul.search_name_list > li').remove();
							$('ul.chosen_select > li').remove();

							$('input[value=student]').iCheck('disable');
							$('input[value=parent]').iCheck('disable');
							$('input[value=nonStudent]').iCheck('disable');
							$('input[value=nonParent]').iCheck('disable');
							$('input[value=teacher]').iCheck('disable');
						} else if( event.type == 'ifUnchecked' ) {
							$('div[data-view=classDiv]').show();

							$('select[name=targetType]').attr('disabled', false);
							$('div[data-view=searchDiv]').hide();
							$('div[data-view=searchTarget]').hide();
							$('div[data-view=searchResult]').hide();
							$('input[name=searchText]').val('');

							$('ul.search_name_list > li').remove();
							$('ul.chosen_select > li').remove();

							$('input[value=student]').iCheck('enable');
							$('input[value=parent]').iCheck('enable');
							$('input[value=nonStudent]').iCheck('enable');
							$('input[value=nonParent]').iCheck('enable');
							$('input[value=teacher]').iCheck('enable');
						}
					}
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
					var messageUploadOptions = new UploadOptions();
					messageUploadOptions.customExtraFields = {'uploadType' : CommonConstant.File.TYPE_MESSAGE};
					messageUploadOptions.onFinish = function(event, total) {
						if (this.errorFileArray.length + this.errorCount > 0) {
							alert('메세지 파일 업로드를 실패 했습니다.');
						} else {
							console.log(this.uploadFileArray);
							for (var i = 0; i < this.uploadFileArray.length; i++) {
								var fileInfo = this.uploadFileArray[i];
								fileInfo.extType = CommUtil.isFileType(fileInfo.imageYn, fileInfo.mimeType);
								$('#mainNgView div.attachment').append($.tmpl(hakwonTmpl.message.attchFile, {fileInfo:fileInfo}))
							}
						}
					};

					$("input[data-act=file_upload]").html5_upload(messageUploadOptions);
				}

				$('div[data-target-form=Y]').hide();
				$('div[data-target-type='+targetType+']').show();

				if( msg_class_no ) {
					/*	선택된 반이 있으면 정회원 학생 선택	*/
					$('#mainNgView select[name=classTarget]').val(msg_class_no).trigger('change');
				} else if( msg_user_no_array ) {
					/*	사용자 번호가 있으면 사용자 선택	*/
					$('#mainNgView select[name=classTarget]').val('search').trigger('change');
					messageSendSerivce.targetUserSearch(msg_user_no_array);
				}

				/*	에디터 초기화 완료 후 value 셋팅	*/
				var editOptions = comm.getEditorOptions();
				editOptions.setup = function(ed) {
					ed.on('init', function(e) {
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
			});
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});