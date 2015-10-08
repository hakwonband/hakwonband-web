package hakwonband.admin.service;

import hakwonband.admin.dao.ConfigDAO;
import hakwonband.common.exception.HKBandException;
import hakwonband.util.DataMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 설정 서비스
 * @author bumworld
 *
 */
@Service
public class ConfigService {

	public static final Logger logger = LoggerFactory.getLogger(ConfigService.class);

	@Autowired
	private ConfigDAO configDAO;

	/**
	 * 설정 조회
	 * @param param
	 * @return
	 */
	public String selectConfig(DataMap param) {
		return configDAO.selectConfig(param);
	}

	/**
	 * 설정 저장
	 * @param param
	 * @return
	 */
	public void updateConfig(DataMap param) {
		int checkCount = configDAO.updateConfig(param);
		if( checkCount != 1 ) {
			throw new HKBandException("checkCount ["+checkCount+"] param["+param+"]");
		}
	}
}