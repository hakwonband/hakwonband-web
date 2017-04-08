package hakwonband.hakwon.controller;

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
import hakwonband.common.exception.HKBandException;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.model.DevicePushData;
import hakwonband.hakwon.service.AsyncService;
import hakwonband.hakwon.service.MessageSendService;
import hakwonband.hakwon.service.MessageService;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;
import net.logstash.logback.encoder.org.apache.commons.lang.StringUtils;

/**
 * 메세지 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/hakwon/message")
@Controller
public class MessageController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(MessageController.class);

	@Resource(name = "messageSourceAccessor")
	protected MessageSourceAccessor messageSource;

	@Autowired
	private MessageService messageService;

	@Autowired
	private AsyncService asyncService;

	@Autowired
	private MessageSendService messageSendService;

	/**
	 * 선생님 메세지 보내기 학생 검색
	 * @param request
	 * @param response
	 * @url /hakwon/message/teacherSearchStudent.do
	 */
	@RequestMapping("/teacherSearchStudent")
	public void teacherSearchStudent(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String searchText = request.getParameter("searchText");
		String hakwon_no = request.getParameter("hakwon_no");

		DataMap param = new DataMap();
		param.put("searchText", searchText);
		param.put("hakwon_no", hakwon_no);
		param.put("user_no", authUserInfo.getString("user_no"));

		/**
		 * 학생 검색
		 */
		List<DataMap> searchList = messageSendService.teacherSearchStudent(param);

		sendList(searchList, request, response);
	}


	/**
	 * 선생님 메세지 보내기
	 * @param request
	 * @param response
	 * @url /hakwon/message/teacherSend.do
	 */
	@RequestMapping("/teacherSend")
	public void teacherSend(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String hakwon_no		= request.getParameter("hakwon_no");
		String classTarget		= request.getParameter("classTarget");
		String targetType		= request.getParameter("targetType");
		String messageContent	= request.getParameter("messageContent");
		String fileListStr		= request.getParameter("fileListStr");
		String [] targetUserList= request.getParameterValues("targetUserList");

		/*	예약 전송	*/
		String reservationDate		= request.getParameter("reservationDate");
		String reservationTime		= request.getParameter("reservationTime");
		if( StringUtils.isNotBlank(reservationDate) && StringUtils.isNotBlank(reservationTime) ) {
		} else {
			reservationDate = "";
			reservationTime = "";
		}

		if( "search".equals(classTarget) ) {
			/*	검색	*/
			targetType = "";
		}
		if( StringUtil.isBlank(messageContent) ) {
			throw new HKBandException();
		}

		DataMap param = new DataMap();
		param.put("hakwon_no", hakwon_no);
		param.put("user_no", authUserInfo.getString("user_no"));
		param.put("user_name", authUserInfo.getString("user_name"));

		param.put("classTarget",	classTarget);
		param.put("targetType",		targetType);
		param.put("messageContent",	messageContent);
		param.put("fileListStr",	fileListStr);
		param.put("targetUserList",	targetUserList);

		param.put("reservationDate",	reservationDate);
		param.put("reservationTime",	reservationTime);

		/*	메세지 대상	*/
		if( "search".equals(classTarget) ) {
			DataMap messageTargetMap = new DataMap();
			messageTargetMap.put("hakwon_no", hakwon_no);
			messageTargetMap.put("targetUserList", targetUserList);
			param.put("messageTarget",	messageTargetMap.toString());
		} else {
			DataMap messageTargetMap = new DataMap();
			messageTargetMap.put("hakwon_no", hakwon_no);
			messageTargetMap.put("targetType", targetType);
			param.put("messageTarget",	messageTargetMap.toString());
		}

		/*	메세지 전송	*/
		DevicePushData devicePushData = messageSendService.executeTeacherMessageSend(param);
		asyncService.pushMobileDevice(devicePushData);


		sendFlag(CommonConstant.Flag.success, request, response);
	}


	/**
	 * 원장님 메세지 보내기 검색
	 * @param request
	 * @param response
	 * @url /hakwon/message/masterSearch.do
	 */
	@RequestMapping("/masterSearch")
	public void masterSearch(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String searchText = request.getParameter("searchText");
		String hakwon_no = request.getParameter("hakwon_no");

		DataMap param = new DataMap();
		param.put("searchText", searchText);
		param.put("hakwon_no", hakwon_no);
		param.put("user_no", authUserInfo.getString("user_no"));

		/**
		 * 대상 검색
		 */
		List<DataMap> searchList = messageSendService.masterSearch(param);

		sendList(searchList, request, response);
	}

	/**
	 * 원장님 메세지 보내기
	 * @param request
	 * @param response
	 * @url /hakwon/message/masterSend.do
	 */
	@RequestMapping("/masterSend")
	public void masterSend(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String hakwon_no		= request.getParameter("hakwon_no");

		/**
		 * 반/사용자 그룹/검색
		 */
		String targetType	= request.getParameter("targetType");

		/*	선택 반	*/
		String [] targetClass	= request.getParameterValues("targetClass");

		/*	대상자 타입	*/
		String [] targetUserType	= request.getParameterValues("targetUserType");

		/*	검색자	*/
		String [] targetUserList= request.getParameterValues("targetUserList");

		/*	메세지 및 첨부 파일	*/
		String messageContent	= request.getParameter("messageContent");
		String fileListStr		= request.getParameter("fileListStr");

		/*	예약 전송	*/
		String reservationDate		= request.getParameter("reservationDate");
		String reservationTime		= request.getParameter("reservationTime");
		if( StringUtils.isNotBlank(reservationDate) && StringUtils.isNotBlank(reservationTime) ) {
		} else {
			reservationDate = "";
			reservationTime = "";
		}


		if( "search".equals(targetType) ) {
			/*	검색	*/
			targetClass = null;
			targetUserType = null;
		}
		if( StringUtil.isBlank(messageContent) ) {
			throw new HKBandException();
		}

		DataMap param = new DataMap();
		param.put("hakwon_no", hakwon_no);
		param.put("user_no", authUserInfo.getString("user_no"));
		param.put("user_name", authUserInfo.getString("user_name"));


		param.put("targetType",		targetType);
		param.put("targetClass",	targetClass);
		param.put("targetUserType",	targetUserType);
		param.put("targetUserList",	targetUserList);

		param.put("reservationDate",	reservationDate);
		param.put("reservationTime",	reservationTime);

		/*	메세지 대상	*/
		if( "search".equals(targetType) ) {
			DataMap messageTargetMap = new DataMap();
			messageTargetMap.put("hakwon_no", hakwon_no);
			messageTargetMap.put("targetUserList", targetUserList);
			param.put("messageTarget",	messageTargetMap.toString());
		} else if( "class".equals(targetType) ) {
			DataMap messageTargetMap = new DataMap();
			messageTargetMap.put("hakwon_no", hakwon_no);
			messageTargetMap.put("targetUserType", targetUserType);
			messageTargetMap.put("targetClass", targetClass);
			param.put("messageTarget",	messageTargetMap.toString());
		} else if( "userGroup".equals(targetType) ) {
			DataMap messageTargetMap = new DataMap();
			messageTargetMap.put("hakwon_no", hakwon_no);
			messageTargetMap.put("targetUserType", targetUserType);
			param.put("messageTarget",	messageTargetMap.toString());
		}

		param.put("messageContent",	messageContent);
		param.put("fileListStr",	fileListStr);

		System.out.println("param : " + param);


		DevicePushData devicePushData = messageSendService.executeMasterMessageSend(param);

		/**
		 * Async 서비스
		 */
		asyncService.pushMobileDevice(devicePushData);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * 보낸 메세지 리스트
	 * @param request
	 * @param response
	 * @url /hakwon/message/sendList.do
	 */
	@RequestMapping("/sendList")
	public void sendMessageList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String hakwon_no		= request.getParameter("hakwon_no");

		int pageNo		= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale	= HakwonConstant.PageScale.PARENT_LIST;

		String searchText	= request.getParameter("searchText");
		String groupYn		= request.getParameter("groupYn");

		DataMap param = new DataMap();
		param.put("startNo",	(pageNo-1)*pageScale);
		param.put("pageScale",	pageScale);
		param.put("searchText",	searchText);
		param.put("user_no",	authUserInfo.getString("user_no"));
		param.put("hakwon_no",	hakwon_no);

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
	 * @url /hakwon/message/groupMessageDetail.do
	 */
	@RequestMapping("/groupMessageDetail")
	public void groupMessageDetail(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String hakwon_no		= request.getParameter("hakwon_no");

		String messageNo = request.getParameter("messageNo");

		DataMap param = new DataMap();
		param.put("messageNo",	messageNo);
		param.put("user_no",	authUserInfo.getString("user_no"));
		param.put("hakwon_no",	hakwon_no);

		/*	보낸 메세지 상세	*/
		DataMap sendMessageDetail = messageService.sendGroupMessageDetail(param);

		sendColData(sendMessageDetail, request, response);
	}

	/**
	 * 보낸 싱글 메세지 상세
	 * @param request
	 * @param response
	 * @url /hakwon/message/sendDetail.do
	 */
	@RequestMapping("/singleMessageDetail")
	public void singleMessageDetail(HttpServletRequest request, HttpServletResponse response) {
		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String hakwon_no		= request.getParameter("hakwon_no");

		String receiveNo = request.getParameter("receiveNo");

		DataMap param = new DataMap();
		param.put("receiveNo",	receiveNo);
		param.put("user_no",	authUserInfo.getString("user_no"));
		param.put("hakwon_no",	hakwon_no);

		/*	보낸 메세지 상세	*/
		DataMap sendMessageDetail = messageService.sendSingleMessageDetail(param);

		sendColData(sendMessageDetail, request, response);
	}

	/**
	 * 받은 메세지 상세
	 * @param request
	 * @param response
	 * @url /hakwon/message/receiveMessageDetail.do
	 */
	@RequestMapping("/receiveMessageDetail")
	public void receiveMessageDetail(HttpServletRequest request, HttpServletResponse response) {
		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String hakwon_no		= request.getParameter("hakwon_no");

		String receiveNo = request.getParameter("receiveNo");
		String messageNo = request.getParameter("messageNo");

		DataMap param = new DataMap();
		param.put("receiveNo",	receiveNo);
		param.put("messageNo",	messageNo);
		param.put("user_no",	authUserInfo.getString("user_no"));
		param.put("hakwon_no",	hakwon_no);

		/*	보낸 메세지 상세	*/
		DataMap sendMessageDetail = messageService.executeReceiveMessageDetail(param);

		sendColData(sendMessageDetail, request, response);
	}


	/**
	 * 받은 메세지 리스트 조회
	 * @param request
	 * @param response
	 * @url /hakwon/message/receiveList.do
	 */
	@RequestMapping("/receiveList")
	public void receiveList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no	= request.getParameter("hakwon_no");
		String searchType	= request.getParameter("searchType");
		int page_no			= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int page_scale		= HakwonConstant.PageScale.MESSAGE_REQ;

		DataMap param = new DataMap();
		param.put("hakwon_no",			hakwon_no);
		param.put("receive_user_no",	authUserInfo.get("user_no"));
		param.put("start_no",			(page_no-1)*page_scale);
		param.put("page_scale",			page_scale);
		param.put("search_type",		searchType);

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

		String hakwon_no	= request.getParameter("hakwon_no");
		String targetUserNoArray	= request.getParameter("targetUserNoArray");

		DataMap param = new DataMap();
		param.put("hakwon_no",			hakwon_no);
		param.put("user_no",			authUserInfo.getString("user_no"));
		param.put("user_type",			authUserInfo.getString("user_type"));
		param.put("targetUserNoArray",	targetUserNoArray);

		/**
		 * 대상 검색 결과
		 */
		List<DataMap> targetUserList = messageSendService.targetUserSearch(param);

		sendList(targetUserList, request, response);
	}

	/**
	 * 예약 메시지 삭제
	 * @param request
	 * @param response
	 * @url /hakwon/message/reservationMsgDelete.do
	 */
	@RequestMapping("/reservationMsgDelete")
	public void reservationMsgDelete(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String messageNo	= request.getParameter("message_no");

		DataMap param = new DataMap();
		param.put("messageNo",	messageNo);
		param.put("user_no",	authUserInfo.getString("user_no"));

		/*	메세지 삭제	*/
		messageService.deleteReservationMsg(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 싱글 메세지 삭제
	 * @param request
	 * @param response
	 */
	@RequestMapping("/msgDelete")
	public void msgDelete(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String messageNo	= request.getParameter("message_no");

		DataMap param = new DataMap();
		param.put("messageNo",	messageNo);
		param.put("user_no",	authUserInfo.getString("user_no"));

		/*	메세지 삭제	*/
		messageService.deleteMessage(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}
}