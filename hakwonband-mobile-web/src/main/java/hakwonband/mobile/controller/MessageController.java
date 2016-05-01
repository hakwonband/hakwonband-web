package hakwonband.mobile.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.mobile.common.constant.HakwonConstant;
import hakwonband.mobile.model.DevicePushData;
import hakwonband.mobile.service.AsyncService;
import hakwonband.mobile.service.MessageService;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 메세지 컨트롤러
 * @author jrlim
 *
 */
@RequestMapping("/mobile/message")
@Controller
public class MessageController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(MessageController.class);

	@Resource(name = "messageSourceAccessor")
	protected MessageSourceAccessor messageSource;

	@Autowired
	private MessageService messageService;

	@Autowired
	private AsyncService asyncService;

	/**
	 * 사용자의 보낸 메세지 리스트 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/sendMessageList")
	public void sendMessageList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no	= request.getParameter("hakwon_no");
		int page_no			= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale		= HakwonConstant.PageScale.MESSAGE_REQ;

		DataMap param = new DataMap();
		param.put("hakwon_no",		hakwon_no);
		param.put("write_user_no",	authUserInfo.get("user_no"));
		param.put("start_no",		(page_no-1)*page_scale);
		param.put("page_scale",		page_scale);

		/* 보낸 메세지 리스트 */
		List<DataMap> sendMessageList = messageService.sendMessageList(param);

		/* 보낸 메세지 리스트 카운트 */
		int sendMessageListTotCount = messageService.sendMessageListTotCount(param);

		DataMap colData = new DataMap();
		colData.put("pageScale", 				page_scale);
		colData.put("sendMessageList", 			sendMessageList);
		colData.put("sendMessageListTotCount",	sendMessageListTotCount);

		sendColData(colData, request, response);
	}

	/**
	 * 받은 메세지 리스트 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/receiveMessageList")
	public void receiveMessageList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no	= request.getParameter("hakwon_no");
		int page_no			= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale		= HakwonConstant.PageScale.MESSAGE_REQ;

		DataMap param = new DataMap();
		param.put("hakwon_no",			hakwon_no);
		param.put("receive_user_no",	authUserInfo.get("user_no"));
		param.put("start_no",			(page_no-1)*page_scale);
		param.put("page_scale",			page_scale);

		/* 전체 받은 메세지 리스트 조회 */
		DataMap colData = messageService.receiveMessageList(param);
		colData.put("pageScale", page_scale);
		sendColData(colData, request, response);
	}

	/**
	 * 보낸 메세지 상세 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/sendMessageDetail")
	public void sendMessageDetail(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String receive_no = request.getParameter("receive_no");

		DataMap param = new DataMap();
		param.put("receive_no",			receive_no);
		param.put("content_type", 		"002");							// 댓글타입 002 메세지
		param.put("content_parent_no",	receive_no);
		param.put("file_parent_type",	"002");							// 파일타입 002 메세지
		param.put("user_no", 			authUserInfo.get("user_no"));	// 읽은상태 등록시 사용

		/* 보낸 메세지 내용 상세조회, 보낸 메세지 댓글조회, 보낸 메세지 파일 조회 */
		DataMap colData = messageService.sendMessageDetail(param);

		sendColData(colData, request, response);
	}

	/**
	 * 받은 메세지 상세조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/receiveMessageDetail")
	public void receiveMessageDetail(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String receive_no	= request.getParameter("receive_no");
		String message_no	= request.getParameter("message_no");

		DataMap param = new DataMap();
		param.put("receive_no",			receive_no);
		param.put("message_no",			message_no);
		param.put("content_type", 		"002");							// 댓글타입 002 메세지
		param.put("content_parent_no",	receive_no);
		param.put("file_parent_type",	"002");							// 파일타입 002 메세지
		param.put("user_no", 			authUserInfo.get("user_no"));	// 읽은상태 등록시 사용

		/* 받은 메세지 내용 상세조회, 받은 메세지 댓글조회, 받은 메세지 파일 조회, 읽은상태 등록 */
		DataMap colData = messageService.executeReceiveMessageDetail(param);

		sendColData(colData, request, response);
	}

	/**
	 * 다중 메세지 보내기 (단건 가능)
	 * @param request
	 * @param response
	 */
	@RequestMapping("/registMultiMessage")
	public void registMultiMessage(HttpServletRequest request, HttpServletResponse response) {

		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no		= request.getParameter("hakwon_no");
		String title			= request.getParameter("title");
		String preview_content	= request.getParameter("preview_content");
		String content			= request.getParameter("content");
		String user_no_list		= request.getParameter("user_no_list");		// 메세지 수신자 리스트
		String file_no_list		= request.getParameter("file_no_list");		// 파일정보 업데이트 리스트

		DataMap param = new DataMap();
		param.put("hakwon_no",			hakwon_no);
		param.put("title",				title);
		param.put("preview_content", 	preview_content);
		param.put("content",			content.replaceAll(CommonConstant.LINE_SEPARATOR, "<br/>"));
		param.put("write_user_no",		authUserInfo.get("user_no"));
		param.put("send_user_no",		authUserInfo.get("user_no"));
		param.put("user_no_list",		user_no_list);
		param.put("file_no_list",		file_no_list);						// 파일 정보들
		param.put("reg_user_no",		authUserInfo.get("user_no"));		// 파일 등록자

		param.put("send_user_name",		authUserInfo.get("user_name"));		// 사용자 이름

		/**
		 * TODO 추후 멀티 메세지 가능하면 상태에따라 처리
		 */
		param.put("group_yn",			"N");						// 그룹 메세지 여부

		/* 다건 메세지 전송 */
		DataMap colData = messageService.registMultiMessage(param);
		DevicePushData devicePushData = (DevicePushData)colData.get("devicePushData");
		asyncService.pushMobileDevice(devicePushData);

		sendColData(colData, request, response);
	}
}