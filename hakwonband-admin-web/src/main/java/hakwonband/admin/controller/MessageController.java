package hakwonband.admin.controller;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.model.DevicePushData;
import hakwonband.admin.service.AsyncService;
import hakwonband.admin.service.MessageService;
import hakwonband.admin.service.UserService;
import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

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
 * 메세지 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/admin/message")
@Controller
public class MessageController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(MessageController.class);

	@Autowired
	private UserService userService;

	@Autowired
	private MessageService messageService;

	@Autowired
	private AsyncService asyncService;

	/**
	 * 보낸 메세지 리스트
	 * @param request
	 * @param response
	 * @url /admin/message/sendList.do
	 */
	@RequestMapping("/sendList")
	public void sendMessageList(HttpServletRequest request, HttpServletResponse response) {

		int pageNo		= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale	= HakwonConstant.PageScale.PARENT_LIST;

		String searchText	= request.getParameter("searchText");
		String groupYn		= request.getParameter("groupYn");

		DataMap param = new DataMap();
		param.put("startNo",	(pageNo-1)*pageScale);
		param.put("pageScale",	pageScale);
		param.put("searchText",	searchText);

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
	 * @url /admin/message/groupMessageDetail.do
	 */
	@RequestMapping("/groupMessageDetail")
	public void groupMessageDetail(HttpServletRequest request, HttpServletResponse response) {
		String messageNo = request.getParameter("messageNo");

		DataMap param = new DataMap();
		param.put("messageNo",	messageNo);

		/*	보낸 메세지 상세	*/
		DataMap sendMessageDetail = messageService.sendGroupMessageDetail(param);

		sendColData(sendMessageDetail, request, response);
	}

	/**
	 * 보낸 싱글 메세지 상세
	 * @param request
	 * @param response
	 * @url /admin/message/sendDetail.do
	 */
	@RequestMapping("/singleMessageDetail")
	public void singleMessageDetail(HttpServletRequest request, HttpServletResponse response) {
		String receiveNo = request.getParameter("receiveNo");

		DataMap param = new DataMap();
		param.put("receiveNo",	receiveNo);

		/*	보낸 메세지 상세	*/
		DataMap sendMessageDetail = messageService.sendSingleMessageDetail(param);

		sendColData(sendMessageDetail, request, response);
	}

	/**
	 * 사용자 리스트
	 * @return
	 * @url /admin/message/userList.do
	 */
	@RequestMapping("/userList")
	public void masterList(HttpServletRequest request, HttpServletResponse response) {

		String searchText = request.getParameter("searchText");

		DataMap param = new DataMap();
		param.put("searchText",	searchText);

		/*	사용자 리스트 검색	*/
		List<DataMap> userList = userService.userList(param);

		sendList(userList, request, response);
	}

	/**
	 * 메세지 발송
	 * @param request
	 * @param response
	 */
	@RequestMapping("/send")
	public void send(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		/*	메세지 타입	*/
		String messageType	= request.getParameter("messageType");

		DataMap param = new DataMap();
		param.put("user_no",		authUserInfo.getString("user_no"));
		param.put("messageType",	messageType);

		if( "area".equals(messageType) ) {
			/*	지역	*/

			String sido				= request.getParameter("sido");	/*	시도	*/
			String [] gugunList		= request.getParameterValues("gugunList");	/*	구군 리스트	*/
			String [] hakwonCateList= request.getParameterValues("hakwonCateList");	/*	업종	*/
			String [] userTypeList	= request.getParameterValues("userTypeList");	/*	사용자 타입 리스트	*/

			param.put("sido",			sido);
			param.put("gugunList",		gugunList);
			param.put("hakwonCateList",	hakwonCateList);
			param.put("userTypeList",	userTypeList);

			DataMap messageTargetMap = new DataMap();
			messageTargetMap.put("sido", sido);
			messageTargetMap.put("gugunList", gugunList);
			messageTargetMap.put("hakwonCateList", hakwonCateList);
			messageTargetMap.put("userTypeList", userTypeList);
			param.put("messageTarget",	messageTargetMap.toString());
		} else if( "hakwonSearch".equals(messageType) ) {
			/*	학원 검색	*/

			String [] hakwonList	= request.getParameterValues("hakwonList");	/*	학원 리스트	*/
			String [] userTypeList	= request.getParameterValues("userTypeList");	/*	사용자 타입 리스트	*/

			param.put("hakwonList",		hakwonList);
			param.put("userTypeList",	userTypeList);

			DataMap messageTargetMap = new DataMap();
			messageTargetMap.put("hakwonList", hakwonList);
			messageTargetMap.put("userTypeList", userTypeList);
			param.put("messageTarget",	messageTargetMap.toString());
		} else if( "userSearch".equals(messageType) ) {
			/*	사용자 검색	*/

			String [] userList	= request.getParameterValues("userList");	/*	사용자 리스트	*/
			param.put("userList",		userList);

			DataMap messageTargetMap = new DataMap();
			messageTargetMap.put("userList", userList);
			param.put("messageTarget",	messageTargetMap.toString());
		} else {
			throw new HKBandException("Invalid MessageType["+messageType+"]");
		}

		/*	메세지 내용	*/
		String messageContent = request.getParameter("messageContent");
		param.put("messageContent",		messageContent);

		/*	파일 리스트	*/
		String [] fileList	= request.getParameterValues("fileList");
		param.put("fileListStr",	StringUtils.join(fileList, ','));

		logger.debug("param\n" + param.toString());

		/*	메세지 발송	*/
		DevicePushData devicePushData = messageService.executeMessageSend(param);
		asyncService.pushMobileDevice(devicePushData);

		sendFlag(CommonConstant.Flag.success, request, response);
	}
}