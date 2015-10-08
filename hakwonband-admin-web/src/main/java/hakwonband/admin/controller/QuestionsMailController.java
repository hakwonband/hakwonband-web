package hakwonband.admin.controller;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.service.QuestionsMailService;
import hakwonband.common.BaseAction;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 문의 메일 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/admin/questionsMail")
@Controller
public class QuestionsMailController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(QuestionsMailController.class);

	@Autowired
	private QuestionsMailService questionsMailService;


	/**
	 * 문의 메일 리스트
	 * @return
	 * @url /admin/questionsMail/list.do
	 */
	@RequestMapping("/list")
	public void questionsMailList(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		int pageNo		= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale	= HakwonConstant.PageScale.NOTICE_REQ;

		String searchText	=	request.getParameter("searchText");

		DataMap param = new DataMap();
		param.put("userNo",		authUserInfo.getString("user_no"));
		param.put("startNo",	(pageNo-1)*pageScale);
		param.put("pageScale",	pageScale);

		param.put("searchText",	searchText);

		logger.debug("param["+param+"]");

		/*	문의 메일 리스트	*/
		DataMap colData = questionsMailService.questionsMailList(param);
		colData.put("pageScale",		pageScale);

		sendColData(colData, request, response);
	}

	/**
	 * 문의 메일 정보
	 * @return
	 * @url /admin/questionsMail/view.do
	 */
	@RequestMapping("/view")
	public void questionsMailDetail(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("userNo",			authUserInfo.getString("user_no"));
		param.put("questionsNo",	request.getParameter("questionsNo"));

		logger.debug("param["+param+"]");

		/*	문의 메일	*/
		DataMap questionsMailInfo = questionsMailService.questionsMailDetail(param);

		DataMap colData = new DataMap();
		colData.put("questionsMailInfo",	questionsMailInfo);

		sendColData(colData, request, response);
	}
}