package hakwonband.hakwon.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.hakwon.dao.FileDAO;
import hakwonband.hakwon.dao.MessageSendDAO;
import hakwonband.hakwon.model.DevicePushData;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 메세지 작성 Service
 * @author jrlim
 */
@Service
public class MessageSendService {

	public static final Logger logger = LoggerFactory.getLogger(MessageSendService.class);

	@Autowired
	private MessageSendDAO messageSendDAO;

	@Autowired
	private FileDAO fileDAO;

	/**
	 * 선생님 학생 검색
	 * @param param
	 * @return
	 */
	public List<DataMap> teacherSearchStudent(DataMap param) {
		return messageSendDAO.teacherSearchStudent(param);
	}


	/**
	 * 선생님 메세지 전송
	 * @param param
	 */
	public DevicePushData executeTeacherMessageSend(DataMap param) {

		DevicePushData devicePushData = null;

		String targetType		= param.getString("targetType");
		String classTarget		= param.getString("classTarget");
		String messageContent	= param.getString("messageContent");
		String fileListStr		= param.getString("fileListStr");

		/**
		 * 메세지 등록
		 */
		String preview_content = "";
		String title = "";
		if( messageContent.length() > 20 ) {
			preview_content = messageContent.substring(0, 20);
			title = preview_content;
		} else {
			preview_content = messageContent;
			title = preview_content;
		}
		DataMap messageMap = new DataMap();
		messageMap.put("title", title);
		messageMap.put("preview_content", preview_content);
		messageMap.put("content", messageContent.replaceAll(CommonConstant.LINE_SEPARATOR, "<br/>"));
		messageMap.put("send_user_no", param.getString("user_no"));
		if( "search".equals(classTarget) ) {
			messageMap.put("group_yn", "N");
		} else {
			messageMap.put("group_yn", "Y");
		}
		messageMap.put("hakwon_no",		param.getString("hakwon_no"));
		messageMap.put("messageType",	param.getString("targetType"));
		messageMap.put("messageTarget",	param.getString("messageTarget"));

		if( param.isNotNull("reservationDate") && param.isNotNull("reservationTime") ) {
			messageMap.put("reservationDate",	param.getString("reservationDate") + " " + param.getString("reservationTime"));
			messageMap.put("reservationYn",		"Y");
		} else {
			messageMap.put("reservationYn",		"N");
		}

		messageSendDAO.messageInsert(messageMap);
		long messageNo = messageMap.getLong("idx");
		param.put("messageNo", messageNo);

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

		if( "search".equals(classTarget) ) {
			/*	검색한 대상만	*/
			String [] targetUserList= (String [])param.get("targetUserList");

			/*	받는 사용자 등록	*/
			List<DataMap> receiverList = new ArrayList<DataMap>();
			for(int i=0; i<targetUserList.length; i++) {
				String receive_user_no = targetUserList[i];

				DataMap receiverMap = new DataMap();
				receiverMap.put("message_no", messageNo);
				receiverMap.put("send_user_no", param.getString("user_no"));
				receiverMap.put("receive_user_no", receive_user_no);
				receiverMap.put("hakwon_no", param.getString("hakwon_no"));

				receiverList.add(receiverMap);
			}
			messageSendDAO.messageReceiverMultiInsert(receiverList);

			/**
			 * 디바이스 리스트 조회
			 */
			DataMap searchParam = new DataMap();
			searchParam.put("searchUserNoArray", StringUtils.join(targetUserList, ','));
			deviceList = messageSendDAO.searchUserDeviceToken(searchParam);
		} else {
			/*	해당 반만	*/
			DataMap receiverMap = new DataMap();
			receiverMap.put("message_no",	messageNo);
			receiverMap.put("hakwon_no",	param.getString("hakwon_no"));
			receiverMap.put("send_user_no",	param.getString("user_no"));
			receiverMap.put("class_no",		classTarget);
			receiverMap.put("user_no",		param.getString("user_no"));

			if( "student_all".equals(targetType) ) {
				/*	학생 모두	*/
				messageSendDAO.messageReceiverGroupInsertClassStudent(receiverMap);

				/*	디바이스 리스트	*/
				deviceList = messageSendDAO.teacherTargetClassStudent(receiverMap);
			} else if( "parent_all".equals(targetType) ) {
				/*	학부모 모두	*/
				messageSendDAO.messageReceiverGroupInsertClassParent(receiverMap);

				/*	디바이스 리스트	*/
				deviceList = messageSendDAO.teacherTargetClassParent(receiverMap);
			} else if( "all".equals(targetType) ) {
				/*	학생/학부모 모두	*/
				messageSendDAO.messageReceiverGroupInsertClassStudent(receiverMap);
				messageSendDAO.messageReceiverGroupInsertClassParent(receiverMap);

				/*	디바이스 리스트	*/
				List<UserDevice> deviceList1 = messageSendDAO.teacherTargetClassStudent(receiverMap);

				List<UserDevice> deviceList2 = messageSendDAO.teacherTargetClassParent(receiverMap);

				deviceList = new ArrayList<UserDevice>();
				deviceList.addAll(deviceList1);
				deviceList.addAll(deviceList2);
			}
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
			pushMessage.setTitle(param.getString("user_name")+"님께서 메세지를 보냈습니다.");
			pushMessage.setContent(title);
			pushMessage.addCustomParam("hakwonNo", param.getString("hakwon_no"));
			pushMessage.setImage_url("");
			pushMessage.setLink_url("https://m.hakwonband.com/message.do?hakwonNo="+param.getString("hakwon_no"));

			devicePushData = new DevicePushData(pushMessage, deviceList);
		}

		return devicePushData;
	}

	/**
	 * 원장님 검색
	 * - 선생님
	 * - 학원 멤버
	 * - 정회원 학부모 포함
	 * @param param
	 * @return
	 */
	public List<DataMap> masterSearch(DataMap param) {
		return messageSendDAO.masterSearch(param);
	}

	/**
	 * 원장님 메세지 전송
	 * @param param
	 */
	public DevicePushData executeMasterMessageSend(DataMap param) {

		DevicePushData devicePushData = null;

		/**
		 * 반/사용자 그룹/검색
		 */
		String targetType	= param.getString("targetType");

		/*	선택 반	*/
		String [] targetClass	= (String [])param.get("targetClass");

		/*	대상자 타입	*/
		String [] targetUserType	= (String [])param.get("targetUserType");

		/*	메세지 및 첨부 파일	*/
		String messageContent	= param.getString("messageContent");
		String fileListStr		= param.getString("fileListStr");


		/**
		 * 메세지 등록
		 */
		String preview_content = "";
		String title = "";
		if( messageContent.length() > 20 ) {
			preview_content = messageContent.substring(0, 20);
			title = preview_content;
		} else {
			preview_content = messageContent;
			title = preview_content;
		}
		DataMap messageMap = new DataMap();
		messageMap.put("title", title);
		messageMap.put("preview_content", preview_content);
		messageMap.put("content", messageContent.replaceAll(CommonConstant.LINE_SEPARATOR, "<br/>"));
		messageMap.put("send_user_no", param.getString("user_no"));
		if( "search".equals(targetType) ) {
			messageMap.put("group_yn", "N");
		} else {
			messageMap.put("group_yn", "Y");
		}
		messageMap.put("hakwon_no",		param.getString("hakwon_no"));
		messageMap.put("messageType",	param.getString("targetType"));
		messageMap.put("messageTarget",	param.getString("messageTarget"));

		if( param.isNotNull("reservationDate") && param.isNotNull("reservationTime") ) {
			messageMap.put("reservationDate",	param.getString("reservationDate") + " " + param.getString("reservationTime"));
			messageMap.put("reservationYn",		"Y");
		} else {
			messageMap.put("reservationYn",		"N");
		}

		System.out.println("messageMap\n" + messageMap);
		messageSendDAO.messageInsert(messageMap);
		long messageNo = messageMap.getLong("idx");
		param.put("messageNo", messageNo);

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

		/**
		 * 대상자 처리
		 */
		if( "search".equals(targetType) ) {
			/*	검색 대상만	*/

			/*	검색자	*/
			String [] targetUserList= (String [])param.get("targetUserList");

			/*	받는 사용자 등록	*/
			List<DataMap> receiverList = new ArrayList<DataMap>();
			for(int i=0; i<targetUserList.length; i++) {
				String receive_user_no = targetUserList[i];

				DataMap receiverMap = new DataMap();
				receiverMap.put("message_no", messageNo);
				receiverMap.put("send_user_no", param.getString("user_no"));
				receiverMap.put("receive_user_no", receive_user_no);
				receiverMap.put("hakwon_no", param.getString("hakwon_no"));

				receiverList.add(receiverMap);
			}
			messageSendDAO.messageReceiverMultiInsert(receiverList);

			/**
			 * 디바이스 리스트 조회
			 */
			DataMap searchParam = new DataMap();
			searchParam.put("searchUserNoArray", StringUtils.join(targetUserList, ','));
			deviceList = messageSendDAO.searchUserDeviceToken(searchParam);
		} else if( "class".equals(targetType) ) {
			/*	반 선택	*/
			DataMap param01 = new DataMap();
			for(int i=0; i<targetUserType.length; i++) {
				String targetUserTypeStr = targetUserType[i];

				if( "teacher".equals(targetUserTypeStr) ) {
					param01.put("targetUserTeacher", "Y");
				} else if( "student".equals(targetUserTypeStr) ) {
					param01.put("targetUserStudent", "Y");
				} else if( "parent".equals(targetUserTypeStr) ) {
					param01.put("targetUserParent", "Y");
				}
			}
			param01.put("hakwon_no", param.getString("hakwon_no"));
			param01.put("target_class_array", StringUtils.join(targetClass, ','));

			/*	반 대상자 조회	*/
			List<String> targetUserList = messageSendDAO.masterTargetClassUser(param01);

			List<DataMap> receiverList = new ArrayList<DataMap>();
			for(int i=0; i<targetUserList.size(); i++) {
				String receive_user_no = targetUserList.get(i);

				DataMap receiverMap = new DataMap();
				receiverMap.put("message_no", messageNo);
				receiverMap.put("send_user_no", param.getString("user_no"));
				receiverMap.put("receive_user_no", receive_user_no);
				receiverMap.put("hakwon_no", param.getString("hakwon_no"));

				receiverList.add(receiverMap);
			}
			if( receiverList == null || receiverList.size() == 0 ) {
				return null;
			}
			messageSendDAO.messageReceiverMultiInsert(receiverList);

			/**
			 * 반 대상자 디바이스 정보 조회
			 */
			deviceList = messageSendDAO.masterTargetClassUserDeviceToken(param01);
		} else if( "userGroup".equals(targetType) ) {
			/*	사용자 그룹 선택	*/

			DataMap param01 = new DataMap();
			param01.put("hakwon_no", param.getString("hakwon_no"));

			for(int i=0; i<targetUserType.length; i++) {
				String targetUserTypeStr = targetUserType[i];

				if( "teacher".equals(targetUserTypeStr) ) {
					param01.put("targetUserTeacher", "Y");
				} else if( "student".equals(targetUserTypeStr) ) {
					param01.put("targetUserStudent", "Y");
				} else if( "parent".equals(targetUserTypeStr) ) {
					param01.put("targetUserParent", "Y");
				} else if( "nonStudent".equals(targetUserTypeStr) ) {
					param01.put("targetUserStudentNon", "Y");
				} else if( "nonParent".equals(targetUserTypeStr) ) {
					param01.put("targetUserParentNon", "Y");
				}
			}

			/*	사용자 대상자 조회	*/
			List<String> targetUserList = messageSendDAO.masterTargetUserGroup(param01);
			targetUserList = StringUtil.removeDuplicates(targetUserList);		//	중복제거

			List<DataMap> receiverList = new ArrayList<DataMap>();
			for(int i=0; i<targetUserList.size(); i++) {
				String receive_user_no = targetUserList.get(i);

				DataMap receiverMap = new DataMap();
				receiverMap.put("message_no", messageNo);
				receiverMap.put("send_user_no", param.getString("user_no"));
				receiverMap.put("receive_user_no", receive_user_no);
				receiverMap.put("hakwon_no", param.getString("hakwon_no"));

				receiverList.add(receiverMap);
			}
			if( receiverList == null || receiverList.size() == 0 ) {
				return null;
			}
			messageSendDAO.messageReceiverMultiInsert(receiverList);

			/**
			 * 디바이스 정보 조회
			 */
			deviceList = messageSendDAO.masterTargetUserGroupDeviceToken(param01);
		} else {
			throw new HKBandException();
		}

		/*	메세지 받은 사용자 카운트 업데이트	*/
		int checkCount = messageSendDAO.updateMessageReceiverCount(param);
		if( checkCount != 1 ) {
			throw new HKBandException("updateMessageReceiverCount fail["+checkCount+"]");
		}

		/**
		 * 메세지 발송 처리
		 */
		logger.info("executeMasterMessageSend deviceList["+deviceList+"]");
		if( deviceList != null && deviceList.size() > 0 ) {
			PushMessage pushMessage = new PushMessage();
			pushMessage.setTicker("학원밴드 입니다.");
			pushMessage.setTitle(param.getString("user_name")+"님께서 메세지를 보냈습니다.");
			pushMessage.setContent(title);
			pushMessage.addCustomParam("hakwonNo", param.getString("hakwon_no"));
			pushMessage.setImage_url("");
			pushMessage.setLink_url("https://m.hakwonband.com/message.do?hakwonNo="+param.getString("hakwon_no"));

			devicePushData = new DevicePushData(pushMessage, deviceList);
		}

		return devicePushData;
	}

	/**
	 * 단건 메세지 보내기
	 * @param param
	 */
	public void registSingleMessage(DataMap param) {
		String messageContent	= param.getString("messageContent");
		String fileListStr		= param.getString("fileListStr");

		/**
		 * 메세지 등록
		 */
		String preview_content = "";
		String title = "";
		if( messageContent.length() > 20 ) {
			preview_content = messageContent.substring(0, 20);
			title = preview_content;
		} else {
			preview_content = messageContent;
			title = preview_content;
		}
		DataMap messageMap = new DataMap();
		messageMap.put("title", title);
		messageMap.put("preview_content", preview_content);
		messageMap.put("content",		messageContent.replaceAll(CommonConstant.LINE_SEPARATOR, "<br/>"));
		messageMap.put("send_user_no",	param.getString("user_no"));
		messageMap.put("hakwon_no",		param.getString("hakwon_no"));
		messageMap.put("group_yn",		"N");

		messageSendDAO.messageInsert(messageMap);
		long messageNo = messageMap.getLong("idx");
		param.put("messageNo", messageNo);

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

		/*	받는 사용자 등록	*/
		param.put("messageNo",	messageNo);
		messageSendDAO.messageReceiverSingleInsert(param);

		/*	메세지 받은 사용자 카운트 업데이트	*/
		int checkCount = messageSendDAO.updateMessageReceiverCount(param);
		if( checkCount != 1 ) {
			throw new HKBandException("updateMessageReceiverCount fail["+checkCount+"]");
		}
	}

	/**
	 * 대상 사용자 검색
	 * @param param
	 * @return
	 */
	public List<DataMap> targetUserSearch(DataMap param) {
		return messageSendDAO.targetUserList(param);
	}
}