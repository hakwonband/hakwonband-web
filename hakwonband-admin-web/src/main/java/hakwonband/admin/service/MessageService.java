package hakwonband.admin.service;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.dao.CommonDAO;
import hakwonband.admin.dao.FileDAO;
import hakwonband.admin.dao.HakwonCateDAO;
import hakwonband.admin.dao.HakwonDAO;
import hakwonband.admin.dao.MasterDAO;
import hakwonband.admin.dao.MessageSendDAO;
import hakwonband.admin.dao.MessageViewDAO;
import hakwonband.admin.dao.ReplyDAO;
import hakwonband.admin.dao.UserDAO;
import hakwonband.admin.model.DevicePushData;
import hakwonband.api.PushSend;
import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 공통 서비스
 * @author bumworld
 *
 */
@Service
public class MessageService {

	public static final Logger logger = LoggerFactory.getLogger(MessageService.class);

	@Autowired
	private MasterDAO masterDAO;

	@Autowired
	private UserDAO userDAO;

	@Autowired
	private HakwonDAO hakwonDAO;

	@Autowired
	private MessageSendDAO messageSendDAO;

	@Autowired
	private MessageViewDAO messageViewDAO;

	@Autowired
	private FileDAO fileDAO;

	@Autowired
	private ReplyDAO replyDAO;

	@Autowired
	private HakwonCateDAO hakwonCateDAO;

	@Autowired
	private CommonDAO commonDAO;

	/**
	 * 보낸 그룹 메세지 리스트
	 * @param param
	 * @return
	 */
	public DataMap sendGroupMessageList(DataMap param) {
		DataMap sendMessage = new DataMap();

		List<DataMap> messageList = messageViewDAO.sendGroupMessageList(param);
		sendMessage.put("dataList", messageList);

		int messageCount = messageViewDAO.sendGroupMessageCount(param);
		sendMessage.put("dataCount", messageCount);

		return sendMessage;
	}

	/**
	 * 메세지 상세
	 * @param param
	 * @return
	 */
	public DataMap sendGroupMessageDetail(DataMap param) {
		DataMap colData = new DataMap();

		/*	메세지 상세	*/
		DataMap messageDetail = messageViewDAO.sendGroupMessageDetail(param);
		colData.put("messageDetail", messageDetail);

		if( messageDetail.isNotNull("message_target") ) {
			String messageTargetJsonStr = messageDetail.getString("message_target");
			try {
				DataMap messageTarget = (new ObjectMapper()).readValue(messageTargetJsonStr, DataMap.class);

				if( messageTarget.isNotNull("hakwonCateList") ) {
					/*	학원 카테고리	*/
					String hakwonCateListStr = hakwonCateDAO.cateCodeToString(messageTarget);
					messageTarget.put("hakwonCateListStr", hakwonCateListStr);
				}

				/*	학원 리스트	*/
				if( messageTarget.isNotNull("hakwonList") ) {
					String hakwonListStr = hakwonDAO.hakwonListToString(messageTarget);
					messageTarget.put("hakwonListStr", hakwonListStr);
				}

				/*	사용자 타입 리스트	*/
				List<String> userTypeList = (List<String>)messageTarget.get("userTypeList");
				DataMap codeMap = new DataMap();
				codeMap.put("codeGroup", "001");
				codeMap.put("codeList",	userTypeList);
				String userTypeListStr = commonDAO.codeToString(codeMap);
				messageTarget.put("userTypeListStr", userTypeListStr);

				colData.put("messageTarget", messageTarget);
			} catch(Exception e) {
				throw new HKBandException(e);
			}
		}

		/* 보낸 메세지 파일 리스트 조회 */
		param.put("file_parent_type",	CommonConstant.File.TYPE_MESSAGE);
		param.put("file_parent_no",	messageDetail.getString("message_no"));
		List<DataMap> fileList = fileDAO.fileList(param);
		colData.put("fileList", fileList);

		return colData;
	}

	/**
	 * 보낸 싱글 메세지 리스트
	 * @param param
	 * @return
	 */
	public DataMap sendSingleMessageList(DataMap param) {
		DataMap sendMessage = new DataMap();

		List<DataMap> messageList = messageViewDAO.sendSingleMessageList(param);
		sendMessage.put("dataList", messageList);

		int messageCount = messageViewDAO.sendSingleMessageCount(param);
		sendMessage.put("dataCount", messageCount);

		return sendMessage;
	}

	/**
	 * 메세지 상세
	 * @param param
	 * @return
	 */
	public DataMap sendSingleMessageDetail(DataMap param) {
		DataMap colData = new DataMap();

		/*	메세지 상세	*/
		DataMap messageDetail = messageViewDAO.sendSingleMessageDetail(param);
		colData.put("messageDetail", messageDetail);

		if( messageDetail.isNotNull("message_target") ) {
			String messageTargetJsonStr = messageDetail.getString("message_target");
			try {
				DataMap messageTarget = (new ObjectMapper()).readValue(messageTargetJsonStr, DataMap.class);

				/*	사용자 리스트	*/
				if( messageTarget.isNotNull("userList") ) {
					List<DataMap> userList = messageViewDAO.userListInfo(messageTarget);
					messageTarget.put("userList", userList);
				}

				colData.put("messageTarget", messageTarget);
			} catch(Exception e) {
				throw new HKBandException(e);
			}
		}

		/* 보낸 메세지 파일 리스트 조회 */
		param.put("file_parent_type",	CommonConstant.File.TYPE_MESSAGE);
		param.put("file_parent_no",	messageDetail.getString("message_no"));
		List<DataMap> fileList = fileDAO.fileList(param);
		colData.put("fileList", fileList);

		return colData;
	}


	/**
	 * 메세지 발송
	 * @param param
	 */
	public DevicePushData executeMessageSend(DataMap param) {

		DevicePushData devicePushData = null;

		DataMap messageMap = new DataMap();
		/**
		 * 메세지 등록
		 */
		/*	메세지 및 첨부 파일	*/
		String messageContent	= param.getString("messageContent");
		String fileListStr		= param.getString("fileListStr");

		String preview_content = "";
		String title = "";
		if( messageContent.length() > 20 ) {
			preview_content = messageContent.substring(0, 20);
			title = preview_content;
		} else {
			preview_content = messageContent;
			title = preview_content;
		}
		messageMap.put("title", title);
		messageMap.put("preview_content", preview_content);
		messageMap.put("content", messageContent.replaceAll(CommonConstant.LINE_SEPARATOR, "<br/>"));
		messageMap.put("send_user_no", param.getString("user_no"));
		if( param.equals("messageType", "area") ) {
			messageMap.put("group_yn", "Y");
		} else if( param.equals("messageType", "hakwonSearch") ) {
			messageMap.put("group_yn", "Y");
		} else if( param.equals("messageType", "userSearch") ) {
			messageMap.put("group_yn", "N");
		}
		messageMap.put("messageType", param.getString("messageType"));
		messageMap.put("messageTarget", param.getString("messageTarget"));

		messageSendDAO.messageInsert(messageMap);
		long messageNo = messageMap.getLong("idx");
		param.put("messageNo",	messageNo);

		/**
		 * 파일 등록 처리
		 */
		if( StringUtil.isNotBlank(fileListStr) ) {
			DataMap fileParam = new DataMap();
			fileParam.put("file_parent_no",		messageNo);
			fileParam.put("file_parent_type",	CommonConstant.File.TYPE_MESSAGE);
			fileParam.put("reg_user_no",		param.getString("user_no"));

			fileParam.put("file_no_list",		param.getString("fileListStr"));
			int updateFiles = fileDAO.usingUpdate(fileParam);
			if( fileListStr.split(",").length != updateFiles ) {
				throw new HKBandException("File Update Fail");
			}
		}


		/**
		 * 디바이스 리스트
		 */
		List<UserDevice> deviceList = null;
		if( param.equals("messageType", "area") ) {
			/*	지역	*/

			String sido				= param.getString("sido");					/*	시도	*/
			String [] gugunList		= (String [])param.get("gugunList");		/*	구군 리스트	*/
			String [] hakwonCateList= (String [])param.get("hakwonCateList");	/*	업종	*/
			String [] userTypeList	= (String [])param.get("userTypeList");		/*	사용자 타입 리스트	*/

			DataMap param01 = new DataMap();
			param01.put("sido",				sido);
			param01.put("gugunList",		gugunList);
			param01.put("hakwonCateList",	hakwonCateList);
			param01.put("messageNo",		messageNo);

			for(int i=0; i<userTypeList.length; i++) {
				String userTypeListStr = userTypeList[i];

				if( HakwonConstant.UserType.WONJANG.equals(userTypeListStr) ) {
					param01.put("targetUserMaster", "Y");
				} else if( HakwonConstant.UserType.TEACHER.equals(userTypeListStr) ) {
					param01.put("targetUserTeacher", "Y");
				} else if( HakwonConstant.UserType.STUDENT.equals(userTypeListStr) ) {
					param01.put("targetUserStudent", "Y");
				} else if( HakwonConstant.UserType.PARENT.equals(userTypeListStr) ) {
					param01.put("targetUserParent", "Y");
				}
			}

			/*	지역 그룹 등록	*/
			messageSendDAO.messageReceiverAreaGroupInsert(param01);

			deviceList = messageSendDAO.areaGroupUserDeviceToken(param01);
		} else if( param.equals("messageType", "hakwonSearch") ) {
			/*	학원	*/

			String [] hakwonList	= (String [])param.get("hakwonList");		/*	학원 리스트	*/
			String [] userTypeList	= (String [])param.get("userTypeList");		/*	사용자 타입 리스트	*/

			DataMap param01 = new DataMap();
			param01.put("hakwonList",	hakwonList);
			param01.put("messageNo",	messageNo);

			for(int i=0; i<userTypeList.length; i++) {
				String userTypeListStr = userTypeList[i];

				if( HakwonConstant.UserType.WONJANG.equals(userTypeListStr) ) {
					param01.put("targetUserMaster", "Y");
				} else if( HakwonConstant.UserType.TEACHER.equals(userTypeListStr) ) {
					param01.put("targetUserTeacher", "Y");
				} else if( HakwonConstant.UserType.STUDENT.equals(userTypeListStr) ) {
					param01.put("targetUserStudent", "Y");
				} else if( HakwonConstant.UserType.PARENT.equals(userTypeListStr) ) {
					param01.put("targetUserParent", "Y");
				}
			}

			/*	학원 그룹 등록	*/
			messageSendDAO.messageReceiverHakwonGroupInsert(param01);

			deviceList = messageSendDAO.hakwonGroupUserDeviceToken(param01);
		} else if( param.equals("messageType", "userSearch") ) {
			/*	사용자	*/
			String [] userList = (String [])param.get("userList");

			List<DataMap> receiverList = new ArrayList<DataMap>();
			for(int i=0; i<userList.length; i++) {
				String receive_user_no = userList[i];

				DataMap receiverMap = new DataMap();
				receiverMap.put("message_no", messageNo);
				receiverMap.put("receive_user_no", receive_user_no);

				receiverList.add(receiverMap);
			}
			messageSendDAO.messageReceiverMultiInsert(receiverList);


			/**
			 * 디바이스 리스트 조회
			 */
			DataMap searchParam = new DataMap();
			searchParam.put("searchUserNoArray", StringUtils.join(userList, ','));
			deviceList = messageSendDAO.searchUserDeviceToken(searchParam);
		}

		/*	메세지 받은 사용자 카운트 업데이트	*/
		int checkCount = messageSendDAO.updateMessageReceiverCount(param);
		if( checkCount != 1 ) {
			throw new HKBandException("updateMessageReceiverCount fail["+checkCount+"]");
		}

		/**
		 * 메세지 발송 처리
		 */
		logger.info("executeTeacherMessageSend deviceList["+deviceList+"]");
		if( deviceList != null && deviceList.size() > 0 ) {
			PushMessage pushMessage = new PushMessage();
			pushMessage.setTicker("학원밴드 입니다.");
			pushMessage.setTitle("학원밴드에서 메세지를 보냈습니다.");
			pushMessage.setContent(title);
			pushMessage.addCustomParam("hakwonNo", "-1");
			pushMessage.setImage_url("");
			pushMessage.setLink_url("https://m.hakwonband.com/message.do?hakwonNo=-1");

			devicePushData = new DevicePushData(pushMessage, deviceList);
		}

		return devicePushData;
	}
}