package hakwonband.manager.service;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.manager.dao.FileDAO;
import hakwonband.manager.dao.MessageSendDAO;
import hakwonband.manager.model.DevicePushData;
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
	 * 원장님 검색
	 * - 선생님
	 * - 학원 멤버
	 * - 정회원 학부모 포함
	 * @param param
	 * @return
	 */
	public List<DataMap> targetSearch(DataMap param) {
		return messageSendDAO.targetSearch(param);
	}

	/**
	 * 메세지 전송
	 * @param param
	 */
	public DevicePushData executeMessageSend(DataMap param) {

		DevicePushData devicePushData = null;

		/**
		 * 학원 원장님 / 검색
		 */
		String targetType	= param.getString("targetType");

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
		messageMap.put("messageType",	param.getString("targetType"));
		messageMap.put("messageTarget",	param.getString("messageTarget"));

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
			String [] targetHakwonList= (String [])param.get("targetHakwonList");

			param.put("targetHakwonList", StringUtils.join(targetHakwonList, ','));

			/*	받는 사용자 등록	*/
			List<DataMap> receiverList = messageSendDAO.hakwonMasterList(param);
			messageSendDAO.messageReceiverMultiInsert(receiverList);

			/**
			 * 디바이스 리스트 조회
			 */
			DataMap searchParam = new DataMap();
			searchParam.put("searchHakwonNoArray", StringUtils.join(targetHakwonList, ','));
			deviceList = messageSendDAO.searchHakwonDeviceToken(searchParam);
		} else if( "hakwonAll".equals(targetType) ) {
			/*	학원 전체	*/

			/*	학원 원장님 리스트	*/
			List<DataMap> receiverList = messageSendDAO.hakwonMasterList(param);
			if( receiverList == null || receiverList.size() == 0 ) {
				return null;
			}
			messageSendDAO.messageReceiverMultiInsert(receiverList);

			/**
			 * 디바이스 정보 조회
			 */
			deviceList = messageSendDAO.hakwonMasterUserDeviceToken(param);
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
			pushMessage.setTitle(param.getString("user_name")+" 매니저님께서 메세지를 보냈습니다.");
			pushMessage.setContent(title);
			pushMessage.addCustomParam("hakwonNo", param.getString("hakwon_no"));
			pushMessage.setImage_url("");
			pushMessage.setLink_url("https://m.hakwonband.com/message.do?hakwonNo="+param.getString("hakwon_no"));

			devicePushData = new DevicePushData(pushMessage, deviceList);
		}

		return devicePushData;
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