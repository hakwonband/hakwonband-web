/**
 * 학원 공지사항 서비스
 */
hakwonMainApp.service('allSearchService', function(CommUtil) {
	console.log('hakwonMainApp allSearchService call');

	var allSearchService = {};

	return allSearchService;
});


/**
 * 학원 공지사항 리스트 컨트롤러
 */
hakwonMainApp.controller('allSearchListController', function($scope, $location, $window, $routeParams, allSearchService, CommUtil) {
	console.log('hakwonMainApp allSearchListController call');

	/*	페이지 초기화 호출	*/
	hakwonCommon.pageInit();

	$("#wrapper").show();

	/*	헤더 셋팅	*/
	comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'전체 검색'}]);

	$scope.search_count = 0;

	$scope.isSearch = false;

	if (!isNull($routeParams.hakwon_no)) {
		$scope.hakwonNo = $routeParams.hakwon_no;
	} else if (!isNull(hakwonInfo.hakwon_no)) {
		$scope.hakwonNo = hakwonInfo.hakwon_no;
	}

	//	검색어
	$scope.search_text = '';
	if( $routeParams.search_text ) {
		$scope.search_text = $routeParams.search_text;
	}


	$scope.search_list 			= [];
	$scope.noticeListTotCount	= 0;
	$scope.page_no = $routeParams.page_no;
	if( isNull($scope.page_no) ) {
		$scope.page_no = 1;
	}

	/*	초기화	*/
	$scope.$on('$viewContentLoaded', function() {
		console.log('allSearchListController $viewContentLoaded');
	});

	/*	공지사항 리스트 조회	*/
	$scope.getSearchList = function() {

		if( isNull($scope.search_text) ) {
			return ;
		}

		var params = {
			hakwon_no:$scope.hakwonNo
			, page_no: $scope.page_no
			, search_text : $scope.search_text
		};

		CommUtil.ajax({url:contextPath+"/hakwon/search/all.do", param: params, successFun:function(data) {
			$scope.isSearch = true;
			var colData = data.colData;
			if( colData && colData.search_list ) {
				for(var i=0; i<colData.search_list.length; i++) {
					// 001 : 그룹 메세지, 002 : 개별 메세지, 003 : 학원 공지, 004 : 반공지, 005 : 이벤트
					if( colData.search_list[i].search_type == '001' ) {
						colData.search_list[i].search_type_name = '그룹 메세지';
					} else if( colData.search_list[i].search_type == '002' ) {
						colData.search_list[i].search_type_name = '개별 메세지';
					} else if( colData.search_list[i].search_type == '003' ) {
						colData.search_list[i].search_type_name = '학원 공지';
					} else if( colData.search_list[i].search_type == '004' ) {
						colData.search_list[i].search_type_name = '반 공지';
					} else if( colData.search_list[i].search_type == '005' ) {
						colData.search_list[i].search_type_name = '이벤트';
					}
				}

				$scope.search_list		= colData.search_list;
				$scope.search_count		= colData.search_count;
				$scope.pageInfo = CommUtil.getPagenationInfo(colData.search_count, colData.page_scale, DefaultInfo.page_scale, $scope.page_no);
				$scope.page_no = colData.page_po;
			} else {
				$scope.search_list = [];
			}
		}});
	};

	/*	페이지네이션 페이지 이동	*/
	$scope.movePage = function(page_no) {
		// $window.location.href = PageUrl.common.allSearch+'?hakwon_no=' + item.hakwon_no+'&page_no='+item.search_no;
		//$location.search('page_no', page_no);
		$location.search('page_no', page_no);
	};

	$scope.searchPage = function() {
		$location.search('search_text', $scope.search_text);
		$location.search('page_no', 1);
	}

	/*	상세 이동	*/
	$scope.goContentDetail = function(item) {
		console.log('item', item);
		if( item.search_type == '001' ) {
			$window.location.href = PageUrl.message.sendGroupMessageDetail+'?hakwon_no=' + item.hakwon_no+'&messageNo='+item.search_no;
		} else if( item.search_type == '002' ) {
			$window.location.href = PageUrl.message.sendSingleMessageDetail+'?hakwon_no=' + item.hakwon_no+'&receiveNo='+item.search_no;
		} else if( item.search_type == '003' ) {
			$window.location.href = PageUrl.common.noticeDetail+'?hakwon_no=' + item.hakwon_no+'&notice_no='+item.search_no;
		} else if( item.search_type == '004' ) {
			$window.location.href = PageUrl.common.classNoticeDetail+'?hakwon_no=' + item.hakwon_no+'&notice_no='+item.search_no+'&class_no'+item.search_data+'&page=1';
		} else if( item.search_type == '005' ) {
			$window.location.href = PageUrl.common.eventView+'?hakwon_no=' + item.hakwon_no+'&event_no='+item.search_no;
		}
	};

	/*	학원 공지사항 리스트 정보조회	*/
	$scope.getSearchList();
});