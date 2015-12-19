/**
* HTML 필터링
* 예제 : <div ng-bind-html="hakwonObj.introduction | rawHtml"></div>
*/
//hakwonMainApp.filter('rawHtml', function($sce){
//	return function(val) {
//		return $sce.trustAsHtml(val);
//	};
//});

var ngFilter = {};

ngFilter.rawHtml = function ($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
};

/**
 * HTML 필터링
 * 예제 : <div ng-bind-html="hakwonObj.introduction | rawHtml"></div>
 */
hakwonMainApp.filter('rawHtml', ngFilter.rawHtml);

/**
 * 학원 공통 앵귤러 모듈
 */
hakwonMainApp.factory('CommUtil', function($http, $window, $log) {

	var CommUtil = {};

	/**
	 * 년월 - 포멧터
	 */
	CommUtil.yearMonthFormatter = function(dateStr) {
		if( dateStr ) {
			return dateStr.substring(0, 4)+'-'+dateStr.substring(4, 6);
		} else {
			return '';
		}
	};

	/**
	 * 비디오 파일 체크
	 */
	CommUtil.isFileType = function(imageYn, mimeType) {
		if( imageYn == 'Y' ) {
			return 'img';
		} else {
			if( mimeType.indexOf("video") == 0 ) {
				return 'video';
			} else if( mimeType.indexOf("audio") == 0 ) {
				return 'audio';
			} else {
				return 'file';
			}
		}
	};

	/**
	 * 데이타 통신을 도와주는 util
	 * @param httpObj
	 * errorFun : 실패 함수(기본:commProto.commonError)
	 * successFun : 성공 함수
	 * method : 통신 메소드(기본:post)
	 * queryString : 쿼리 스트링
	 * param : 쿼리스트링으로 변환되는 파라미터 object
	 * url : 호출 url
	 */
	CommUtil.ajax = function(httpObj) {
		if( !httpObj.errorFun ) {
			httpObj.errorFun = commProto.commonError;
		}

		if( !httpObj.method ) {
			httpObj.method = 'post';
		}

		if( !httpObj.queryString && httpObj.param ) {
			httpObj.queryString = $.param(httpObj.param, true);
		}

		$http({
			withCredentials: false,
			method: httpObj.method,
			url: httpObj.url,
			headers: angularHeaders,
			data: httpObj.queryString
		}).success(httpObj.successFun).error(httpObj.errorFun);
	};

	/**
	 * Url 이동시 HashTag에 object를 pramater로 처리
	 * ex) {content_no:1, page_no:1} -> '#/contentPage?content_no=1&page_no=1'
	 * @param href
	 * @param params
	 * @param type
	 */
	CommUtil.locationHref = function (href, params, type) {
		if (!isNull(type == 'hakwon')) {
			params = _.extend({
				hakwon_no : hakwonInfo.hakwon_no
			}, params);
			$window.location.href = href + '?' + $.param(params, true);
			return false;
		} else {
			$window.location.href = href + '?' + $.param(params, true);
			return false;
		}
	};

	/**
	 * 페이지 강제 리로드 유틸
	 */
	CommUtil.reloadRoute = function() {
		$window.location.reload();
	};

	/**
	 * 공지사항 리스트의 썸네일 파일경로 문자열을 object Array로 변경
	 * @param objArray
	 * @returns {void|*|Object|Array}
	 */
	CommUtil.initThumbPathArray = function(objArray) {
		var strArray 		= [],
			filePathArray	= [];
		if (!_.isUndefined(objArray) && objArray.length > 0) {
			return objArray = angular.forEach(objArray, function(outerItem){
				strArray		= [];
				filePathArray	= [];
				if (!isNull(outerItem.file_path_array)) {
					strArray = outerItem.file_path_array.split(CommonConstant.ChDiv.CH_DEL);
					_.each(strArray, function(item){
						var fileObj = {};
						fileObj.thumb_file_full_path = HakwonConstant.FileServer.ATTATCH_DOMAIN + item;
						filePathArray.push(fileObj);
					});
				}
				outerItem.thumbFileList = filePathArray;
				return outerItem;
			});
		}
	};

	/**
	 * 상세보기 파일 리스트, 이미지와 일반파일로 분류
	 * @param $scope
	 */
	CommUtil.initFileTypeArray = function($scope) {
		if ($scope.fileList.length > 0) {
			$scope.imageFileArray	= [];
			$scope.normalFileArray	= [];
			_.each($scope.fileList, function (item) {
				if (item.image_yn == 'Y') {
					$scope.imageFileArray.push(item);
				} else {
					$scope.normalFileArray.push(item);
				}
			});
		}
	};

	/**
	 * 전체 파일 경로 생성
	 * @param filePath
	 * @param fileType
	 * @returns {*}
	 */
	CommUtil.createFileFullPath = function(filePath, fileType) {
		//$log.log('filePath', filePath);
		if (!isNull(filePath)) {
			if( fileType == 'down' ) {
				return  DefaultInfo.downPath + filePath;
			} else {
				if( fileType == 'photo' ) {
					return  HakwonConstant.FileServer.ATTATCH_DOMAIN + filePath+"_thumb";
				} else if( fileType == 'hakwon' ) {
					return  HakwonConstant.FileServer.ATTATCH_DOMAIN + filePath+"_thumb";
				} else if( fileType == 'class' ) {
					return  HakwonConstant.FileServer.ATTATCH_DOMAIN + filePath+"_thumb";
				} else {
					return  HakwonConstant.FileServer.ATTATCH_DOMAIN + filePath;
				}
			}
		} else {
			if( fileType == 'photo' ) {
				return DefaultInfo.photoUrl;
			} else if( fileType == 'hakwon' ) {
				return DefaultInfo.hakwonLogoPath;
			} else if( fileType == 'class' ) {
				return DefaultInfo.classLogoPath;
			} else if( fileType == 'attachment' ) {
				return '';
			} else {
				return DefaultInfo.photoUrl;
			}
		}
	};

	/*
	 * 신규 컨텐츠 체크 key:value 생성 : 컨텐츠 생성일 기준 7일전과 현재일 기준 7일전을 비교하여 boolean 리턴
	 * @param objArray
	 * @returns {void|*|Object|Array}
	 */
	CommUtil.createNewContent = function (objArray) {
		return _.each(objArray, function(item) {
			if (!_.isUndefined(item.reg_date) && item.reg_date) {
				var regDate 	= parseInt(moment(item.reg_date).format('YYYYMMDD'));
				var compareDate = parseInt(moment().weekday(1).format('YYYYMMDD'));

				return item.new_content = compareDate <= regDate;
			}
		});
	};

	/**
	 * 사용자 성별 문자열 리턴
	 * CommUtil.createGenderName
	 */
	CommUtil.createGenderName = function(gender) {
		//console.log('gender : ', gender);
		if (!isNull(gender) && gender == 'M') {
			return  '남';
		} else if (!isNull(gender) && gender == 'F') {
			return '여';
		} else {
			return '성별없음';
		}
	};

	/*
	 * 페이지네이션 정보 계산
	 * @param totalCount, scale, pageScale, curPage
	 * @return {Object}
	 */
	CommUtil.getPagenationInfo = function(totalCount, scale, pageScale, curPage) {
		if (totalCount === 0) {
			return null;
		}
		totalCount = _.max([totalCount, 1]);
		var totalPage = parseInt((totalCount-1)/scale)+1;
		var groups = _.groupBy(_.range(1, totalPage+1), function(page) {
			return parseInt((page-1)/pageScale);
		});
		var pages = groups[parseInt((curPage-1)/pageScale)];
		var firstPage = pages[0];
		var lastPage = pages[pages.length-1];
		var result = {pages: pages, curPage: curPage, firstPage:firstPage, lastPage:lastPage, totalPage: totalPage};
		if (firstPage > 1) {
			result.prevPage = firstPage - 1;
		}
		if (lastPage < totalPage) {
			result.nextPage = lastPage + 1;
		}
		return result
	};

	/*
	 *  새글 여부 : 게시글의 등록일이 7일을 넘기지 않았으면 새글임
	 *  @param regDate
	 *  @return boolean
	 */
	CommUtil.isNewItem = function(regDate) {
		// DefaultInfo.expireDate : 컨텐츠 new 만료처리 기준일
		regDate = parseInt(moment(regDate).add(DefaultInfo.expireDate, 'days').format('YYYYMMDD'));
		var compareDate = parseInt(moment().format('YYYYMMDD'));
		return compareDate <= regDate;
	};

	/*
	 * 특정 컨테이너(엘리먼트)로부터 하위에 있는 폼 요소들의 입력 값을 json object형태로 반한함
	 * @param $container
	 * @return {Object}
	 */
	CommUtil.getFormValues = function($container, scope) {
		var data = _.object(_.map($container.find('input,select'), function(element) {
			var key = element.name;
			var value = (scope[key] || element.value || '').trim();
			if (!key || (element.type === 'radio' && element.checked === false)) {
				key = 'nil';
				value = '';
			}
			return [key, value];
		}));
		delete data.nil;
		return data;
	};

	/**
	 * 통신
	 */
	CommUtil.ajaxReq = [];
	CommUtil.colHttp = function(reqObj) {
		if( reqObj.double_req_msg === null ) {
			/*	토스트 안보여줌	*/
		} else if( isNull(reqObj.double_req_msg) ) {
			reqObj.double_req_msg = '요청 중 입니다.';
		}
		if( isNull(reqObj.method) ) {
			reqObj.method = 'post';
		}

		if( _.contains(CommUtil.ajaxReq, reqObj.url) ) {
			if( reqObj.double_req_msg !== null ) {
				alert(reqObj.double_req_msg);
			}
		} else {
			CommUtil.ajaxReq.push(reqObj.url);

			var queryData = undefined;
			if( reqObj.param ) {
				queryData = $.param(reqObj.param, true);
			}
			$http({
				method		: reqObj.method
				, url		: reqObj.url
				, headers	: reqObj.header
				, data		: queryData
			}).then(function(response) {
				console.debug('response', response);
				CommUtil.ajaxReq = _.without(CommUtil.ajaxReq, reqObj.url);
				if( reqObj.callback ) {
					response.data._param = reqObj.param;
					reqObj.callback(response.data);
				}
			}, function(response) {
				CommUtil.ajaxReq = _.without(CommUtil.ajaxReq, reqObj.url);
				if( reqObj.callback ) {
					response.data._param = reqObj.param;
					reqObj.callback(response.data);
				}
			});
		}
	}

	return CommUtil;

});

hakwonMainApp.directive('focusOn', function() {
	return function(scope, elem, attr) {
		scope.$on(attr.focusOn, function(e, name) {
			elem[0].focus();
		});
	};
});
/**
 * ng-enter 커스텀 디렉티브
 */
hakwonMainApp.directive('ngEnter', function () {
	return function (scope, element, attrs) {
		element.bind('keydown keypress', function (event) {
			if(event.which === 13) {
				scope.$apply(function (){
					scope.$eval(attrs.ngEnter, {$event:event});
				});
				event.preventDefault();
			}
		});
	};
})