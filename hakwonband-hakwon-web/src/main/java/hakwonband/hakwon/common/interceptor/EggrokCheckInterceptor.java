package hakwonband.hakwon.common.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import hakwonband.common.exception.LoginFailException;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.util.DataMap;

/**
 * 로그인 체크 인터셉터
 * @author bumworld.kim
 *
 */
public class EggrokCheckInterceptor extends HandlerInterceptorAdapter  {

	public static final Logger logger = LoggerFactory.getLogger(EggrokCheckInterceptor.class);

	@Override
	public boolean preHandle( HttpServletRequest request, HttpServletResponse response, Object controller) {

		logger.debug("Interceptor LoginCheckInterceptor call");

		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		if( authUserInfo == null || !"eggrok".equals(authUserInfo.getString("user_id"))) {
			throw new LoginFailException("AuthFail");
		}

		return true;
	}
}