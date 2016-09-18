/**
 * 셋팅 서비스
 */
hakwonMainApp.service('settingService', function($http, CommUtil) {
	console.log('hakwonMainApp settingService call');

	var settingService = {};

	/**
	 * 카테고리 리스트
	 */
	settingService.noticeCateList = function() {
		var param = {hakwonNo:hakwonInfo.hakwon_no};

		$.ajax({
			url: contextPath+"/hakwon/setting/noticeCateList.do",
			type: "post",
			headers : hakwonInfo.getHeader(),
			data : $.param(param, true),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('카테고리 조회를 실패 했습니다.');
						return ;
					}
					var colData = data.colData;
					if( colData.dataList && colData.dataList.length > 0 ) {
						$('div[data-view=noticeCateList]').html($.tmpl(hakwonTmpl.setting.noticeCategory.listCateRow, colData));
					} else {
						$('div[data-view=noticeCateList]').html('<span data-type="empty">공지사항 카테고리를 등록해 주세요.</span>');
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
	 * 카테고리 삭제
	 */
	settingService.noticeDeleteCate = function(cateNo) {

		var param = {hakwonNo:hakwonInfo.hakwon_no, cateNo:cateNo};

		$.ajax({
			url: contextPath+"/hakwon/setting/deleteNoticeCate.do",
			type: "post",
			headers : hakwonInfo.getHeader(),
			data : $.param(param, true),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('카테고리 삭제를 실패 했습니다.');
					} else {
						var colData = data.colData;

						if( colData.flag == CommonConstant.Flag.success ) {
							$('div[data-view=noticeCateList] > div[data-id='+cateNo+']').remove();
						} else if( colData.flag == CommonConstant.Flag.exist ) {
							alert('학원에서 사용중인 카테고리 입니다.');
						} else {
							alert('카테고리 삭제를 실패 했습니다.');
						}
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
	 * 카테고리 수정
	 */
	settingService.noticeModifyCate = function(cateNo) {

		var $targetDiv = $('div[data-view=noticeCateList] > div[data-id='+cateNo+']');
		var cateName = $targetDiv.find('input[name=cate_name]').val();
		var cateOrder = $targetDiv.find('input[name=cate_order]').val();

		if( isNull(cateName) ) {
			alert('카테고리 이름을 입력해 주세요.');
			return false;
		}
		if( isNull(cateOrder) ) {
			alert('카테고리 순서를 입력해 주세요.');
			return false;
		}

		var param = {hakwonNo:hakwonInfo.hakwon_no, cateNo:cateNo, cateName:cateName, cateOrder:cateOrder};

		$.ajax({
			url: contextPath+"/hakwon/setting/modifyNoticeCate.do",
			type: "post",
			headers : hakwonInfo.getHeader(),
			data : $.param(param, true),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('카테고리 수정을 실패 했습니다.');
					} else {
						var colData = data.colData;
						if( colData.flag == CommonConstant.Flag.success ) {
							alert('카테고리 수정 성공');
						} else {
							alert('카테고리 수정을 실패 했습니다.');
						}
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
	 * 카테고리 등록
	 */
	settingService.noticeInsertCate = function() {

		var $newDiv = $('div[data-view=noticeCateList] > div[data-id=new]');
		var cateName	= $newDiv.find('input[name=cate_name]').val();
		var cateOrder	= $newDiv.find('input[name=cate_order]').val();

		var param = {hakwonNo:hakwonInfo.hakwon_no, cateName:cateName, cateOrder:cateOrder};

		$.ajax({
			url: contextPath+"/hakwon/setting/insertNoticeCate.do",
			type: "post",
			headers : hakwonInfo.getHeader(),
			data : $.param(param, true),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;
					if( colData.flag == CommonConstant.Flag.success ) {
						//$('div[data-view=noticeCateList] > div').remove();
						settingService.noticeCateList();
					} else {
						alert('카테고리 등록을 실패 했습니다.');
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
	 * 매니저 정보 조회
	 */
	settingService.hakwonManagerInfo = function() {

		var param = {hakwonNo:hakwonInfo.hakwon_no};

		$.ajax({
			url: contextPath+"/hakwon/setting/hakwonManagerInfo.do",
			type: "post",
			headers : hakwonInfo.getHeader(),
			data : $.param(param, true),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('매니저 조회를 실패 했습니다.');
					} else {
						var colData = data.colData;

						if( colData.managerInfo ) {
							$('div[data-view=hakwonManagerInfo]').html($.tmpl(hakwonTmpl.setting.manager.registManager, colData));
						} else {
							$('div[data-view=hakwonManagerInfo]').html('등록된 매니저가 없습니다.');
						}
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
	 * 매니저 검색
	 */
	settingService.hakwonManagerSearch = function() {

		var searchText = $('input[name=searchText]').val();
		if( isNull(searchText) ) {
			alert('검색어를 입력해 주세요.');
			return ;
		}

		var param = {hakwonNo:hakwonInfo.hakwon_no, searchText:searchText};

		$.ajax({
			url: contextPath+"/hakwon/setting/hakwonManagerSearch.do",
			type: "post",
			headers : hakwonInfo.getHeader(),
			data : $.param(param, true),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('매니저 조회를 실패 했습니다.');
					} else {
						var colData = data.colData;
						if( colData && colData.dataList.length > 0 ) {
							$('div[data-view=searchManager]').html($.tmpl(hakwonTmpl.setting.manager.searchManager, colData));
						} else {
							$('div[data-view=searchManager]').html('<div>검색된 매니저가 없습니다.</div>');
						}
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
	 * 매니저 셋팅
	 */
	settingService.hakwonManagerSetting = function(managerNo) {

		var param = {
			hakwonNo:hakwonInfo.hakwon_no
			, managerNo : managerNo
		};

		$.ajax({
			url: contextPath+"/hakwon/setting/hakwonManagerSetting.do",
			type: "post",
			headers : hakwonInfo.getHeader(),
			data : $.param(param, true),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('매니저 설정을 실패 했습니다.');
					} else {
						var colData = data.colData;

						if( colData.flag == 'success' ) {
							settingService.hakwonManagerInfo();
						}
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
	 * 매니저 해지
	 */
	settingService.hakwonManagerRemove = function(managerNo) {

		var param = {
			hakwonNo:hakwonInfo.hakwon_no
			, managerNo : managerNo
		};

		$.ajax({
			url: contextPath+"/hakwon/setting/hakwonManagerRemove.do",
			type: "post",
			headers : hakwonInfo.getHeader(),
			data : $.param(param, true),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('매니저 해지를 실패 했습니다.');
					} else {
						var colData = data.colData;

						if( colData.flag == 'success' ) {
							settingService.hakwonManagerInfo();
						}
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

	return settingService;
});

/**
 * 공지 카테고리 셋팅
 */
hakwonMainApp.controller('settingNoticeCategoryController', function($scope, $location, $routeParams, settingService, CommUtil) {
	console.log('hakwonMainApp settingNoticeCategoryController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'설정'}, {url:'#', title:'공지 카테고리'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		$("#wrapper").show();

		/**
		 * 신규 카테고리 추가
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=newCate]', function() {
			$('span[data-type=empty]').remove();
			$('div[data-view=noticeCateList]').append($.tmpl(hakwonTmpl.setting.noticeCategory.newCateRow));
		});

		/**
		 * 삭제
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=rowDelete]', function() {
			var cateNo = $(this.parentNode.parentNode).attr('data-id');
			if( window.confirm('카테고리를 삭제하시겠습니까?') ) {
				settingService.noticeDeleteCate(cateNo);
			}
		});

		/**
		 * 수정
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=rowModify]', function() {
			var cateNo = $(this.parentNode.parentNode).attr('data-id');
			settingService.noticeModifyCate(cateNo);
		});

		/**
		 * 저장
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=newSave]', settingService.noticeInsertCate);

		/**
		 * 취소
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=newCancel]', function() {
			$('div[data-id=new]').remove();
		});

		$scope.$$postDigest(function(){
			console.log('$$postDigest');

			settingService.noticeCateList();
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 매니저 셋팅
 */
hakwonMainApp.controller('settingManagerController', function($scope, $location, $routeParams, settingService, CommUtil) {
	console.log('hakwonMainApp settingManagerController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'설정'}, {url:'#', title:'매니저 설정'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		$("#wrapper").show();

		/**
		 * 매니저 검색
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=search]', settingService.hakwonManagerSearch);

		$('#mainNgView').on(clickEvent, 'button[data-act=registManager]', function() {
			var managerNo = $(this).attr('data-manager-no');
			if( isNull(managerNo) ) {
				return ;
			}
			settingService.hakwonManagerSetting(managerNo);
		});

		/*	매니저 해지	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=removeManager]', function() {
			var managerNo = $(this).attr('data-manager-no');
			if( isNull(managerNo) ) {
				return ;
			}
			if( window.confirm('매니저를 해지하시겠습니까?') ) {
				settingService.hakwonManagerRemove(managerNo);
			}
		});

		/**
		 * 저장
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=newSave]', settingService.noticeInsertCate);

		$scope.$$postDigest(function(){
			console.log('$$postDigest');

			settingService.hakwonManagerInfo();
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 엑셀 등록
 */
hakwonMainApp.controller('settingExcelRegistController', function($scope, $location, $routeParams, settingService, CommUtil) {
	console.log('hakwonMainApp settingExcelRegistController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'설정'}, {url:'#', title:'엑셀 회원 등록'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		$("#wrapper").show();

		/*	결과 리스트	*/
		$scope.resultList = [];

		$scope.$$postDigest(function(){
			console.log('$$postDigest');

			/*	파일 업로드 객체 생성		*/
			if( comm.isAndroidUploader() ) {
				angular.element("input[data-act=file_upload]").click(function() {
					delete window.uploadCallBack;
					window.uploadCallBack = function(uploadJsonStr) {
						try {
							var resultObj = JSON.parse(uploadJsonStr);
							if( !resultObj.resultList || resultObj.resultList.length == 0 ) {
								alert('파일 업로드를 실패 했습니다.');
								$scope.resultList = [];
							} else {
								$scope.resultList = resultList;
							}
						} catch(e) {
							alert('파일 업로드를 실패 했습니다.');
							$scope.resultList = [];
						}
					};
					var param = {
						fileType : 'all'
						, multipleYn : 'Y'
						, callBack : 'uploadCallBack'
						, upload : {
							url : window.location.protocol+'//'+window.location.host+'/hakwon/excel_join.do'
							, param : {hakwonNo:hakwonInfo.hakwon_no}
							, cookie : document.cookie
						}
					};
					window.PLATFORM.fileChooser(JSON.stringify(param));

					return false;
				});
			} else {
				var fileUploadOptions = new UploadOptions();
				fileUploadOptions.customExtraFields = {hakwonNo:hakwonInfo.hakwon_no};
				fileUploadOptions.url = '/hakwon/excel_join.do';
				fileUploadOptions.onFinish = function(event, total) {
					if (this.errorFileArray.length + this.errorCount > 0) {
						alert('첨부파일 업로드를 실패 했습니다.' +  this.errorFileArray + '-' + this.errorCount);
						$scope.resultList = [];
					} else {
						var result = this.uploadFileArray[0];
						if( !result.resultList || result.resultList.length == 0 ) {
							alert('파일 업로드를 실패 했습니다.');
							$scope.resultList = [];
						} else {
							$scope.resultList = result.resultList;
						}
						$scope.$digest();
					}
				};

				$scope.fileUploadObj = angular.element("input[data-act=file_upload]").html5_upload(fileUploadOptions);
			}
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});