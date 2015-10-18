package hakwonband.down.common.interceptor;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.LoginFailException;
import hakwonband.down.common.constant.HakwonConstant;
import hakwonband.down.service.CommonService;
import hakwonband.util.CookieUtils;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

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
		String authKey = cookieUtils.getCookie(CommonConstant.Cookie.hkBandAuthKey);
		if( StringUtil.isBlank(authKey) ) {
			authKey = request.getHeader(CommonConstant.Cookie.hkBandAuthKey);
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
				throw new LoginFailException("AuthFail");
			} else {
				request.setAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO, authUserInfo);
			}
		} else {
			logger.debug("authKey Fail");
			//throw new LoginFailException("AuthFail");
		}

		return true;
	}
}