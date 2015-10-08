package hakwonband.hakwon.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.hakwon.dao.CommonDAO;
import hakwonband.hakwon.dao.SignUpDAO;
import hakwonband.hakwon.util.HakwonUtilSupportBox;
import hakwonband.util.DataMap;
/**
 * User Service
 * @author jszzang9
 *
 */
@Service
public class SignUpService {

	public static final Logger logger = LoggerFactory.getLogger(SignUpService.class);

	@Autowired
	private SignUpDAO signupDAO;

	@Autowired
	private CommonDAO commonDAO;

	/**
	 * User Id 찾기.
	 * @param param
	 * @return
	 */
	public DataMap getUserFindId(DataMap param) {
		DataMap result =  signupDAO.selectIdSearch(param);

		if (result == null) {
			DataMap resultObj = new DataMap();
			resultObj.put("result", CommonConstant.Flag.notexist);
			return resultObj;
		}

		String userId = (String) result.get("user_id");
		result.put("result", CommonConstant.Flag.exist);
		result.put("user_id", HakwonUtilSupportBox.getInstance().replaceString(userId));
		return result;
	}

	/**
	 * 비밀번호 찾기시, 아이디, 이름, 전화번호로 사용자 정보 체크
	 * @param param
	 * @return
	 */
	public DataMap getPwdUserInfoCheck(DataMap param) {
		return signupDAO.pwdUserInfoCheck(param);
	}

	/**
	 * 비밀번호 정보 업데이트
	 * @param param
	 * @return
	 */
	public DataMap updateForUserPasswd(DataMap param) {

		int updateForUserInfo = signupDAO.updateForUserPasswd(param);

		if (updateForUserInfo != 1) {
			throw new HKBandException("SignUpDAO.updateForUserPasswd error");
		}

		DataMap result = new DataMap();
		result.put("resultUpdate",	updateForUserInfo);
		result.put("result",		CommonConstant.Flag.success);

		return result;
	}

	/**
	 * 회원 아이디 중복 체크
	 * @param param
	 * @return
	 */
	public DataMap checkUserId(DataMap param) {
		logger.debug("checkUserId param["+param+"]");

		int checkUserId = signupDAO.checkUserId(param);
		DataMap resultObj = new DataMap();

		if (checkUserId == 0) {
			resultObj.put("result", CommonConstant.Flag.notexist);
		} else {
			resultObj.put("result", CommonConstant.Flag.exist);
		}

		return resultObj;
	}

	/**
	 * 이메일 중복 체크
	 * @param param
	 * @return
	 */
	public DataMap checkEmail(DataMap param) {
		logger.debug("checkEmail param["+param+"]");

		int checkEmail = signupDAO.checkEmail(param);
		DataMap resultObj = new DataMap();

		if (checkEmail == 0) {
			resultObj.put("result", CommonConstant.Flag.notexist);
		} else {
			resultObj.put("result", CommonConstant.Flag.exist);
		}

		return resultObj;
	}

	/**
	 * 학원코드로 학원검색
	 * @param param
	 * @return
	 */
	public DataMap searchHakwonCode(DataMap param) {
		logger.debug("searchHakwonCode param["+param+"]");

		DataMap searchHakwonCode = signupDAO.searchHakwonCode(param);
		DataMap resultObj = new DataMap();

		if (searchHakwonCode == null) {
			resultObj.put("result", CommonConstant.Flag.notexist);
		} else {
			resultObj.put("result", CommonConstant.Flag.exist);
		}
		resultObj.put("hakwonInfo", searchHakwonCode);

		return resultObj;
	}

	/**
	 * 원장, 선생님 회원가입
	 * @param param
	 * @return
	 */
	public DataMap registHakwonUser(DataMap param) {
		logger.debug("registHakwonUser param["+param+"]");

		int resultUser		= 0;
		int resultUserInfo	= 0;
		int resultTeachear	= 0;

		/* tb_user 기본 정보 등록 */
		resultUser = signupDAO.insertUser(param);
		if (resultUser != 1) {
			throw new HKBandException("SignUpDAO.insertUser error");
		}

		long lastId = param.getLong("idx");
		param.put("user_no", lastId);

		/* tb_user_info 부가 정보 등록 */
		resultUserInfo = signupDAO.insertUserInfo(param);
		if (resultUserInfo != 1) {
			throw new HKBandException("SignUpDAO.insertUserInfo error");
		}

		/* 선생님 가입시 tb_hakwon_teacher 학원에 선생님 등록 신청 */
		if (param.get("user_type").equals("004")) {
			resultTeachear = signupDAO.insertHakwonTeacher(param);
			if (resultTeachear != 1) {
				throw new HKBandException("SignUpDAO.insertHakwonTeacher error");
			}
		}

		DataMap resultObj = new DataMap();
		resultObj.put("registUser",				CommonConstant.Flag.success);
		resultObj.put("insertUser",				resultUser);
		resultObj.put("insertUserInfo",			resultUserInfo);
		if (param.get("user_type").equals("004")) {
			resultObj.put("insertHakwonTeacher",	resultTeachear);
		} else if (param.get("user_type").equals("003")) {
			/*	원장님 가입은 관리자에게 알림 메세지 보낸다.	*/
			/*
			 * 바로 승인 처리하기 때문에 따로 푸시 하지는 않는다.
			 */
		}

		return resultObj;
	}
}
