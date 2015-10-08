package hakwonband.manager.service;

import hakwonband.manager.dao.AdvertiseDAO;
import hakwonband.util.DataMap;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
	 * 광고 요청 상세
	 * @param param
	 * @return
	 */
	public DataMap advertiseReqDetail(DataMap param) {
		return advertiseDAO.advertiseReqDetail(param);
	}

	/**
	 * 광고 요청 리스트
	 * @param param
	 * @return
	 */
	public DataMap advertiseReqList(DataMap param) {
		DataMap colData = new DataMap();

		logger.debug("advertiseReqList param : " + param);

		/*	요청 리스트	*/
		List<DataMap> advertiseReqList = advertiseDAO.advertiseReqList(param);
		colData.put("advertiseReqList",	advertiseReqList);

		/*	요청 카운트	*/
		int advertiseReqCount = advertiseDAO.advertiseReqTotCount(param);
		colData.put("advertiseReqCount",	advertiseReqCount);

		return colData;
	}

	/**
	 * 요청 상세 정보
	 * @param param
	 * @return
	 */
	public DataMap reqDetailData(DataMap param) {

		DataMap reqDetail = advertiseDAO.advertiseReqDetail(param);
		if( reqDetail == null ) {
			return null;
		}
		List<DataMap> advertiseReqLocalList = advertiseDAO.advertiseReqLocalList(param);
		reqDetail.put("advertiseReqLocalList", advertiseReqLocalList);

		/*	월별 가격 리스트	*/
		List<DataMap> monthPriceList = advertiseDAO.hakwonRegMonthPriceList(param);
		reqDetail.put("monthPriceList", monthPriceList);

		return reqDetail;
	}

	/**
	 * 월별 가격 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> yearMonthPriceList(DataMap param) {
		return advertiseDAO.yearMonthPriceList(param);
	}
}