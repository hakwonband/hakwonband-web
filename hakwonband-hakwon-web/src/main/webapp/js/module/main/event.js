/**
 * 이벤트 서비스
 */
hakwonMainApp.service('eventService', function($http, CommUtil) {
	console.log('hakwonMainApp eventService call');

	var eventService = {};

	/**
	 * 첨부파일 업로드 옵션 생성
	 */
	eventService.getFileUploadOptions = function() {
		var uploadTypeObj = {uploadType:CommonConstant.File.TYPE_EVENT};

		// 파일 업로드 객체 생성
		var fileUploadOptions = new UploadOptions();
		fileUploadOptions.customExtraFields = uploadTypeObj;
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

				$('div.attachment').append($.tmpl(hakwonTmpl.event.attachFile, {fileList:this.uploadFileArray}));
			}
		};
		return fileUploadOptions;
	};

	/*	상세 정보 조회	*/
	eventService.view = function(eventNo, student_url) {
		var param = {
			hakwon_no : hakwonInfo.hakwon_no
			, event_no : eventNo
		};
		$.ajax({
			url: contextPath+"/hakwon/event/view.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('이벤트 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;

					if( colData.eventInfo.recommend_yn == 'Y' ) {
						if( !colData.recommendList ) {
							colData.recommendList = [];
						}
					}

					colData.student_url = student_url;
					$('#mainNgView div[data-view=data-view]').html($.tmpl(hakwonTmpl.event.viewData, colData));

					setTimeout(function(){
						comm.videoTagReplace('content_view_div', colData.fileList);
						comm.contentImageReset();
					}, 50);
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	}

	/*	수정 정보 조회	*/
	eventService.editData = function(eventNo) {
		var param = {
			hakwon_no : hakwonInfo.hakwon_no
			, event_no : eventNo
		};
		$.ajax({
			url: contextPath+"/hakwon/event/view.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error || !data.colData.eventInfo ) {
						alert('이벤트 조회를 실패 했습니다.');
						return false;
					}

					/**
					 * 에디터 로드
					 * textarea에 data-lib="editor" 를 추가해줘야 한다.
					 */
					var colData = data.colData;
					$('#mainNgView div[data-view=data-view]').html($.tmpl(hakwonTmpl.event.editData, colData));

					var editOptions = comm.getEditorOptions();
					editOptions.setup = function(ed) {
						ed.on("init", function(ed) {
							tinymce.activeEditor.setContent(colData.eventInfo.event_content);
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
					}
					tinymce.init(editOptions);

					/*	파일 로드	*/
					$('div.attachment').append($.tmpl(hakwonTmpl.event.attachFile, {fileList:colData.fileList}));

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
										$('div.attachment').append($.tmpl(hakwonTmpl.event.attachFile, {fileList:[fileInfo]}));
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
										uploadType : CommonConstant.File.TYPE_EVENT
										, hakwonNo : $scope.hakwonNo
										, classNo : $scope.classNo
									}
									, cookie : document.cookie
								}
							};
							window.PLATFORM.fileChooser(JSON.stringify(param));

							return false;
						});
					} else {
						$("input[data-act=file_upload]").html5_upload(eventService.getFileUploadOptions());
					}

					/*	데이트 피커	*/
					$('.event_date_picker .input-daterange').datepicker({
						keyboardNavigation: false,
						forceParse: false,
						autoclose: true,
						format: "yyyy-mm-dd"
					});
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	}

	/*	삭제	*/
	eventService.eventDel = function(eventNo) {
		var param = {
			hakwon_no : hakwonInfo.hakwon_no
			, event_no : eventNo
		};
		$.ajax({
			url: contextPath+"/hakwon/master/deleteEvent.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('이벤트 삭제를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;
					if( colData.flag == CommonConstant.Flag.success ) {
						window.location.href = PageUrl.common.eventList+'?hakwon_no='+hakwonInfo.hakwon_no;
					} else if( colData.flag == CommonConstant.Flag.exist ) {
						alert('참여한 멤버가 있는 이벤트는 삭제가 불가능 합니다.');
					} else {
						alert('삭제를 실패 했습니다.');
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
	 * 저장
	 */
	eventService.regist = function() {
		var $mainNgView = $('#mainNgView');
		var title = $mainNgView.find('input[name=title]').val();
		var beginDate = $mainNgView.find('input[name=begin_date]').val();
		var endDate = $mainNgView.find('input[name=end_date]').val();
		var eventContent = tinymce.activeEditor.getContent();
		eventContent = eventContent.replace(/><\/p>/g, ">&nbsp;</p>");

		if( isNull(title) ) {
			alert('제목을 입력해 주세요.');
			return ;
		}
		if( isNull(beginDate) ) {
			alert('시작일을 입력해 주세요.');
			return ;
		}
		if( isNull(endDate) ) {
			alert('종료일을 입력해 주세요.');
			return ;
		}
		if( isNull(eventContent) ) {
			alert('내용을 입력해 주세요.');
			return ;
		}

		var fileArray = [];
		$('div.file-box').each(function() {
			var fileNo = $(this).attr('data-file-no');
			fileArray.push(fileNo);
		});

		var recommend_yn	= $mainNgView.find('select[name=recommend_yn]').val();
		var add_info_title	= $mainNgView.find('input[name=add_info_title]').val();

		var param = {
			hakwon_no : hakwonInfo.hakwon_no
			, event_title : title
			, begin_date : beginDate
			, end_date : endDate
			, event_content : eventContent
			, file_no_list : fileArray.toString()
			, recommend_yn : recommend_yn
			, add_info_title : add_info_title
		};
		$.ajax({
			url: contextPath+"/hakwon/master/registEvent.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('이벤트 저장을 실패 했습니다.');
						return false;
					}
					var colData = data.colData;
					if( colData.flag == CommonConstant.Flag.success ) {
						alert('이벤트 알림은 시작일 16시에 일괄 발송 됩니다.\n15:30분 이후 등록 이벤트는 실시간 발송 됩니다.');
						window.location.href = PageUrl.common.eventView+'?hakwon_no='+hakwonInfo.hakwon_no+'&event_no='+colData.eventNo;
					} else {
						alert('이벤트 저장을 실패 했습니다.');
						return false;
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
	 * 저장
	 */
	eventService.edit = function(eventNo) {
		var $mainNgView = $('#mainNgView');
		var title = $mainNgView.find('input[name=title]').val();
		var beginDate = $mainNgView.find('input[name=begin_date]').val();
		var endDate = $mainNgView.find('input[name=end_date]').val();
		var eventContent = tinymce.activeEditor.getContent();
		eventContent = eventContent.replace(/><\/p>/g, ">&nbsp;</p>");

		if( isNull(title) ) {
			alert('제목을 입력해 주세요.');
			return ;
		}
		if( isNull(beginDate) ) {
			alert('시작일을 입력해 주세요.');
			return ;
		}
		if( isNull(endDate) ) {
			alert('종료일을 입력해 주세요.');
			return ;
		}
		if( isNull(eventContent) ) {
			alert('내용을 입력해 주세요.');
			return ;
		}

		var fileArray = [];
		$('div.file-box').each(function() {
			var fileNo = $(this).attr('data-file-no');
			fileArray.push(fileNo);
		});

		var recommend_yn	= $mainNgView.find('select[name=recommend_yn]').val();
		var add_info_title	= $mainNgView.find('input[name=add_info_title]').val();

		var param = {
			hakwon_no : hakwonInfo.hakwon_no
			, event_no : eventNo
			, event_title : title
			, begin_date : beginDate
			, end_date : endDate
			, event_content : eventContent
			, file_no_list : fileArray.toString()
			, recommend_yn : recommend_yn
			, add_info_title : add_info_title
		};
		$.ajax({
			url: contextPath+"/hakwon/master/editEvent.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('이벤트 저장을 실패 했습니다.');
						return false;
					}
					var colData = data.colData;
					if( colData.flag == CommonConstant.Flag.success ) {
						window.location.href = PageUrl.common.eventView+'?hakwon_no='+hakwonInfo.hakwon_no+'&event_no='+eventNo;
					} else {
						alert('이벤트 저장을 실패 했습니다.');
						return false;
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
	 * 이벤트 리스트
	 */
	eventService.eventList = function(pageNo) {
		if( !pageNo ) pageNo = 1;

		var param = {
			pageNo : pageNo
			, hakwon_no : hakwonInfo.hakwon_no
		};
		$.ajax({
			url: contextPath+"/hakwon/event/list.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('이벤트 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;

					var $dataDiv = $('#mainNgView div[data-view=data-div]');
					var $dataTableBody = $dataDiv.find('table > tbody');

					if( colData.eventCount == 0 ) {
						$dataTableBody.html($.tmpl(hakwonTmpl.event.listNoData, colData));

						$('#mainNgView div[data-view=pagination]').html('');
					} else {
						$dataTableBody.html($.tmpl(hakwonTmpl.event.listRow, colData));

						var totalPages = comm.pageCalc(colData.eventCount, colData.pageScale);
						$('#mainNgView div[data-view=pagination]').bootpag({
							total: totalPages,
							page: pageNo,
							maxVisible: DefaultInfo.pageScale,
							leaps: true
						}).unbind("page").bind("page", function(event, page){
							eventService.eventList(page);
						});
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

	return eventService;
});

/*	이벤트 리스트	*/
hakwonMainApp.controller('eventListController', function($scope, $location, $routeParams, eventService, CommUtil){
	console.log('hakwonMainApp eventListController call');

	/*	페이지 초기화 호출	*/
	hakwonCommon.pageInit();

	comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'이벤트 리스트'}]);

	/**
	 * 페이지 번호
	 */
	var pageNo = $routeParams.pageNo;
	if( !pageNo ) {
		pageNo = 1;
	}

	var hakwon_no = $routeParams.hakwon_no;

	/*	is Mobile	*/
	$scope.isMobile = isMobile.any();

	$scope.write = function() {
		/*
		if( isMobile.any() ) {
			window.location = '/assets/js/popup/popupIndex.html#/eventWrite?hakwon_no=' + hakwon_no;
		} else {
			$window.location.href = PageUrl.event.write+'?hakwon_no='+hakwonInfo.hakwon_no;
		}
		*/
		$window.location.href = PageUrl.event.write+'?hakwon_no='+hakwonInfo.hakwon_no;
	};

	$("#wrapper").show();
	$scope.$on('$viewContentLoaded', function() {
		console.log('eventListController $viewContentLoaded');

		/*	권한 체크 기능	*/
		$scope.checkAuthType = comm.checkAuthType;

		eventService.eventList(pageNo);
	});
});

/*	이벤트 작성	*/
hakwonMainApp.controller('eventWriteController', function($scope, $location, $routeParams, eventService, CommUtil){
	console.log('hakwonMainApp eventWriteController call');

	/*	페이지 초기화 호출	*/
	hakwonCommon.pageInit();

	comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'이벤트 작성'}]);

	/*	권한 체크 기능	*/
	$scope.checkAuthType = comm.checkAuthType;

	/*	취소	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=cancel]', function() {
		window.history.back();
		return false;
	});

	/*	저장	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=save]', eventService.regist);

	/*	파일 삭제	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=fileDel]', function() {
		$(this.parentNode.parentNode).remove();
	});

	/*	파일 본문 삽입	*/
	$('#mainNgView').on(clickEvent, 'div.file-box > div.file > div.image', function() {
		var imgSrc = $(this).find('img').attr('src');
		tinymce.activeEditor.insertContent('<p><a href="'+ imgSrc + '" target="_blank"><img src="'+imgSrc+'" class="img-responsive"></a></p><p>&nbsp;</p>');
		tinymce.activeEditor.focus();
	});

	/*	비디오 삽입	*/
	$('#mainNgView').on(clickEvent, 'div.file-box > div.file > div[data-file-type=video]', function() {
		var fileUrl = $(this).attr('data-file-url');
		var videoHtml = hakwonTmpl.common.videoHtml.replace('{{=videoUrl}}', fileUrl);
		tinymce.activeEditor.insertContent(videoHtml);
		tinymce.activeEditor.focus();
	});



	$scope.$$postDigest(function(){
		console.log('eventWriteController $$postDigest');

		try {
			$('.event_date_picker .input-daterange').datepicker({
				keyboardNavigation: false,
				forceParse: false,
				autoclose: true,
				format: "yyyy-mm-dd"
			});

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
								$('div.attachment').append($.tmpl(hakwonTmpl.event.attachFile, {fileList:[fileInfo]}));
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
								uploadType : CommonConstant.File.TYPE_EVENT
								, hakwonNo : $scope.hakwonNo
								, classNo : $scope.classNo
							}
							, cookie : document.cookie
						}
					};
					window.PLATFORM.fileChooser(JSON.stringify(param));

					return false;
				});
			} else {
				$("input[data-act=file_upload]").html5_upload(eventService.getFileUploadOptions());
			}

			/**
			 * 에디터 로드
			 * textarea에 data-lib="editor" 를 추가해줘야 한다.
			 */

			setTimeout(function() {
				var editOptions = comm.getEditorOptions();
				editOptions.setup = function(ed) {
					ed.on("init", function(ed) {
						tinymce.activeEditor.setContent('');
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
			}, 500);
		} catch(ex) {
			commProto.errorDump({errorObj:ex});
		}

		/**
		 * 에디터 내용 조회
		 * var contentHtml = tinymce.activeEditor.getContent();
		 *
		 * 에디터 내용 불러오기
		 * tinymce.activeEditor.setContent('불러올 데이타');
		 *
		 * 에디터에 이미지 삽입
		 * tinymce.activeEditor.insertContent('<img src="" data-img-no="이미지 번호 넣어 주세요.">');
		 */
	});

	$("#wrapper").show();
});

/*	이벤트 수정	*/
hakwonMainApp.controller('eventEditController', function($scope, $location, $routeParams, eventService){
	console.log('hakwonMainApp eventEditController call');

	/*	페이지 초기화 호출	*/
	hakwonCommon.pageInit();

	comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'이벤트 수정'}]);

	/*	이벤트 번호	*/
	var eventNo = $routeParams.event_no;
	if( isNull(eventNo) ) {
		alert('이벤트 번호가 없습니다.');
		window.location.href = PageUrl.common.eventList+'?hakwon_no='+hakwonInfo.hakwon_no;
		return false;
	}

	/*	파일 삭제	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=fileDel]', function() {
		$(this.parentNode.parentNode).remove();
	});

	/*	파일 본문 삽입	*/
	$('#mainNgView').on(clickEvent, 'div.file-box > div.file > div.image', function() {
		var imgSrc = $(this).find('img').attr('src');
		tinymce.activeEditor.insertContent('<p><a href="'+ imgSrc + '" target="_blank"><img src="'+imgSrc+'" class="img-responsive"></a></p><p>&nbsp;</p>');
		tinymce.activeEditor.focus();
	});
	/*	비디오 삽입	*/
	$('#mainNgView').on(clickEvent, 'div.file-box > div.file > div[data-file-type=video]', function() {
		var fileUrl = $(this).attr('data-file-url');
		var videoHtml = hakwonTmpl.common.videoHtml.replace('{{=videoUrl}}', fileUrl);
		tinymce.activeEditor.insertContent(videoHtml);
		tinymce.activeEditor.focus();
	});


	/*	취소	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=cancel]', function() {
		window.history.back();
		return false;
	});

	/*	수정	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=edit]', function() {
		eventService.edit(eventNo);
	});

	$scope.$$postDigest(function(){
		console.log('eventEditController $viewContentLoaded');

		/*	권한 체크 기능	*/
		$scope.checkAuthType = comm.checkAuthType;

		/*	이벤트 수정 정보 조회	*/
		eventService.editData(eventNo);
	});

	$("#wrapper").show();
});

/*	이벤트 뷰	*/
hakwonMainApp.controller('eventViewController', function($scope, $location, $routeParams, eventService){
	console.log('hakwonMainApp eventViewController call');

	/*	페이지 초기화 호출	*/
	hakwonCommon.pageInit();

	comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.common.eventList+'?hakwon_no='+hakwonInfo.hakwon_no, title:'이벤트'}, {url:'#', title:'보기'}]);

	/*	이벤트 번호	*/
	var eventNo = $routeParams.event_no;
	if( isNull(eventNo) ) {
		alert('이벤트 번호가 없습니다.');
		window.location.href = PageUrl.common.eventList+'?hakwon_no='+hakwonInfo.hakwon_no;
		return false;
	}

	var hakwon_no = $routeParams.hakwon_no;

	var student_url = 'https://m.hakwonband.com/index.do#/hakwon/eventDetail?hakwon_no='+hakwonInfo.hakwon_no+'&event_no='+eventNo;
	$scope.$$postDigest(function() {
		setTimeout(function(){
			if( isFlashInstalled() ) {
				var clipboard = new ZeroClipboard($('#clipboard_btn'));
				clipboard.on('aftercopy', function(event) { alert('복사 되었습니다. : '+event.data['text/plain']); });
			} else {
				$scope.copy_prompt = function() {
					prompt("Ctrl+C를 눌러 복사하세요.", $scope.student_url);
				}
			}
		}, 50);
	});


	/*	수정 하기	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=eventEdit]', function() {
		/*
		if( isMobile.any() ) {
			window.location = '/assets/js/popup/popupIndex.html#/eventWrite?hakwon_no=' + hakwon_no+'&event_no='+eventNo;
		} else {
			$window.location.href = PageUrl.event.edit+'?hakwon_no='+hakwonInfo.hakwon_no+'&event_no='+eventNo;
		}
		*/
		$window.location.href = PageUrl.event.edit+'?hakwon_no='+hakwonInfo.hakwon_no+'&event_no='+eventNo;
	});

	/*	목록으로	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=list]', function() {
		window.location.href = PageUrl.common.eventList+'?hakwon_no='+hakwonInfo.hakwon_no;
	});

	/*	삭제 하기	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=eventDel]', function() {
		if( window.confirm('이벤트를 삭제 하시겠습니까?') ) {
			eventService.eventDel(eventNo);
		}
	});

	/**
	 * 이벤트 참여자 메세지 보내기
	 */
	$('#mainNgView').on(clickEvent, 'button[data-act=eventUserMessage]', function() {
		var user_no = $(this).data('user-no');
		window.location.href = PageUrl.message.masterSend+'?hakwon_no='+hakwonInfo.hakwon_no+'&msg_user_no_array='+user_no;
	});

	$scope.$on('$viewContentLoaded', function() {
		console.log('eventViewController $viewContentLoaded');

		/*	권한 체크 기능	*/
		$scope.checkAuthType = comm.checkAuthType;

		/*	이벤트 상세 조회	*/
		eventService.view(eventNo, student_url);
	});

	$("#wrapper").show();
});