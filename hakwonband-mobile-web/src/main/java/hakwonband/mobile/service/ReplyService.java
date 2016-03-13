package hakwonband.mobile.service;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.mobile.common.constant.HakwonConstant;
import hakwonband.mobile.dao.CommonDAO;
import hakwonband.mobile.dao.MessageDAO;
import hakwonband.mobile.dao.ReplyDAO;
import hakwonband.mobile.model.DevicePushData;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

/**
 * 댓글 서비스
 * @author jrlim
 */
@Service
public class ReplyService {

	public static final Logger logger = LoggerFactory.getLogger(ReplyService.class);

	@Autowired
	private ReplyDAO replyDAO;

	@Autowired
	private MessageDAO messageDAO;

	@Autowired
	private CommonDAO commonDAO;

	/**
	 * 댓글 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> replyList(DataMap param) {
		logger.debug("replyList param["+param+"]");

		/* 댓글 목록 */
		return replyDAO.replyList(param);
	}

	/**
	 * 신규 댓글 리스트 카운트
	 * @param param
	 * @return
	 */
	public DataMap newReplyList(DataMap param) {
		logger.debug("newReplyList param["+param+"]");

		/* 신규 댓글 목록 */
		List<DataMap> newReplyList = replyDAO.newReplyList(param);

		DataMap resultObj = new DataMap();
		resultObj.put("result", 			CommonConstant.Flag.success);
		resultObj.put("replyList", 			newReplyList);

		return resultObj;
	}

	/**
	 * 댓글 등록
	 * @param param
	 * @return
	 */
	public DataMap registReply(DataMap param) {
		logger.debug("registReply param["+param+"]");

		DevicePushData devicePushData = null;

		int resultInsert = replyDAO.replyInsert(param);
		if (resultInsert != 1) {
			throw new HKBandException("ReplyDAO.replyInsert error");
		}

		if( param.equals("content_type", "002") ) {
			/*	메세지	*/

			DataMap messageParam = new DataMap();
			messageParam.put("receive_no", param.getString("content_parent_no"));

			DataMap messageUserInfo = messageDAO.messageUserInfo(messageParam);
			String receiveUserNo = "";
			String receiveUserType = "";
			String messageType = "";
			/*	보낸 사람이면 받는 사람에게/받는 사람이면 보낸 사람에게	*/
			if( messageUserInfo.equals("receive_user_no", param.getString("reg_user_no")) ) {
				/*	받은 메세지	*/
				receiveUserNo = messageUserInfo.getString("send_user_no");
				receiveUserType = messageUserInfo.getString("send_user_type");
				messageType = "send";
			} else if( messageUserInfo.equals("send_user_no", param.getString("reg_user_no")) ) {
				/*	보낸 메세지	*/
				receiveUserNo = messageUserInfo.getString("receive_user_no");
				receiveUserType = messageUserInfo.getString("receive_user_type");
				messageType = "receive";
			}
			if( StringUtils.isBlank(receiveUserNo) ) {
				throw new HKBandException("registReply receiveUserNo is null");
			}

			messageParam.put("receiveUserNo", receiveUserNo);
			List<UserDevice> deviceList = commonDAO.getUserDeviceTokenOne(messageParam);
			logger.info("executeTeacherMessageSend deviceList["+deviceList+"]");

			String hakwonNo		= messageUserInfo.getString("hakwon_no");
			String receiveNo	= messageUserInfo.getString("receive_no");

			if( deviceList != null && deviceList.size() > 0 ) {
				PushMessage pushMessage = new PushMessage();
				pushMessage.setTicker("학원밴드 입니다.");
				pushMessage.setTitle("[메세지 댓글] 학원밴드에서 메세지를 보냈습니다.");
				pushMessage.setIos_title("[메세지 댓글] "+messageUserInfo.getString("title"));
				pushMessage.setContent(messageUserInfo.getString("title")+"에 댓글이 달렸습니다.");

				if( HakwonConstant.UserType.ADMIN.equals(receiveUserType) ) {
					/*	학생/학부모는 관리자가 보내는것밖에는 없다.	*/
					pushMessage.setLink_url("https://admin.hakwonband.com/main.do#/message/sendSingleMessageDetail?receiveNo="+receiveNo);
				} else if( HakwonConstant.UserType.WONJANG.equals(receiveUserType) || HakwonConstant.UserType.TEACHER.equals(receiveUserType) ) {
					if( "receive".equals(messageType) ) {
						pushMessage.setLink_url("https://hakwon.hakwonband.com/main.do#/message/receiveMessageDetail?hakwon_no="+hakwonNo+"&receiveNo="+receiveNo);
					} else if( "send".equals(messageType) ) {
						pushMessage.setLink_url("https://hakwon.hakwonband.com/main.do#/message/sendSingleMessageDetail?hakwon_no="+hakwonNo+"&receiveNo="+receiveNo);
					}
				} else if( HakwonConstant.UserType.STUDENT.equals(receiveUserType) || HakwonConstant.UserType.PARENT.equals(receiveUserType) ) {
					pushMessage.setLink_url("https://m.hakwonband.com/index.do#/messageDetail?receive_no="+receiveNo+"&type="+messageType);
				}

				devicePushData = new DevicePushData(pushMessage, deviceList);
			}
		}

		DataMap resultObj = new DataMap();
		resultObj.put("result",			CommonConstant.Flag.success);
		resultObj.put("replyInsert",	resultInsert);
		resultObj.put("devicePushData",	devicePushData);

		return resultObj;
	}

	/**
	 * 댓글 삭제
	 * @param param
	 * @return
	 */
	public DataMap deleteReply(DataMap param) {
		logger.debug("editReply param["+param+"]");

		int resultDelete = replyDAO.replyDelete(param);

		if (resultDelete != 1) {
			throw new HKBandException("ReplyDAO.replyDelete error");
		}

		DataMap resultObj = new DataMap();
		resultObj.put("result", CommonConstant.Flag.success);
		resultObj.put("replyDelete", resultDelete);

		return resultObj;
	}

}