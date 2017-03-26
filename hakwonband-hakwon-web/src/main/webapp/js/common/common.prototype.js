/**
 * hakwonband JavaScript Prototype
 */

/**
 * Trim 함수 구현
 * use
 * trim	: '   s	  s e tststset	   '.trim()
 * ltrim	: '   s	  s e tststset	   '.ltrim()
 * rtrim	: '   s	  s e tststset	   '.rtrim()
 */
String.prototype.ltrim = function() {
	var re = /\s*((\S+\s*)*)/;
	return this.replace(re, "$1");
};
String.prototype.rtrim = function() {
	var re = /((\s*\S+)*)\s*/;
	return this.replace(re, "$1");
};
String.prototype.trim = function() {
	return this.ltrim().rtrim();
};


$.fn.isBound = function(type, fn) {
	console.log('events : ', this.data('events'));
	if( !this.data('events') ) {
		return false;
	}
    var data = this.data('events')[type];

    if (data === undefined || data.length === 0) {
        return false;
    }

    return (-1 !== $.inArray(fn, data));
};


/**
 * string String::cut(int len)
 * 글자를 앞에서부터 원하는 바이트만큼 잘라 리턴합니다.
 * 한글의 경우 2바이트로 계산하며, 글자 중간에서 잘리지 않습니다.
 */
String.prototype.cut = function(len) {
	var str = this;
	var l = 0;
	for (var i=0; i<str.length; i++) {
		l += (str.charCodeAt(i) > 128) ? 2 : 1;
		if (l > len) return str.substring(0,i) + "...";
	}
	return str;
};

/**
 * bool String::bytes(void)
 * 해당스트링의 바이트단위 길이를 리턴합니다. (기존의 length 속성은 2바이트 문자를 한글자로 간주합니다)
 */
String.prototype.bytes = function() {
	var str = this;
	var l = 0;
	for (var i=0; i<str.length; i++) l += (str.charCodeAt(i) > 128) ? 2 : 1;
	return l;
 };

/**
 * 알파벳과 숫자만 포함인지 체크
 * 주로 아이디 검사시 사용
 */
String.prototype.isAlphaNumeric = function() {
	var sAlphabet	= "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

	for(var i=0; i<this.length; i++ ) {
		if ( sAlphabet.indexOf(this.substring(i, i+1)) < 0 ) {
			return false;
		}
	}
	return true;
};


/**
 * 특수 문자 체크
 * @returns {Boolean}
 */
String.prototype.specialCharCheck = function() {
	if( RegularExt.specialChar.test(this) == true ){
		return false;
	}
	return true;
};

/**********************************
 * 숫자인지 체크
 * 주로 아이디 검사시 사용
 **********************************/
String.prototype.isNumber = function() {
	return jQuery.isNumeric(this);
};

/**
 * URL이 맞는지 확인
 */
String.prototype.isValidURL = function() {
	return RegularExt.url.test(this);
};

/**
 * 이메일 주소가 맞는지 확인
 */
String.prototype.isValidEmail = function() {
	return RegularExt.email.test(this);
};


/**
 * date를 날짜 포멧으로 변환해 준다.
 * @returns {String}
 */
Date.prototype.yyyymmdd = function(dash) {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString();
	var dd  = this.getDate().toString();
	if( !dash ) dash = "-";
	return yyyy + dash + (mm[1]?mm:"0"+mm[0]) + dash + (dd[1]?dd:"0"+dd[0]);
};

/**********************************
 * 배열 remove 함수 구현
 * index 값으로 제거
 **********************************/
Array.prototype.remove = function(idx) {
	var temp = new Array();
	var i = this.length;

	while( i > idx ) {
		var kk = this.pop();
		temp.push(kk);

		i--;
	}

	for(var i=temp.length - 2; i>=0; i--) {
		this.push(temp[i]);
	}
};

/**********************************
 * 배열 remove 함수 구현
 * Value 값으로 제거
 **********************************/
Array.prototype.removeValue = function(val) {

	var chkIdx = -1;
	for(var i=0; i<this.length; i++) {
		var tempVal = this[i];
		if( tempVal == val ) {
			chkIdx = i;
			break;
		}
	}
	if( chkIdx != -1 ) {
		this.remove(chkIdx);
	}
};

Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] == obj) {
			return true;
		}
	}
	return false;
};

Array.prototype.containKeyIndex = function(obj) {
	var returnIndex = -1;
	for(var i=0; i<this.length; i++ ) {
		if (this[i] == obj) {
			returnIndex = i;
			break;
		}
	}

	return returnIndex;
};

Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

/*	중복 제거	*/
Array.prototype.unique = function() {
	var a = {};
	for(var i=0; i <this.length; i++){
		if(typeof a[this[i]] == "undefined")
			a[this[i]] = 1;
	}
	this.length = 0;
	for(var i in a)
		this[this.length] = i;
	return this;
};

/**********************************
 * jquery 공통
 **********************************/
jQuery.fn.reverse = [].reverse;

/*	엘리먼트 유무	*/
jQuery.fn.doesExist = function(){
	return jQuery(this).length > 0;
};

/**
 * 콜라비 공통 함수 모음
 */
var commProto = {
	/**
	 * url을 추출해서 링크로 만들어 준다.
	 * @param text
	 * @returns
	 *
	 * usage : commProto.fn.replaceURLWithHTMLLinks
	 */
	replaceURLWithHTMLLinks : function(text) {
		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		return text.replace(exp, '<a href="$1" target="_blank">$1</a>');
	}

	/**
	 * java.util.Date 포맷의 날짜 차이 레이블
	 * @param viewDateStr
	 * @return String
	 *
	 * usage : commProto.fn.getTimeDiffLabel
	 */
	, getTimeDiffLabel : function(viewDateStr) {
		var nowDate		= new Date();
		var viewDate	= new Date(viewDateStr.slice(0, 4), viewDateStr.slice(4, 6) - 1, viewDateStr.slice(6, 8), viewDateStr.slice(8, 10), viewDateStr.slice(10, 12), viewDateStr.slice(12, 14));

		var diff = nowDate.getTime() - viewDate.getTime();

		var sec = parseInt(diff/1000);
		if (sec < 5) return "지금막";
		if (sec < 60) return sec+" 초전";

		var min = parseInt(sec/60);
		if (min < 60) return min+" 분전";

		var hour = parseInt(min/60);
		if (hour < 24) return hour+" 시간전";


		var day = parseInt(diff/1000/60/60/24);
		if (day <= 0) {
			day = hour / 24;
		}

		if( hour/24 < 30 ) {
			if (day == 1) return "어제";
			if (day == 2) return "그저께";
			return (day+" 일전");
		}

		var month = parseInt(hour/24/30);
		if (month == 1) return "한달전";
		if (month == 2) return "두달전";
		if (month < 12) return (month+" 달전");

		var year = parseInt(month/12);
		if (year == 1) return "작년";
		return (year+" 년전");
	}
	/**
	 * 로깅한다.
	 * usage : commProto.logger
	 */
	, logger : function(paramObj) {
		try {
			var reqParam = {};
			/*	현재 시간	*/
			reqParam.currentTime = (new Date()).toString();
			reqParam.loggingData = paramObj;
			/**
			 * TODO 현재 사용자 정보나 기타 정보 셋팅
			 */
			reqParam.userAuth	= userAuth;
			reqParam.hakwonInfo	= hakwonInfo;

			console.log('reqParam', reqParam);
			$.ajax({
				url : contextPath+'/logging.log',
				contentType: 'application/json; charset=utf-8;',
				data: JSON.stringify(reqParam),
				type : 'post',
				dataType : 'text',
				crossDomain : true,
				cache : false,
				success : function() { console.warn('logger api call'); },
				error : function(request, status, error) {
					console.error('logger api call Exception', request, status, error);
				}
			});
		} catch(e) {
			console.error(e);
		}
	}
	/**
	 * 에러 객체 덤프(로깅도 한다.)
	 * commProto.errorDump(errorData);
	 * 	errorCode
	 * 	errorObj
	 * 	customData
	 */
	, errorDump : function(errorData) {
		try {
			var errorCode = errorData.errorCode;
			var errorObj = errorData.errorObj;
			var customData = errorData.customData;

			var errorMsgObj = {};
			errorMsgObj.errorCode = errorCode;
			errorMsgObj.errorObj = errorObj;
			errorMsgObj.customData = customData;
			var viewMsg = errorCode;
			if (typeof errorObj === 'object') {
				if (errorObj.message) {
					viewMsg += '\nMessage: ' + errorObj.message;
					errorMsgObj.message = errorObj.message;
				}
				if (errorObj.stack) {
					viewMsg += '\nStacktrace:';
					viewMsg += '\n====================\n';
					viewMsg += errorObj.stack;
					errorMsgObj.stack = errorObj.stack;
				}
			} else {
				viewMsg += ('\ndumpError :: argument is not an object['+errorObj+']');
				errorMsgObj.message = 'dumpError :: argument is not an object';
			}
			console.error(viewMsg);
			commProto.logger(errorMsgObj);
		} catch(e) {
			console.error(e);
		}
	}
	/**
	 * 공통 에러
	 * commProto.commonError
	 */
	, commonError : function(xhr, textStatus, errorThrown) {
		try {
			if( xhr.readyState == 4 ) {
				if( xhr.status == 0 ) {
					alert("네트워크 상태를 확인해 주세요.");
					return false;
				} else if( xhr.status == 403 ) {
					alert("접근 권한이 없습니다.");
					return false;
				} else if( xhr.status == 404 ) {
					alert("요청 URL을 확인할 수 없습니다.");
					return false;
				}
			}
			if((window['console'] !== undefined)) {
				console.log('[commonErrorFun] xhr['+JSON.stringify(xhr)+'] textStatus['+textStatus+'] errorThrown[\n'+errorThrown+']');
			}
			commProto.logger({xhr:xhr, textStatus:textStatus, errorThrown:errorThrown});
			var data = JSON.parse(xhr.responseText);
			alert(data.errorMessage?data.errorMessage:"시스템 에러가 발생 했습니다.");
		} catch (e) {
			/*	Unexpected end of input	*/
			commProto.errorDump({errorObj:e});
		}
	}

	/*	숫자만 입력 가능하게	*/
	/*	commProto.onlyNumber	*/
	, onlyNumber : function(e) {
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
			//	Allow: Ctrl+A
			(e.keyCode == 65 && e.ctrlKey === true) ||
			//	tab
			(e.keyCode == 9 ) ||
			//	Allow: home, end, left, right, down, up
			(e.keyCode >= 35 && e.keyCode <= 40)) {
			//	let it happen, don't do anything
			return;
		}
		// Ensure that it is a number and stop the keypress
		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
			e.preventDefault();
		}
	}
	/*	숫자 콤바 추가	*/
	/*	commProto.numberWithCommas	*/
	, numberWithCommas : function(x) {
		if( !x ) return '0';
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	/**
	 * history.back 또는 url 이동
	 * commProto.hrefMove
	 */
	, hrefMove : function(moveUrl) {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			window.location.href = moveUrl;
		}
	}
	/**
	 * 반응형 체크
	 * commProto.isResponsiveCheck()
	 */
	, isResponsiveCheck : function() {
		if( window.innerWidth < 769 ) {
			return true;
		} else {
			return false;
		}
	}
};

$.fn.singleRowspan = function(colIdx, isStats) {
	return this.each(function() {
		var that;
		$('tr', this).each(function(row) {
			$('td:eq('+colIdx+')', this).filter(':visible').each(function(col) {
				if ($(this).html() == $(that).html() && (!isStats || isStats && $(this).prev().html() == $(that).prev().html() ) ) {
					rowspan = $(that).attr("rowspan") || 1;
					rowspan = Number(rowspan)+1;

					$(that).attr("rowspan",rowspan);
					$(this).hide();
				} else {
					that = this;
				}
				that = (that == null) ? this : that;
			});
		});
	});
};

/**
 * @deprecated
 */
$.fn.groupTable = function(startIndex, total) {
	if( total === 0 ) { return; }
	console.log(this);
	var $rows = this;
	var i , currentIndex = startIndex, count=1, lst=[];
	var tds = $rows.find('td:eq('+ currentIndex +')');
	console.log('tds', tds);
	var ctrl = $(tds[0]);
	lst.push($rows[0]);

	for (i=1;i<=tds.length;i++) {
		if (ctrl.text() ==  $(tds[i]).text()) {
			count++;
			$(tds[i]).addClass('deleted');
			lst.push($rows[i]);
		} else {
			if (count>1) {
				ctrl.attr('rowspan',count);
				groupTable($(lst), startIndex+1, total-1);
			}
			count=1;
			lst = [];
			ctrl=$(tds[i]);
			lst.push($rows[i]);
		}
	}
}

/**
 * 테이블 머지 한다.
 */
function groupTable($rows, startIndex, total) {
	if (total === 0) {
		return;
	}
	var i , currentIndex = startIndex, count=1, lst=[];
	var tds = $rows.find('td:eq('+ currentIndex +')');
	console.log('tds', tds);
	var ctrl = $(tds[0]);
	lst.push($rows[0]);
	for (i=1;i<=tds.length;i++) {
		if (ctrl.text() ==  $(tds[i]).text()) {
			count++;
			$(tds[i]).addClass('deleted');
			lst.push($rows[i]);
		} else {
			if (count>1) {
				ctrl.attr('rowspan',count);
				groupTable($(lst),startIndex+1,total-1);
			}
			count=1;
			lst = [];
			ctrl=$(tds[i]);
			lst.push($rows[i]);
		}
	}
}

/*	숫자만 입력 가능하게	*/
function onlyNumber(evt) {
	var theEvent = evt || window.event;
	var key = theEvent.keyCode || theEvent.which;
	key = String.fromCharCode( key );
	var regex = /[0-9]|\./;
	if( !regex.test(key) ) {
		theEvent.returnValue = false;
		if(theEvent.preventDefault) theEvent.preventDefault();
	}
}

/*****************************************************
 * 바로 사용할수 있는 함수
 *****************************************************/

/**
 * null 체크 함수
 * @param val
 * @returns {Boolean}
 */
function isNull(val) {
	if( !val ) {
		return true;
	} else if( typeof(val) == "undefined" ) {
		return true;
	} else if( val == null ) {
		return true;
	}

	if( typeof(val) != "string" ) {
		val = String(val);
	}

	if( val.trim() == "" ) {
		return true;
	} else {
		return false;
	}
}

/**
 * 브라우저 체크
 */
var isMobile = {
	Android: function() {
		return /Android/i.test(navigator.userAgent);
	},
	BlackBerry: function() {
		return /BlackBerry/i.test(navigator.userAgent);
	},
	iOS: function() {
		return /iPhone|iPad|iPod/i.test(navigator.userAgent);
	},
	Windows: function() {
		return /IEMobile/i.test(navigator.userAgent);
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
	}
};
console.log('isMobile.Android() : ' + isMobile.Android());

/**
 * 이벤트 핸들러
 * @param event
 * @param selector
 */
function eventHandler(event, selector) {
	event.stopPropagation();
	event.preventDefault();
	if (event.type === 'touchend'){
		selector.off('click');
	}
}

/**
 * 푸시 키 저장
 * @param key string
 * @param deviceType string
 * @param isProduction boolean
 */
var deviceToken = undefined;
function setPushNotiKey(key, deviceType, isProduction, callback) {
	console.debug('key['+key+'] deviceType['+deviceType+'] isProduction['+isProduction+']');
	if( isDebug === true ) {
		alert('key['+key+'] deviceType['+deviceType+'] isProduction['+isProduction+']');
	}

	if (isNull(key) || key == 'null' || key == '(null)') {
		return ;
	}

	if( userAuth.userNo ) {
		/*	로그인	*/
		var param = {key:key, deviceType:deviceType, isProduction:isProduction};
		$.ajax({
			url: contextPath+"/setPushNotiKey.do",
			type: "post",
			data: $.param(param, true),
			dataType: "json",
			success: function(data) {
				console.log('setPushNotiKey', data);
				if( callback ) {
					callback(data);
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				console.error('setPushNotiKey Fai', xhr, textStatus, errorThrown);
			}
		});
	} else {
		/*	비로그인	*/
		deviceToken = {
			key : key
			, deviceType : deviceType
			, isProduction : isProduction
		};
	}
}


/**
 * ie 브라우저 체크
 * @returns {Boolean}
 */
function isIE() {
	var ua = window.navigator.userAgent;
	console.debug('ua : ' + ua);
	var msie = ua.indexOf("MSIE ");
	console.debug('msie : ' + msie);

	if( ua.indexOf('Windows Phone') >= 0 || ua.indexOf('Mobile') >= 0 ) {
		return false;
	} else if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		return true;
	} else {
		return false;
	}
}

function isSupport() {
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");

	if( ua.indexOf('Windows Phone') >= 0 || ua.indexOf('Mobile') >= 0 ) {
		return true;
	} else if (msie > 0 ) {
		if( ua.indexOf('MSIE 10') >= 0 || ua.indexOf('MSIE 11') >= 0 ) {
			return true;
		} else {
			return false;
		}
	} else {
		return true;
	}
}

function call_ajax(params, targetUrl, callback) {
	$.ajax({
		type: "post",
		url:  contextPath + targetUrl,
		data: $.param(params, true),
		dataType: "JSON",
		success: function(data) {
			callback(data);
		},
		error: function(xhr, textStatus, errorThrown) {
			alert('통신을 실패 했습니다.');
		}
	});
}


/**
 * currentPage : 현재 페이지
 * totalCount : 전체 카운트
 * scaleOfPage : 페이지당 보여줄 컨텐츠의 개수
 * blockSize : 한 블럭당 보여줄 페이지의 개수
 */
function generatePage(currentPage, totalCount, scaleOfPage, blockSize) {

	var html = '';
	var totalPage = 0;
	var back = 0;
	var forward = 0;

	if(blockSize == null || blockSize == "" || blockSize == "undefined") {
		blockSize = 10;
	}

	if((totalCount % scaleOfPage) == 0 ) {
		totalPage = parseInt(totalCount / scaleOfPage);
	} else {
		totalPage = parseInt(totalCount / scaleOfPage) + 1;
	}

	//int blockSize = 3;	// 페이지 리스트 크기 ( 10개씩 페이지를 보여줌.)
	var totalBlock = parseInt(totalPage / blockSize);		// 전체 블럭의 개수

	if(totalPage % blockSize != 0){
		totalBlock++;
	}
	var currentBlock = parseInt(currentPage / blockSize);		// 현재 페이지가 속한 블럭 번호

	if(currentPage % blockSize != 0){
		currentBlock++;
	}

	back = parseInt((currentBlock - 2) * blockSize) + 1;
	forward = parseInt(currentBlock * blockSize ) + 1;

	if(totalCount > 0) {
		html += '<button type="button" class="btn btn-white" current-page="1" style=" margin-right: 3px; ">처음</button>';
	}


	if(back != 0 && back > 0) {																	//이전 버튼
		html += '<button type="button" class="btn btn-white" current-page="'+back+'" style=" margin-right: 3px; "><i class="fa fa-chevron-left"></i></button>';

	}
	for( var i=(currentBlock-1)*blockSize+1; i<=currentBlock*blockSize && i<=totalPage; i++ ) { //페이징
		if( i == currentPage){
			html += '<button type="button" class="btn btn-white active" current-page="'+i+'" style=" margin-right: 3px; ">'+i+'</button>';
		} else {
			html += '<button type="button" class="btn btn-white" current-page="'+i+'" style=" margin-right: 3px; ">'+i+'</button>';
		}

	}

	if(currentBlock < totalBlock ) {												//다음 버튼
		html += '<button type="button" class="btn btn-white" current-page="'+forward+'" style=" margin-right: 3px; "><i class="fa fa-chevron-right"></i> </button>';

	}


	if(totalCount > 0) {
		html += '<button type="button" class="btn btn-white" current-page="'+totalPage+'">끝</button>';


	}
	return html;
}

var setCookie = function(cookieName, cookieValue, autoLogin) {
	console.log('setCookie cookieName['+cookieName+'] cookieValue['+cookieValue+'] autoLogin['+autoLogin+']');
	var cookieString = cookieName + '=' + encodeURIComponent(cookieValue) + ';domain=.'+HakwonConstant.CookieDomain+'; path=/;';

	if(autoLogin) {
		var nowDate = new Date();
		nowDate.setTime(nowDate.getTime() + (90*24*60*60*1000));
		cookieString += " expires="+nowDate.toUTCString()+';';
	}
	document.cookie = cookieString;
};

/**
 * 브라우저 체크
 */
var getBrowser = function() {
	if( window.PLATFORM ) {
		/*	android app	*/
		return 'androidApp'
	} else {
		var standalone = window.navigator.standalone;
		var userAgent = window.navigator.userAgent.toLowerCase();
		var safari = /safari/.test( userAgent );
		var ios = /iphone|ipod|ipad/.test( userAgent );

		if( ios ) {
			if ( !standalone && safari ) {
				return 'iosBrowser';
			} else if ( standalone && !safari ) {
				return 'iosStandalone';
			} else if ( !standalone && !safari ) {
				return 'iosApp';
			} else {
				return 'ios';
			}
		} else {
			if( /android/i.test(userAgent) ) {
				return 'android';
			} else {
				return 'other';
			}
		}
	}
};

/*	디버그 모드	*/
var isDebug = false;


var isFlashInstalled = function() {
	var is_flash_installed = false;
	try {
		if(new ActiveXObject('ShockwaveFlash.ShockwaveFlash')) is_flash_installed=true;
	} catch(e) {
		if(navigator.mimeTypes['application/x-shockwave-flash'] != undefined) is_flash_installed=true;
	}

	return is_flash_installed;
}