/**
 * 카테고리 서비스
 */
hakwonMainApp.service('hakwonCateService', function($http, CommUtil) {
	console.log('hakwonMainApp hakwonCateService call', CommUtil);

	var self = this;


	/**
	 * 카테고리 리스트
	 */
	this.cateList = function() {

		$.ajax({
			url: contextPath+"/admin/hakwonCate/cateList.do",
			type: "post",
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;
					$('div[data-view=hakwonCateList]').html($.tmpl(hakwonTmpl.setting.category.listCateRow, colData));
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
	this.deleteCate = function(cateCode) {

		var param = {cateCode:cateCode};

		$.ajax({
			url: contextPath+"/admin/hakwonCate/delete.do",
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
							$('div[data-view=hakwonCateList] > div[data-id='+cateCode+']').remove();
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
	this.modifyCate = function(cateCode) {

		var $targetDiv = $('div[data-view=hakwonCateList] > div[data-id='+cateCode+']');
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

		var param = {cateCode:cateCode, cateName:cateName, cateOrder:cateOrder};

		$.ajax({
			url: contextPath+"/admin/hakwonCate/modify.do",
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
	this.insertCate = function() {

		var $newDiv = $('div[data-view=hakwonCateList] > div[data-id=new]');
		var cateName	= $newDiv.find('input[name=cate_name]').val();
		var cateOrder	= $newDiv.find('input[name=cate_order]').val();

		var param = {cateName:cateName, cateOrder:cateOrder};

		$.ajax({
			url: contextPath+"/admin/hakwonCate/insert.do",
			type: "post",
			headers : hakwonInfo.getHeader(),
			data : $.param(param, true),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;
					if( colData.flag == CommonConstant.Flag.success ) {
						$('div[data-view=hakwonCateList] > div').remove();
						self.cateList();
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

});

/**
 * 카테고리 상세
 */
hakwonMainApp.controller('hakwonCateController', function($scope, $location, $routeParams, hakwonCateService, CommUtil) {
	console.log('hakwonMainApp hakwonCateController call', $scope, $location, $routeParams, hakwonCateService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		$("#wrapper").show();

		/**
		 * 신규 카테고리 추가
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=newCate]', function() {
			$('div[data-view=hakwonCateList]').append($.tmpl(hakwonTmpl.setting.category.newCateRow));
		});

		/**
		 * 삭제
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=rowDelete]', function() {
			var cateCode = $(this.parentNode.parentNode).attr('data-id');
			if( window.confirm('카테고리를 삭제하시겠습니까?') ) {
				hakwonCateService.deleteCate(cateCode);
			}
		});

		/**
		 * 수정
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=rowModify]', function() {
			var cateCode = $(this.parentNode.parentNode).attr('data-id');
			hakwonCateService.modifyCate(cateCode);
		});

		/**
		 * 저장
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=newSave]', hakwonCateService.insertCate);

		/**
		 * 취소
		 */
		$('#mainNgView').on(clickEvent, 'button[data-act=newCancel]', function() {
			$('div[data-id=new]').remove();
		});

		/*	화면 로드 후	*/
		$scope.$on('$viewContentLoaded', function() {
			console.log('hakwonCateController $viewContentLoaded');

			hakwonCateService.cateList();
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});