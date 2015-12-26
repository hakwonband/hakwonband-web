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
import hakwonband.common.exception.HKBandException;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.service.NoticeShareService;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 공지 공유 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/hakwon/noticeShare")
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

		DataMap param = new DataMap();
		param.put("user_no", 			authUserInfo.get("user_no"));	// 현재 사용자의 공지사항 읽은상태 체크용
		param.put("start_no",			(page_no-1)*page_scale);
		param.put("page_scale",			page_scale);
		param.put("hakwon_no",			hakwon_no);

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

		String hakwon_no		= request.getParameter("hakwon_no");
		String start_date		= request.getParameter("start_date");
		String end_date			= request.getParameter("end_date");
		String share_class		= request.getParameter("share_class");
		String share_hakwon		= request.getParameter("share_hakwon");
		String [] target_hakwon	= request.getParameterValues("target_hakwon");

		int startDate = Integer.parseInt(start_date.replaceAll("-", ""));
		int endDate = Integer.parseInt(end_date.replaceAll("-", ""));

		if( startDate > endDate ) {
			throw new HKBandException();
		}

		DataMap param = new DataMap();
		param.put("user_no",		authUserInfo.getString("user_no"));
		param.put("start_date",		start_date);
		param.put("end_date",		end_date);
		param.put("hakwon_no",		hakwon_no);
		param.put("share_class",	share_class);
		param.put("share_hakwon",	share_hakwon);
		param.put("target_hakwon",	target_hakwon);

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

		int startDate = Integer.parseInt(start_date.replaceAll("-", ""));
		int endDate = Integer.parseInt(end_date.replaceAll("-", ""));

		if( startDate > endDate ) {
			throw new HKBandException();
		}

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


		String del_type = request.getParameter("del_type");

		String receive_hakwon_no = request.getParameter("receive_hakwon_no");

		DataMap param = new DataMap();
		param.put("share_no",			share_no);
		param.put("receive_hakwon_no",	receive_hakwon_no);
		param.put("user_no",			authUserInfo.getString("user_no"));

		if( "receive".equals(del_type) ) {
			noticeShareService.deleteReceiveShare(param);
		} else if( "send".equals(del_type) ) {
			noticeShareService.deleteSendShare(param);
		}

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 공유받은 공지 적용
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/apply", method = RequestMethod.POST)
	public void noticeApply(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		/*	공유 번호	*/
		String share_no = request.getParameter("share_no");

		/*	학원 번호	*/
		String hakwon_no = request.getParameter("hakwon_no");

		/*	적용할 반 번호	*/
		String target_class = request.getParameter("target_class");

		DataMap param = new DataMap();
		param.put("share_no",		share_no);
		param.put("hakwon_no",		hakwon_no);
		param.put("target_class",	target_class);
		param.put("user_no",		authUserInfo.getString("user_no"));

		noticeShareService.executeNoticeApply(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}
}