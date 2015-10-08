package hakwonband.test.controller;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.test.common.constant.HakwonConstant;
import hakwonband.test.service.ApiService;
import hakwonband.test.service.CommonService;
import hakwonband.util.CookieUtils;
import hakwonband.util.DataMap;
import hakwonband.util.SecuUtil;
import hakwonband.util.StringUtil;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.uadetector.UserAgentStringParser;
import net.sf.uadetector.service.UADetectorServiceFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * 공통 컨트롤러
 * @author bumworld
 *
 */
@Controller
public class CommonController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(CommonController.class);

	private static final UserAgentStringParser uaParser = UADetectorServiceFactory.getResourceModuleParser();

	@Resource(name = "messageSourceAccessor")
	protected MessageSourceAccessor messageSource;

	@Autowired
	private ApiService apiService;

	@Autowired
	private CommonService commonService;

	/**
	 * 로그인
	 * @return
	 */
	@RequestMapping("/login")
	public void login(HttpServletRequest request, HttpServletResponse response) {
		String user_id	= request.getParameter("user_id");
		String pass_wd	= request.getParameter("pass_wd");

		if( "tester".equals(user_id) && "xptmxj1".equals(pass_wd) ) {
			request.getSession().setAttribute(HakwonConstant.SessionKey.AUTH_USER_INFO, user_id);
			sendFlag(CommonConstant.Flag.success, request, response);
		} else {
			sendFlag(CommonConstant.Flag.fail, request, response);
		}
	}

	/**
	 * 사용자 로그인
	 * @return
	 */
	@RequestMapping("/userLogin")
	public void user_login(HttpServletRequest request, HttpServletResponse response) {
		String userId		= StringUtil.replaceNull(request.getParameter("userId"));
		String userPass		= StringUtil.replaceNull(request.getParameter("userPass"));

		String flag = CommonConstant.Flag.fail;
		if(StringUtil.isNotNull(userId) && StringUtil.isNotNull(userPass)) {
			String reqIpAddr = getClientIpAddress(request);
			DataMap param = new DataMap();
			param.put("userId",		userId);
			param.put("userPass",	SecuUtil.sha256(userPass));
			param.put("reqIpAddr",	reqIpAddr);
			param.put("userAgent",	uaParser.parse(request.getHeader("User-Agent")));
			param.put("sessionId",	request.getSession().getId());

			DataMap authUserInfo = commonService.executeLogin(param);
			/*	조회 성공	*/
			if(authUserInfo != null ) {
				logger.debug("auth user info : " + authUserInfo.toString());

				int cookieExpires = -1;
				CookieUtils cookieUtils = new CookieUtils(request, response, true);
				cookieUtils.setCookie(CommonConstant.Cookie.hkBandAuthKey, authUserInfo.getString("authKey"), cookieExpires);

				flag = CommonConstant.Flag.success;
			} else {
				flag = CommonConstant.Flag.notexist;
			}
		} else {
			flag = CommonConstant.Flag.param_error;
		}

		sendFlag(flag, request, response);
	}

	/**
	 * 로그 아웃
	 *
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/userLogout")
	public void userLogout(HttpServletRequest request, HttpServletResponse response) {

		CookieUtils cookieUtils = new CookieUtils(request, response, true);
		cookieUtils.delCookieAll();

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 사용자 정보 조회
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/getUserInfo")
	public void getUserInfo(HttpServletRequest request, HttpServletResponse response) {

		CookieUtils cookieUtils = new CookieUtils(request, response, true);
		String authKey = cookieUtils.getCookie(CommonConstant.Cookie.hkBandAuthKey);
		if( StringUtil.isBlank(authKey) ) {
			authKey = request.getHeader(CommonConstant.Cookie.hkBandAuthKey);
		}
		logger.debug("authKey : " + authKey);

		DataMap param = new DataMap();
		param.put("authKey",	authKey);
		DataMap userInfo = commonService.getUserInfo(param);

		sendColData(userInfo, request, response);
	}


	/**
	 * 인덱스 페이지
	 * @return
	 */
	@RequestMapping("/index")
	public ModelAndView index(HttpServletRequest request, HttpServletResponse response) {
		/**
		 * 로그인 시에는 main으로 이동
		 */
		String user_id = (String)request.getSession().getAttribute(HakwonConstant.SessionKey.AUTH_USER_INFO);
		if( user_id != null ) {
			return new ModelAndView("/index");
		} else {
			return new ModelAndView("/login");
		}
	}
}