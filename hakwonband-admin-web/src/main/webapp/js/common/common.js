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
 * 기본 정보
 */
var DefaultInfo = {
	/*	사용자 기본 이미지	*/
	photoUrl		: contextPath+'/inspinia/img/profile_default.gif'

	/*	기본 학원 로고 패스	*/
	, hakwonLogoPath	: contextPath+'/images/logo/144x144.png'

	, logoUrl			: contextPath+'/images/logo/144x144.png'

	/*	한번에 보여지는 페이지 카운트	*/
	, pageScale : 10

	/*	다운로드 패스	*/
	, downPath : HakwonConstant.FileServer.DOWN_DOMAIN+'/down.do?path='

	, userTypeList : undefined

	/*	시도 구군 정보	*/
	, sido : undefined
	, gugun : {

	}
};

if( isMobile.any() ) {
	DefaultInfo.pageScale = 5;
}

/**
 * 클릭 이벤트를 모바일은 touchend를 pc는 click을 사용하도록 한다.
 */
var clickEvent = isMobile.any()?'touchend':'click';

/*	페이지 url	*/
var PageUrl = {
	hakwon : {
		list : '#/hakwon/list'	//	학원 리스트
		, regist : '#/hakwon/regist'	//	관리자 학원 등록
		, adminModify : '#/hakwon/adminModify'
	}
	, hakwonDetail : {
		classList : '#/hakwon/detail/classList'
		, introduce : '#/hakwon/detail/introduce'
		, teacherList : '#/hakwon/detail/teacherList'
		, studentList : '#/hakwon/detail/studentList'
		, parentList : '#/hakwon/detail/parentList'
	}
	, adminQuestion : {
		list : '#/adminQuestion/list'	//	관리자 문의 리스트
		, view : '#/adminQuestion/view'	//	관리자 문의 리스트
	}
	, excelUpload : '#/hakwon/excelUpload'	//	엑셀 업로드

	, edvertise : {
		bankDepositList: '#/edvertise/bankDeposit/list'	//	광고 입금자 리스트
		, bannerList : '#/advertise/banner/list'	//	광고 베너 리스트
		, bankDepositWrite : '#/edvertise/bankDeposit/write'
		, bannerView : '#/advertise/banner/view'
	}
	, message : {
		send : '#/message/send'	//메세지 발송
		, sendMessageGroupList : '#/message/sendMessageGroupList'	//	보낸 그룹 메세지 리스트
		, sendMessageSingleList : '#/message/sendMessageSingleList'	//	보낸 싱글 메세지 리스트
		, sendGroupMessageDetail : '#/message/sendGroupMessageDetail'	//	보낸 메세지 상세
		, sendSingleMessageDetail : '#/message/sendSingleMessageDetail'	//	보낸 메세지 상세
	}
	, master : {
		list : '#/master/list'	//	원장님 리스트
		, view : '#/master/view'		//	원장님 상세
		, requestList : '#/master/requestList'	//	가입 요청 원장님 리스트
	}
	, teacher : {
		list : '#/teacher/list'	//	선생님 리스트
		, view : '#/teacher/view'
	}
	, student : {
		list : '#/student/list'	//	학생 리스트
		, view : '#/student/view'
	}
	, parent : {
		list : '#/parent/list'	//	학부모 리스트
		, view : '#/parent/view'
	}
	, manager : {
		list : '#/manager/list'	//	매니저 리스트
		, view : '#/manager/view'		//	매니저 상세
		, hakwonList : '#/manager/hakwonList'		//	매니저 학원 리스트
		, requestList : '#/manager/requestList'	//	가입 요청 매니저 리스트
	}
	, questionsMail : {
		list : '#/questionsMail/list'	//	문의 메일 리스트
		, view : '#/questionsMail/view'	//	문의 메일 리스트
	}
	, setting : {
		hakwonCategory : '#/setting/hakwonCategory'		//	학원 카테고리 설정
		, bannerDefaultPrice : '#/setting/bannerDefaultPrice'	//	베너 기본 가격
		, monthPrice : '#/advertise/monthPrice'	//	월별가격
		, advertiseBankInfo : '#/setting/advertiseBankInfo'	//	무통장 입금 정보
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

	var currentVersion = undefined;
	this.getAppVersion = function() {

		if( !currentVersion ) {
			if( window.PLATFORM ) {
				currentVersion = window.PLATFORM.version();
				currentVersion = currentVersion.replace(/\./gi, '');
			} else {
				currentVersion = 'browser';
			}
		}

		return currentVersion;
	};

	this.onload = function() {
		console.log('HakwonCommon onload');

		/*	인증 체크	*/
		self.authCheck();

		if( self.isLogin() ) {

			/*	로그인 상태 일때 main.html 이 아니면 main으로 보낸다.	*/
			if( window.location.pathname == '/main.do' ) {
				console.log('main');
			} else {
				window.location.href = '/main.do';
				return ;
			}
		}

		self.getSido(function() {
			self.getGugun(DefaultInfo.sido[0]);
		});


	};

	/*	시도 조회	*/
	this.getSido = function(callBack) {
		$.ajax({
			url: contextPath+"/admin/address/sidoList.do",
			type: "post",
			dataType: "json",
			success: function(data) {
				try {
					DefaultInfo.sido = data.colData.dataList;
					if( callBack ) callBack();
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/*	구군 조회	*/
	this.getGugun = function(sido, callBack) {
		var param = {sido:sido};
		$.ajax({
			url: contextPath+"/admin/address/gugunList.do",
			type: "post",
			data: $.param(param),
			dataType: "json",
			success: function(data) {
				try {
					DefaultInfo.gugun[sido] = data.colData.dataList;
					if( callBack ) callBack();
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
	 * 헤더 셋팅
	 * comm.setHeader([{url:'', title:''}]);
	 * headerArray
	 * 	url, title
	 */
	this.setHeader = function(headerArray) {
		if( Object.prototype.toString.call( headerArray ) === '[object Array]' ) {
			if( headerArray && headerArray.length > 0 ) {
				var headerHtml = '<ol class="breadcrumb">';
				var viewTitle = '';
				for(var i=0; i<headerArray.length; i++) {
					var loopHeader = headerArray[i];

					var isLast = false;
					if( i == headerArray.length-1 ) {
						isLast = true;
					}

					headerHtml += '<li class="'+(isLast?'active':'')+'"><a href="'+loopHeader.url+'" '+(loopHeader.url=='#'?'onclick="return false;"':'')+'>'+loopHeader.title+'</a></li>';
					console.log(headerHtml);
					if( isLast ) {
						viewTitle = '<h1>'+loopHeader.title+'</h1>';
					}
				}
				headerHtml += '</ol>';
				$('div.page-heading').html(viewTitle+headerHtml);
			} else {
				$('div.page-heading').html('');
			}
		} else {
			$('div.page-heading').html('<h1>'+headerArray.title+'</h1>');
		}
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
	 * 로그인 여부
	 */
	this.isLogin = function() {
		if( userAuth.userNo ) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 공통 코드 조회
	 */
	this.getCodeList = function(codeGroup, callBackFunc) {
		$.ajax({
			url: contextPath+"/getCodeList.do",
			type: "post",
			data: 'codeGroup='+codeGroup,
			dataType: "json",
			success: function(data) {
				callBackFunc(data.colData.dataList);
			},
			error: function(xhr, textStatus, errorThrown) {
				console.error('공통 코드 조회를 실패 했습니다.');
			}
		});
	}

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
		return tinymceConstInitOptios;
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
				console.log('인증 성공');

				var colData = data.colData;
				console.log('colData', colData);
				if( colData && colData.authUserInfo ) {
					userAuth.userName = colData.authUserInfo.user_name;
					userAuth.userEmail = colData.authUserInfo.user_email;
					userAuth.userType = colData.authUserInfo.user_type;
					userAuth.userId = colData.authUserInfo.user_id;
					userAuth.userNo = colData.authUserInfo.user_no;
					if( !colData.authUserInfo.profile_path ) {
						/**
						 * 기본 이미지 필요
						 */
						colData.authUserInfo.profile_path = '/inspinia/img/p3.jpg';
					}
					userAuth.profilePath = colData.authUserInfo.profile_path;

					if( window.PLATFORM ) {
						if( colData.authUserInfo.device_type && colData.authUserInfo.device_token ) {
							userAuth.deviceAuth = {
								device_type : colData.authUserInfo.device_type
								, device_token : colData.authUserInfo.device_token
							};
						} else {
							var newKey = window.PLATFORM.getGcmKey();
							setPushNotiKey(newKey, CommonConstant.DeviceType.android, '', function(data) {
								if( data.flag == 'success' ) {
									userAuth.deviceAuth = {
										device_type : colData.authUserInfo.device_type
										, device_token : colData.authUserInfo.device_token
									};
								}
							});
						}
					} else if( getBrowser() == 'iosApp' ) {
						if( colData.authUserInfo.device_type && colData.authUserInfo.device_token ) {
							userAuth.deviceAuth = {
								device_type : colData.authUserInfo.device_type
								, device_token : colData.authUserInfo.device_token
							};
						} else {
							/*	ios 푸시키 요청	*/
							window.location = 'hakwonband://notification/getToken';
						}
					}
				} else {
					userAuth = {};
				}

				/*	앱 버전 체크	*/
				if( colData ) {
					self.appUpdateCheck(colData.appVersionList);
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				console.error('인증 체크를 실패 했습니다.');
				userAuth = {};
			}
		});

	}
	/**
	 * 학원 리스트 조회
	 * sync 요청
	 * comm.hakwonList();
	 */
	this.hakwonList = function(asyncFlag, callBackFun) {
		$.ajax({
			url: contextPath+"/hakwon/data/userHakwonList.do",
			type: "post",
			data: '',
			async : !asyncFlag,
			dataType: "json",
			success: callBackFun,
			error: function(xhr, textStatus, errorThrown) {
				console.error('학원 조회를 실패 했습니다.');
				userAuth = {};
			}
		});
	}

	/**
	 * 쿼리 파람 object 생성
	 * @usage comm.queryParam(target)
	 * TODO select 및 radio input 다양한 형태 지원.
	 */
	this.queryParamObj = function(target) {
		var tagetParam = {};
		$(target).find('input').each(function(idx, thisObj) {
			var name	= $(thisObj).attr('name');
			var val		= $(thisObj).val();

			tagetParam[name] = val;
		});
		return tagetParam;
	}
	/**
	 * 쿼리 파람 생성
	 * @usage comm.queryParam(target)
	 */
	this.queryParam = function(target) {
		var paramObj = self.queryParamObj(target);
		var queryString = $.param(paramObj, true);
		return queryString;
	}

	/**
	 * 인증 체크 필터
	 */
	this.authCheckFilter = function($location) {
		if( !userAuth.userNo ) {
			$location.path('/login');
		}
	}

	/**
	 * 페이지 계산
	 * comm.pageCalc(totalCount, pageScale);
	 */
	this.pageCalc = function(totalCount, pageScale) {
		var totalPages = 1;
		if( totalCount <= pageScale ) {
			totalPages = 1;
		} else {
			totalPages = Math.floor(totalCount/pageScale);
			if( totalCount % pageScale > 0 ) {
				totalPages = totalPages+1;
			}
		}
		return totalPages;
	}

	/**
	 * 사용자 이미지 처리
	 */
	this.userProfileImg = function(imgSrc) {
		if( isNull(imgSrc) ) {
			return DefaultInfo.photoUrl;
		} else {
			return HakwonConstant.FileServer.ATTATCH_DOMAIN+imgSrc+'_thumb';
		}
	}

	/**
	 * 학원 로고 처리
	 */
	this.hakwonLogoImg = function(imgSrc) {
		console.log('imgSrc', imgSrc);
		if( !imgSrc || isNull(imgSrc) ) {
			return DefaultInfo.hakwonLogoPath;
		} else {
			return HakwonConstant.FileServer.ATTATCH_DOMAIN+imgSrc+'_thumb';
		}
	}

	/**
	 * 프로그래스바
	 * @comm.progress(50);
	 */
	this.progress = function(perVal) {
		try {
			if( jQuery.isNumeric(perVal) ) {
				if( perVal < 0 ) {
					$progress.hide();
					$progress.find('div').css('width', '0%').attr('aria-valuenow', 0);
					$progress.find('span').text('0% Complete (success)');
				} else if( perVal >= 0 && perVal <= 100 ) {
					if( perVal == 0 ) $progress.show();
					if( perVal == 100 ) $progress.hide();

					$progress.find('div').css('width', perVal+'%').attr('aria-valuenow', perVal);
					$progress.find('span').text(perVal+'% Complete (success)');
				}
			}
		} catch(e) {
			console.log(e);
		}
	};

	/**
	 * 사용자 정보 파싱 처리
	 * @param userInfoStr
	 * @returns {*}
	 * @usage comm.userInfoParse();
	 */
	this.userInfoParse = function(userInfoStr) {
		var userInfoArray = userInfoStr.split(CommonConstant.ChDiv.CH_DEL);
		var userInfo = {};
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
		return userInfo;
	};

	/**
	 * 앱 업데이트 체크
	 */
	this.appUpdateCheck = function(appVersionList) {
		if( window.PLATFORM && appVersionList && appVersionList.length > 0 ) {
			/*	앱이 두개밖에 안되 그냥다 가져왔다.	*/
			for(var i=0; i<appVersionList.length; i++) {
				if( appVersionList[i].device_type == CommonConstant.DeviceType.android ) {
					var appVersion = appVersionList[i].app_version;
					var currentVersion = window.PLATFORM.version();

					appVersion = appVersion.replace(/\./gi, '');
					currentVersion = currentVersion.replace(/\./gi, '');
					if( appVersion > currentVersion ) {
						console.log('앱을 업그레이드 하세요~');
					}
				}
			}
		}
	};

	/*	메세지 사용자 타입을 문자열로	*/
	this.messageUserTypeListToString = function(userTypeList) {
		var rtnStr = '';
		if( userTypeList && userTypeList.length > 0 ) {
			for(var i=0; i<userTypeList.length; i++) {
				userTypeList[i];
			}
		}
		return rtnStr;
	};

	/**
	 * 앱일때 android에서 4.4.0 ~ 4.4.2 버전 사이인 경우에만 업로더를 따로 쓴다.
	 * @usage comm.isAndroidUploader()
	 */
	this.isAndroidUploader = function() {
		if( window.PLATFORM ) {
			/*	android 앱	*/
			return true;
/*
			if( navigator.userAgent.indexOf('SHW-M440') > 0 || navigator.userAgent.indexOf('SHV-E210') > 0 ) {
				return true;
			} else if( '113' < comm.getAppVersion() ) {
				var androidVersion = window.PLATFORM.androidVersion();
				androidVersion = androidVersion.replace(/\./gi, '');
				if( androidVersion >= 440 && androidVersion <= 442 ) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
*/
		} else {
			return false;
		}
	};

	/**
	 * 비디오 태그 변경
	 * @usage comm.videoTagReplace();
	 */
	this.videoTagReplace = function() {
		if( window.PLATFORM ) {
			if( comm.getAppVersion() >= 118 ) {
				$('video').click(function() {
					var videoSrc = $(this).find('source').attr('src');
					window.PLATFORM.videoPlayerCall(videoSrc);
				});
				$('video').removeAttr("controls");
				$('video').attr('poster', '/images/video_preview.jpg');
			}
		}
	};

	this.onload();
};
var comm = new HakwonCommon();