package hakwonband.down.common.exception;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.common.exception.LoginFailException;
import hakwonband.common.exception.NoLoginFailException;
import hakwonband.down.service.CommonService;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

import java.io.FileNotFoundException;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;


/**
 * 공통 에러 처리
 * @author bumworld
 *
 */
public class GeneralExceptionResolver extends SimpleMappingExceptionResolver {

	public static final Logger logger = LoggerFactory.getLogger(GeneralExceptionResolver.class);

	public static final Logger waringLogger = LoggerFactory.getLogger("waring");

	@Resource(name="messageSourceAccessor")
	private MessageSourceAccessor message;

	@Autowired
	private CommonService commonService;

	@Override
	public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {

		ModelAndView modelAndView = null;
		String flag			= CommonConstant.Flag.error;
		String errorReqType	= "";	//	요청 타입
		String errorMessage	= "";	//	에러 메시지
		boolean logging		= true;	//	로깅 여부

		boolean isAjaxRequest = isAjaxRequest(request);

		Throwable[] throwArray = ex.getSuppressed();
		if( throwArray != null && throwArray.length > 0 ) {
			Throwable throwException = throwArray[0];
			if( throwException.getClass() == HKBandException.class ) {
				ex = (Exception) throwException;
			}
		}

		if( ex instanceof LoginFailException ) {
			flag = CommonConstant.Flag.login;
			errorReqType = LoginFailException.class.getName();
			errorMessage = ex.getMessage();

		} else if( ex instanceof NoLoginFailException ) {
			flag = CommonConstant.Flag.logout;
			errorReqType = NoLoginFailException.class.getName();
			errorMessage = ex.getMessage();

		} else if( ex instanceof HttpRequestMethodNotSupportedException ) {
			/**
			 * POST로만 접근 가능한 url에 대해서 get 방식으로 접근 했을시 발생
			 */
			errorReqType = "HttpRequestMethodNotSupportedException";
			errorMessage = ex.getMessage();
			logging = false;
		} else if( ex instanceof FileNotFoundException ) {
			errorReqType	= "FileNotFoundException";
			errorMessage	= "파일을 찾을 수 없습니다.";
		} else {
			errorReqType	= "Exception";
			errorMessage	= ex.getMessage();
		}

		String requestContent = StringUtil.requestAllParam(request);
		/*	로그인/비로그인 실패시는 에러로그 안남긴다.	*/
		if( ex instanceof LoginFailException || ex instanceof NoLoginFailException || logging == false ) {
		} else {
			logger.error(requestContent, ex);
		}

		if( isAjaxRequest ) {

			DataMap jsonMap = new DataMap();
			jsonMap.put("flag",			flag);
			jsonMap.put("errorReqType",	errorReqType);
			jsonMap.put("errorMessage",	errorMessage);

			DataMap colData = new DataMap();
			colData.put("error",	jsonMap);

			response.setStatus(HttpServletResponse.SC_OK);
			modelAndView = new ModelAndView("jsonView", colData);

		} else {
			modelAndView = super.resolveException(request, response, handler, ex);
			modelAndView.addObject(CommonConstant.AlertMessage.errorReqType, errorReqType);
			modelAndView.addObject(CommonConstant.AlertMessage.errorMessage, errorMessage);
		}
		return modelAndView;
	}

	/**
	 * ajax 처리 인지 체크
	 * @param request
	 * @return
	 */
	private boolean isAjaxRequest(HttpServletRequest request) {
		if("XMLHttpRequest".equalsIgnoreCase(request.getHeader("x-requested-with")) || "Ajax".equalsIgnoreCase(request.getHeader("x-requested-with"))) {
			return true;
		} else {
			return false;
		}
	}
}