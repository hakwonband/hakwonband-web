package hakwonband.mobile.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.common.BaseAction;
import hakwonband.mobile.common.constant.HakwonConstant;
import hakwonband.mobile.service.NoticeService;
import hakwonband.util.DataMap;

/**
 * 공지 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/notice")
@Controller
public class NoticeController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(NoticeController.class);

	@Autowired
	private NoticeService noticeService;

	/**
	 * 공지 번호로 찾기
	 * @param request
	 * @param response
	 */
	@RequestMapping("/find")
	public void find(HttpServletRequest request, HttpServletResponse response) {

		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String notice_no = request.getParameter("notice_no");

		DataMap param = new DataMap();
		param.put("notice_no",	notice_no);
		param.put("user_no",	authUserInfo.getString("user_no"));


		/*	공지 조회	*/
		DataMap noticeDetail = noticeService.findNoticeDetail(param);

//		sendColData(colData, request, response);
	}


}