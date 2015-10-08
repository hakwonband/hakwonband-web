package hakwonband.down.service;

import hakwonband.down.dao.CommonDAO;
import hakwonband.util.DataMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
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

	/**
	 * 세션이 없는 경우에 쿠키 인증 체크
	 * @param param
	 * @return
	 */
	public DataMap authCheck(DataMap param) {
		return commonDAO.authCheckUser(param);
	}

	/**
	 * 파일 정보
	 * @param param
	 * @return
	 */
	public DataMap fileInfo(DataMap param) {
		return commonDAO.fileInfo(param);
	}
}