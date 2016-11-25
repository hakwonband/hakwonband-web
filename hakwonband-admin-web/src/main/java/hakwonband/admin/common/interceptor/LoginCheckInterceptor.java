package hakwonband.admin.common.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.common.exception.LoginFailException;
import hakwonband.util.CookieUtils;
import hakwonband.util.DataMap;

/**
 * 로그인 체크 인터셉터
 * @author bumworld.kim
 *
 */
public class LoginCheckInterceptor extends HandlerInterceptorAdapter  {

	public static final Logger logger = LoggerFactory.getLogger(LoginCheckInterceptor.class);

	@Override
	public boolean preHandle( HttpServletRequest request, HttpServletResponse response, Object controller) {

		logger.debug("Interceptor LoginCheckInterceptor call");

		DataMap authAdminInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		if( authAdminInfo == null ) {

			CookieUtils cookieUtils = new CookieUtils(request, response, true);
			cookieUtils.delCookieAll();

			throw new LoginFailException("AuthFail");
		}

		return true;
	}
}