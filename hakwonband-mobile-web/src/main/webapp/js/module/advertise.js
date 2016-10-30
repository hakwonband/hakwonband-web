/**
 * 광고 서비스
 */
hakwonApp.service('advertiseService', function(CommUtil) {
	console.log('hakwonMainApp advertiseService call');

	var advertiseService = {};

	/**
	 * 지역 광고 리스트
	 */
	advertiseService.areaList = function(hakwon_no) {
		$.ajax({
			url: contextPath+"/mobile/edvert/areaList.do",
			type: "post",
			data: $.param({hakwon_no:hakwon_no}, true),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('지역 광고 조회를 실패 했습니다.');
						window.history.back();
						return false;
					}
					var colData = data.colData;

					var blockHakwonArray = [];
					if( colData.blockList && colData.blockList.length > 0 ) {
						for(var i=0; i<colData.blockList.length; i++) {
							var blockInfo = colData.blockList[i];
							blockHakwonArray.push(blockInfo.hakwon_no);
						}
					}
					colData.blockHakwonArray = blockHakwonArray;

					$('ul[data-view=data-veiw]').html($.tmpl(hakwonTmpl.advertRow, colData));
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	return advertiseService;
});

/* 광고 리스트  */
hakwonApp.controller('advertiseListController', function($scope, $window, $routeParams, advertiseService){
	console.log('advertiseListController call');

	var hakwon_no = $routeParams.hakwon_no;

	/*  인증 정보 체크  */
	comm.authCheckFilter();

	/*  학원 번호 체크  */
	var checkFlag = comm.hakwonNoCheckFilter(hakwon_no);
	if( checkFlag === false ) {
		return ;
	}

	/*	헤더 정보 셋팅	*/
	hakwonHeader.setHeader({viewType:'hakwon'});

	$scope.reloadRoute = function() {
		$window.location.reload();
	}
	$scope.$on('$viewContentLoaded', function() {
		console.log('advertiseListController $viewContentLoaded call');

		advertiseService.areaList(hakwon_no);
	});
});

/* 광고 UCC  */
hakwonApp.controller('advertiseUccController', function($scope, $window){
	console.log('advertiseUccController call');

	/*	헤더 정보 셋팅	*/
	hakwonHeader.setHeader({viewType:'user'});

	$scope.reloadRoute = function() {
		$window.location.reload();
	}
});