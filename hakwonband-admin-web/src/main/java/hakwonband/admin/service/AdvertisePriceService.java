package hakwonband.admin.service;

import hakwonband.admin.dao.AdvertisePriceDAO;
import hakwonband.util.DataMap;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 광고 가격 서비스
 * @author bumworld
 *
 */
@Service
public class AdvertisePriceService {

	public static final Logger logger = LoggerFactory.getLogger(AdvertisePriceService.class);

	@Autowired
	private AdvertisePriceDAO advertisePriceDAO;


	/**
	 * 월별 가격 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> yearMonthPriceList(DataMap param) {
		return advertisePriceDAO.yearMonthPriceList(param);
	}

	/**
	 * 월별 가격 리스트 등록
	 * @param param
	 * @return
	 */
	public void insertMonthPrice(DataMap param) {

		/**
		 * 먼저 삭제
		 */
		advertisePriceDAO.deleteMonthPrice(param);

		/**
		 * 등록
		 */
		advertisePriceDAO.insertMonthPrice((List<DataMap>)param.get("priceList"));

		/**
		 * 이력 등록
		 */
		advertisePriceDAO.insertMonthPriceHist(param);
	}
}