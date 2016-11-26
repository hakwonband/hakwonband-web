package hakwonband.admin.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.service.NoticeService;
import hakwonband.common.BaseAction;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 관리자 문의 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/adminQuestion")
@Controller
public class AdminQuestionController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(AdminQuestionController.class);

	@Autowired
	private NoticeService noticeService;

	/**
	 * 관리자 문의하기 리스트
	 * @url /adminQuestion/list.do
	 * @return
	 */
	@RequestMapping("/list")
	public void list(HttpServletRequest request, HttpServletResponse response) {

		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		int pageNo			= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale		= HakwonConstant.PageScale.NOTICE_REQ;


		DataMap param = new DataMap();
		param.put("user_no",			authUserInfo.getString("user_no"));
		param.put("notice_type",		"004");
		param.put("start_no",			(pageNo-1)*pageScale);
		param.put("page_scale",			pageScale);

		/**
		 * 문의 메일 조회
		 */
		DataMap noticeMap = noticeService.noticeList(param);

		sendColData(noticeMap, request, response);
	}

	/**
	 * 관리자 문의하기 리스트
	 * @url /adminQuestion/view.do
	 * @return
	 */
	@RequestMapping("/view")
	public void view(HttpServletRequest request, HttpServletResponse response) {

		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String notice_no	= request.getParameter("notice_no");


		DataMap param = new DataMap();
		param.put("user_no",			authUserInfo.getString("user_no"));
		param.put("notice_type",		"004");
		param.put("content_type",		"001");//공지는 001이다.
		param.put("content_parent_no",	notice_no);
		param.put("notice_no",			notice_no);

		/**
		 * 문의 메일 조회
		 */
		DataMap noticeMap = noticeService.noticeDetail(param);

		sendColData(noticeMap, request, response);
	}
}