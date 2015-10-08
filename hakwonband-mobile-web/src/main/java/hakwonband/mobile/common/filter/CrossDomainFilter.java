package hakwonband.mobile.common.filter;

import java.io.IOException;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import hakwonband.common.constant.CommonConstant;
import hakwonband.util.CommonConfig;

public class CrossDomainFilter implements Filter {

	/**
	 * 크로스 도메인 리스트
	 */
	private static final List<String> crossDomainList = CommonConfig.getList("crossDomain/host");

	@Override
	public void destroy() {
	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain) throws IOException, ServletException {
		if( !(servletRequest instanceof HttpServletRequest) ) {
			throw new ServletException("This filter can only process HttpServletRequest requests");
		}

		HttpServletRequest request = (HttpServletRequest) servletRequest;
		HttpServletResponse response = (HttpServletResponse) servletResponse;

		String responseHost = request.getHeader("Origin");
		if( responseHost == null ) {
			responseHost = "";
		}

		boolean isAllowDomain = false;
		for(String str: crossDomainList){
			if(responseHost.contains(str)) {
				isAllowDomain = true;
				break;
			}
		}
		if( isAllowDomain ) {
			response.addHeader("Access-Control-Allow-Origin", responseHost);
		}

		response.addHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, HEAD");
		response.addHeader("Access-Control-Allow-Headers", "Access-Control-Request-Method, Access-Control-Request-Headers, X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept, "+CommonConstant.Cookie.hkBandAuthKey);

		chain.doFilter(request, response);
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
	}
}