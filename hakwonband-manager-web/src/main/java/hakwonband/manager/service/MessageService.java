package hakwonband.manager.service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.manager.dao.CommonDAO;
import hakwonband.manager.dao.FileDAO;
import hakwonband.manager.dao.MessageViewDAO;
import hakwonband.manager.dao.ReadDAO;
import hakwonband.manager.dao.ReplyDAO;
import hakwonband.util.DataMap;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 메세지 Service
 * @author jrlim
 */
@Service
public class MessageService {

	public static final Logger logger = LoggerFactory.getLogger(MessageService.class);

	@Autowired
	private MessageViewDAO messageViewDAO;

	@Autowired
	private ReadDAO readDAO;

	@Autowired
	private ReplyDAO replyDAO;

	@Autowired
	private FileDAO fileDAO;

	@Autowired
	private CommonDAO commonDAO;


	/**
	 * 받은 메세지 목록조회
	 * @param param
	 * @return
	 */
	public List<DataMap> receiveMessageList(DataMap param) {
		return messageViewDAO.receiveMessageList(param);
	}

	/**
	 * 받은 메세지 카운트 확인
	 * @param param
	 * @return
	 */
	public int receiveMessageListTotCount(DataMap param) {
		return messageViewDAO.receiveMessageListTotCount(param);
	}

	/**
	 * 신규 받은 메시지 카운트
	 * @param param
	 * @return
	 */
	public int newReceiveMessageCount(DataMap param) {

		return messageViewDAO.newReceiveMessageCount(param);
	}

	////////////////////////////////////////////////////////////////////////////////////////
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
				List<String> targetUserType = (List<String>)messageTarget.get("targetUserType");

				/**
				 * 사용자 타입 문자열로 변경
				 */
				String userTypeListStr = "";
				if( targetUserType != null && targetUserType.size() > 0 ) {
					for(int i=0; i<targetUserType.size(); i++) {
						String userType = targetUserType.get(i);
						if( "teacher".equals(userType) ) {
							userTypeListStr += " 선생님";
						} else if( "parent".equals(userType) ) {
							userTypeListStr += " 부모님";
						} else if( "student".equals(userType) ) {
							userTypeListStr += " 학생";
						} else if( "nonParent".equals(userType) ) {
							userTypeListStr += " 비회원 부모님";
						} else if( "nonStudent".equals(userType) ) {
							userTypeListStr += " 비회원 학생";
						}
					}
				}
				messageTarget.put("userTypeListStr", userTypeListStr);

				colData.put("messageTarget", messageTarget);
			} catch(Exception e) {
				throw new HKBandException(e);
			}
		}

		List<DataMap> receiveUserList = messageViewDAO.receiveUserList(messageDetail);
		colData.put("receiveUserList", receiveUserList);

		/* 보낸 메세지 파일 리스트 조회 */
		param.put("file_parent_type",	CommonConstant.File.TYPE_MESSAGE);
		param.put("file_parent_no",	messageDetail.getString("message_no"));
		List<DataMap> fileList = fileDAO.fileList(param);
		colData.put("fileList", fileList);

		/*	받은 대상들 읽기 여부 확인	*/

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

		/* 보낸 메세지 파일 리스트 조회 */
		param.put("file_parent_type",	CommonConstant.File.TYPE_MESSAGE);
		param.put("file_parent_no",	messageDetail.getString("message_no"));
		List<DataMap> fileList = fileDAO.fileList(param);
		colData.put("fileList", fileList);

		return colData;
	}

	/**
	 * 받은 메세지 상세
	 * @param param
	 * @return
	 */
	public DataMap executeReceiveMessageDetail(DataMap param) {
		DataMap colData = new DataMap();

		/*	메세지 상세	*/
		DataMap messageDetail = messageViewDAO.receiveMessageDetail(param);
		colData.put("messageDetail", messageDetail);

		/* 메세지 파일 리스트 조회 */
		param.put("file_parent_type",	CommonConstant.File.TYPE_MESSAGE);
		param.put("file_parent_no",	messageDetail.getString("message_no"));
		List<DataMap> fileList = fileDAO.fileList(param);
		colData.put("fileList", fileList);

		/*	읽은 시간 셋팅	*/
		messageViewDAO.updateMessageReceiveDate(param);

		return colData;
	}
}