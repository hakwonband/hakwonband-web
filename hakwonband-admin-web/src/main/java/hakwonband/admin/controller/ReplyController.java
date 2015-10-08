package hakwonband.admin.controller;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.model.DevicePushData;
import hakwonband.admin.service.AsyncService;
import hakwonband.admin.service.ReplyService;
import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.util.DataMap;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 댓글 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/admin/reply")
@Controller
public class ReplyController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(ReplyController.class);

	@Autowired
	private ReplyService replyService;

	@Autowired
	private AsyncService asyncService;

	/**
	 * 테스트용 댓글 리스트 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/replyList")
	public void replyList(HttpServletRequest request, HttpServletResponse response) {

		String content_type			= request.getParameter("content_type");
		String content_parent_no	= request.getParameter("content_parent_no");

		DataMap param = new DataMap();
		param.put("content_type",		content_type);
		param.put("content_parent_no",	content_parent_no);

		/* 댓글 리스트 */
		List<DataMap> replyList = replyService.replyList(param);

		DataMap colData = new DataMap();
		colData.put("replyList", 			replyList);

		sendColData(colData, request, response);
	}

	/**
	 * 신규 댓글 리스트 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/newReplyList")
	public void newReplyList(HttpServletRequest request, HttpServletResponse response) {

		String content_type			= request.getParameter("content_type");
		String content_parent_no	= request.getParameter("content_parent_no");
		String reply_no				= request.getParameter("reply_no");

		DataMap param = new DataMap();
		param.put("content_type",		content_type);
		param.put("content_parent_no",	content_parent_no);
		param.put("reply_no",			reply_no);

		sendColData(replyService.newReplyList(param), request, response);
	}

	/**
	 * 댓글 등록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/registReply")
	public void registReply(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String title					= request.getParameter("title");
		String reply_content			= request.getParameter("reply_content");
		String content_type				= request.getParameter("content_type");
		String content_parent_no		= request.getParameter("content_parent_no");

		if( StringUtils.isBlank(title) ) {
			if( reply_content.length() > 20 ) {
				title = reply_content.substring(0, 20);
			} else {
				title = reply_content;
			}
		}

		DataMap param = new DataMap();
		param.put("title", title);
		param.put("reply_content",		reply_content.replaceAll(CommonConstant.LINE_SEPARATOR, "<br/>"));
		param.put("content_type",		content_type);
		param.put("reg_user_no",		authUserInfo.get("user_no"));
		param.put("content_parent_no",	content_parent_no);

		/* 댓글 등록 */
		DataMap colData = replyService.registReply(param);
		DevicePushData devicePushData = (DevicePushData)colData.get("devicePushData");
		asyncService.pushMobileDevice(devicePushData);
		colData.remove("devicePushData");

		sendColData(colData, request, response);
	}


	/**
	 * 댓글 삭제
	 * @param request
	 * @param response
	 */
	@RequestMapping("/removeReply")
	public void removeReply(HttpServletRequest request, HttpServletResponse response) {

		String reply_no	= request.getParameter("reply_no");

		DataMap param = new DataMap();
		param.put("reply_no", reply_no);

		/* 댓글 삭제 */
		DataMap colData = replyService.deleteReply(param);

		sendColData(colData, request, response);
	}

}