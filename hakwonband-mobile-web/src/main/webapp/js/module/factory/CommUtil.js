/**
 * HTML 필터링
 * 예제 : <div ng-bind-html="hakwonObj.introduction | rawHtml"></div>
 */
//hakwonApp.filter('rawHtml', ['$sce', function($sce){
//	return function(val) {
//		return $sce.trustAsHtml(val);
//	};
//}]);


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
hakwonApp.filter('rawHtml', ngFilter.rawHtml);


/**
 * 모바일 공통 앵귤러 모듈
 */
hakwonApp.factory('CommUtil', function($http, $window) {

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

	/*	encodeURIComponent 추가	*/
	CommUtil.encodeURIComponent = function(str) {
		return encodeURIComponent(str);
	}

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
		}).
			success(httpObj.successFun).error(httpObj.errorFun);
	};

	/**
	 * Url 이동시 HashTag에 object를 pramater로 처리
	 * ex) {content_no:1, page_no:1} -> '#/contentPage?content_no=1&page_no=1'
	 * @param href
	 * @param params
	 * @param type
	 */
	CommUtil.locationHref = function (href, params, type) {
		//console.log(resParams);
		if (!isNull(type == 'hakwon')) {
			$window.location.href = href + '?hakwon_no=' + hakwonInfo.currentHakwon.hakwon_no + '&' + $.param(params, true);
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
	 * 첨부 파일중 일반 파일이 존재하는지 체크
	 * @param fileList
	 * @returns {*}
	 */
	CommUtil.checkNotImageFiles = function(fileList) {
		var resultFlag = false;
		_.each(fileList, function(item) {
			if (item.image_yn == 'N') {
				resultFlag = true;
			}
		});
		return resultFlag;
	};

	/**
	 * 파일 경로 생성
	 * CommUtil.createFileFullPath
	 */
	CommUtil.createFileFullPath = function(filePath, fileType, isThumb) {
		if (!isNull(filePath)) {
			if( fileType == 'down' ) {
				return  DefaultInfo.downPath + filePath;
			} else {
				if( isThumb === true ) {
					return  HakwonConstant.FileServer.ATTATCH_DOMAIN + filePath+'_thumb';
				} else {
					return  HakwonConstant.FileServer.ATTATCH_DOMAIN + filePath;
				}
			}
		} else {
			if( fileType == 'photo' ) {
				return DefaultInfo.photoUrl;
			} else if( fileType == 'hakwon' ) {
				return DefaultInfo.hakwonLogo;
			} else if( fileType == 'class' ) {
				return DefaultInfo.classLogo;
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
		return objArray = angular.forEach(objArray, function(item) {
			if (!_.isUndefined(item.reg_date) && item.reg_date) {
				var regDate 	= parseInt(moment(item.reg_date).format('YYYYMMDD'));
				var compareDate = parseInt(moment().weekday(1).format('YYYYMMDD'));

				if (compareDate <= regDate) {
					return item.new_content = true;
				} else {
					return item.new_content = false;
				}
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
		regDate = parseInt(moment(regDate).add(1,'week').format('YYYYMMDD'));
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
	 * sms 링크 생성
	 */
	CommUtil.smsLink = function(phoneNum, msgText) {
		var browserVal = getBrowser();
		if( browserVal.indexOf('ios') == 0 ) {
			return 'sms:'+phoneNum+'&body='+msgText;
		} else if( browserVal.indexOf('android') == 0 ) {
			return 'sms:'+phoneNum+'?body='+msgText;
		} else {
			return 'sms:'+phoneNum+'?body='+msgText;
		}
	};


	return CommUtil;

});