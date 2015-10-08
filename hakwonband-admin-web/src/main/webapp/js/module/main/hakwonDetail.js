/**
 * 학원 상세
 */
hakwonMainApp.service('hakwonDetailService', function($http, CommUtil) {
	console.log('hakwonMainApp hakwonDetailService call', CommUtil);

	var hakwonDetailService = {};

	/**
	 * 학원 상세 조회
	 */
	hakwonDetailService.hakwonDetailLeft = function(hakwonNo, menuType) {
		var param = {hakwonNo:hakwonNo};
		$.ajax({
			url: contextPath+"/admin/hakwon/detail.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;
					colData.menuType = menuType;

					$('div[data-view=left]').html($.tmpl(hakwonTmpl.hakwon.hakwonDetailLeft, colData));

					if( menuType == 'introduce' ) {
						/*	소개 페이지	*/
						$('div[data-view=content]').html($.tmpl(hakwonTmpl.hakwon.hakwonIntroduce, colData));
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
	 * 학원 소개 수정 폼
	 */
	hakwonDetailService.introUpdateForm = function(hakwonNo) {
		var param = {hakwonNo:hakwonNo};
		$.ajax({
			url: contextPath+"/admin/hakwon/introDetail.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;

					$('div[data-view=content]').html($.tmpl(hakwonTmpl.hakwon.hakwonIntroUpdate, colData));

					/*	에디터 초기화 완료 후 value 셋팅	*/
					var editOptions = comm.getEditorOptions();
					editOptions.setup = function(ed) {
						ed.on("init", function(ed) {
							if (!_.isUndefined(colData.hakwonInfo.introduction) && colData.hakwonInfo.introduction) {
								tinymce.activeEditor.setContent(colData.hakwonInfo.introduction);
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


					/*	파일 업로드 셋팅	*/
					if( comm.isAndroidUploader() ) {
						$("input[data-act=file_upload]").click(function() {
							delete window.uploadCallBack;
							window.uploadCallBack = function(uploadJsonStr) {
								try {
									var resultObj = JSON.parse(uploadJsonStr);
									if( resultObj.error ) {
										alert('메세지 파일 업로드를 실패 했습니다.');
									} else {
										var fileInfo = resultObj.colData;
										$('#mainNgView div.attachment').append($.tmpl(hakwonTmpl.messageView.attchFile, {fileInfo:fileInfo}))
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
									, param : {uploadType:CommonConstant.File.TYPE_INTRODUCTION}
									, cookie : document.cookie
								}
							};
							window.PLATFORM.fileChooser(JSON.stringify(param));

							return false;
						});
					} else {
						var messageUploadOptions = new UploadOptions();
						messageUploadOptions.customExtraFields = {'uploadType' : CommonConstant.File.TYPE_INTRODUCTION};
						messageUploadOptions.onFinish = function(event, total) {
							if (this.errorFileArray.length + this.errorCount > 0) {
								alert('메세지 파일 업로드를 실패 했습니다.');
							} else {
								for (var i = 0; i < this.uploadFileArray.length; i++) {
									var fileInfo = this.uploadFileArray[i];

									$('#mainNgView div.attachment').append($.tmpl(hakwonTmpl.messageView.attchFile, {fileInfo:fileInfo}))
								}
							}
						};

						$("input[data-act=file_upload]").html5_upload(messageUploadOptions);
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
	 * 학원 소개 수정 저장
	 */
	hakwonDetailService.introUpdateSave = function(hakwonNo) {
		var editContent = tinymce.activeEditor.getContent();
		editContent = editContent.replace(/><\/div>/g, ">&nbsp;</div>");
		editContent = editContent.replace(/><\/p>/g, ">&nbsp;</p>");

		var params = {
			hakwon_no			: hakwonNo,
			introduction		: editContent,
		};
		/*	파일 리스트	*/
		var fileList = new Array();
		$('div.file-box').each(function(idx, obj) {
			var fileNo = $(obj).attr('data-file-no');
			fileList.push(fileNo);
		});
		params.fileList = fileList.toString();

		console.log(params);

		CommUtil.ajax({url:contextPath+"/admin/hakwon/editHakwonIntro.do", param:params, successFun:function(data) {
			try {
				var colData = data.colData;
				if( colData.result == CommonConstant.Flag.success ) {
					alert('학원소개가 수정되었습니다.');
					window.location = PageUrl.hakwonDetail.introduce+'?hakwon_no='+hakwonNo;
				} else {
					alert('학원소개가 수정을 실패하였습니다. 다시 시도해 주시기 바랍니다.');
					commProto.logger({editHakwonIntroError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/**
	 * 학원 소개 미리보기
	 */
	hakwonDetailService.previewIntro = function(hakwon_no) {
		var editContent = tinymce.activeEditor.getContent();
		editContent = editContent.replace(/><\/div>/g, ">&nbsp;</div>");
		editContent = editContent.replace(/><\/p>/g, ">&nbsp;</p>");

		var params = {
			hakwon_no			: hakwon_no
			, introduction		: editContent
		};

		$.ajax({
			url: contextPath+"/admin/hakwon/previewIntro.do",
			type: "post",
			data: $.param(params, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;
					if( colData || colData.preivewNo ) {
						window.open(HakwonConstant.Site.MOBILE+'/preview.do?preview_no='+colData.preivewNo, "", "width=320, height=480");
						return false;
					} else {
						alert('미리보기를 실패 했습니다.');
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
	 * 학원 상세 반 리스트
	 */
	hakwonDetailService.classList = function(hakwonNo) {
		var param = {hakwonNo:hakwonNo};
		$.ajax({
			url: contextPath+"/admin/hakwon/classList.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;

					$('div[data-view=content]').html($.tmpl(hakwonTmpl.hakwon.hakwonClassList, colData));
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
	 * 학원 상세 선생님 리스트
	 */
	hakwonDetailService.teacherList = function(hakwonNo) {
		var param = {hakwonNo:hakwonNo};
		$.ajax({
			url: contextPath+"/admin/teacher/list.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;

					$('div[data-view=content]').html($.tmpl(hakwonTmpl.hakwon.hakwonTeacherList, colData));
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
	 * 학원 상세 학생 리스트
	 */
	hakwonDetailService.studentList = function(hakwonNo, pageNo) {
		var param = {hakwonNo:hakwonNo, pageNo:pageNo};
		$.ajax({
			url: contextPath+"/admin/student/list.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;

					/*	리스트	*/
					$('div[data-view=content]').html($.tmpl(hakwonTmpl.hakwon.hakwonStudentList, colData));

					/*	페이징	*/
					var totalPages = comm.pageCalc(colData.dataCount, colData.pageScale);
					$('#mainNgView div[data-view=pagination]').bootpag({
						total: totalPages,
						page: pageNo,
						maxVisible: DefaultInfo.pageScale,
						leaps: true
					}).unbind("page").bind("page", function(event, page){
						param.pageNo = page;
						window.location.href = PageUrl.hakwonDetail.studentList+'?'+$.param(param);
					});
					if( colData.dataCount == 0 ) {
						$('#mainNgView div[data-view=pagination]').hide();
					} else {
						$('#mainNgView div[data-view=pagination]').show();
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
	 * 학원 상세 학부모 리스트
	 */
	hakwonDetailService.parentList = function(hakwonNo, pageNo) {
		var param = {hakwonNo:hakwonNo, pageNo:pageNo};
		$.ajax({
			url: contextPath+"/admin/parent/list.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;

					/*	리스트	*/
					$('div[data-view=content]').html($.tmpl(hakwonTmpl.hakwon.hakwonParentList, colData));

					/*	페이징	*/
					var totalPages = comm.pageCalc(colData.dataCount, colData.pageScale);
					$('#mainNgView div[data-view=pagination]').bootpag({
						total: totalPages,
						page: pageNo,
						maxVisible: DefaultInfo.pageScale,
						leaps: true
					}).unbind("page").bind("page", function(event, page){
						param.pageNo = page;
						window.location.href = PageUrl.hakwonDetail.parentList+'?'+$.param(param);
					});
					if( colData.dataCount == 0 ) {
						$('#mainNgView div[data-view=pagination]').hide();
					} else {
						$('#mainNgView div[data-view=pagination]').show();
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
	 * 학원 상태 변경
	 */
	hakwonDetailService.hakwonStatusChange = function(hakwon_no) {
		var selectHakwonStatus = $('select[name=hakwon_status]').val();
		var currentStatus = $('li[data-view=statusLi]').attr('data-status');

		if( currentStatus == selectHakwonStatus ) {
			alert('현재 상태와 동일한 상태 입니다.');
			return ;
		}

		var message = $('textarea[name=hakwonStatusMessage]').val();
		if( isNull(message) ) {
			alert('원장님께 전달할 메세지를 입력해 주세요.');
			return ;
		}

		var param = {hakwonNo:hakwon_no, status:selectHakwonStatus, message:message};
		$.ajax({
			url: contextPath+"/admin/hakwon/status.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('학원 상태 업데이트를 실패 했습니다.');
						return ;
					}

					var colData = data.colData;
					if( colData.flag == CommonConstant.Flag.success ) {
						if( selectHakwonStatus == '001' ) {
							$('li[data-view=statusLi]').html('학원 상태 : 인증');
						} else if( selectHakwonStatus == '002' ) {
							$('li[data-view=statusLi]').html('학원 상태 : 미인증');
						} else if( selectHakwonStatus == '003' ) {
							$('li[data-view=statusLi]').html('학원 상태 : 원장님&선생님 접근 금지');
						}
						$('textarea[name=hakwonStatusMessage]').val('');
						$('li[data-view=statusLi]').attr('data-status', selectHakwonStatus);
						$('#hakwon_status_layer').modal('hide');
					} else {
						alert('학원 상태 업데이트를 실패 했습니다.');
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

	return hakwonDetailService;
});

/**
 * 학원 상세 반리스트
 */
hakwonMainApp.controller('hakwonDetailClassListController', function($scope, $location, $routeParams, hakwonDetailService, CommUtil) {
	console.log('hakwonMainApp hakwonDetailClassListController call', $scope, $location, $routeParams, hakwonDetailService, CommUtil);
	try {

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'학원'}, {url:'#/hakwon/list', title:'학원 리스트'}, {url:'#', title:'반 리스트'}]);

		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/*	학원 번호	*/
		var currentHakwonNo = $routeParams.hakwon_no;

		/*	학원 상태 변경	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=hakwonStatusChange]', function() {
			hakwonDetailService.hakwonStatusChange(currentHakwonNo);
		});

		$("#wrapper").show();
		$scope.$on('$viewContentLoaded', function() {
			console.log('hakwonDetailClassListController $viewContentLoaded call');

			/*	학원 상세 조회	*/
			hakwonDetailService.hakwonDetailLeft(currentHakwonNo, "classList");

			/*	학원 반 리스트 조회	*/
			hakwonDetailService.classList(currentHakwonNo);
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 학원 상세 선생님 리스트
 */
hakwonMainApp.controller('hakwonDetailTeacherListController', function($scope, $location, $routeParams, hakwonDetailService, CommUtil) {
	console.log('hakwonMainApp hakwonDetailTeacherListController call', $scope, $location, $routeParams, hakwonDetailService, CommUtil);
	try {

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'학원'}, {url:'#/hakwon/list', title:'학원 리스트'}, {url:'#', title:'선생님 리스트'}]);

		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/*	학원 번호	*/
		var currentHakwonNo = $routeParams.hakwon_no;

		/*	학원 상태 변경	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=hakwonStatusChange]', function() {
			hakwonDetailService.hakwonStatusChange(currentHakwonNo);
		});

		$("#wrapper").show();
		$scope.$on('$viewContentLoaded', function() {
			console.log('hakwonDetailTeacherController $viewContentLoaded call');

			/*	학원 상세 조회	*/
			hakwonDetailService.hakwonDetailLeft(currentHakwonNo, "teacherList");

			/*	학원 선생님 리스트 조회	*/
			hakwonDetailService.teacherList(currentHakwonNo);
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 학원 상세 학부모 리스트
 */
hakwonMainApp.controller('hakwonDetailParentListController', function($scope, $location, $routeParams, hakwonDetailService, CommUtil) {
	console.log('hakwonMainApp hakwonDetailParentListController call', $scope, $location, $routeParams, hakwonDetailService, CommUtil);
	try {

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'학원'}, {url:'#/hakwon/list', title:'학원 리스트'}, {url:'#', title:'학부모 리스트'}]);

		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/*	학원 번호	*/
		var currentHakwonNo = $routeParams.hakwon_no;

		/*	학원 상태 변경	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=hakwonStatusChange]', function() {
			hakwonDetailService.hakwonStatusChange(currentHakwonNo);
		});

		$("#wrapper").show();
		$scope.$on('$viewContentLoaded', function() {
			console.log('hakwonDetailParentController $viewContentLoaded call');

			var pageNo = $routeParams.pageNo;
			if( !pageNo ) pageNo = 1;

			/*	학원 상세 조회	*/
			hakwonDetailService.hakwonDetailLeft(currentHakwonNo, "parentList");

			/*	학원 학부모 리스트 조회	*/
			hakwonDetailService.parentList(currentHakwonNo, pageNo);
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 학원 상세 학생 리스트
 */
hakwonMainApp.controller('hakwonDetailStudentListController', function($scope, $location, $routeParams, hakwonDetailService, CommUtil) {
	console.log('hakwonMainApp hakwonDetailStudentListController call', $scope, $location, $routeParams, hakwonDetailService, CommUtil);
	try {

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'학원'}, {url:'#/hakwon/list', title:'학원 리스트'}, {url:'#', title:'학생 리스트'}]);

		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		$("#wrapper").show();
		$scope.$on('$viewContentLoaded', function() {
			console.log('hakwonDetailStudentController $viewContentLoaded call');

			var pageNo = $routeParams.pageNo;
			if( !pageNo ) pageNo = 1;

			var currentHakwonNo = $routeParams.hakwon_no;
			/*	학원 상세 조회	*/
			hakwonDetailService.hakwonDetailLeft(currentHakwonNo, "studentList");

			/*	학원 학생 리스트 조회	*/
			hakwonDetailService.studentList(currentHakwonNo, pageNo);
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 학원 소개
 */
hakwonMainApp.controller('hakwonDetailIntroduceController', function($scope, $location, $routeParams, hakwonDetailService, CommUtil) {
	console.log('hakwonMainApp hakwonDetailIntroduceController call', $scope, $location, $routeParams, hakwonDetailService, CommUtil);
	try {

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'학원'}, {url:'#/hakwon/list', title:'학원 리스트'}, {url:'#', title:'학원 소개'}]);

		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/*	학원 번호	*/
		var currentHakwonNo = $routeParams.hakwon_no;

		/*	학원 상태 변경	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=hakwonStatusChange]', function() {
			hakwonDetailService.hakwonStatusChange(currentHakwonNo);
		});

		$("#wrapper").show();
		$scope.$on('$viewContentLoaded', function() {
			console.log('hakwonDetailIntroduceController $viewContentLoaded call');

			/*	학원 상세 조회	*/
			hakwonDetailService.hakwonDetailLeft(currentHakwonNo, "introduce");
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 학원 소개 수정
 */
hakwonMainApp.controller('hakwonDetailIntroUpdateController', function($scope, $location, $routeParams, hakwonDetailService, CommUtil) {
	console.log('hakwonMainApp hakwonDetailIntroUpdateController call', $scope, $location, $routeParams, hakwonDetailService, CommUtil);
	try {

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'학원'}, {url:'#/hakwon/list', title:'학원 리스트'}, {url:'#', title:'학원 소개'}]);

		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/*	학원 번호	*/
		var currentHakwonNo = $routeParams.hakwon_no;

		/*	학원 상태 변경	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=hakwonStatusChange]', function() {
			hakwonDetailService.hakwonStatusChange(currentHakwonNo);
		});

		/*	취소	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=introUpdateCancel]', function() {
			commProto.hrefMove('#/hakwon/detail/introduce?hakwon_no='+currentHakwonNo);
		});

		/*	미리보기	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=introUpdatePreview]', function() {
			hakwonDetailService.previewIntro(currentHakwonNo);
		});
		/*	저장	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=introUpdateSave]', function() {
			hakwonDetailService.introUpdateSave(currentHakwonNo);
		});

		/*	파일 삭제	*/
		$('#mainNgView').on(clickEvent, 'button.btn_file_del', function() {
			$(this).parents('div.file-box').remove();
		});


		/*	지도 삽입	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=mapInsert]', function() {
			var mapHtml = $('#mainNgView').find('input[name=mapHtml]').val();
			var $mapHtml = $(mapHtml).css('margin', '10px auto').attr('data-type', 'frameMap');
			console.log($mapHtml.prop('outerHTML'));
			$('#mainNgView').find('input[name=mapHtml]').val('');
			tinymce.activeEditor.insertContent($mapHtml.prop('outerHTML'));
		});
		$('#mainNgView').on(clickEvent, 'button[data-act=daumMapInsert]', function() {
			var mapHtml = $('#mainNgView').find('input[name=daumMapHtml]').val();
			mapHtml = mapHtml.replace(/<span(.*)<\/span>/g, "");
			$('body').append('<div style="display:none;" id="temp_map_div">'+mapHtml+'</div>');
			$('#temp_map_div').find('img').addClass('map_img').removeAttr('width').removeAttr('height');

			var mapDataHtml = $('#temp_map_div').find('div:eq(1)').html();
			$('#temp_map_div').remove();

			tinymce.activeEditor.insertContent(mapDataHtml);
		});

		/*	youtube 삽입	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=youtubeInsert]', function() {
			var youtubeID = $('#mainNgView').find('input[name=youtubeID]').val();

			var youtubeHtml = '<a href="http://www.youtube.com/watch?v='+youtubeID+'" target="_blank"><img src="http://img.youtube.com/vi/'+youtubeID+'/0.jpg" class="img-responsive" alt="" data-video="youtube" data-id="'+youtubeID+'" /></a>';
			tinymce.activeEditor.insertContent(youtubeHtml);
		});

		/*	첨부 이미지 추가	*/
		$('#mainNgView').on(clickEvent, 'div.file-box > div.file > div.image', function() {
			var imgSrc = $(this).find('img').attr('src');
			tinymce.activeEditor.insertContent('<img src="'+imgSrc+'" class="img-responsive">');
		});



		$("#wrapper").show();
		$scope.$$postDigest(function(){
			console.log('hakwonDetailIntroduceController $$postDigest call', angular.element("input[data-act=file_upload]"));

			/*	학원 상세 조회	*/
			hakwonDetailService.hakwonDetailLeft(currentHakwonNo, "introduce");

			/*	학원 소개 수정 폼	*/
			hakwonDetailService.introUpdateForm(currentHakwonNo);
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});