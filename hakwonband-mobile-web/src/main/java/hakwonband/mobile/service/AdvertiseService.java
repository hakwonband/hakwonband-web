package hakwonband.mobile.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.mobile.dao.AdvertiseDAO;
import hakwonband.util.DataMap;

/**
 * 광고 서비스
 * @author bumworld
 *
 */
@Service
public class AdvertiseService {

	public static final Logger logger = LoggerFactory.getLogger(AdvertiseService.class);

	@Autowired
	private AdvertiseDAO advertiseDAO;

	/**
	 * 지역 광고 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> areaList(DataMap param) {
		return advertiseDAO.areaList(param);
	}

	/**
	 * 공통 광고 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> commList(DataMap param) {
		return advertiseDAO.commList(param);
	}

	/**
	 * 블럭 광고 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> blockList(DataMap param) {
		return advertiseDAO.blockList(param);
	}
}