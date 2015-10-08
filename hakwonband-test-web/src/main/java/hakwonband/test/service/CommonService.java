package hakwonband.test.service;

import hakwonband.api.MailSend;
import hakwonband.test.dao.CommonDAO;
import hakwonband.util.DataMap;
import hakwonband.util.HKBandUtil;
import net.sf.uadetector.ReadableUserAgent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
	private MailSend mailSend;

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

		/*	로그인 이력 등록	*/
		String loginAuthKey = HKBandUtil.loginAuthKeyGen(param.getString("reqIpAddr"), userInfo.getInt("user_no"), (ReadableUserAgent)param.getObject("userAgent"), param.getString("deviceType"));
		DataMap loginHis = new DataMap();
		loginHis.put("userNo",		userInfo.getString("user_no"));
		loginHis.put("userType",	userInfo.getString("user_type"));
		loginHis.put("loginIp",		param.getString("reqIpAddr"));
		loginHis.put("authKey",		loginAuthKey);

		commonDAO.insertLoginHis(loginHis);

		/*	인증키 저장(쿠키에 저장하기 위해서)	*/
		userInfo.put("authKey", loginAuthKey);

		return userInfo;
	}

	/**
	 * 사용자 정보 조회
	 * @param param
	 * @return
	 */
	public DataMap getUserInfo(DataMap param) {
		return commonDAO.getUserInfo(param);
	}
}