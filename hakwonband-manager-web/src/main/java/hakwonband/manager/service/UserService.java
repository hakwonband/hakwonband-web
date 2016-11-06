package hakwonband.manager.service;

import hakwonband.api.PushSend;
import hakwonband.common.exception.HKBandException;
import hakwonband.manager.common.constant.HakwonConstant;
import hakwonband.manager.dao.CommonDAO;
import hakwonband.manager.dao.MemberOutDAO;
import hakwonband.manager.dao.MessageSendDAO;
import hakwonband.manager.dao.UserDAO;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

import java.util.List;

import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 사용자 서비스
 * @author bumworld
 *
 */
@Service
public class UserService {

	public static final Logger logger = LoggerFactory.getLogger(UserService.class);

	@Autowired
	private UserDAO userDAO;

	@Autowired
	private CommonDAO commonDAO;

	@Autowired
	private MemberOutDAO memberOutDAO;

	@Autowired
	private MessageSendDAO messageSendDAO;

	/**
	 * 사용자 상세 정보
	 * @return
	 */
	public DataMap userDetail(DataMap param) {
		return userDAO.userDetail(param);
	}

	/**
	 * 정보 수정
	 * @param param
	 * @return
	 */
	public void updateUserInfo(DataMap param) {
		logger.debug("updateMasterInfo param["+param+"]");

		int resultUpdateUser = userDAO.updateUser(param);

		if (resultUpdateUser != 1) {
			throw new HKBandException("UserDAO.updateUser error");
		}

		int resultUpdateUserInfo = userDAO.updateUserInfo(param);

		if (resultUpdateUserInfo != 1) {
			throw new HKBandException("UserDAO.updateUserInfo error");
		}
	}

	/**
	 * 회원 탈퇴
	 * @param param
	 */
	public void memberOut(DataMap param) {

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

		/*	탈퇴 이력 등록	*/
		memberOutDAO.insertOutHist(param);
	}

	/**
	 * 사용자 알림 업데이트
	 * @param param
	 */
	public String updateUserAlarmOff(long user_no, int alarm_off_time) {

		String off_date = null;
		if( alarm_off_time == 0 ) {
			off_date = null;
		} else {
			DateTime dateTime = new DateTime().plusHours(alarm_off_time);
			off_date = dateTime.toString("yyyy-MM-dd HH:mm");
		}

		userDAO.updateUserAlarmOff(user_no, off_date);

		return off_date;
	}
}