package hakwonband.test.service;

import hakwonband.common.exception.HKBandException;
import hakwonband.test.dao.ApiDAO;
import hakwonband.test.model.ApiForm;

import java.util.List;

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
public class ApiService {

	public static final Logger logger = LoggerFactory.getLogger(ApiService.class);

	@Autowired
	private ApiDAO apiDAO;

	/**
	 * api 등록
	 * @param param
	 */
	public long insertApi(ApiForm apiForm) {
		apiDAO.insertApi(apiForm);
		return apiForm.getApiNo();
	}

	/**
	 * api 수정
	 * @return
	 */
	public void modifyApi(ApiForm apiForm) {

		/**
		 * 이력 등록 쉽게 하려고 먼저 넣음
		 */
		int histInsertCount = apiDAO.insertApiHist(apiForm);
		logger.debug("histInsertCount {}", histInsertCount);
		if( histInsertCount != 1 ) {
			throw new HKBandException();
		}

		int updateCount = apiDAO.modifyApi(apiForm);
		logger.debug("updateCount {}", updateCount);
		if( updateCount != 1 ) {
			throw new HKBandException();
		}
	}

	/**
	 * api 리스트 조회
	 * @param apiForm
	 * @return
	 */
	public List<ApiForm> selectApiList(ApiForm apiForm) {
		return apiDAO.selectApiList(apiForm);
	}


	/**
	 * api 조회
	 * @param apiForm
	 * @return
	 */
	public ApiForm selectApi(ApiForm apiForm) {
		return apiDAO.selectApi(apiForm);
	}

	/**
	 * api 등록자 리스트
	 * @return
	 */
	public List<String> selectApiRegUserList() {
		return apiDAO.selectApiRegUserList();
	}
}