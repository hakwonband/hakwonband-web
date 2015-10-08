package hakwonband.admin.common.interceptor;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.common.exception.NoLoginFailException;
import hakwonband.util.DataMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

/**
 * 로그인 안되 있어야지 사용할 수 있는 url 체크
 * 회원 가입 등...
 * @author bumworld
 *
 */
public class NoLoginCheckInterceptor extends HandlerInterceptorAdapter  {

	public static final Logger logger = LoggerFactory.getLogger(NoLoginCheckInterceptor.class);

	public NoLoginCheckInterceptor() {
	}

	@Override
	public boolean preHandle( HttpServletRequest request, HttpServletResponse response, Object controller) {

		logger.debug("Interceptor NoLoginCheckInterceptor call");

		DataMap adminInfoModel = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		if( adminInfoModel != null ) {
			throw new NoLoginFailException("회원은 사용할 수 없는 메뉴 입니다.");
		}

		return true;
	}
}