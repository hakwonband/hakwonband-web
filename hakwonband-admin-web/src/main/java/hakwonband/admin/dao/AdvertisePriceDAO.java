package hakwonband.admin.dao;

import java.util.List;

import hakwonband.util.DataMap;


/**
 * 광고 가격 dao
 * @author bumworld.kim
 *
 */
public interface AdvertisePriceDAO {
	/**
	 * 월별 가격 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> yearMonthPriceList(DataMap param);

	/**
	 * 월별 가격 리스트 삭제
	 * @param param
	 * @return
	 */
	public int deleteMonthPrice(DataMap param);

	/**
	 * 월별 가격 리스트 등록
	 * @param param
	 * @return
	 */
	public int insertMonthPrice(List<DataMap> priceList);

	/**
	 * 월별 가격 리스트 이력 등록
	 * @param param
	 * @return
	 */
	public int insertMonthPriceHist(DataMap param);
}