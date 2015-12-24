/**
 *
############################################################
# 2015-08-27 05
############################################################

 */
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
console.info('is_touch_device() : ' + is_touch_device());
console.info('clickEvent : ' + clickEvent);

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
	main : '#/main'
	, findInfo : '#/findInfo'
	, login : '#/login'
	, signUp : '#/signUp'
	, user : {
		memberProfile : '#/memberProfile'
		, memberEdit : '#/memberEdit'
	}
	, master : {
		teacherList : '#/master/hakwonTeacherList'	//	선생님 리스트
		, joinReqTeacherList : '#/master/joinReqTeacherList'	//	가입 요청 선생님 리스트
		, hakwonCreate: '#/master/hakwonCreate'
		, hakwonModify : '#/hakwonModify'
		, hakwonAllList : '#/hakwonAllList'
	}
	, class : {
		teacherList : '#/class/teacherList'
		, noticeEdit : '#/class/noticeEdit'
	}
	, teacher : {
		hakwonRegist : '#/teacher/hakwonRegist'
		, teacherHakwonAllList : '#/teacherHakwonAllList'
	}
	, edBanner : {
		edit : '#/edBanner/edit'
	}
	, event : {
		write : '#/event/write'
		, edit : '#/event/edit'
	}
	, common : {
		hakwonIntro : '#/hakwonIntro'
		, hakwonIntroEdit : '#/hakwonIntroEdit'
		, classList : '#/class/classList'	//	반 리스트
		, classNoticeList : '#/class/noticeList'
		, classNoticeDetail : '#/class/noticeDetail'
		, classStudentList : '#/class/studentList'
		, classParentList : '#/class/parentList'

		, noticeList : '#/notice/list'
		, noticeDetail : '#/notice/detail'

		, studentList : '#/student/list'
		, studentView : '#/student/view'

		, parentList : '#/parent/list'
		, parentView : '#/parent/view'

		, edBannerList : '#/edBanner/list'
		, edBannerView : '#/edBanner/view'
		, edBannerWrite : '#/edBanner/write'

		, eventList : '#/event/list'
		, eventView : '#/event/view'

		, adminQuestionList : '#/adminQuestion/list'
		, adminQuestionView : '#/adminQuestion/view'
	}
	, setting : {
		noticeCategory : '#/setting/noticeCategory'
		, manager : '#/setting/manager'
	}
	, message : {
		masterSend : '#/message/masterSend'	//메세지 발송
		, teacherSend : '#/message/teacherSend'	//메세지 발송
		, sendMessageGroupList : '#/message/sendMessageGroupList'	//	보낸 그룹 메세지 리스트
		, sendMessageSingleList : '#/message/sendMessageSingleList'	//	보낸 싱글 메세지 리스트
		, sendGroupMessageDetail : '#/message/sendGroupMessageDetail'	//	보낸 메세지 상세
		, sendSingleMessageDetail : '#/message/sendSingleMessageDetail'	//	보낸 메세지 상세
		, receiveMessageList : '#/message/receiveMessageList'	//	보낸 메세지 리스트
		, receiveMessageDetail : '#/message/receiveMessageDetail'	//	보낸 메세지 상세

		, sendQuestion: '#/sendQuestion'

		, adminQuestionRegist : '#/adminQuestion/regist'
	}
	, notice : {
		edit  : '#/notice/edit'
	}
	, guide : {
		map : '#/guide/map'
		, daumMap : '#/guide/daumMap'
		, youtube : '#/guide/youtube'
	}
	, attendance : {
		make : '#/attendance/make'
		, start : '#/attendance/start'
		, end : '#/attendance/end'
		, weekList : '#/attendance/attendanceWeekList'
	}
	, receipt : {
		insert : '#/receipt/insert'
		, list : '#/receipt/list'
		, listYear : '#/receipt/listYear'
		, detail : '#/receipt/detail'
	}
	, counsel : {
		insert : '#/counsel/insert'
		, list : '#/counsel/list'
		, detail : '#/counsel/detail'
		, update : '#/counsel/update'
	}
	, notice_share : {
		send : '#/notice/share/send'
		, receive : '#/notice/share/receive'
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

		if( isSupport() == false ) {
			$('#ieModal').modal('show');
		}

		/*	인증 체크	*/
		self.authCheck();

		if( self.isLogin() ) {

			console.log('location', window.location);

			/*	로그인 상태 일때 main.html 이 아니면 main으로 보낸다.	*/
			if( window.location.pathname == '/main.do' ) {
				console.log('main');
			} else {
				window.location.href = '/main.do';
				return ;
			}

			/*	학원 리스트 조회(sync 요청)	*/
			self.hakwonList(true, function(data) {
				console.log('hakwonList', data);

				var colData = data.colData;
				if( colData && colData.dataList && colData.dataList.length > 0 ) {
					var hakwonList = colData.dataList;

					/*	학원 정보 저장	*/
					hakwonInfo.hakwon_name		= hakwonList[0].hakwon_name;
					hakwonInfo.hakwon_no		= hakwonList[0].hakwon_no;
					hakwonInfo.master_user_no	= hakwonList[0].master_user_no;
					hakwonInfo.logo_path		= hakwonList[0].logo_path;
					hakwonInfo.hakwonList		= hakwonList;
				} else {
					hakwonInfo.hakwon_name		= undefined;
					hakwonInfo.hakwon_no		= undefined;
					hakwonInfo.master_user_no	= undefined;
					hakwonInfo.logo_path		= undefined;
					hakwonInfo.hakwonList		= [];
				}
			});
		}
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
						colData.authUserInfo.profile_path = '/assets/img/p3.jpg';
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
			url: contextPath+"/hakwon/userHakwonList.do",
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
			window.location.href = PageUrl.login;
		}
	}

	/**
	 * 페이지 계산
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
			if( '/assets/img/p3.jpg' == imgSrc ) {
				return imgSrc;
			} else {
				return HakwonConstant.FileServer.ATTATCH_DOMAIN+imgSrc+"_thumb";
			}
		}
	}

	/**
	 * 학원 로고 처리
	 */
	this.hakwonLogoImg = function(imgSrc) {
		console.log('imgSrc', imgSrc);
		if( !imgSrc || isNull(imgSrc) ) {
			return DefaultInfo.hakwonLogo;
		} else {
			return HakwonConstant.FileServer.ATTATCH_DOMAIN+imgSrc;
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

					if( loopHeader.url == PageUrl.main ) {
						loopHeader.url += '?hakwon_no='+hakwonInfo.hakwon_no;
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
	 * 권한 인증 체크. 원장일 경우만 true
	 * @returns {boolean}
	 */
	this.checkAuthType = function() {
		//console.log(userAuth.userType, HakwonConstant.UserType.WONJANG);
		return userAuth.userType == HakwonConstant.UserType.WONJANG;
	};

	/**
	 * 반 공지사항 권한 인증 체크 : 원장은 true, 선생님이며 등록자일 경우 true
	 * @param registUserNo
	 * @returns {boolean}
	 */
	this.checkAuthTypeRegistUser = function(registUserNo) {
		if (userAuth.userType == HakwonConstant.UserType.WONJANG) {
			return true;
		} else {
			return userAuth.userNo == registUserNo;
		}
	};

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


	/*
	 *  새글 여부 : 게시글의 등록일이 7일을 넘기지 않았으면 새글
	 *  @param regDate
	 *  @return boolean
	 */
	this.isNewItem = function(regDate) {
		// DefaultInfo.expireDay : 컨텐츠 new 만료처리 기준일
		regDate = parseInt(moment(regDate).add(DefaultInfo.expireDay, 'days').format('YYYYMMDD'));
		var compareDate = parseInt(moment().format('YYYYMMDD'));
		return compareDate <= regDate;
	};

	/**
	 * comm.createFileFullPath()
	 */
/*
	this.createFileFullPath = function(filePath, fileType) {
		//$log.log('filePath', filePath);
		if (!isNull(filePath)) {
			if( fileType == 'down' ) {
				return  DefaultInfo.downPath + filePath;
			} else {
				return  HakwonConstant.FileServer.ATTATCH_DOMAIN + filePath;
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
*/
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

	/**
	 * 앱일때 android에서 4.4.0 ~ 4.4.2 버전 사이인 경우에만 업로더를 따로 쓴다.
	 * @usage comm.isAndroidUploader()
	 */
	this.isAndroidUploader = function() {
		if( window.PLATFORM ) {
			/*	android 앱	*/
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
	 * sns 공유 초기화
	 */
	this.snsShareInit = function(callBackFun) {
		console.log('snsShareInit');
		try {
			var shareUrl = comm.getShareUrl();

			/*	카카오톡 링크 공유	*/
			var imgObj = {};
			if( hakwonInfo.logo_path ) {
				imgObj = {
					src: self.createFileFullPath(hakwonInfo.logo_path, 'hakwon', true),
					width: '200',
					height: '200'
				}
			} else {
				imgObj = {
					src: 'http://www.hakwonband.com/images/facebook_screen.png',
					width: '1200',
					height: '630'
				}
			}
			console.log('imgObj.src', imgObj.src);

			try {
				Kakao.Link.createTalkLinkButton({
					container: 'button[data-type=kakao]',
					label: hakwonInfo.hakwon_name+' 입니다.',
					image: imgObj,
					webButton: {
						text: hakwonInfo.hakwon_name+' 에서 공유 합니다.',
						url: shareUrl
					}
				});
			} catch(ex) {
			}

			/**
			 * sns 클릭
			 */
			$('div.sns_area').find('button[data-act=snsShare]').click(function() {
				var dataType = $(this).attr('data-type');
				if( dataType == 'facebook' || dataType == 'twitter' || dataType == 'line' || dataType == 'sms' || dataType == 'band' ) {
					self.shareSns({type:dataType, url:shareUrl, title:hakwonInfo.hakwon_name+' 에서 공유 합니다.'});
				} else {
					console.log('dataType['+dataType+']');
				}
			});
			if( callBackFun ) {
				callBackFun();
			}
		} catch(e) {
			console.error('snsShareInit', e);
		}
	};

	/**
	 * sns 공유
	 * @author bumworld.kim
	 * @param type
	 * @param url
	 * @param title
	 *
	 * @usage shareSns({type:'facebook', url:'https://m.hakwonband.com', title:'학원밴드'});
	 */
	this.shareSns = function(shareObj) {
		console.info('shareObj', shareObj);
		if( shareObj.type == 'facebook' ) {
			var shref = "http://wwww.facebook.com/share.php?u="+encodeURIComponent(shareObj.url)+"&t="+encodeURIComponent(shareObj.title);
			var sWindow = window.open(shref);
			if(sWindow) {
				sWindow.focus();
			}
		} else if( shareObj.type == 'twitter' ) {
			var shref = "https://twitter.com/intent/tweet?text="+encodeURIComponent(shareObj.title+' ')+encodeURIComponent(shareObj.url);
			window.location = shref;
			var sWindow = window.open(shref);
			if(sWindow) {
				sWindow.focus();
			}
		} else if( shareObj.type == 'band' ) {
			var shref = "bandapp://create/post?text="+encodeURIComponent(shareObj.title+' ')+encodeURIComponent(shareObj.url);
			var sWindow = window.open(shref);
			if(sWindow) {
				sWindow.focus();
			}
		} else if( shareObj.type == 'sms' ) {
			var ua = navigator.userAgent.toLowerCase();
			var url = "sms:";
			url += (ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1) ? ";" : "?";
			url += "body=" + encodeURIComponent(shareObj.title+' ')+encodeURIComponent(shareObj.url);
			console.log('sms url : ' + url);
			window.location = url;

		} else if( shareObj.type == 'line' ) {
			var lineShareUrl = encodeURIComponent(shareObj.title)+'%0A'+encodeURIComponent(shareObj.url);
			window.location = 'http://line.me/R/msg/text/'+lineShareUrl;
		} else {
			console.error('shareSns invalid type', shareObj);
		}
	}

	/**
	 * 공유 url 생성
	 */
	this.getShareUrl = function() {
		var shareUrl = "https://m.hakwonband.com/hakwonInfo.do?hakwonNo="+hakwonInfo.hakwon_no;
		return shareUrl;
	};

	this.onload();
};
var comm = new HakwonCommon();