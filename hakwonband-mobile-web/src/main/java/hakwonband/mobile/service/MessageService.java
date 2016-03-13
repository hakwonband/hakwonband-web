package hakwonband.mobile.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.mobile.dao.CommonDAO;
import hakwonband.mobile.dao.MessageDAO;
import hakwonband.mobile.dao.ReadDAO;
import hakwonband.mobile.dao.ReplyDAO;
import hakwonband.mobile.model.DevicePushData;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 학원 Service
 * @author jszzang9
 */
@Service
public class MessageService {

	public static final Logger logger = LoggerFactory.getLogger(MessageService.class);

	@Autowired
	private MessageDAO messageDAO;

	@Autowired
	private ReplyDAO replyDAO;

	@Autowired
	private FileService fileService;

	@Autowired
	private ReadDAO readDAO;

	@Autowired
	private CommonDAO commonDAO;

	/**
	 * 보낸 메세지 목록조회
	 * @param param
	 * @return
	 */
	public List<DataMap> sendMessageList(DataMap param) {
		logger.debug("sendMessageList param["+param+"]");
		return messageDAO.sendMessageList(param);
	}

	/**
	 * 보낸 메세지 카운트 확인
	 * @param param
	 * @return
	 */
	public int sendMessageListTotCount(DataMap param) {
		logger.debug("sendMessageListTotCount param["+param+"]");
		return messageDAO.sendMessageListTotCount(param);
	}

	/**
	 * 받은 메세지 목록조회
	 * @param param
	 * @return
	 */
	public DataMap receiveMessageList(DataMap param) {
		logger.debug("receiveMessageList param["+param+"]");

		/* 전체 받은 메세지 리스트 */
		List<DataMap> receiveMessageList = messageDAO.receiveMessageList(param);

		/* 전체 받은 메세지 리스트 카운트 */
		int receiveMessageListTotCount = messageDAO.receiveMessageListTotCount(param);

		DataMap resultObj = new DataMap();
		resultObj.put("result", CommonConstant.Flag.success);
		resultObj.put("receiveMessageList",			receiveMessageList);
		resultObj.put("receiveMessageListTotCount",	receiveMessageListTotCount);

		return resultObj;
	}

	/**
	 * 신규 메시지 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> newMessageList(DataMap param) {
		return messageDAO.newMessageList(param);
	}

	/**
	 * 보낸 메세지 상세조회
	 * @param param
	 * @return
	 */
	public DataMap sendMessageDetail(DataMap param) {
		logger.debug("sendMessageDetail param["+param+"]");

		/* 보낸 메세지 상세정보 조회 */
		DataMap messageDetail = messageDAO.sendMessageDetail(param);

		/* 보낸 메세지 댓글 리스트 조회 */
		List<DataMap> replyList = replyDAO.replyList(param);

		/* 보낸 메세지 파일 리스트 조회 */
		param.put("file_parent_no",		messageDetail.getString("message_no"));
		List<DataMap> fileList = fileService.fileList(param);

		/* 보낸 메세지 상세확인시, 읽은상태정보 업데이트 없음 */

		DataMap resultObj = new DataMap();
		resultObj.put("messageDetail",			messageDetail);
		resultObj.put("replyList",				replyList);
		resultObj.put("fileList",				fileList);

		return resultObj;
	}

	/**
	 * 받은 메세지 상세조회
	 * @param param
	 * @return
	 */
	public DataMap executeReceiveMessageDetail(DataMap param) {
		logger.debug("receiveMessageDetail param["+param+"]");

		/*	받은메세지 상세조회시, receive_date 업데이트	*/
		messageDAO.updateMessageReceiveDate(param);

		/* 받은 메세지 상세정보 조회 */
		DataMap messageDetail = messageDAO.receiveMessageDetail(param);
		param.put("file_parent_no",		messageDetail.getString("message_no"));

		/* 받은 메세지 댓글 리스트 조회 */
		List<DataMap> replyList = replyDAO.replyList(param);

		/* 받은 메세지 파일 리스트 조회 */
		List<DataMap> fileList = fileService.fileList(param);

		DataMap resultObj = new DataMap();
		resultObj.put("result",						CommonConstant.Flag.success);
		resultObj.put("messageDetail",				messageDetail);
		resultObj.put("replyList",					replyList);
		resultObj.put("fileList",					fileList);

		return resultObj;
	}

	/**
	 * 학원내 사용자별 단건 혹은 다건 메세지 등록
	 * @param param
	 * @return
	 */
	public DataMap registMultiMessage(DataMap param) {
		logger.debug("registMultiMessage param["+param+"]");

		DevicePushData devicePushData = null;

		/* 보낸 메세지 기본 등록 */
		int resultInsertMessage = messageDAO.messageInsert(param);
		if (resultInsertMessage != 1) {
			throw new HKBandException("MessageDAO.messageInsert error");
		}

		long lastId = param.getLong("idx");
		param.put("message_no", lastId);

		/* 메세지 수신자 정보 셋팅 */
		String strUserNoList = (String)param.get("user_no_list");
		String [] userListArray = strUserNoList.split(",");

		List<DataMap> insertList = new ArrayList<DataMap>();

		for (String user_no : userListArray) {
			DataMap item = new DataMap();
			item.put("message_no",		param.get("message_no"));
			item.put("send_user_no",	param.get("send_user_no"));
			item.put("receive_user_no", user_no);
			item.put("hakwon_no",		param.get("hakwon_no"));

			insertList.add(item);
		}

		DataMap resultObj = new DataMap();

		if (insertList.size() == 0) {
			throw new HKBandException("MessageService.registMultiMessage error, empty [user_no_list]");
		}

		/* 메세지 수신자 등록 */
		int resultMulti = messageDAO.messageReceiverMultiInsert(insertList);
		if (resultMulti == userListArray.length) {
			resultObj.put("result", CommonConstant.Flag.success);
		} else {
			throw new HKBandException("MessageDAO.messageReceiverMultiInsert error some message");
		}

		/* 메세지 번호를 파일 부모번호로 입력 */
		param.put("file_parent_no", param.get("message_no"));

		/* 메세지 파일정보들 업데이트 */
		DataMap updateFile = new DataMap();
		if (StringUtil.isNotBlank( (String)param.get("file_no_list") )) {
			updateFile = fileService.updateFile(param);
		}

		resultObj.put("messageInsert",				resultInsertMessage);
		resultObj.put("messageReceiverMultiInsert", resultMulti);
		resultObj.put("resultUpdateFile",			updateFile.get("resultUpdateFile"));
		resultObj.put("updateFileCount",			updateFile.get("updateFileCount"));


		/*	메세지 받은 사용자 카운트 업데이트	*/
		int checkCount = messageDAO.updateMessageReceiverCount(param);
		if( checkCount != 1 ) {
			throw new HKBandException("updateMessageReceiverCount fail["+checkCount+"]");
		}

		/**
		 * 메세지 발송
		 */
		DataMap deviceParam = new DataMap();
		deviceParam.put("reciveUserNo", strUserNoList);
		List<UserDevice> deviceList = commonDAO.getUserDeviceToken(deviceParam);

		if( deviceList != null && deviceList.size() > 0 ) {
			PushMessage pushMessage = new PushMessage();
			pushMessage.setTicker("학원밴드 입니다.");
			pushMessage.setTitle("[메세지] " + param.getString("send_user_name")+"님께서 메세지를 보냈습니다.");
			pushMessage.setIos_title("[메세지] " + param.getString("send_user_name")+"님께서 메세지를 보냈습니다.");
			pushMessage.setContent(param.getString("title"));
			pushMessage.addCustomParam("hakwonNo", param.getString("hakwon_no"));
			pushMessage.setImage_url("");
			pushMessage.setLink_url("https://m.hakwonband.com/message.do?hakwonNo="+param.getString("hakwon_no"));

			devicePushData = new DevicePushData(pushMessage, deviceList);
			resultObj.put("devicePushData",	devicePushData);
		}

		return resultObj;
	}
}