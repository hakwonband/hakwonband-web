package hakwonband.admin.service;

import java.util.List;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import hakwonband.admin.dao.CommonDAO;
import hakwonband.admin.model.GoogleAuthModel;
import hakwonband.common.exception.HKBandException;
import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;
import hakwonband.util.HKBandUtil;
import net.sf.uadetector.ReadableUserAgent;

/**
 * 공통 서비스
 * @author bumworld
 *
 */
@Service
public class CommonService {

	public static final Logger logger = LoggerFactory.getLogger(CommonService.class);

	@Autowired
	private CommonDAO commonDAO;

	@Autowired
	private JavaMailSender naverWorksMailSender;

	/**
	 * DB에서 현재 시간 조회
	 * @return
	 */
	public String selectTime() {
		return commonDAO.selectTime();
	}

	/**
	 * 로그인
	 * @param param
	 * @return
	 */
	public DataMap executeLogin(DataMap param) {

		DataMap adminInfo = commonDAO.selectLoginInfo(param);

		if( adminInfo == null ) {
			return adminInfo;
		}

		if( param.isNotNull("deviceToken") ) {
			/*	디바이스 키가 존재 하는 경우 기존 디바이스에 물려있는 로그인 정보 삭제 한다.	*/
			int delCount = commonDAO.cleanDeviceLoginHist(param);
			logger.info("cleanDeviceLoginHist : " + delCount);
		}

		/*	로그인 이력 등록	*/
		String loginAuthKey = HKBandUtil.loginAuthKeyGen(param.getString("reqIpAddr"), adminInfo.getInt("user_no"), (ReadableUserAgent)param.getObject("userAgent"), param.getString("deviceType"));
		DataMap loginHis = new DataMap();
		loginHis.put("userNo",		adminInfo.getString("user_no"));
		loginHis.put("userType",	adminInfo.getString("user_type"));
		loginHis.put("loginIp",		param.getString("reqIpAddr"));
		loginHis.put("authKey",		loginAuthKey);
		loginHis.put("deviceToken",	param.getString("deviceToken"));
		loginHis.put("deviceType",	param.getString("deviceType"));

		/*	먼저 삭제 하고 이력 넣는다.	*/
		commonDAO.deleteLoginHis(loginHis);

		commonDAO.insertLoginHis(loginHis);

		/*	인증키 저장(쿠키에 저장하기 위해서)	*/
		adminInfo.put("authKey", loginAuthKey);

		return adminInfo;
	}

	/**
	 * 세션이 없는 경우에 쿠키 인증 체크
	 * @param param
	 * @return
	 */
	public DataMap executeAuthCheck(DataMap param) {
		return commonDAO.authCheckUser(param);
	}

	/**
	 * 문의 메일
	 *
	 * TODO 알림 보내야함
	 * @param param
	 */
	public void executeQuestionsMail(DataMap param) {
		//commonDAO.insertQuestionsMail(param);

		try {
			MimeMessage message = naverWorksMailSender.createMimeMessage();

			MimeMessageHelper messageHelper = new MimeMessageHelper(message, true, "UTF-8");
			messageHelper.setSubject(param.getString("title"));
			messageHelper.setTo(param.getString("email"));
			messageHelper.setText(param.getString("content"), true);

			naverWorksMailSender.send(message);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 로그 아웃
	 * @param param
	 * @return
	 */
	public void executeLogout(DataMap param) {
		commonDAO.deleteLoginHis(param);
	}

	/**
	 * 코드 리스트 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> getCodeList(DataMap param) {
		return commonDAO.getCodeList(param);
	}

	/**
	 * 앱 버전 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> getAppVersion() {
		return commonDAO.getAppVersion();
	}

	/**
	 * 사용자 로그인 이력의 푸시키 업데이트
	 * @param param
	 */
	public void updateDevicePushKey(DataMap param) {
		int updateCnt = commonDAO.loginUserDeviceTokenUpdate(param);
		logger.info("updateDevicePushKey["+updateCnt+"]");
	}

	/**
	 * 사용자 디바이스 정보
	 * @param param
	 * @return
	 */
	public List<UserDevice> getUserDevice(DataMap param) {
		return commonDAO.getUserDeviceToken(param);
	}

	/**
	 * 구글 인증 정보 업데이트
	 * @param googleAuthModel
	 */
	public void updateGoogleAuth(GoogleAuthModel googleAuthModel) {
		int cnt = commonDAO.googleAuthUpdate(googleAuthModel);
		if( cnt != 1 ) {
			throw new HKBandException(googleAuthModel.toString());
		}
	}

	/**
	 * youtube 사용 안함 처리
	 * @param file_no
	 */
	public void updateYoutubeDisable(String file_no) {
		int cnt = commonDAO.youtubeDisable(file_no);
		if( cnt != 1 ) {
			throw new HKBandException("update fail");
		}
	}
}