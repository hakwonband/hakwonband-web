
package hakwonband.hakwon.common.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import hakwonband.common.exception.RoleFailException;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.util.DataMap;

/**
 * 원장 체크 인터셉터
 * @author bumworld.kim
 *
 */
public class WonjangCheckInterceptor extends HandlerInterceptorAdapter  {

	public static final Logger logger = LoggerFactory.getLogger(WonjangCheckInterceptor.class);

	@Override
	public boolean preHandle( HttpServletRequest request, HttpServletResponse response, Object controller) {

		logger.debug("Interceptor MasterCheckInterceptor call");

		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		if( authUserInfo != null && authUserInfo.equals("user_type", "003") ) {
			return true;
		} else {
			throw new RoleFailException("RoleFail");
		}
	}
}