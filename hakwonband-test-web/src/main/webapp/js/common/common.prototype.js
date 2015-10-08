/**
 * hakwonband JavaScript Prototype
 */

/**
 * Trim 함수 구현
 * use
 * trim	: '   s      s e tststset       '.trim()
 * ltrim	: '   s      s e tststset       '.ltrim()
 * rtrim	: '   s      s e tststset       '.rtrim()
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
	 * commProto.dumpError(e);
	 */
	, dumpError : function(errTitle, err) {
		if (typeof err === 'object') {
			console.error(errTitle);
			if (err.message) {
				console.log('\nMessage: ' + err.message)
			}
			if (err.stack) {
				console.log('\nStacktrace:')
				console.log('====================')
				console.log(err.stack);
			}
		} else {
			console.error(errTitle+' dumpError :: argument is not an object', e);
		}
	}
};

/**
 * 초기화
 */
jQuery(document).ready(function() {

});

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

/**
 *
 * Check if a "hash key" is present:
 * HashSearch.keyExists("thekey");
 *
 * Get the value for a hash key:
 * HashSearch.get('thekey');
 *
 * Set the value for a hash key, and update the URL hash:
 * HashSearch.set('thekey', 'hey');
 *
 * Remove a hash key from the URL:
 * HashSearch.remove('thekey');
 *
 * Reload the hash into the local object:
 * HashSearch.load();
 *
 * Push the current key value set to the URL hash:
 * HashSearch.push();
 *
 * http://stackoverflow.com/questions/3729150/retrieve-specific-hash-tags-value-from-url
 */
var HashSearch = new function () {
	var params;

	this.set = function (key, value) {
		params[key] = value;
		this.push();
	};

	this.remove = function (key, value) {
		delete params[key];
		this.push();
	};

	this.get = function (key) {
		if( params.hasOwnProperty(key) ) {
			return params[key];
		} else {
			return null;
		}
	};

	this.keyExists = function (key) {
		return params.hasOwnProperty(key);
	};

	this.push= function () {
		var hashBuilder = [];
		for(var key in params) if (params.hasOwnProperty(key)) {
			key = escape(key);
			var value = escape(params[key]); // escape(undefined) == "undefined"
			hashBuilder.push(key + ( (value !== "undefined") ? '=' + value : "" ));
		}

		window.location.hash = hashBuilder.join("&");
	};

	(this.load = function () {
		params = {};
		var hashStr = window.location.hash, hashArray;
		hashStr = hashStr.substring(1, hashStr.length);
		hashArray = hashStr.split('&');

		for(var i = 0; i < hashArray.length; i++) {
			var keyVal = hashArray[i].split('=');
			params[unescape(keyVal[0])] = (typeof keyVal[1] != "undefined") ? unescape(keyVal[1]) : keyVal[1];
		}
	})();
};

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

/*	함수 이름으로 실행 한다.	*/
function executeFunctionByName(functionName, context /*, args */) {
	console.log('executeFunctionByName call['+functionName+']');
	var args = [].slice.call(arguments).splice(2);
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for(var i=0; i<namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(this, args);
}

/*	레이아웃 html을 가져온다.	*/
function getLayoutHtml(functionName, context) {
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for(var i=0; i<namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func];
}

/**
 * ie 브라우저 체크
 * @returns {Boolean}
 */
function isIE() {
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");

	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		//alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
		return true;
	} else {
		//alert('otherbrowser');
		return false;
	}
}