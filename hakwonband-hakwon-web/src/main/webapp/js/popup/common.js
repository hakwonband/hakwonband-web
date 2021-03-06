/**
 * 사용자 정보
 * 로그인 후 사용자 정보 셋팅
 * @property userName
 * @property userEmail
 * @property userType
 * @property userId
 *
 */
var userAuth = {};

/**
 * 학원 정보
 */
var hakwonInfo = {
	hakwon_name : undefined
	, hakwon_no : undefined
	, hakwonList : []
	, getHeader : function() {
		return {hakwonNo:this.hakwon_no};
	}
};

/**
 * 클릭 이벤트를 모바일은 touchend를 pc는 click을 사용하도록 한다.
 */
var clickEvent = isMobile.any()?'touchend':'click';
function is_touch_device() {
	return 'ontouchstart' in window // works on most browsers
	|| 'onmsgesturechange' in window; // works on ie10
};

/**
 * 기본 정보
 */
var DefaultInfo = {
	/*	신규 컨텐츠 만료 기준일(New 처리 제외)	*/
	expireDay : 7

	/*	사용자 기본 이미지	*/
	, photoUrl : contextPath+'/images/img_photo.gif'

	/*	기본 학원 로고 패스	*/
	, hakwonLogoPath : contextPath+'/images/logo/144x144.png'

	/*	반 로고 패스	*/
	, classLogoPath	: contextPath+'/images/logo/144x144.png'

	/*	다운로드 패스	*/
	, downPath : HakwonConstant.FileServer.DOWN_DOMAIN+'/down.do?path='

	/*	한번에 보여지는 페이지 카운트	*/
	, pageScale : 10
};
if( isMobile.any() ) {
	DefaultInfo.pageScale = 5;
}

/*	페이지 url	*/
var PageUrl = {
	noticeWrite : {
		hakwon : '#/noticeWrite/hakwon',
		hakwonClass : '#/noticeWrite/class'
	}
};

/**
 * 학원 공통
 */
var HakwonCommon = function() {
	console.log('HakwonCommon create');

	var self = this;

	/*	프로그래스바	*/
	var $progress = $('div.progress.top_progress');

	this.progress = function(perVal) {
	}

	this.onload = function() {
		console.log('HakwonCommon onload');

		if( isSupport() == false ) {
			$('#ieModal').modal('show');
		}

		/*	인증 체크	*/
		self.authCheck();

		if( userAuth.userNo ) {
			console.log('location', window.location);
		}
	};

	this.checkAuthType = function() {
		return userAuth.userType == HakwonConstant.UserType.WONJANG;
	};

	/**
	 * 에디터 옵션 생성
	 */
	this.getEditorOptions = function() {
		var tinymceConstInitOptios = jQuery.extend(true, {}, tinymceConst.initOptios);
		tinymceConstInitOptios.setup = function(ed) {
			ed.on('KeyDown', function(e) {
				var thisEditor = this;
				var keyCode = undefined;
				if (e.keyCode) keyCode = e.keyCode;
				else if (e.which) keyCode = e.which;

				if(keyCode == 9 && !e.altKey && !e.ctrlKey) {
					if (e.shiftKey) {
						thisEditor.execCommand('Outdent');
					} else {
						thisEditor.execCommand('Indent');
					}

					return tinymce.dom.Event.cancel(e);
				}

			});
		};
		tinymceConstInitOptios.statusbar = false;
		tinymceConstInitOptios.toolbar1 += ' hakwonupload hakwonyoutube';
		return tinymceConstInitOptios;
	};

	/**
	 * 해시 파라미터 조회
	 */
	this.getHashParam = function(getKey) {
		var hashUrl = window.location.hash;
		if( hashUrl && getKey ) {
			var startIdx = hashUrl.indexOf('?');
			var queryString = hashUrl.substring(startIdx+1, hashUrl.length);

			var pairs = queryString.split('&');
			var result = {};
			pairs.forEach(function(pair) {
				pair = pair.split('=');
				result[pair[0]] = decodeURIComponent(pair[1] || '');
			});
			return result[getKey];
		} else {
			return null;
		}
	};

	/**
	 * 인증 체크
	 * sync 요청
	 */
	this.authCheck = function() {
		$.ajax({
			url: contextPath+"/authCheck.do",
			type: "post",
			data: 'authCheck=Y',
			async : false,
			dataType: "json",
			success: function(data) {
				console.log('인증 조회');

				var colData = data.colData;
				console.log('colData', colData);
				if( colData && colData.authUserInfo ) {
					userAuth.userName = colData.authUserInfo.user_name;
					userAuth.userEmail = colData.authUserInfo.user_email;
					userAuth.userType = colData.authUserInfo.user_type;
					userAuth.userId = colData.authUserInfo.user_id;
					userAuth.userNo = colData.authUserInfo.user_no;
					userAuth.start_time	= colData.authUserInfo.start_time;
					userAuth.end_time	= colData.authUserInfo.end_time;
				} else {
					console.error('인증 데이타 없음');
					userAuth = {};
					window.close();
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				console.error('인증 체크를 실패 했습니다.');
				window.close();
			}
		});

	}

	/**
	 * 첨부 파일중 일반 파일이 존재하는지 체크
	 * @param fileList
	 * @returns {*}
	 */
	this.checkNotImageFiles = function(fileList) {
		var resultFlag = false;
		_.each(fileList, function(item) {
			if (item.image_yn == 'N') {
				resultFlag = true;
			}
		});
		return resultFlag;
	};

	/**
	 * comm.createFileFullPath()
	 */
	this.createFileFullPath = function(filePath, fileType, isThumb) {
		if (!isNull(filePath)) {
			if( fileType == 'down' ) {
				return  DefaultInfo.downPath + filePath;
			} else {
				if( isThumb == true ) {
					return  HakwonConstant.FileServer.ATTATCH_DOMAIN + filePath + '_thumb';
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

	/**
	 * 사용자 이미지 처리
	 */
	this.userProfileImg = function(imgSrc) {
		if( isNull(imgSrc) ) {
			return DefaultInfo.photoUrl;
		} else {
			if( '/assets/img/p3.jpg' == imgSrc ) {
				return imgSrc;
			} else {
				return HakwonConstant.FileServer.ATTATCH_DOMAIN+imgSrc+"_thumb";
			}
		}
	}

	/**
	 * 학부모의 학생 or 학생의 학부모 리스트 split 처리
	 * @param mainList
	 * @returns {*}
	 */
	this.initRelationList = function(mainList) {
		return _.each(mainList, function(item) {
			var relationStr 	= '';	// 학생 or 학부모 데이터 문자열 값
			var relationList	= [];	// object Array로 변환한 결과 값

			if (!isNull(item.parent_list)) {
				relationStr = item.parent_list;
			} else if (!isNull(item.child_list)) {
				relationStr = item.child_list;
			}

			if (!isNull(relationStr)) {
				var subList  = relationStr.split(CommonConstant.ChDiv.CH_GRP);
				_.each(subList, function(subItem) {
					var tempObj = subItem.split(CommonConstant.ChDiv.CH_DEL);
					var relationObj = {};
					relationObj.user_name		= !isNull(tempObj[0]) ? tempObj[0] : '';
					relationObj.user_id			= !isNull(tempObj[1]) ? tempObj[1] : '';
					relationObj.user_gender		= !isNull(tempObj[2]) ? tempObj[2] : '';
					relationObj.user_no			= !isNull(tempObj[3]) ? tempObj[3] : '';
					relationObj.user_age		= !isNull(tempObj[4]) ? tempObj[4] : '';
					relationObj.user_photo_path	= !isNull(tempObj[5]) ? tempObj[5] : '';
					relationObj.user_type		= !isNull(tempObj[6]) ? tempObj[6] : '';
					relationObj.school_name		= !isNull(tempObj[7]) ? tempObj[7] : '';
					relationObj.school_level	= !isNull(tempObj[8]) ? tempObj[8] : '';

					relationList.push(relationObj);
				});
			}
			return item.relationList = relationList;
		});
	};

	/**
	 * 사용자 정보 파싱 처리
	 * @param userInfoStr
	 * @returns {*}
	 * @usage comm.userInfoParse();
	 */
	this.userInfoParse = function(userInfoStr) {
		var userInfo = {};

		if( userInfoStr ) {
			var userInfoArray = userInfoStr.split(CommonConstant.ChDiv.CH_DEL);
			userInfo.user_name		= !isNull(userInfoArray[0]) ? userInfoArray[0] : '';
			userInfo.user_id		= !isNull(userInfoArray[1]) ? userInfoArray[1] : '';
			userInfo.user_gender	= !isNull(userInfoArray[2]) ? userInfoArray[2] : '';
			userInfo.user_no		= !isNull(userInfoArray[3]) ? userInfoArray[3] : '';
			userInfo.user_age		= !isNull(userInfoArray[4]) ? userInfoArray[4] : '';
			userInfo.user_photo_path= !isNull(userInfoArray[5]) ? userInfoArray[5] : '';
			userInfo.user_type		= !isNull(userInfoArray[6]) ? userInfoArray[6] : '';
			userInfo.school_name	= !isNull(userInfoArray[7]) ? userInfoArray[7] : '';
			userInfo.school_level	= !isNull(userInfoArray[8]) ? userInfoArray[8] : '';
			userInfo.user_type_name	= !isNull(userInfoArray[9]) ? userInfoArray[9] : '';
		}

		return userInfo;
	};



	/**
	 * 비디오 태그 변경
	 * @usage comm.videoTagReplace();
	 */
	this.videoTagReplace = function() {
		if( window.PLATFORM ) {
			$('video').click(function() {
				var videoSrc = $(this).find('source').attr('src');
				window.PLATFORM.videoPlayerCall(videoSrc);
			});
			$('video').removeAttr("controls");
			$('video').attr('poster', '/images/video_preview.jpg');
		}
	};

	/**
	 * 컨텐츠 이미지 가운데 정렬 수정
	 */
	this.contentImageReset = function() {
		$('#content_view_div img').each(function(idx, obj) {
			if( $(obj).parent().css('text-align') == 'center' ) {
				$(obj).css('margin', '10px auto');
			}
		});
	}

	/**
	 * 베타 멤버 체크
	 */
	this.isBetaMember = function() {
		if( location.href.indexOf("teamoboki") > 0 ) {
			return true;
		} else if(userAuth && ("bumwonjang" == userAuth.userId || "icheoneduk" == userAuth.userId) ) {
			return true;
		} else {
			return false;
		}
	}

	this.onload();
};
var comm = new HakwonCommon();