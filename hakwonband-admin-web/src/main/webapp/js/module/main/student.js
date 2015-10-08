/**
 * 학생 서비스
 */
hakwonMainApp.service('studentService', function($http, CommUtil) {
	console.log('hakwonMainApp studentService call', CommUtil);

	var studentService = {};

	/**
	 * 학생 리스트
	 */
	studentService.studentList = function(pageNo) {
		var searchText = $('#mainNgView input[name=searchText]').val();
		if( !pageNo ) pageNo = 1;

		var param = {
			pageNo : pageNo
			, searchText : searchText
		};

		$.ajax({
			url: contextPath+"/admin/student/list.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('학생 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;

					var $dataDiv = $('#mainNgView div[data-view=data-div]');
					var $dataTableBody = $dataDiv.find('table > tbody');

					if( colData.dataCount == 0 ) {
						$dataTableBody.html($.tmpl(hakwonTmpl.student.listNoData, colData));

						$dataDiv.find('thead').hide();
						$('#mainNgView div[data-view=pagination]').html('');
					} else {
						$dataTableBody.html($.tmpl(hakwonTmpl.student.listRow, colData));

						$dataDiv.find('thead').show();
						var totalPages = comm.pageCalc(colData.dataCount, colData.pageScale);
						$('#mainNgView div[data-view=pagination]').bootpag({
							total: totalPages,
							page: pageNo,
							maxVisible: DefaultInfo.pageScale,
							leaps: true
						}).unbind("page").bind("page", function(event, page){
							param.pageNo = page;
							window.location.href = PageUrl.student.list+"?"+$.param(param);
						});
					}

					$dataDiv.find('.i-checks').iCheck({
						checkboxClass: 'icheckbox_square-green'
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

	/**
	 * 학생 상세
	 */
	studentService.studentView = function(studentUserNo) {
		var param = {studentUserNo:studentUserNo};
		$.ajax({
			url: contextPath+"/admin/student/view.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('학생 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;
					$('#mainNgView > div[data-view=data-view]').html($.tmpl(hakwonTmpl.student.viewData, colData));
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	return studentService;
});

/**
 * 학생 리스트
 */
hakwonMainApp.controller('studentListController', function($scope, $location, $routeParams, studentService, CommUtil) {
	console.log('hakwonMainApp studentListController call', $scope, $location, $routeParams, studentService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'학생'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/*	검색	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=search]', function() {
			window.location.href = PageUrl.student.list+"?"+$.param({pageNo:1, searchText:$('#mainNgView input[name=searchText]').val()});
		});
		$('#mainNgView').on('keypress', 'input[name=searchText]', function( event ) {
			if ( event.which == 13 ) {
				window.location.href = PageUrl.student.list+"?"+$.param({pageNo:1, searchText:$('#mainNgView input[name=searchText]').val()});
			}
		});


		$("#wrapper").show();
		$scope.$$postDigest(function() {
			/**
			 * 페이지 번호
			 */
			var pageNo = $routeParams.pageNo;
			if( !pageNo ) pageNo = 1;

			var searchText = $routeParams.searchText;
			if( !searchText ) searchText = '';
			$('#mainNgView input[name=searchText]').val(searchText);

			studentService.studentList(pageNo);
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 학생 상세
 */
hakwonMainApp.controller('studentViewController', function($scope, $location, $routeParams, studentService, CommUtil) {
	console.log('hakwonMainApp studentViewController call', $scope, $location, $routeParams, studentService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'학생'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/**
		 * 학생 번호
		 */
		var studentUserNo = $routeParams.studentUserNo;
		if( !studentUserNo ) {
			alert('학생을 선택해 주세요.');
			window.history.back();
			return ;
		}

		/*	목록으로	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=list]', function() {
			commProto.hrefMove(PageUrl.student.list);
		});


		$("#wrapper").show();
		$scope.$$postDigest(function(){
			studentService.studentView(studentUserNo);
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});