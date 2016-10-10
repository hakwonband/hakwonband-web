package hakwonband.hakwon.common.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import hakwonband.common.constant.CommonConstant;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.service.CommonService;
import hakwonband.util.CookieUtils;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 인증 체크
 * @author bumworld
 *
 */
public class AuthCheckInterceptor extends HandlerInterceptorAdapter  {

	public static final Logger logger = LoggerFactory.getLogger(AuthCheckInterceptor.class);

	@Autowired
	public CommonService commonService;

	public AuthCheckInterceptor() {
	}

	@Override
	public boolean preHandle( HttpServletRequest request, HttpServletResponse response, Object controller) {

		logger.debug("Interceptor AuthCheckInterceptor call");

		CookieUtils cookieUtils = new CookieUtils(request, response, true);

		String authKey = request.getHeader(CommonConstant.Cookie.hkBandAuthKey);
		logger.debug("header authKey : " + authKey);
		if( StringUtil.isBlank(authKey) ) {
			authKey = cookieUtils.getCookie(CommonConstant.Cookie.hkBandAuthKey);
			logger.debug("cookie authKey : " + authKey);
		}
		logger.debug("authKey : " + authKey);

		if( StringUtil.isNotBlank(authKey) ) {
			/**
			 * 인증키로 인증 처리 하고
			 * 인증 정보 없으면 쿠키 삭제한다.
			 */
			DataMap param = new DataMap();
			param.put("authKey",	authKey);
			DataMap authUserInfo = commonService.authCheck(param);

			if( authUserInfo == null ) {
				commonService.executeLogout(param);
				cookieUtils.delCookieAll();
			} else {
				request.setAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO, authUserInfo);
				request.setAttribute(CommonConstant.Cookie.hkBandAuthKey, authKey);
			}
		}

		return true;
	}
}