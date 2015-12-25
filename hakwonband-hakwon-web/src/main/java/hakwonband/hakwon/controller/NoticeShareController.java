package hakwonband.hakwon.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.service.NoticeShareService;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

@RequestMapping("/hakwon/noticeShare")

/**
 * 공지 공유 컨트롤러
 * @author bumworld
 *
 */
@Controller
public class NoticeShareController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(NoticeShareController.class);

	@Autowired
	private NoticeShareService noticeShareService;

	/**
	 * 공유 리스트
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/sendList", method = RequestMethod.POST)
	public void sendList(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		int page_no			= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale		= HakwonConstant.PageScale.SHARE_LIST;
		String hakwon_no	= request.getParameter("hakwon_no");
		String start_date	= request.getParameter("start_date");
		String end_date		= request.getParameter("end_date");

		DataMap param = new DataMap();
		param.put("user_no", 			authUserInfo.get("user_no"));	// 현재 사용자의 공지사항 읽은상태 체크용
		param.put("start_no",			(page_no-1)*page_scale);
		param.put("page_scale",			page_scale);
		param.put("hakwon_no",			hakwon_no);
		param.put("start_date",			start_date);
		param.put("end_date",			end_date);


		DataMap colData = noticeShareService.sendList(param);
		colData.put("page_scale",	page_scale);

		sendColData(colData, request, response);
	}

	/**
	 * 공유 받은 리스트
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/receiveList", method = RequestMethod.POST)
	public void receiveList(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		int page_no			= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale		= HakwonConstant.PageScale.SHARE_LIST;
		String hakwon_no	= request.getParameter("hakwon_no");
		String start_date	= request.getParameter("start_date");
		String end_date		= request.getParameter("end_date");

		DataMap param = new DataMap();
		param.put("user_no", 			authUserInfo.get("user_no"));	// 현재 사용자의 공지사항 읽은상태 체크용
		param.put("start_no",			(page_no-1)*page_scale);
		param.put("page_scale",			page_scale);
		param.put("hakwon_no",			hakwon_no);
		param.put("start_date",			start_date);
		param.put("end_date",			end_date);


		DataMap colData = noticeShareService.receiveList(param);
		colData.put("page_scale",	page_scale);

		sendColData(colData, request, response);
	}

	/**
	 * 공유 하기 리스트
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/send", method = RequestMethod.POST)
	public void send(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no	= request.getParameter("hakwon_no");
		String start_date	= request.getParameter("start_date");
		String end_date		= request.getParameter("end_date");

		DataMap param = new DataMap();
		param.put("user_no",	authUserInfo.getString("user_no"));
		param.put("start_date",	start_date);
		param.put("end_date",	end_date);
		param.put("hakwon_no",	hakwon_no);

		/**
		 * 공유 등록
		 */
		noticeShareService.insertShare(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 공유 수정
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public void update(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String share_no		= request.getParameter("share_no");
		String start_date	= request.getParameter("start_date");
		String end_date		= request.getParameter("end_date");

		DataMap param = new DataMap();
		param.put("share_no",	share_no);
		param.put("user_no",	authUserInfo.getString("user_no"));
		param.put("start_date",	start_date);
		param.put("end_date",	end_date);

		noticeShareService.updateShare(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 공유 취소
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public void delete(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String share_no = request.getParameter("share_no");

		DataMap param = new DataMap();
		param.put("share_no",	share_no);
		param.put("user_no",	authUserInfo.getString("user_no"));

		noticeShareService.deleteShare(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}
}