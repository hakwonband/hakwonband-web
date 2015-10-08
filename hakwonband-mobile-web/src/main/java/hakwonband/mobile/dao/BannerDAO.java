package hakwonband.mobile.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 베너 dao
 * @author bumworld
 *
 */
public interface BannerDAO {


	/**
	 * 학원 베너 리스트
	 *
	 * TODO 학원과 동일한 카테고리의 광고는 제거 하도록 쿼리 수정
	 * @return
	 */
	public List<DataMap> hakwonBannerList(DataMap param);

	/**
	 * 지역 베너 리스트
	 * @return
	 */
	public List<DataMap> localBannerList(DataMap param);

}