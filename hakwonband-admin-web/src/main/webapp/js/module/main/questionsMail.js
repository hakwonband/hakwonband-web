/**
 * 문의 메일 서비스
 */
hakwonMainApp.service('questionsMailService', function($http, CommUtil) {
	console.log('hakwonMainApp questionsMailService call', CommUtil);

	var questionsMailService = {};

	/**
	 * 문의 메일 검색
	 */
	questionsMailService.questionsMailList = function(pageNo) {
		if( !pageNo ) {
			pageNo = 1;
		}

		var searchText = $('#mainNgView input[name=searchText]').val();

		var param = {pageNo:pageNo, searchText:searchText};

		$.ajax({
			url: contextPath+"/admin/questionsMail/list.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('문의 메일 조회를 실패 했습니다.');
						return false;
					}

					var $mainEle = $('#mainNgView');

					var colData = data.colData;
					var $tableBody = $mainEle.find('div[data-view=data-div] table > tbody');
					if( colData.questionsMailList.length > 0 ) {
						$tableBody.html($.tmpl(hakwonTmpl.questionsMail.listRow, colData));
					} else {
						$tableBody.html($.tmpl(hakwonTmpl.questionsMail.listNoData));
					}

					console.log('colData', colData);
					var totalPages = comm.pageCalc(colData.questionsMailCount, colData.pageScale);
					/*	페이징 처리	*/
					$('#mainNgView div[data-view=pagination]').bootpag({
						total: totalPages,
						page: pageNo,
						maxVisible: DefaultInfo.pageScale,
						leaps: true
					}).unbind("page").bind("page", function(event, page){
						param.pageNo = page;
						window.location.href = PageUrl.questionsMail.list+"?"+$.param(param);
					});
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
	 * 문의 메일 상세
	 */
	questionsMailService.questionsMailView = function(questionsNo) {
		var params = {questionsNo:questionsNo};
		$.ajax({
			url: contextPath+"/admin/questionsMail/view.do",
			type: "post",
			data: $.param(params, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('문의 메일 조회를 실패 했습니다.');
						return false;
					}

					var colData = data.colData;
					$('#mainNgView div[data-view=data-view]').html($.tmpl(hakwonTmpl.questionsMail.viewData, colData));
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	return questionsMailService;
});

/**
 * 관리자 문의 리스트
 */
hakwonMainApp.controller('questionsMailListController', function($scope, $location, $routeParams, questionsMailService, CommUtil) {
	console.log('hakwonMainApp questionsMailListController call', $scope, $location, $routeParams, questionsMailService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'문의 메일 리스트'}]);

		$("#wrapper").show();

		/**
		 * 검색
		 */
		$scope.search = function() {
			window.location.href = PageUrl.questionsMail.list+"?"+$.param({pageNo:1, searchText:$('#mainNgView input[name=searchText]').val()});
		}
		$('#mainNgView').on('keypress', 'input[name=searchText]', function( event ) {
			if ( event.which == 13 ) {
				window.location.href = PageUrl.questionsMail.list+"?"+$.param({pageNo:1, searchText:$('#mainNgView input[name=searchText]').val()});

				event.preventDefault();
			}
		});

		$scope.$$postDigest(function(){
			console.log('$$postDigest');

			var pageNo = $routeParams.pageNo;
			if( !pageNo ) pageNo = 1;

			var searchText = $routeParams.searchText;
			if( !searchText ) searchText = 1;
			$('#mainNgView input[name=searchText]').val(searchText);

			questionsMailService.questionsMailList(pageNo);
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 관리자에게 문의하기 보기
 */
hakwonMainApp.controller('questionsMailViewController', function($scope, $location, $routeParams, questionsMailService, CommUtil) {
	console.log('hakwonMainApp questionsMailViewController call', $scope, $location, $routeParams, questionsMailService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#/questionsMail/list', title:'문의 메일 리스트'}, {url:'#', title:'문의 메일 상세'}]);

		$("#wrapper").show();

		var questionsNo = $routeParams.questionsNo;
		if( !questionsNo ) {
			alert('올바르지 않은 접근 입니다.');
			window.history.back();
		}

		/*	문의 목록	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=list]', function() {
			commProto.hrefMove('#/questionsMail/list');
		});


		$scope.$$postDigest(function(){
			console.log('$$postDigest');

			questionsMailService.questionsMailView(questionsNo);
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});