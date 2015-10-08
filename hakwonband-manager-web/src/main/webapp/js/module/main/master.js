/**
 * 원장 서비스
 */
hakwonMainApp.service('masterService', function() {
	console.log('hakwonMainApp masterService call');

	var masterService = {};

	/**
	 * 원장 상세
	 */
	masterService.masterView = function(masterUserNo) {
		var param = {masterUserNo:masterUserNo};
		$.ajax({
			url: contextPath+"/manager/master/view.do",
			type: "post",
			data: $.param(param, true),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('원장님 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;
					$('#mainNgView > div[data-view=data-view]').html($.tmpl(hakwonTmpl.master.viewData, colData));
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	return masterService;
});

/**
 * 원장 상세
 */
hakwonMainApp.controller('masterViewController', function($scope, $location, $routeParams, masterService, CommUtil) {
	console.log('hakwonMainApp masterViewController call', $scope, $location, $routeParams, masterService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'원장님 상세'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/**
		 * 학생 번호
		 */
		var masterUserNo = $routeParams.masterUserNo;
		if( !masterUserNo ) {
			alert('원장님을 선택해 주세요.');
			window.history.back();
			return ;
		}

		/*	목록으로	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=list]', function() {
			window.history.back();
		});

		/*	계정 일시 정지	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=stop]', function() {
			masterService.userStop(masterUserNo);
		});



		$("#wrapper").show();
		$scope.$on('$viewContentLoaded', function() {
			masterService.masterView(masterUserNo);
		});
		$scope.$$postDigest(function(){
			console.log('$$postDigest');
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});