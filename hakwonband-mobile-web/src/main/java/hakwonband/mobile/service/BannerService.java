package hakwonband.mobile.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.mobile.dao.BannerDAO;
import hakwonband.util.DataMap;

/**
 * 베너 서비스
 * @author bumworld
 *
 */
@Service
public class BannerService {

	public static final Logger logger = LoggerFactory.getLogger(BannerService.class);

	@Autowired
	private BannerDAO bannerDAO;


	/**
	 * 학원 베너 리스트
	 * @return
	 */
	public List<DataMap> hakwonBannerList(DataMap param) {
		return bannerDAO.hakwonBannerList(param);
	}

	/**
	 * 지역 베너 리스트
	 * @return
	 */
	public List<DataMap> localBannerList(DataMap param) {
		return bannerDAO.localBannerList(param);
	}

}