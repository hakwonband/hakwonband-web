package hakwonband.hakwon.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.hakwon.dao.CommonDAO;
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

	/**
	 * 공통 코드 그룹 리스트
	 * @return
	 */
	public List<String> getCommonGrp() {
		return commonDAO.getCommonGrp();
	}

	/**
	 * 공통 코드 상세 리스트
	 * @param keyType
	 * @return
	 */
	public List<DataMap> getCommonCode(String keyType) {
		return commonDAO.getCommonCode(keyType);
	}

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

		DataMap userInfo = commonDAO.selectLoginInfo(param);

		if( userInfo == null ) {
			return userInfo;
		}

		if( param.isNotNull("deviceToken") ) {
			/*	디바이스 키가 존재 하는 경우 기존 디바이스에 물려있는 로그인 정보 삭제 한다.	*/
			int delCount = commonDAO.cleanDeviceLoginHist(param);
			logger.info("cleanDeviceLoginHist : " + delCount);
		}

		/*	로그인 이력 등록	*/
		String loginAuthKey = HKBandUtil.loginAuthKeyGen(param.getString("reqIpAddr"), userInfo.getInt("user_no"), (ReadableUserAgent)param.getObject("userAgent"), param.getString("deviceType"));
		DataMap loginHis = new DataMap();
		loginHis.put("userNo",		userInfo.getString("user_no"));
		loginHis.put("userType",	userInfo.getString("user_type"));
		loginHis.put("loginIp",		param.getString("reqIpAddr"));
		loginHis.put("authKey",		loginAuthKey);
		loginHis.put("deviceToken",	param.getString("deviceToken"));
		loginHis.put("deviceType",	param.getString("deviceType"));

		/*	먼저 삭제 하고 이력 넣는다.	*/
		commonDAO.deleteLoginHis(loginHis);

		commonDAO.insertLoginHis(loginHis);

		/*	인증키 저장(쿠키에 저장하기 위해서)	*/
		userInfo.put("authKey", loginAuthKey);

		return userInfo;
	}

	/**
	 * 세션이 없는 경우에 쿠키 인증 체크
	 * @param param
	 * @return
	 */
	public DataMap authCheck(DataMap param) {
		return commonDAO.authCheckUser(param);
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
	 * 앱 삭제시 로그아웃 처리 및 디바이스 정보 삭제
	 * @param param
	 */
	public void deleteApp(DataMap param) {

		/*	로그인 이력 삭제	*/
		commonDAO.deleteLoginHis(param);

		/*	디바이스 삭제	*/
		commonDAO.deviceDelete(param);
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
}