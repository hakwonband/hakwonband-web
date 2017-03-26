package hakwonband.hakwon.dao;

import java.util.List;

import hakwonband.hakwon.model.AllSearchModel;
import hakwonband.hakwon.model.AllSearchResultModel;

/**
 * 전체 검색 DAO
 * @author bumworld.kim
 *
 */
public interface AllSearchDAO {

	/**
	 * 전체 검색
	 * @param param
	 * @return
	 */
	public List<AllSearchResultModel> allSearch(AllSearchModel allSearchModel);

	/**
	 * 전체 검색 카운트
	 * @param param
	 * @return
	 */
	public int allSearchCount(AllSearchModel allSearchModel);
}