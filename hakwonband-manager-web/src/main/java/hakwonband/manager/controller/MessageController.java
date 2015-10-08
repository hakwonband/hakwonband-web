package hakwonband.manager.controller;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.manager.common.constant.HakwonConstant;
import hakwonband.manager.model.DevicePushData;
import hakwonband.manager.service.AsyncService;
import hakwonband.manager.service.MessageSendService;
import hakwonband.manager.service.MessageService;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

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

/**
 * 메세지 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/manager/message")
@Controller
public class MessageController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(MessageController.class);

	@Resource(name = "messageSourceAccessor")
	protected MessageSourceAccessor messageSource;

	@Autowired
	private MessageService messageService;

	@Autowired
	private MessageSendService messageSendService;

	@Autowired
	private AsyncService asyncService;

	/**
	 * 메세지 보내기 검색(원장님만 검색된다.)
	 * @param request
	 * @param response
	 * @url /manager/message/targetSearch.do
	 */
	@RequestMapping("/targetSearch")
	public void masterSearch(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String searchText = request.getParameter("searchText");

		DataMap param = new DataMap();
		param.put("searchText", searchText);
		param.put("user_no", authUserInfo.getString("user_no"));
		param.put("manager_no", authUserInfo.getString("manager_no"));

		/**
		 * 대상 검색
		 */
		List<DataMap> searchList = messageSendService.targetSearch(param);

		sendList(searchList, request, response);
	}

	/**
	 * 메세지 보내기
	 * @param request
	 * @param response
	 * @url /manager/message/send.do
	 */
	@RequestMapping("/send")
	public void send(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		/**
		 * 학원 전체/검색
		 */
		String targetType	= request.getParameter("targetType");

		/*	선택 학원	*/
		String [] targetHakwonList= request.getParameterValues("targetHakwonList");

		/*	메세지 및 첨부 파일	*/
		String messageContent	= request.getParameter("messageContent");
		String fileListStr		= request.getParameter("fileListStr");


		if( StringUtil.isBlank(messageContent) ) {
			throw new HKBandException();
		}

		DataMap param = new DataMap();
		param.put("user_no", authUserInfo.getString("user_no"));
		param.put("manager_no", authUserInfo.getString("manager_no"));
		param.put("user_name", authUserInfo.getString("user_name"));


		param.put("targetType",		targetType);
		param.put("targetHakwonList",	targetHakwonList);

		/*	메세지 대상	*/
		if( "search".equals(targetType) ) {
			DataMap messageTargetMap = new DataMap();
			messageTargetMap.put("targetHakwonList", targetHakwonList);
			param.put("messageTarget",	messageTargetMap.toString());
		}

		param.put("messageContent",	messageContent);
		param.put("fileListStr",	fileListStr);

		DevicePushData devicePushData = messageSendService.executeMessageSend(param);
		asyncService.pushMobileDevice(devicePushData);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * 보낸 메세지 리스트
	 * @param request
	 * @param response
	 * @url /manager/message/sendList.do
	 */
	@RequestMapping("/sendList")
	public void sendMessageList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		int pageNo		= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale	= HakwonConstant.PageScale.PARENT_LIST;

		String searchText	= request.getParameter("searchText");
		String groupYn		= request.getParameter("groupYn");

		DataMap param = new DataMap();
		param.put("startNo",	(pageNo-1)*pageScale);
		param.put("pageScale",	pageScale);
		param.put("searchText",	searchText);
		param.put("user_no",	authUserInfo.getString("user_no"));

		/*	보낸 메세지 리스트	*/
		DataMap sendMessage = null;
		if( "Y".equals(groupYn) ) {
			sendMessage = messageService.sendGroupMessageList(param);
		} else if( "N".equals(groupYn) ) {
			sendMessage = messageService.sendSingleMessageList(param);
		}
		sendMessage.put("pageScale",	pageScale);

		sendColData(sendMessage, request, response);
	}

	/**
	 * 보낸 그룹 메세지 상세
	 * @param request
	 * @param response
	 * @url /manager/message/groupMessageDetail.do
	 */
	@RequestMapping("/groupMessageDetail")
	public void groupMessageDetail(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String messageNo = request.getParameter("messageNo");

		DataMap param = new DataMap();
		param.put("messageNo",	messageNo);
		param.put("user_no",	authUserInfo.getString("user_no"));

		/*	보낸 메세지 상세	*/
		DataMap sendMessageDetail = messageService.sendGroupMessageDetail(param);

		sendColData(sendMessageDetail, request, response);
	}

	/**
	 * 보낸 싱글 메세지 상세
	 * @param request
	 * @param response
	 * @url /manager/message/sendDetail.do
	 */
	@RequestMapping("/singleMessageDetail")
	public void singleMessageDetail(HttpServletRequest request, HttpServletResponse response) {
		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String receiveNo = request.getParameter("receiveNo");

		DataMap param = new DataMap();
		param.put("receiveNo",	receiveNo);
		param.put("user_no",	authUserInfo.getString("user_no"));

		/*	보낸 메세지 상세	*/
		DataMap sendMessageDetail = messageService.sendSingleMessageDetail(param);

		sendColData(sendMessageDetail, request, response);
	}

	/**
	 * 받은 메세지 상세
	 * @param request
	 * @param response
	 * @url /manager/message/receiveMessageDetail.do
	 */
	@RequestMapping("/receiveMessageDetail")
	public void receiveMessageDetail(HttpServletRequest request, HttpServletResponse response) {
		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String receiveNo = request.getParameter("receiveNo");

		DataMap param = new DataMap();
		param.put("receiveNo",	receiveNo);
		param.put("user_no",	authUserInfo.getString("user_no"));

		/*	보낸 메세지 상세	*/
		DataMap sendMessageDetail = messageService.executeReceiveMessageDetail(param);

		sendColData(sendMessageDetail, request, response);
	}


	/**
	 * 받은 메세지 리스트 조회
	 * @param request
	 * @param response
	 * @url /manager/message/receiveList.do
	 */
	@RequestMapping("/receiveList")
	public void receiveList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		int page_no			= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale		= HakwonConstant.PageScale.MESSAGE_REQ;

		DataMap param = new DataMap();
		param.put("receive_user_no",	authUserInfo.get("user_no"));
		param.put("start_no",			(page_no-1)*page_scale);
		param.put("page_scale",			page_scale);

		/* 전체 받은 메세지 리스트 조회 */
		List<DataMap> receiveMessageReqList = messageService.receiveMessageList(param);

		/* 전체 받은 메세지 리스트 카운트 */
		int receiveMessageReqListTotCount = messageService.receiveMessageListTotCount(param);

		/* 신규 받은 메세지 카운트 */
		int newReceiveMessageCount = messageService.newReceiveMessageCount(param);

		DataMap colData = new DataMap();
		colData.put("dataList",		receiveMessageReqList);
		colData.put("dataCount",	receiveMessageReqListTotCount);
		colData.put("newReceiveMessageCount",	newReceiveMessageCount);
		colData.put("pageScale", page_scale);

		sendColData(colData, request, response);
	}

	/**
	 * 메세지 대상 검색
	 * @param request
	 * @param response
	 */
	@RequestMapping("/targetUserSearch")
	public void targetUserSearch(HttpServletRequest request, HttpServletResponse response) {
		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String targetUserNoArray	= request.getParameter("targetUserNoArray");

		DataMap param = new DataMap();
		param.put("user_no",			authUserInfo.getString("user_no"));
		param.put("user_type",			authUserInfo.getString("user_type"));
		param.put("targetUserNoArray",	targetUserNoArray);

		/**
		 * 대상 검색 결과
		 */
		List<DataMap> targetUserList = messageSendService.targetUserSearch(param);

		sendList(targetUserList, request, response);
	}
}