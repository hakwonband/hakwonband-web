package hakwonband.hakwon.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.service.CommonService;
import hakwonband.util.CookieUtils;
import hakwonband.util.DataMap;
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

	private static final UserAgentStringParser uaParser = UADetectorServiceFactory.getResourceModuleParser();

	/*	쿠키 저장 시간	*/
	private static final int cookieSaveTime = 1 * 90 * 24 * 60 * 60;

	/**
	 * index
	 *
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/index")
	public ModelAndView index(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		if( authUserInfo != null ) {
			if( authUserInfo.equals("user_type", HakwonConstant.UserType.PARENT) || authUserInfo.equals("user_type", HakwonConstant.UserType.STUDENT) ) {
				return new ModelAndView("redirect:https://m.hakwonband.com");
			}
		}

		return new ModelAndView("/index");
	}

	/**
	 * main
	 *
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/main")
	public ModelAndView main(HttpServletRequest request, HttpServletResponse response) {

		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		if( authUserInfo == null ) {
			return new ModelAndView("redirect:/index.do");
		} else {
			if( authUserInfo.equals("user_type", HakwonConstant.UserType.PARENT) || authUserInfo.equals("user_type", HakwonConstant.UserType.STUDENT) ) {
				return new ModelAndView("redirect:https://m.hakwonband.com");
			}
		}

		return new ModelAndView("/main");
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
		String loginSave	= StringUtil.replaceNull(request.getParameter("loginSave"));
		String idSave		= StringUtil.replaceNull(request.getParameter("idSave"));
		String deviceToken	= StringUtil.replaceNull(request.getParameter("deviceToken"));
		String deviceType	= StringUtil.replaceNull(request.getParameter("deviceType"));
		String isProduction	= StringUtil.replaceNull(request.getParameter("isProduction"));
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

		DataMap colData = new DataMap();
		/*	필수 파라미터 체크	*/
		if(StringUtil.isNotNull(userId) && StringUtil.isNotNull(userPass)) {

			String reqIpAddr = getClientIpAddress(request);
			DataMap param = new DataMap();
			param.put("userId",		userId);
			param.put("userPass",	SecuUtil.sha256(userPass));
			param.put("reqIpAddr",	reqIpAddr);
			param.put("userAgent",	uaParser.parse(request.getHeader("User-Agent")));
			param.put("sessionId",	request.getSession().getId());
			param.put("deviceToken",deviceToken);
			param.put("deviceType",	deviceType);
			param.put("isProduction",	isProduction);

			DataMap authUserInfo = commonService.executeLogin(param);
			/*	조회 성공	*/
			if(authUserInfo != null ) {
				logger.debug("auth user info : " + authUserInfo.toString());

				if( authUserInfo.equals("use_yn", "S") ) {
					/*	일시 정지	*/
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

		return new ModelAndView("redirect:/index.do");
	}

	/**
	 * 앱 삭제
	 *
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/appDelete")
	public void appDelete(HttpServletRequest request, HttpServletResponse response) {

		String authKey		= StringUtil.replaceNull(request.getParameter("authKey"));
		String deviceToken	= StringUtil.replaceNull(request.getParameter("deviceToken"));

		DataMap param = new DataMap();
		param.put("authKey",		authKey);
		param.put("deviceToken",	deviceToken);

		commonService.deleteApp(param);

		CookieUtils cookieUtils = new CookieUtils(request, response, true);
		cookieUtils.delCookie(CommonConstant.Cookie.hkBandAuthKey);

		sendFlag(CommonConstant.Flag.success, request, response);
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

		DataMap colData = new DataMap();
		colData.put("authUserInfo", authUserInfo);

		/*	app 버전 조회	*/
		List<DataMap> appVersionList = commonService.getAppVersion();
		colData.put("appVersionList", appVersionList);

		sendColData(colData, request, response);
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

		DataMap param = new DataMap();
		param.put("auth_key",		authKey);
		param.put("device_token",	key);
		param.put("device_type",	deviceType);
		param.put("is_production",	isProduction);

		commonService.updateDevicePushKey(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}
}