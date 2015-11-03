/*
####################################################################################################################
# 2015-03-21 03
####################################################################################################################
####################################################################################################################
# 2015-03-21 04
####################################################################################################################
####################################################################################################################
# 2015-03-22 01
####################################################################################################################
####################################################################################################################
# 2015-04-18 01
####################################################################################################################
####################################################################################################################
# 2015-05-01 01
####################################################################################################################
*/
/**
 * 기본 값
 */
var DefaultInfo = {
	/*	신규 컨텐츠 만료 기준일(New 처리 제외)	*/
	expireDay		: 7

	/*	사용자 기본 이미지	*/
	, photoUrl		:contextPath+'/images/img_photo.gif'

	/*	기본 학원 로고 패스	*/
	, hakwonLogo	: contextPath+'/images/logo/144x144.png'

	/*	반 로고 패스	*/
	, classLogo		: contextPath+'/images/logo/114x114.png'

	/*	다운로드 패스	*/
	, downPath : HakwonConstant.FileServer.DOWN_DOMAIN+'/down.do?path='

	/**
	 * 메타 정보
	 */
	, meta : {
		title : $('meta[name=title]').attr("content")
	}
};

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
	hakwonList : undefined
	, currentHakwon : undefined
};

/**
 * 클릭 이벤트를 모바일은 touchend를 pc는 click을 사용하도록 한다.
 */
//var clickEvent = isMobile.any()?'touchend':'click';
var clickEvent = undefined;

if( getBrowser().indexOf('ios') == 0 ) {
	clickEvent = 'touchend';
} else if( getBrowser().indexOf('android') == 0 ) {
	clickEvent = 'touchend';
} else {
	clickEvent = 'click';
}

/**
 * 전체 메뉴의 url 정보
 */
var MENUS = {
	sharpUrls : {
		index 				: '#/index',
		login 				: '#/login',
		userMain 			: '#/userMain',
		signUp 				: '#/signUp',
		findId 				: '#/findId',
		findPw 				: '#/findPw',
		memberModify 		: '#/memberModify',
		sendMessageList 	: '#/sendMessageList',
		receiveMessageList 	: '#/receiveMessageList',
		messageDetail 		: '#/messageDetail',
		messageWrite 		: '#/messageWrite',
		attendanceList		: '#/attendanceList',
		hakwonIntro 		: '#/hakwon/intro',
		hakwonDetail 		: '#/hakwon/detail',
		hakwonSearch 		: '#/hakwon/search',
		hakwonClass 		: '#/hakwon/class',
		hakwonTeacher 		: '#/hakwon/teacherList',
		noticeList 			: '#/hakwon/noticeList',
		noticeDetail 		: '#/hakwon/noticeDetail',
		eventList 			: '#/hakwon/eventList',
		eventDetail 		: '#/hakwon/eventDetail',
		eventJoin 			: '#/hakwon/eventJoin',
		advertiseList 		: '#/advertiseList',
		advertiseUcc 		: '#/advertiseUcc',
		myInfo		 		: '#/myInfo'
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

	var address = undefined;
	this.getAddress = function() {
		return address;
	}
	this.setAddress = function(setAddress) {
		address = setAddress;
		console.log('setAddress : ' + setAddress);
	}

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
	}

	/**
	 * 학원 상세 정보
	 */
	this.hakwonDetail = function(hakwon_no) {
		var newHakwonInfo = undefined;
		$.ajax({
			url: contextPath+"/mobile/hakwon/hakwonDetail.do",
			type: "post",
			data: 'hakwon_no='+hakwon_no,
			async : false,
			dataType: "json",
			success: function(data) {
				var colData = data.colData;
				console.log('colData', colData);
				newHakwonInfo = colData;
			},
			error: function(xhr, textStatus, errorThrown) {
				console.error('학원 정보 조회를 실패 했습니다.');
				hakwonInfo.hakwonList = [];
			}
		});
		return newHakwonInfo;
	};

	/**
	 * 부모/자식 조회
	 */
	this.familyList = function() {
		$.ajax({
			url: contextPath+"/mobile/user/familyList.do",
			type: "post",
			dataType: "json",
			success: function(data) {
				var colData = data.colData;
				console.log('colData', colData);
				userAuth.familyList 	= colData.dataList;
				if( userAuth.userType == HakwonConstant.UserType.STUDENT ) {
				} else if( userAuth.userType == HakwonConstant.UserType.PARENT ) {
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				console.error('정보 조회를 실패 했습니다.');
			}
		});
	};

	/**
	 * 사용자 학원 리스트
	 */
	this.userHakwonList = function(callBack) {
		$.ajax({
			url: contextPath+"/mobile/hakwon/hakwonList.do",
			type: "post",
			data: '',
			async : false,
			dataType: "json",
			success: function(data) {
				var colData = data.colData;
				console.log('colData', colData);
				if( colData ) {
					/*	학원 리스트	*/
					hakwonInfo.hakwonList = colData.hakwonList;

					var hakwonClassList = colData.hakwonClassList;
					var hakwonClass = {};
					if( hakwonClassList ) {
						for(var i=0; i<hakwonClassList.length; i++) {
							var classInfo = hakwonClassList[i];
							if( !hakwonClass[classInfo.hakwon_no] ) {
								hakwonClass[classInfo.hakwon_no] = [];
							}
							hakwonClass[classInfo.hakwon_no].push(classInfo);
						}
						if( hakwonInfo.hakwonList && hakwonInfo.hakwonList.length > 0 ) {
							for(var i=0; i<hakwonInfo.hakwonList.length; i++) {
								var loopHakwonNo = hakwonInfo.hakwonList[i].hakwon_no;

								hakwonInfo.hakwonList[i].classList = hakwonClass[loopHakwonNo];

								/*	현재 학원이고 학원 번호가 같으면 현재 학원정보의 반 리스트를 갱신한다.	*/
								if( hakwonInfo.currentHakwon && loopHakwonNo == hakwonInfo.currentHakwon.hakwon_no ) {
									hakwonInfo.currentHakwon.classList = hakwonClass[loopHakwonNo];
								}
							}
						}
					}
				} else {
					hakwonInfo.hakwonList = [];
				}
				if( callBack ) {
					callBack();
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				console.error('사용자 학원 리스트 조회를 실패 했습니다.');
				hakwonInfo.hakwonList = [];
			}
		});
	};


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
	this.authCheckFilter = function() {
		if( !userAuth.userNo ) {
			userAuth = {};//초기화 시킨다.
			window.location.href = MENUS.sharpUrls.login;

			return false;
		} else {
			if( hakwonInfo.currentHakwon === undefined && hakwonInfo.hakwonList === undefined ) {
				/*	학원 정보 로드	*/
				self.userHakwonList();
			}
			return true;
		}
	};

	/**
	 * 학원 번호 체크
	 */
	this.hakwonNoCheckFilter = function(hakwonNo) {
		if( !hakwonNo ) {
			window.location.href = MENUS.sharpUrls.userMain;
			return false;
		} else {
			if( hakwonInfo.hakwonList ) {
				for(var i=0; i<hakwonInfo.hakwonList.length; i++) {
					var loopHakwonInfo = hakwonInfo.hakwonList[i];
					if( loopHakwonInfo.hakwon_no == hakwonNo ) {
						hakwonInfo.currentHakwon = loopHakwonInfo;
					}
				}
			}

			if( !hakwonInfo.currentHakwon || hakwonInfo.currentHakwon.hakwon_no != hakwonNo ) {
				/*	현재 가지고 있는 학원 정보가 아니라면 조회 한다.	*/
				var newHakwonInfo = self.hakwonDetail(hakwonNo);
				if( !newHakwonInfo ) {
					/*	학원 정보가 없는 학원이라 메인으로 보낸다.	*/
					hakwonInfo.currentHakwon = undefined;
					window.location.href = MENUS.sharpUrls.userMain;
					return false;
				} else {
					hakwonInfo.currentHakwon = newHakwonInfo;
					return true;
				}
			} else {
				return true;
			}
		}
	};

	/**
	 * screenInit 함수
	 * comm.screenInit();
	 */
	this.screenInit = function() {

		console.log('screenInit call');

		/*	메인 content	*/
		var $wrapCont = $("#wrap_cont");

		var windowHeight	= $(window).height();
		var windowWidth		= $(window).width();
		var docWidth		= $(document).width();

		/*	스크롤 탑	*/
		$("html, body").animate({ scrollTop: 0 }, 600);

		//$wrapCont.css("min-height",windowHeight-71); //footer 하단 고정
		//$wrapCont.find("input.search").css("width",docWidth-72); // 검색 input
		//$wrapCont.find("div.list_cont.view").css("width",docWidth-115); //list영역 가로값 ...처리
		//$wrapCont.find("div.input_chk input").css("width",docWidth-100); //input float button float..
		//$wrapCont.find("div.imgfile_view .view").css("width",docWidth-100); //첨부파일 이미지 영역
		//$wrapCont.find("div.sec_input textarea").css("width",docWidth-42); //form영역의 textarea

		//loading img
		var $loading = $(".sec_loading");
		if( $loading.length > 0 ) {
			$loading.css("left",windowWidth/2 - 16);
			$loading.css("top",	windowHeight/2 - 16);
		}
		$wrapCont = null;
		$loading = null;
	};

	/**
	 * 사용자 이미지 처리
	 */
	this.userProfileImg = function(imgSrc, isThumb) {
		if( isNull(imgSrc) ) {
			return DefaultInfo.photoUrl;
		} else {
			if( isThumb === true ) {
				return HakwonConstant.FileServer.ATTATCH_DOMAIN+imgSrc+'_thumb';
			} else {
				return HakwonConstant.FileServer.ATTATCH_DOMAIN+imgSrc;
			}
		}
	};


	this.hakwonLogoImg = function(imgSrc, isThumb) {
		if( isNull(imgSrc) ) {
			return DefaultInfo.hakwonLogo;
		} else {
			if( isThumb === true ) {
				return HakwonConstant.FileServer.ATTATCH_DOMAIN+imgSrc+'_thumb';
			} else {
				return HakwonConstant.FileServer.ATTATCH_DOMAIN+imgSrc;
			}
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

	/*	로그인 체크	*/
	this.urlLoginCheck = function() {
		var currentUrlHash = window.location.hash;
		if( self.isLogin() ) {
			/*	로그인 상태	*/
			if( currentUrlHash == '#/signUp' ) {
				window.location.href = '#/userMain';
				return false;
			}
		} else {
			/*	로그 아웃 상태	*/
			console.log('urlLoginCheck 로그아웃 상태');
		}

	};

	/**
	 * 학원 멤버 탈퇴
	 */
	this.hakwonMemberOut = function(hakwon_no) {
		$.ajax({
			url: contextPath+"/mobile/hakwon/memberOut.do",
			type: "post",
			data: 'hakwon_no='+hakwon_no,
			dataType: "json",
			success: function(data) {
				if( data.error ) {
					alert('학원 탈퇴를 실패 했습니다.');
					return false;
				}
				var colData = data.colData;
				if( colData.flag == CommonConstant.Flag.success ) {
					/*	학원 정보 갱신	*/
					self.userHakwonList(function() {
						window.location.href = '#/hakwon/detail?hakwon_no='+hakwon_no+'&reload='+new Date().getTime();
					});
				} else if( colData.flag == 'classMember' ) {
					alert('반에 속해 있으면 탈퇴하지 못합니다.');
				} else if( colData.flag == 'childClassMember' ) {
					alert('학부모님의 학생이 학원 반에 속해 있으면 탈퇴하지 못합니다.');
				} else {
					alert('학원 탈퇴를 실패 했습니다.');
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('학원 탈퇴를 실패 했습니다.');
				commProto.errorDump({xhr:xhr, textStatus:textStatus, errorThrown:errorThrown});
			}
		});
	};

	/**
	 * 학원 관련 광고 보여준다.
	 * comm.advertBlock();
	 */
	this.advertBlock = function() {
		if( hakwonInfo.currentHakwon && hakwonInfo.currentHakwon.hakwon_no ) {
			$.ajax({
				url: contextPath+"/mobile/advert/blockList.do",
				type: "post",
				data: 'hakwon_no='+hakwonInfo.currentHakwon.hakwon_no,
				dataType: "json",
				success: function(data) {
					if( data.error ) {
						alert('학원 광고 조회를 실패 했습니다.');
						return false;
					}
					var colData = data.colData;

					var widthVal = 74;
					var hakwonBanner1 = '<li><a href="#" onclick="alert(\'준비 중 입니다.\'); return false;"><img src="/images/banner/default_banner_01.gif" alt="" height="74" width="74" /></li>';
					var hakwonBanner2 = '<li><a href="#" onclick="alert(\'준비 중 입니다.\'); return false;"><img src="/images/banner/default_banner_02.gif" alt="" height="74" width="148" /></li>';
					var hakwonBanner3 = '<li><a href="#" onclick="alert(\'준비 중 입니다.\'); return false;"><img src="/images/banner/default_banner_03.gif" alt="" height="74" width="222" /></li>';

					var blockHtml = '';
					blockHtml += '<section class="line_n" data-view="advertBlock">';
					blockHtml += '	<div class="sec_blk_02">';
					blockHtml += '		<div class="sec_ad_area">';
					blockHtml += '			<ul class="sec_ad_list">';
					var lineCount = 0;
					if( colData.dataList && colData.dataList.length > 0 ) {
						for(var i=0, maxLen=colData.dataList.length; i<maxLen; i++) {
							var bannerInfo = colData.dataList[i];
							lineCount += bannerInfo.banner_size;

							var blankCount = 0;
							if( i+1 == maxLen ) {
								/*	마지막	*/
							} else {
								if( lineCount + colData.dataList[i+1].banner_size > 4 ) {
									blankCount = 4 - lineCount;
									lineCount = 0;
								}
							}
							blockHtml += '<li><a href="#/hakwon/detail?hakwon_no='+bannerInfo.hakwon_no+'"><img src="'+HakwonConstant.FileServer.ATTATCH_DOMAIN+bannerInfo.banner_file_path+'" height="74" width="'+(widthVal*bannerInfo.banner_size)+'" /></a></li>';

							if( i+1 != maxLen ) {
								if( blankCount == 1 ) blockHtml += hakwonBanner1;
								else if( blankCount == 2 ) blockHtml += hakwonBanner2;
								else if( blankCount == 3 ) blockHtml += hakwonBanner3;
							}
						}
					}
					var remainCount = 4-lineCount;
					if( remainCount == 2 ) blockHtml += hakwonBanner1;
					if( remainCount == 3 ) blockHtml += hakwonBanner2;
					if( remainCount == 0 ) blockHtml += hakwonBanner3;
					if( remainCount == 4 ) blockHtml += hakwonBanner3;

					blockHtml += '				<li><a href="#/advertiseList?hakwon_no='+hakwonInfo.currentHakwon.hakwon_no+'"><img src="/images/img_ad_btn.gif" alt="목록" width="74" height="74" /></a></li>';
					blockHtml += '			</ul>';
					blockHtml += '		</div>';
					blockHtml += '	</div>';
					blockHtml += '</section>';

					$('#wrap_cont section[data-view=advertBlock]').remove();
					$('#wrap_cont').append(blockHtml);
				},
				error: function(xhr, textStatus, errorThrown) {
					console.error('학원 광고 블럭 조회를 실패 했습니다.');
				}
			});
		} else {
			console.error('학원 번호가 없는데 학원 블럭 광고 요청!!!!!!!!!');
		}
	};

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

	/*
	 *  새글 여부 : 게시글의 등록일이 7일을 넘기지 않았으면 새글
	 *  @param regDate
	 *  @return boolean
	 */
	this.isNewItem = function(regDate) {
		/*	DefaultInfo.expireDay : 컨텐츠 new 만료처리 기준일	*/
		regDate = parseInt(moment(regDate).add(DefaultInfo.expireDay, 'days').format('YYYYMMDD'));
		var compareDate = parseInt(moment().format('YYYYMMDD'));
		return compareDate <= regDate;
	};


	/**
	 * sns 공유 초기화
	 */
	this.snsShareInit = function() {
		console.log('snsShareInit');
		try {
			var shareUrl = comm.getShareUrl();

			/*	카카오톡 링크 공유	*/
			var imgObj = {};
			if( hakwonInfo.currentHakwon.file_path ) {
				imgObj = {
					src: comm.hakwonLogoImg(hakwonInfo.currentHakwon.file_path, true),
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

			try {
				Kakao.Link.createTalkLinkButton({
					container: '#wrap_cont button[data-type=kakao]',
					label: hakwonInfo.currentHakwon.hakwon_name+' 입니다.',
					image: imgObj,
					webButton: {
						text: hakwonInfo.currentHakwon.hakwon_name+' 에서 공유 합니다.',
						url: shareUrl
					}
				});
			} catch(ex) {
			}

			/**
			 * sns 클릭
			 */
			$('#wrap_cont').find('div.sec_con_sns button[data-act=snsShare]').click(function() {
				var dataType = $(this).attr('data-type');
				if( dataType == 'facebook' || dataType == 'twitter' || dataType == 'line' || dataType == 'sms' || dataType == 'band' ) {
					self.shareSns({type:dataType, url:shareUrl, title:hakwonInfo.currentHakwon.hakwon_name+' 에서 공유 합니다.'});
				} else {
					console.log('dataType['+dataType+']');
				}
			});
		} catch(e) {
			console.error('snsShareInit', e);
		}
	}

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
//			window.location = shref;
			var sWindow = window.open(shref);
			if(sWindow) {
				sWindow.focus();
			}
		} else if( shareObj.type == 'sms' ) {
			var ua = navigator.userAgent.toLowerCase();
			var url = "sms:";

			var browserVal = getBrowser();
			if( browserVal.indexOf('ios') == 0 ) {
				url += "&body=" + encodeURIComponent(shareObj.title+' ')+encodeURIComponent(shareObj.url);
			} else if( browserVal.indexOf('android') == 0 ) {
				url += "?body=" + encodeURIComponent(shareObj.title+' ')+encodeURIComponent(shareObj.url);
			} else {
				url += "?body=" + encodeURIComponent(shareObj.title+' ')+encodeURIComponent(shareObj.url);
			}

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
		var currentHakwonNo = hakwonInfo.currentHakwon.hakwon_no;
		var shareUrl = "https://m.hakwonband.com/";
		if( currentHakwonNo ) {
			//shareUrl += "#/hakwon/detail?hakwon_no="+currentHakwonNo;
			shareUrl += '/hakwonInfo.do?hakwonNo='+currentHakwonNo;
		}
		return shareUrl;
	}

	/*	싸이트 이동	*/
	this.moveSite = function() {
		if( window.location.href.indexOf('#/hakwon/detail') > 0 || window.location.href.indexOf('#/hakwon/intro') > 0 ) {
			return true;
		}
		if( userAuth.userType == '001' ) {
			window.location = HakwonConstant.Site.ADMIN;
			return false;
		} else if( userAuth.userType == '002' ) {
			window.location = HakwonConstant.Site.MANAGER;
			return false;
		} else if( userAuth.userType == '003' || userAuth.userType == '004' ) {
			window.location = HakwonConstant.Site.HAKWON;
			return false;
		} else {
			return true;
		}
	}

	/**
	 * 사용자 정보 조회
	 */
	this.getUserInfo = function(callBack) {
		$.ajax({
			url: contextPath+"/authCheck.do",
			type: "post",
			dataType: "json",
			success: function(data) {
				var colData = data.colData;
				if( colData && colData.authUserInfo ) {
					userAuth.userName	= colData.authUserInfo.user_name;
					userAuth.userEmail	= colData.authUserInfo.user_email;
					userAuth.userType	= colData.authUserInfo.user_type;
					userAuth.userId		= colData.authUserInfo.user_id;
					userAuth.userNo		= colData.authUserInfo.user_no;
					userAuth.userGender	= colData.authUserInfo.user_gender;
					userAuth.userAge	= colData.authUserInfo.user_age;
					userAuth.userPhotoPath 	= colData.authUserInfo.user_photo_path;
					userAuth.tel1No		= colData.authUserInfo.tel1_no;
					userAuth.userBirthday	= colData.authUserInfo.user_birthday;
					userAuth.attendanceCode	= colData.authUserInfo.attendance_code;

					userAuth.familyList 	= colData.familyList;
					userAuth.schoolInfo 	= colData.schoolInfo;

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

				if( callBack ) {
					callBack();
				}
			},
			error: function(xhr, textStatus, errorThrown) {
			}
		});
	}

	this.init = function() {
		console.log('HakwonCommon init');

		$.ajax({
			url: contextPath+"/authCheck.do",
			type: "post",
			data: '',
			async : false,
			dataType: "json",
			success: function(data) {
				var colData = data.colData;
				if( colData && colData.authUserInfo ) {
					userAuth.userName 	= colData.authUserInfo.user_name;
					userAuth.userEmail 	= colData.authUserInfo.user_email;
					userAuth.userType 	= colData.authUserInfo.user_type;
					userAuth.userId 	= colData.authUserInfo.user_id;
					userAuth.userNo 	= colData.authUserInfo.user_no;
					userAuth.userGender = colData.authUserInfo.user_gender;
					userAuth.userAge 	= colData.authUserInfo.user_age;
					userAuth.userPhotoPath 	= colData.authUserInfo.user_photo_path;
					userAuth.tel1No 	= colData.authUserInfo.tel1_no;
					userAuth.userBirthday 	= colData.authUserInfo.user_birthday;
					userAuth.attendanceCode	= colData.authUserInfo.attendance_code;

					userAuth.familyList 	= colData.familyList;
					userAuth.schoolInfo 	= colData.schoolInfo;

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

					if( userAuth.userType == '005' || userAuth.userType == '006' ) {
						self.userHakwonList();
					} else {
						self.moveSite();
					}
				} else {
					userAuth = {};
				}

				/*	url 인증 체크	*/
				self.urlLoginCheck();

				/*	앱 버전 체크	*/
				if( colData ) {
					self.appUpdateCheck(colData.appVersionList);
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				console.error('로그인을 실패 했습니다.');
				userAuth = {};
			}
		});

		/*	버전 체크후 gps 체크	*/
/*
		if( window.PLATFORM && self.getAppVersion() >= 124 ) {
			if( window.PLATFORM.gpsCheck() == "false" ) {
				if( window.confirm('gps가 off되어 있습니다. 활성화 시키시겠습니까?') ) {
					window.PLATFORM.gpsSettingMove();
				}
			}
		}
*/
	};

	/**
	 * 앱 업데이트 체크
	 */
	this.appUpdateCheck = function(appVersionList) {
		if( isMobile.Android() ) {
			if( window.PLATFORM ) {
				/*	앱	*/
				var uploadFlag = false;
				if( appVersionList && appVersionList.length > 0 ) {
					var checkCurrentVersion = window.PLATFORM.version();

					/*	앱이 두개밖에 안되 그냥다 가져왔다.	*/
					for(var i=0; i<appVersionList.length; i++) {
						if( appVersionList[i].device_type == CommonConstant.DeviceType.android ) {
							var appVersion = appVersionList[i].app_version;

							appVersion = appVersion.replace(/\./gi, '');
							checkCurrentVersion = checkCurrentVersion.replace(/\./gi, '');
							if( appVersion > checkCurrentVersion ) {
								console.log('앱을 업그레이드 하세요~');
								uploadFlag = true;
							}
						}
					}

					if( uploadFlag === true ) {
						$('div.popup_box > p').html('학원밴드 앱이 업데이트 됐습니다.<br/>더 원활한 학원밴드 이용을 위해 앱을 업데이트 해주세요.['+checkCurrentVersion+']');
						$('div.popup_box > button[data-act=install]').html('앱 업데이트');
						$('div.popup_box').show();
					}
				}
			} else {
				/*	일반 브라우저	*/
				$('div.popup_box > p').html('학원밴드 안드로이드 앱이 있습니다.<br/>더 원활한 학원밴드 이용을 위해 앱을 다운로드 해주세요.');
				$('div.popup_box > button[data-act=install]').html('앱 설치');

				$('div.popup_box').show();
			}
		} else {
			if( isIE() ) {
				/*	ie면 팝업 보여준다.	*/
				$('div.popup_box > p').html('학원밴드 서비스는 IE 브라우저는 지원하지 않습니다. IE가 아닌 크롬, 파이어폭스, 사파리 등 다른 브라우저를 사용해 주세요.');
				$('div.popup_box > button[data-act=install]').hide();
				$('div.popup_box').show();
			}
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
	 * 주소 초기화
	 */
	this.initAddress = function() {
		console.log('initAddress call~~~');
		/**
		 * gps 정보 조회
		 */
		if( window.PLATFORM && window.PLATFORM.getLocation ) {
			console.log('android getLocation call!~~~~');
			window.PLATFORM.getLocation();
		} else if( navigator ) {
			console.log('navigator call!~~~~');
			navigator.geolocation.getCurrentPosition(function(position) {
				console.log('position', position);
				if( position && position.coords ) {
					var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					var geocoder = new google.maps.Geocoder();
					geocoder.geocode({'latLng' : latlng}, function(results, status) {
						if( results && results.length > 0 ) {
							var geoObj = results[0];
							self.setAddress(geoObj.formatted_address);
						}
					});
				}
			});
		} else {
			console.error('navigator is fail', navigator);
		}
	};

	this.init();
};
var comm = new HakwonCommon();