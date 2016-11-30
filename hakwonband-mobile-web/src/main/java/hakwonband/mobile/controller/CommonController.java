package hakwonband.mobile.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.common.model.ErrorObj;
import hakwonband.mobile.common.constant.HakwonConstant;
import hakwonband.mobile.model.DevicePushData;
import hakwonband.mobile.service.AsyncService;
import hakwonband.mobile.service.CommonService;
import hakwonband.mobile.service.HakwonService;
import hakwonband.mobile.service.MobileService;
import hakwonband.mobile.service.UserService;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.util.CookieUtils;
import hakwonband.util.DataMap;
import hakwonband.util.HKBandUtil;
import hakwonband.util.SecuUtil;
import hakwonband.util.StringUtil;
import net.sf.uadetector.UserAgentStringParser;
import net.sf.uadetector.service.UADetectorServiceFactory;

/**
 * 공통 컨트롤러
 * @author bumworld
 *
 */
@Controller
public class CommonController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(CommonController.class);

	@Resource(name = "messageSourceAccessor")
	protected MessageSourceAccessor messageSource;

	@Autowired
	private CommonService commonService;

	@Autowired
	private HakwonService hakwonService;

	@Autowired
	private UserService userService;

	@Autowired
	private MobileService mobileService;

	@Autowired
	private AsyncService asyncService;

	private static final UserAgentStringParser uaParser = UADetectorServiceFactory.getResourceModuleParser();

	/*	쿠키 저장 시간	*/
	private static final int cookieSaveTime = 1 * 90 * 24 * 60 * 60;

	/**
	 * index
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/index")
	public ModelAndView index(HttpServletRequest request, HttpServletResponse response) {
		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		if( authUserInfo != null ) {
			if( authUserInfo.equals("user_type", HakwonConstant.UserType.TEACHER) || authUserInfo.equals("user_type", HakwonConstant.UserType.WONJANG) ) {
				return new ModelAndView("redirect:https://hakwon.hakwonband.com/main.do");
			} else if( authUserInfo.equals("user_type", HakwonConstant.UserType.MANAGER) ) {
				return new ModelAndView("redirect:https://manager.hakwonband.com/");
			} else if( authUserInfo.equals("user_type", HakwonConstant.UserType.ADMIN) ) {
				return new ModelAndView("redirect:https://admin.hakwonband.com/main.do");
			}
		}

		return new ModelAndView("/index");
	}

	/**
	 * 글 오픈
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/content")
	public ModelAndView content(HttpServletRequest request, HttpServletResponse response) {

		String num = request.getParameter("num");
		if( StringUtils.isBlank(num) ) {
			return new ModelAndView("redirect:/index.do?"+System.currentTimeMillis()+"#/userMain");
		}

		/* 인증 정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		if( num.startsWith("e:") ) {
			/*	이벤트	*/
			num = num.split(":")[1];
			if( NumberUtils.isNumber(num) ) {
				DataMap param = new DataMap();

				mobileService.procEventDetail(param);
			} else {
				return new ModelAndView("redirect:/index.do?"+System.currentTimeMillis()+"#/userMain");
			}
		} else {
			/*	공지	*/
			if( NumberUtils.isNumber(num) ) {
				String notice_no = num;

				DataMap param = new DataMap();
				param.put("notice_no",			notice_no);
				param.put("content_type", 		"001");								// 댓글 컨텐츠 타입 001 공지
				param.put("content_parent_no",	notice_no);
				param.put("file_parent_type",	CommonConstant.File.TYPE_NOTICE);	// 파일 타입 001 공지
				param.put("file_parent_no",		notice_no);
				if( authUserInfo != null ) {
					param.put("user_no", 			authUserInfo.get("user_no"));		// 읽은상태 등록시 사용
					param.put("user_type", 			authUserInfo.get("user_type"));
				}

				DataMap noticeInfo = mobileService.procNoticeDetail(param);
				DataMap noticeDetail = (DataMap)noticeInfo.get("noticeDetail");
				if( "002".equals(noticeDetail.getString("notice_type")) ) {
					/**
					 * 학원 공지
					 * 학원 멤버 인지 확인해야 한다.
					 */
					return new ModelAndView("redirect:#/hakwon/noticeDetail?hakwon_no="+noticeDetail.getString("hakwon_no")+"&notice_no="+noticeDetail.getString("notice_no"));
				} else if( "003".equals(noticeDetail.getString("notice_type")) ) {
					/**
					 * 반 공지
					 * 반 멤버 인지 확인해야 한다.
					 */
					if( noticeDetail.getInt("is_class_member") > 0 ) {
						return new ModelAndView("redirect:#/hakwon/noticeDetail?hakwon_no="+noticeDetail.getString("hakwon_no")+"&class_no="+noticeDetail.getString("notice_parent_no")+"&notice_no="+noticeDetail.getString("notice_no"));
					} else {
						return new ModelAndView("redirect:/index.do?"+System.currentTimeMillis()+"#/userMain");
					}
				} else {
					return new ModelAndView("redirect:/index.do?"+System.currentTimeMillis()+"#/userMain");
				}
			} else {
				return new ModelAndView("redirect:/index.do?"+System.currentTimeMillis()+"#/userMain");
			}
		}

		return new ModelAndView("redirect:/index.do?"+System.currentTimeMillis()+"/#/receiveMessageList");
	}

	/**
	 * 로그인
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/login")
	public void login(HttpServletRequest request, HttpServletResponse response) {
		String flag			= CommonConstant.Flag.fail;
		String userId		= StringUtil.replaceNull(request.getParameter("userId"));
		String userPass		= StringUtil.replaceNull(request.getParameter("userPass"));
		String deviceToken	= StringUtil.replaceNull(request.getParameter("deviceToken"));
		String deviceType	= StringUtil.replaceNull(request.getParameter("deviceType"));
		String isProduction	= StringUtil.replaceNull(request.getParameter("isProduction"));
		String loginSave	= StringUtil.replaceNull(request.getParameter("loginSave"));
		String idSave		= StringUtil.replaceNull(request.getParameter("idSave"));
		if( "true".equalsIgnoreCase(isProduction) ) {
			isProduction = "Y";
		} else {
			isProduction = "N";
		}
		if( "ios".equals(deviceType) ) {
			/*	임시	*/
			isProduction = "Y";
		}

		if( "(null)".equals(deviceType) ) {
			deviceType = "";
		}

		/*	디바이스는 아이디 저장 및 로그인 유지를 항상 한다.	*/
		if( (StringUtil.isNotBlank(deviceToken) && StringUtil.isNotBlank(deviceToken)) || "ios".equals(deviceType) ) {
			loginSave = "Y";
			idSave = "Y";
		}

		DataMap colData = new DataMap();
		/*	필수 파라미터 체크	*/
		if(StringUtil.isNotNull(userId) && StringUtil.isNotNull(userPass)) {

			String reqIpAddr = getClientIpAddress(request);
			DataMap param = new DataMap();
			param.put("userId",			userId);
			param.put("userPass",		SecuUtil.sha256(userPass));
			param.put("reqIpAddr",		reqIpAddr);
			param.put("userAgent",		uaParser.parse(request.getHeader("User-Agent")));
			param.put("deviceToken",	deviceToken);
			param.put("deviceType",		deviceType);
			param.put("isProduction",	isProduction);

			DataMap authUserInfo = commonService.executeLogin(param);
			/*	조회 성공	*/
			if(authUserInfo != null ) {
				logger.debug("auth user info : " + authUserInfo.toString());

				if( authUserInfo.equals("use_yn", "S") ) {
					/*	일시 정지된 사용자	*/
					sendFlag("stop", request, response);
					return ;
				} else if( authUserInfo.equals("approved_yn", "Y") == false ) {
					/*	미승인 사용자는 	*/
					sendFlag("approvedWait", request, response);
					return ;
				}

				int cookieExpires = -1;
				if( "Y".equals(loginSave) ) {
					cookieExpires = cookieSaveTime;
				}

				CookieUtils cookieUtils = new CookieUtils(request, response, true);
				cookieUtils.setCookie(CommonConstant.Cookie.hkBandAuthKey, authUserInfo.getString("authKey"), cookieExpires);

				/**
				 * 아이디 저장
				 */
				if( "Y".equals(idSave) ) {
					cookieUtils.setCookie(CommonConstant.Cookie.saveId, userId, cookieSaveTime);
				}

				/**
				 * 학생이나 학부모인 경우에는 부모/자식 리스트를 로드한다.
				 */
				if( authUserInfo.equals("user_type", HakwonConstant.UserType.STUDENT) ) {
					List<DataMap> familyList = userService.parentList(authUserInfo);
					colData.put("familyList", familyList);

					/*	학교 정보	*/
					DataMap schoolInfo = userService.schoolInfo(authUserInfo);
					colData.put("schoolInfo", schoolInfo);
				} else if( authUserInfo.equals("user_type", HakwonConstant.UserType.PARENT) ) {
					List<DataMap> familyList = userService.childList(authUserInfo);

					colData.put("familyList", familyList);
				}


				colData.put("authUserInfo", authUserInfo);

				flag = CommonConstant.Flag.success;
			} else {
				flag = CommonConstant.Flag.notexist;
			}
		} else {
			flag = CommonConstant.Flag.param_error;
		}
		colData.put("flag",	flag);

		sendColData(colData, request, response);
	}

	/**
	 * 인증 체크
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/authCheck")
	public void authCheck(HttpServletRequest request, HttpServletResponse response) {
		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String authKey = (String)request.getAttribute(CommonConstant.Cookie.hkBandAuthKey);

		DataMap colData = new DataMap();
		colData.put("authUserInfo", authUserInfo);

		if( authUserInfo != null ) {
			/**
			 * 학생이나 학부모인 경우에는 부모/자식 리스트를 로드한다.
			 */
			if( authUserInfo.equals("user_type", HakwonConstant.UserType.STUDENT) ) {
				List<DataMap> parentList = userService.parentList(authUserInfo);
				colData.put("familyList", parentList);

				/*	학교 정보	*/
				DataMap schoolInfo = userService.schoolInfo(authUserInfo);
				colData.put("schoolInfo", schoolInfo);
			} else if( authUserInfo.equals("user_type", HakwonConstant.UserType.PARENT) ) {
				List<DataMap> childList = userService.childList(authUserInfo);
				colData.put("familyList", childList);
			}
		}

		if( authUserInfo != null && StringUtils.isNotBlank(authKey) ) {
			/*	인증 정보가 있을때 디바이스 인증키 내려준다.	*/
			DataMap param = new DataMap();
			param.put("authKey",	authKey);

			DataMap deviceInfo = commonService.getLoginDeviceInfo(param);
			if( deviceInfo != null ) {
				colData.put("deviceInfo",	deviceInfo);
			}
		}


		/*	app 버전 조회	*/
		List<DataMap> appVersionList = commonService.getAppVersion();
		colData.put("appVersionList", appVersionList);

		sendColData(colData, request, response);
	}

	/**
	 * 로그 아웃
	 *
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/logout")
	public ModelAndView logout(HttpServletRequest request, HttpServletResponse response) {

		String authKey = (String)request.getAttribute(CommonConstant.Cookie.hkBandAuthKey);
		DataMap param = new DataMap();
		param.put("authKey",	authKey);

		commonService.executeLogout(param);

		CookieUtils cookieUtils = new CookieUtils(request, response, true);
		cookieUtils.delCookie(CommonConstant.Cookie.hkBandAuthKey);

		return new ModelAndView("redirect:/index.html");
	}

	/**
	 * 로그 아웃
	 *
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/ajaxLogout")
	public void ajaxLogout(HttpServletRequest request, HttpServletResponse response) {

		String authKey = (String)request.getAttribute(CommonConstant.Cookie.hkBandAuthKey);
		DataMap param = new DataMap();
		param.put("authKey",	authKey);

		commonService.executeLogout(param);

		CookieUtils cookieUtils = new CookieUtils(request, response, true);
		cookieUtils.delCookie(CommonConstant.Cookie.hkBandAuthKey);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 메세지 요청
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/message")
	public ModelAndView message(HttpServletRequest request, HttpServletResponse response) {

		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		if( authUserInfo == null ) {
			return new ModelAndView("redirect:https://m.hakwonband.com/");
		} else {
			logger.debug("authUserInfo : " + authUserInfo);

			String hakwonNo		= request.getParameter("hakwonNo");
			String messageNo	= request.getParameter("messageNo");
			String userType		= authUserInfo.getString("user_type");

			if( HakwonConstant.UserType.STUDENT.equals(userType) || HakwonConstant.UserType.PARENT.equals(userType) ) {
				if( StringUtils.isBlank(messageNo) ) {
					return new ModelAndView("redirect:https://m.hakwonband.com/#/receiveMessageList?"+System.currentTimeMillis());
				} else {
					return new ModelAndView("redirect:https://m.hakwonband.com/#/messageDetail?message_no="+messageNo+"&type=receive&page=1&t="+System.currentTimeMillis());
				}
			} else if( HakwonConstant.UserType.WONJANG.equals(userType) || HakwonConstant.UserType.TEACHER.equals(userType) ) {
				if( StringUtil.isBlank(hakwonNo) ) {
					return new ModelAndView("redirect:https://hakwon.hakwonband.com/main.do");
				} else {
					if( "-1".equals(hakwonNo) ) {
						DataMap hakwonInfo = userService.messageMoveHakwonInfo(authUserInfo);
						hakwonNo = hakwonInfo.getString("hakwon_no");
					}
					if( StringUtils.isBlank(messageNo) ) {
						return new ModelAndView("redirect:https://hakwon.hakwonband.com/main.do#/message/receiveMessageList?hakwon_no="+hakwonNo+"&t="+System.currentTimeMillis());
					} else {
						return new ModelAndView("redirect:https://hakwon.hakwonband.com/main.do#/message/receiveMessageDetail?hakwon_no="+hakwonNo+"&messageNo="+messageNo+"&t="+System.currentTimeMillis());
					}
				}
			} else if( HakwonConstant.UserType.ADMIN.equals(userType) ) {
				return new ModelAndView("redirect:https://admin.hakwonband.com/");
			} else if( HakwonConstant.UserType.MANAGER.equals(userType) ) {
				return new ModelAndView("redirect:https://manager.hakwonband.com/");
			} else {
				return new ModelAndView("redirect:https://m.hakwonband.com/");
			}
		}
	}

	/**
	 * 공지 알림
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/notice")
	public ModelAndView notice(HttpServletRequest request, HttpServletResponse response) {

		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		if( authUserInfo == null ) {
			return new ModelAndView("redirect:https://m.hakwonband.com/");
		} else {
			logger.debug("authUserInfo : " + authUserInfo);

			String hakwonNo = request.getParameter("hakwon_no");
			String classNo = request.getParameter("class_no");
			String noticeNo = request.getParameter("notice_no");
			String userType = authUserInfo.getString("user_type");
			logger.info("\n!!!!!!!!!!!!message hakwonNo["+hakwonNo+"] userType["+userType+"]");

			if( HakwonConstant.UserType.STUDENT.equals(userType) || HakwonConstant.UserType.PARENT.equals(userType) ) {
				String redirectUrl = "/index.do#/hakwon/noticeDetail?hakwon_no="+hakwonNo+"&notice_no="+noticeNo;
				if( StringUtils.isNotBlank(classNo) ) {
					redirectUrl += "&class_no="+classNo;
				}
				return new ModelAndView("redirect:https://m.hakwonband.com"+redirectUrl);
			} else if( HakwonConstant.UserType.WONJANG.equals(userType) || HakwonConstant.UserType.TEACHER.equals(userType) ) {
				if( StringUtil.isBlank(hakwonNo) || StringUtil.isBlank(noticeNo) ) {
					return new ModelAndView("redirect:https://hakwon.hakwonband.com/main.do");
				} else {
					String redirectUrl = "/main.do#/notice/detail?hakwon_no="+hakwonNo+"&notice_no="+noticeNo;
					if( StringUtils.isNotBlank(classNo) ) {
						redirectUrl += "&class_no="+classNo;
					}
					logger.info("\n!!!!master&teacher hakwon_no["+hakwonNo+"]");
					return new ModelAndView("redirect:https://hakwon.hakwonband.com"+redirectUrl);
				}
			} else if( HakwonConstant.UserType.ADMIN.equals(userType) ) {
				return new ModelAndView("redirect:https://admin.hakwonband.com/");
			} else if( HakwonConstant.UserType.MANAGER.equals(userType) ) {
				return new ModelAndView("redirect:https://manager.hakwonband.com/");
			} else {
				return new ModelAndView("redirect:https://m.hakwonband.com/");
			}
		}
	}

	/**
	 * 출결 결과
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/attendanceList")
	public ModelAndView attendanceList(HttpServletRequest request, HttpServletResponse response) {
		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		if( authUserInfo == null ) {
			return new ModelAndView("redirect:https://m.hakwonband.com/");
		} else {
			String student_no		= request.getParameter("user_no");
			String attendance_no	= request.getParameter("no");
			String attendance_type	= request.getParameter("type");

			return new ModelAndView("redirect:https://m.hakwonband.com/#/attendanceList?student_no="+student_no+"&attendance_no="+attendance_no+"&attendance_type="+attendance_type+"&t="+System.currentTimeMillis());
		}
	}

	/**
	 * 미리 보기
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/preview")
	public ModelAndView preview(HttpServletRequest request, HttpServletResponse response) {

		String previewNo = request.getParameter("preview_no");

		DataMap param = new DataMap();
		param.put("preview_no",	previewNo);

		DataMap previewData = commonService.getPreview(param);
		request.setAttribute("previewData",	previewData);

		return new ModelAndView("/preview");
	}

	/**
	 * 푸시키 저장
	 * @param request
	 * @param response
	 */
	@RequestMapping("/setPushNotiKey")
	public void setPushNotiKey(HttpServletRequest request, HttpServletResponse response) {
		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String authKey		= (String)request.getAttribute(CommonConstant.Cookie.hkBandAuthKey);

		String key			= request.getParameter("key");
		String deviceType	= request.getParameter("deviceType");
		String isProduction	= request.getParameter("isProduction");
		if( "true".equalsIgnoreCase(isProduction) ) {
			isProduction = "Y";
		} else {
			isProduction = "N";
		}
		if( "ios".equals(deviceType) ) {
			/*	임시	*/
			isProduction = "Y";
		}
		if( "(null)".equals(deviceType) ) {
			deviceType = "";
		}

		if( CommonConstant.DeviceType.android.equalsIgnoreCase(deviceType) ) {
			deviceType = CommonConstant.DeviceType.android;
		} else if( CommonConstant.DeviceType.ios.equalsIgnoreCase(deviceType) ) {
			deviceType = CommonConstant.DeviceType.ios;
		} else {
			sendFlag("invalidDeviceType", request, response);
			return ;
		}

		if( authUserInfo == null ) {
			/*	로그인 하기 전이라 저장할 필요 없다.	*/
		} else {
			DataMap param = new DataMap();
			param.put("user_no",		authUserInfo.getString("user_no"));
			param.put("auth_key",		authKey);
			param.put("device_token",	key);
			param.put("device_type",	deviceType);
			param.put("is_production",	isProduction);

			commonService.updateDevicePushKey(param);
		}
		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 학원 정보
	 * /hakwonInfo.do?hakwonNo=520
	 * {
  "hakwon_code" : "jNRzFyzYe7",
  "master_user_no" : 71,
  "master_user_name" : "범원장",
  "hakwon_no" : 448,
  "hakwon_cate" : "011",
  "hakwon_cate_name" : "수영학원(스포츠)",
  "hakwon_name" : "범원장 학원 입니다.",
  "tel_no_1" : "02-784-4512",
  "logo_file_path" : "",
  "addr_no" : 3807,
  "old_sido" : "서울",
  "old_addr1" : "서울 동작구 사당동 ",
  "old_addr2" : "기타 주소 입니다.",
  "street_addr1" : "",
  "street_addr2" : ""
}
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/hakwonInfo")
	public ModelAndView hakwonInfo(HttpServletRequest request, HttpServletResponse response) {

		String hakwonNo = request.getParameter("hakwonNo");

		if( StringUtils.isBlank(hakwonNo) ) {
			return new ModelAndView("redirect:/index.do");
		} else {
			DataMap param = new DataMap();
			param.put("hakwon_no", hakwonNo);

			/* 학원 상세정보 조회 */
			DataMap hakwonDetail = hakwonService.hakwonDetail(param);
			request.setAttribute("hakwonDetail", hakwonDetail);
		}

		return new ModelAndView("/hakwon");
	}

	@RequestMapping("/testFun")
	public void testFun(HttpServletRequest request, HttpServletResponse response) {
		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 모바일 디버그 모드에서 사용한다.
	 * @param request
	 * @param response
	 */
	@RequestMapping("/testMsg")
	public void testMsg(HttpServletRequest request, HttpServletResponse response) {

		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("reciveUserNo",	authUserInfo.getString("user_no"));

		List<UserDevice> userDeviceList = commonService.getUserDevice(param);

		PushMessage pushMessage = new PushMessage();
		pushMessage.setTicker("학원밴드 입니다.");
		pushMessage.setTitle("테스트 메세지 입니다.");
		pushMessage.setContent("");
		pushMessage.setLink_url("https://m.hakwonband.com/");

		DevicePushData devicePushData = new DevicePushData(pushMessage, userDeviceList);

		asyncService.pushMobileDevice(devicePushData);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 앱 푸시키 저장
	 * @param request
	 * @param response
	 */
	@RequestMapping("/setPushNotiKeyApp")
	public void setPushNotiKeyApp(HttpServletRequest request, HttpServletResponse response) {
		/* 인증 정보 */
		String authKey		= request.getHeader(CommonConstant.Cookie.hkBandAuthKey);
		String key			= request.getParameter("key");
		String deviceType	= request.getParameter("deviceType");
		String isProduction	= request.getParameter("isProduction");

		logger.debug("authKey : " + authKey);
		logger.debug("key : " + key);
		logger.debug("deviceType : " + deviceType);
		logger.debug("isProduction : " + isProduction);

		if( "true".equalsIgnoreCase(isProduction) ) {
			isProduction = "Y";
		} else {
			isProduction = "N";
		}
		if( "(null)".equals(deviceType) ) {
			deviceType = "";
		}

		if( StringUtils.isBlank(authKey) || StringUtils.isBlank(key) || StringUtils.isBlank(deviceType) || StringUtils.isBlank(isProduction) ) {
			ErrorObj errorObj = new ErrorObj();
			errorObj.setErrorCode("setPushNotiKeyApp");
			errorObj.setRequestInfo(HKBandUtil.requestInfo(request));
			errorObj.putCustomParam("authKey",		authKey);
			errorObj.putCustomParam("key",			key);
			errorObj.putCustomParam("deviceType",	deviceType);
			errorObj.putCustomParam("isProduction",	isProduction);
			asyncService.insertErrorLog(errorObj);
		}

		if( CommonConstant.DeviceType.android.equalsIgnoreCase(deviceType) ) {
			deviceType = CommonConstant.DeviceType.android;
		} else if( CommonConstant.DeviceType.ios.equalsIgnoreCase(deviceType) ) {
			deviceType = CommonConstant.DeviceType.ios;
		} else {
			sendFlag("invalidDeviceType", request, response);
			return ;
		}

		if( StringUtils.isBlank(key) ) {
			sendFlag("invalidDeviceKey", request, response);
			return ;
		}

		DataMap param = new DataMap();
		param.put("auth_key",		authKey);
		param.put("device_token",	key);
		param.put("device_type",	deviceType);
		param.put("is_production",	isProduction);

		int updateCnt = commonService.updateDevicePushKey(param);
		if( updateCnt != 1 ) {
			ErrorObj errorObj = new ErrorObj();
			errorObj.setErrorCode("setPushNotiKeyAppUpdateFail");
			errorObj.setRequestInfo(HKBandUtil.requestInfo(request));
			errorObj.putCustomParam("authKey",		authKey);
			errorObj.putCustomParam("key",			key);
			errorObj.putCustomParam("deviceType",	deviceType);
			errorObj.putCustomParam("isProduction",	isProduction);
			errorObj.putCustomParam("updateCnt",	String.valueOf(updateCnt));
			asyncService.insertErrorLog(errorObj);
		}

		sendFlag(CommonConstant.Flag.success, request, response);
	}
}