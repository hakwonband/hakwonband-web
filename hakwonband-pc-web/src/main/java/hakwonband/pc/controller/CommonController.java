package hakwonband.pc.controller;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.pc.service.CommonService;
import hakwonband.util.DataMap;

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
	 * 문의 메일
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping("/questionsMail")
	public void questionsMail(HttpServletRequest request, HttpServletResponse response) {

		String title	= request.getParameter("title");
		String phone	= request.getParameter("phone");
		String email	= request.getParameter("email");
		String content	= request.getParameter("content");

		DataMap param = new DataMap();
		param.put("title",		title);
		param.put("phone",		phone);
		param.put("email",		email);
		param.put("content",	content.replaceAll(CommonConstant.LINE_SEPARATOR, "<br/>"));

		commonService.executeQuestionsMail(param);

		DataMap colData = new DataMap();
		colData.put("flag", CommonConstant.Flag.success);

		sendColData(colData, request, response);
	}
}