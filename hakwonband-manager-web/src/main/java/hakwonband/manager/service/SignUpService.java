package hakwonband.manager.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.manager.dao.CommonDAO;
import hakwonband.manager.dao.SignUpDAO;
import hakwonband.manager.model.DevicePushData;
import hakwonband.manager.util.HakwonUtilSupportBox;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
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
	 * 매니저 회원가입
	 * @param param
	 * @return
	 */
	public DevicePushData registHakwonManager(DataMap param) {
		logger.debug("registHakwonManager param["+param+"]");

		DevicePushData devicePushData = null;

		/* tb_user 기본 정보 등록 */
		int resultUser = signupDAO.insertUser(param);
		if (resultUser != 1) {
			throw new HKBandException("SignUpDAO.insertUser error");
		}

		long lastId = param.getLong("idx");
		param.put("user_no", lastId);

		/* tb_user_info 부가 정보 등록 */
		int resultUserInfo = signupDAO.insertUserInfo(param);
		if (resultUserInfo != 1) {
			throw new HKBandException("SignUpDAO.insertUserInfo error");
		}

		/*	매니저 등록	*/
		signupDAO.insertManager(param);
		long managerNo = param.getLong("id");
		logger.debug("manager_no : " + managerNo);

		List<UserDevice> deviceList = commonDAO.getAdminDeviceToken();

		String content = param.getString("user_name")+"님께서 매니저로 학원밴드를 가입 했습니다.";
		PushMessage pushMessage = new PushMessage();
		pushMessage.setTicker("학원밴드 입니다.");
		pushMessage.setTitle("매니저 가입 요청");
		pushMessage.setContent(content);
		pushMessage.setLink_url("https://admin.hakwonband.com/main.do#/master/requestList");

		devicePushData = new DevicePushData(pushMessage, deviceList);


		return devicePushData;
	}
}
