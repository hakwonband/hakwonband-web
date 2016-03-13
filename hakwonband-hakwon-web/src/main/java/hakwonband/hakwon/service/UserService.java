package hakwonband.hakwon.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.exception.HKBandException;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.dao.CommonDAO;
import hakwonband.hakwon.dao.MasterDAO;
import hakwonband.hakwon.dao.MemberOutDAO;
import hakwonband.hakwon.dao.MessageSendDAO;
import hakwonband.hakwon.dao.TeacherDAO;
import hakwonband.hakwon.dao.UserDAO;
import hakwonband.hakwon.model.DevicePushData;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

/**
 * 회원 서비스
 * @author jrlim
 *
 */
@Service
public class UserService {

	public static final Logger logger = LoggerFactory.getLogger(UserService.class);

	@Autowired
	private UserDAO userDAO;

	@Autowired
	private MasterDAO masterDAO;

	@Autowired
	private TeacherDAO teacherDAO;

	@Autowired
	private MemberOutDAO memberOutDAO;

	@Autowired
	private CommonDAO commonDAO;

	@Autowired
	private MessageSendDAO messageSendDAO;

	/**
	 * 회원 상세정보
	 * @param param
	 * @return
	 */
	public DataMap userDetail(DataMap param) {
		logger.debug("userReqListTotCount param["+param+"]");

		return userDAO.userDetail(param);
	}

	/**
	 * 회원 개인정보 수정
	 * @param param
	 * @return
	 */
	public int editUser(DataMap param) {
		logger.debug("editUser param["+param+"]");

		return userDAO.updateUserInfo(param);
	}

	/**
	 * 회원 사용여부
	 * @param param
	 * @return
	 */
	public int editUseYn(DataMap param) {
		logger.debug("editUseYn param["+param+"]");

		return userDAO.updateUseYn(param);
	}

	/**
	 * 회원 단건 삭제
	 * @param param
	 * @return
	 */
	public int deleteUser(DataMap param) {
		logger.debug("deleteUser param["+param+"]");

		return userDAO.deleteUser(param);
	}

	/**
	 * 사용자 학원 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> userHakwonList(DataMap authUserInfo) {

		List<DataMap> hakwonList = null;
		if( authUserInfo.equals("user_type", HakwonConstant.UserType.WONJANG) ) {
			/*	원장님	*/
			DataMap param = new DataMap();
			param.put("master_user_no", authUserInfo.getString("user_no"));
			hakwonList = masterDAO.masterHakwonList(param);
		} else if( authUserInfo.equals("user_type", HakwonConstant.UserType.TEACHER) ) {
			/*	선생님	*/
			hakwonList = teacherDAO.teacherHakwonList(authUserInfo);
		}

		return hakwonList;
	}

	/**
	 * 회원 탈퇴
	 * @param param
	 */
	public DevicePushData memberOut(DataMap param) {
		DevicePushData devicePushData = null;


		/*	학원 리스트	*/
		List<DataMap> hakwonList = null;
		if( param.equals("user_type", HakwonConstant.UserType.WONJANG) ) {
			/*	원장님 학원 리스트	*/
			hakwonList = memberOutDAO.masterHakwonList(param);
		} else if( param.equals("user_type", HakwonConstant.UserType.TEACHER) ) {
			/*	선생님 학원 리스트	*/
			hakwonList = memberOutDAO.teacherHakwonList(param);
		}

		/**
		 * 사용자 삭제
		 * @param param
		 * @return
		 */
		int checkCount = memberOutDAO.delUser(param);
		logger.warn("delUser["+checkCount+"]");
		if( checkCount != 1 ) {
			throw new HKBandException("delUser["+checkCount+"]");
		}

		/**
		 * 사용자 정보 삭제
		 * @param param
		 * @return
		 */
		checkCount = memberOutDAO.delUserInfo(param);
		logger.warn("delUserInfo["+checkCount+"]");
		if( checkCount != 1 ) {
			throw new HKBandException("delUserInfo["+checkCount+"]");
		}

		/**
		 * 로그인 이력 삭제
		 * @param param
		 * @return
		 */
		checkCount = memberOutDAO.delLoginHist(param);
		logger.warn("delLoginHist["+checkCount+"]");

		/**
		 * 메세지 삭제
		 * @param param
		 * @return
		 */
		checkCount = memberOutDAO.delMessage(param);
		logger.warn("delMessage["+checkCount+"]");

		/**
		 * 받은 메세지 삭제
		 * @param param
		 * @return
		 */
		checkCount = memberOutDAO.delMessageReceiver(param);
		logger.warn("delMessageReceiver["+checkCount+"]");

		/**
		 * 읽은 컨텐츠 삭제
		 * @param param
		 * @return
		 */
		checkCount = memberOutDAO.delContentRead(param);
		logger.warn("delContentRead["+checkCount+"]");

		/**
		 * 파일 사용 안함 처리
		 * @param param
		 * @return
		 */
		checkCount = memberOutDAO.fileUnUsingUpdate(param);
		logger.warn("fileUnUsingUpdate["+checkCount+"]");

		if( param.equals("user_type", HakwonConstant.UserType.WONJANG) ) {
			checkCount = memberOutDAO.delMasterHakwonClass(param);
			logger.warn("delMasterHakwonClass["+checkCount+"]");

			checkCount = memberOutDAO.delMasterHakwonClassTeacher(param);
			logger.warn("delMasterHakwonClassTeacher["+checkCount+"]");

			checkCount = memberOutDAO.delMasterHakwonClassStudent(param);
			logger.warn("delMasterHakwonClassStudent["+checkCount+"]");

			checkCount = memberOutDAO.delMasterHakwonTeacher(param);
			logger.warn("delMasterHakwonTeacher["+checkCount+"]");

			checkCount = memberOutDAO.delMasterHakwonEvent(param);
			logger.warn("delMasterHakwonEvent["+checkCount+"]");

			checkCount = memberOutDAO.masterHakwonOut(param);
			logger.warn("masterHakwonOut["+checkCount+"]");

			for(int i=0; i<hakwonList.size(); i++) {
				DataMap hakwonInfo = hakwonList.get(i);

				/**
				 * 메세지 등록
				 */
				DataMap messageMap = new DataMap();
				String title = "학원휴원메세지:"+hakwonInfo.getString("hakwon_name");
				String preview_content = title;
				String content = "오늘부터 "+hakwonInfo.getString("hakwon_name")+" 학원 휴원합니다.<br/>그동안 "+hakwonInfo.getString("hakwon_name")+" 학원 학원밴드을 사랑해주신 학부모, 학생분들게 감사를 드립니다.";

				messageMap.put("title",			title);
				messageMap.put("preview_content", preview_content);
				messageMap.put("content",		content);
				messageMap.put("send_user_no",	"1");
				messageMap.put("group_yn",		"Y");
				messageMap.put("hakwon_no",		hakwonInfo.getString("hakwon_no"));
				messageMap.put("messageType",	"groupMember");

				if( param.isNotNull("reservationDate") && param.isNotNull("reservationTime") ) {
					messageMap.put("reservationDate",	param.getString("reservationDate") + " " + param.getString("reservationTime"));
					messageMap.put("reservationYn",		"Y");
				} else {
					messageMap.put("reservationYn",		"N");
				}


				messageSendDAO.messageInsert(messageMap);
				long messageNo = messageMap.getLong("idx");

				/*	받는 사용자 등록	*/
				DataMap receiverMap = new DataMap();
				receiverMap.put("message_no",		messageNo);
				receiverMap.put("hakwon_no",		hakwonInfo.getString("hakwon_no"));	//	원장님한테 보낸다.
				messageSendDAO.messageReceiverGroupInsertHakwonMember(receiverMap);

				/*	메세지 받은 사용자 카운트 업데이트	*/
				receiverMap.put("messageNo",		messageNo);
				messageSendDAO.updateMessageReceiverCount(receiverMap);


				/**
				 * 학생 및 학부모에게 메세지 전달
				 */
				List<UserDevice> deviceList = commonDAO.getHakwonMemberDeviceToken(hakwonInfo);
				PushMessage pushMessage = new PushMessage();
				pushMessage.setTicker("학원밴드");
				pushMessage.setTitle(title);
				pushMessage.setIos_title(title);
				pushMessage.setContent(content);
				pushMessage.setLink_url("https://m.hakwonband.com/message.do?hakwonNo=-1");

				devicePushData = new DevicePushData(pushMessage, deviceList);
			}

			/**
			 * 메세지 먼저 보내고 삭제
			 */
			checkCount = memberOutDAO.delMasterHakwonMember(param);
			logger.warn("delMasterHakwonMember["+checkCount+"]");

			/*	학원 삭제	*/
			checkCount = memberOutDAO.delMasterHakwon(param);
			logger.warn("delMasterHakwon["+checkCount+"]");
		} else if( param.equals("user_type", HakwonConstant.UserType.TEACHER) ) {
			/**
			 * 선생님
			 */
			/*	반에서 탈퇴	*/
			checkCount = memberOutDAO.delTeacherHakwonClassTeacher(param);
			logger.warn("delTeacherHakwonClassTeacher["+checkCount+"]");

			/*	학원에서 탈퇴	*/
			checkCount = memberOutDAO.delTeacherHakwonTeacher(param);
			logger.warn("delTeacherHakwonTeacher["+checkCount+"]");

			for(int i=0; i<hakwonList.size(); i++) {
				DataMap hakwonInfo = hakwonList.get(i);

				String content = "["+hakwonInfo.getString("hakwon_name")+"] "+param.getString("user_name") + " 선생님께서 학원밴드를 탈퇴 했습니다.";

				/**
				 * 메세지 등록
				 */
				DataMap messageMap = new DataMap();
				String title = param.getString("user_name") + " 선생님께서 학원밴드를 탈퇴 했습니다.";
				String preview_content = title;

				messageMap.put("title",			title);
				messageMap.put("preview_content", preview_content);
				messageMap.put("content",		content);
				messageMap.put("send_user_no",	"1");
				messageMap.put("group_yn",		"N");
				messageMap.put("hakwon_no",		hakwonInfo.getString("hakwon_no"));
				messageMap.put("messageType",	"single");

				messageSendDAO.messageInsert(messageMap);
				long messageNo = messageMap.getLong("idx");

				/*	받는 사용자 등록	*/
				DataMap receiverMap = new DataMap();
				receiverMap.put("message_no",		messageNo);
				receiverMap.put("hakwon_no",		hakwonInfo.getString("hakwon_no"));	//	원장님한테 보낸다.
				receiverMap.put("receive_user_no",	hakwonInfo.getString("master_user_no"));
				messageSendDAO.messageReceiverSingleInsert(receiverMap);

				/*	원장님 디바이스 리스트	*/
				hakwonInfo.put("receiveUserNo", hakwonInfo.getString("master_user_no"));
				List<UserDevice> deviceList = commonDAO.getUserDeviceToken(hakwonInfo);

				PushMessage pushMessage = new PushMessage();
				pushMessage.setTicker("학원밴드");
				pushMessage.setTitle("["+hakwonInfo.getString("hakwon_name")+"] 선생님께서 학원밴드를 탈퇴 했습니다.");
				pushMessage.setIos_title("["+hakwonInfo.getString("hakwon_name")+"] 선생님께서 학원밴드를 탈퇴 했습니다.");
				pushMessage.setContent(content);
				pushMessage.setLink_url("https://m.hakwonband.com/message.do?hakwonNo="+hakwonInfo.getString("hakwon_no"));

				devicePushData = new DevicePushData(pushMessage, deviceList);
			}
		}

		/*	탈퇴 이력 등록	*/
		memberOutDAO.insertOutHist(param);

		return devicePushData;
	}
}