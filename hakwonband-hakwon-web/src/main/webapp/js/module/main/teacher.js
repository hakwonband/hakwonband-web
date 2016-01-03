/**
 * 선생님 서비스
 */
hakwonMainApp.service('teacherService', function($http, CommUtil) {
	console.log('hakwonMainApp teacherService call');

	var teacherService = {};

	/**
	 * 학원 검색
	 */
	teacherService.registHakwonSearch = function() {
		var hakwonCode = $('#mainNgView input[name=hakwonCode]').val();
		if( isNull(hakwonCode) ) {
			alert('학원 코드를 입력 해주세요.');
			return ;
		}

		var param = { hakwonCode : hakwonCode };

		$.ajax({
			url: contextPath+"/hakwon/teacher/registHakwonSearch.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('학원 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;

					var $feedElement = $('div.feed-element').removeClass('no_data');
					if( colData.hakwonInfo ) {
						$feedElement.html($.tmpl(hakwonTmpl.teacher.hakwonRegistSearchRow, colData));
					} else {
						/*	조회된 학원이 없음	*/
						$feedElement.addClass('no_data').html('입력된 정보로 검색된 학원이 없습니다.<br>학원 코드를 다시 확인 해 주세요.');
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
	 * 학원 등록
	 */
	teacherService.hakwonRegist = function() {
		var hakwon_no = $(this).attr('data-hakwon-no');
		if( isNull(hakwon_no) ) {
			alert('학원을 선택해 주세요.');
			return ;
		}
		var param = {hakwonNo:hakwon_no};
		$.ajax({
			url: contextPath+"/hakwon/teacher/hakwonRegist.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('학원 등록을 실패 했습니다.');
						return false;
					}
					if( data.colData.flag == CommonConstant.Flag.success ) {
						alert('학원 가입 요청을 성공 했습니다.');
						$('div.feed-element').empty();
					} else {
						alert('학원 등록을 실패 했습니다.');
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
	 * 학원 등록 취소
	 */
	teacherService.hakwonReqCancel = function() {
		var hakwon_no = $(this).attr('data-hakwon-no');
		if( isNull(hakwon_no) ) {
			alert('학원을 선택해 주세요.');
			return ;
		}
		var param = {hakwonNo:hakwon_no};
		$.ajax({
			url: contextPath+"/hakwon/teacher/hakwonReqCancel.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('학원 등록 취소 요청을 실패 했습니다.');
						return false;
					}

					if( data.colData.flag == CommonConstant.Flag.success ) {
						alert('학원 등록 취소 요청을 성공 했습니다.');
						$('div.feed-element').empty();
					} else {
						alert('학원 등록 취소 요청을 실패 했습니다.');
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

	return teacherService;
});

/**
 * 학원 추가 등록
 */
hakwonMainApp.controller('teacherHakwonRegistController', function($scope, $location, $routeParams, teacherService, CommUtil) {
	console.log('hakwonMainApp teacherHakwonRegistController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'학원 추가 등록'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		$("#wrapper").show();

		/*	검색	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=search]', teacherService.registHakwonSearch);
		$('#mainNgView').on('keypress', 'input[name=hakwonCode]', function( event ) {
			if ( event.which == 13 ) {
				teacherService.registHakwonSearch();
				event.preventDefault();
			}
		});

		/*	학원 등록	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=hakwonRegist]', teacherService.hakwonRegist);

		/*	요청 취소	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=hakwonReqCancel]', teacherService.hakwonReqCancel);

		$scope.$$postDigest(function(){
			console.log('$$postDigest');
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 학원 전체 리스트 컨트롤러
 */
hakwonMainApp.controller('teacherHakwonAllListController', function($scope, $location, $log, $routeParams, hakwonService, CommUtil) {
	console.log('hakwonMainApp teacherHakwonAllListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'학원 전체 리스트'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/**
		 * 학원 전체 리스트
		 */
		CommUtil.ajax({url:contextPath+"/hakwon/teacher/hakwonAllList.do", successFun:function(data) {
			try {
				$scope.hakwonAllList = data.colData.dataList;
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});

		$("#wrapper").show();

		$scope.$$postDigest(function(){
			console.log('hakwonViewController $viewContentLoaded call');
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});