package hakwonband.mobile.service;

import java.util.List;

import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.mobile.common.constant.HakwonConstant;
import hakwonband.mobile.dao.HakwonDAO;
import hakwonband.mobile.dao.MemberOutDAO;
import hakwonband.mobile.dao.UserDAO;
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
	private HakwonDAO hakwonDAO;

	@Autowired
	private MemberOutDAO memberOutDAO;

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
	 * 회원 아이디 중복 체크
	 * @param param
	 * @return
	 */
	public DataMap checkUserId(DataMap param) {
		DataMap result = new DataMap();

		DataMap map = userDAO.checkUserId(param);

		if (map != null)
			result.put("result", "exist");
		else
			result.put("result", "notexist");

		logger.debug("checkUserId param["+param+"]");

		return result;
	}

	/**
	 * 이메일 중복 체크
	 * @param param
	 * @return
	 */
	public DataMap checkEmail(DataMap param) {
		DataMap result = new DataMap();

		DataMap map = userDAO.checkEmail(param);

		if (map != null)
			result.put("result", "exist");
		else
			result.put("result", "notexist");

		logger.debug("checkEmail param["+param+"]");

		return result;
	}

	/**
	 * 회원정보 등록
	 * @param param
	 */
	public void registUser(DataMap param) {
		logger.debug("registUser param["+param+"]");

		/* 사용자 기본정보 등록 */
		int resultUser = userDAO.insertUser(param);
		if (resultUser != 1) {
			throw new HKBandException("UserDAO.insertUser error");
		}

		long lastId = param.getLong("idx");
		param.put("user_no", lastId);

		/* 사용자 부가정보 등록 */
		int resultUserInfo = userDAO.insertUserInfo(param);
		if (resultUserInfo != 1) {
			throw new HKBandException("UserDAO.insertUserInfo error");
		}

		/* 학생 가입시 학교 및 학년 정보 등록 */
		if( param.equals("user_type", "006") ) {
			int resultSchool = userDAO.insertUserSchool(param);
			if (resultSchool != 1) {
				throw new HKBandException("UserDAO.insertUserSchool error");
			}
		}

		/* 회원 가입시 학원 등록을 같이 한 경우*/
		if (param.get("hakwon_codes") != null) {
			String hakwon_codes = (String) param.get("hakwon_codes");
			String[] hakwon_code = hakwon_codes.split(",");
			for (String putCode:hakwon_code) {
				param.put("hakwon_no", putCode);
				userDAO.insertHakwonMember(param);
			}
		}
	}

	/**
	 * 사용자가 특정 학원에 가입신청
	 * @param param
	 * @return
	 */
	public DataMap registHakwonMember(DataMap param) {
		/* 사용자가 학원 맴버로 가입 신청 */
		int resultHakwonMember = userDAO.insertHakwonMember(param);

		if (resultHakwonMember != 1) {
			throw new HKBandException("UserDAO.insertHakwonMember error");
		}

		DataMap resultObj = new DataMap();
		resultObj.put("result", CommonConstant.Flag.success);
		resultObj.put("insertHakwonMember", resultHakwonMember);

		return resultObj;
	}

	/**
	 * 회원 개인정보 수정
	 * @param param
	 * @return
	 */
	public DataMap editUser(DataMap param) {
		logger.debug("editUser param["+param+"]");

		DataMap resultObj = new DataMap();

		int updateUser = 0;

		/*	사용자 기본정보 수정	*/
		updateUser = userDAO.updateUser(param);
		if (updateUser != 1) {
			throw new HKBandException("UserDAO.updateUser error [" + param + "]");
		}

		/*	사용자 부가정보 수정	*/
		int updateUserInfo	= userDAO.updateUserInfo(param);
		if (updateUser != 1) {
			throw new HKBandException("UserDAO.updateUserInfo error [" + param + "]");
		}

		/*	학생일 경우 학교 정보 수정	*/
		if (param.get("user_type").equals("006")) {
			int updateUserSchool = userDAO.updateUserSchool(param);
			if (updateUserSchool != 1) {
				throw new HKBandException("UserDAO.updateUserSchool error [" + param + "]");
			}
			resultObj.put("updateUserSchool", updateUserSchool);
		}

		resultObj.put("result", 		CommonConstant.Flag.success);
		resultObj.put("updateUser", 	updateUser);
		resultObj.put("updateUserInfo", updateUserInfo);

		return resultObj;
	}

	/**
	 * 부모 리스트 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> parentList(DataMap param) {
		return userDAO.parentList(param);
	}

	/**
	 * 자식 리스트 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> childList(DataMap param) {
		return userDAO.childList(param);
	}

	/**
	 * 학교 정보
	 * @param param
	 * @return
	 */
	public DataMap schoolInfo(DataMap param) {
		return userDAO.schoolInfo(param);
	}

	/**
	 * 메제시 이동 원장님 학원 번호
	 * @param param
	 * @return
	 */
	public DataMap messageMoveHakwonInfo(DataMap param) {
		if( HakwonConstant.UserType.WONJANG.equals(param.getString("user_type")) ) {
			return hakwonDAO.messageMoveMasterHakwonInfo(param);
		} else if( HakwonConstant.UserType.TEACHER.equals(param.getString("user_type")) ) {
			return hakwonDAO.messageMoveTeacherHakwonInfo(param);
		} else {
			return null;
		}
	}

	/**
	 * 회원 탈퇴
	 * @param param
	 */
	public String insertAlarmOff(long user_no, int alarm_off_time) {

		String off_date = null;
		if( alarm_off_time == 0 ) {
			off_date = null;
		} else {
			DateTime dateTime = new DateTime().plusHours(alarm_off_time);
			off_date = dateTime.toString("yyyy-MM-dd HH:mm");
		}

		userDAO.insertUserAlarmOff(user_no, off_date);

		return off_date;
	}

	/**
	 * 회원 탈퇴
	 * @param param
	 */
	public void memberOut(DataMap param) {
		/**
		 * 반 학생 삭제
		 * @param param
		 * @return
		 */
		int checkCount = memberOutDAO.delHakwonClassStudent(param);
		logger.warn("delHakwonClassStudent["+checkCount+"]");

		/**
		 * 학원 멤버 삭제
		 * @param param
		 * @return
		 */
		checkCount = memberOutDAO.delHakwonMember(param);
		logger.warn("delHakwonMember["+checkCount+"]");

		/**
		 * 사용자 삭제
		 * @param param
		 * @return
		 */
		checkCount = memberOutDAO.delUser(param);
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
		 * 학생 부모 삭제
		 * @param param
		 * @return
		 */
		checkCount = memberOutDAO.delStudentParent(param);
		logger.warn("delStudentParent["+checkCount+"]");

		/**
		 * 학생 학교 정보 삭제
		 * @param param
		 * @return
		 */
		checkCount = memberOutDAO.delStudentSchool(param);
		logger.warn("delStudentSchool["+checkCount+"]");

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
		 * 이벤트 가입 삭제
		 * @param param
		 * @return
		 */
		checkCount = memberOutDAO.delEventUser(param);
		logger.warn("delEventUser["+checkCount+"]");

		/**
		 * 파일 사용 안함 처리
		 * @param param
		 * @return
		 */
		checkCount = memberOutDAO.fileUnUsingUpdate(param);
		logger.warn("fileUnUsingUpdate["+checkCount+"]");

		/**
		 * 탈퇴 이력 등록
		 */
		memberOutDAO.insertOutHist(param);
	}
}