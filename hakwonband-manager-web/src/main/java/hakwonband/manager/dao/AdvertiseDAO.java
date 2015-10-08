package hakwonband.manager.dao;

import hakwonband.util.DataMap;

import java.util.List;

/**
 * 광고 dao
 * @author bumworld.kim
 *
 */
public interface AdvertiseDAO {

	/**
	 * 광고 요청 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> advertiseReqList(DataMap param);

	/**
	 * 광고 요청 카운트
	 * @param param
	 * @return
	 */
	public int advertiseReqTotCount(DataMap param);

	/**
	 * 광고 요청 상세
	 * @param param
	 * @return
	 */
	public DataMap advertiseReqDetail(DataMap param);


	/**
	 * 광고 요청 지역 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> advertiseReqLocalList(DataMap param);


	/**
	 * 등록된 광고 월별 가격 리스트
	 * @return
	 */
	public List<DataMap> hakwonRegMonthPriceList(DataMap param);

	/**
	 * 월별 가격 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> yearMonthPriceList(DataMap param);

	/**
	 * 최근 6개월 광고 금액 합계
	 * @param param
	 * @return
	 */
	public List<DataMap> sixMonthAmount(DataMap param);
}