package hakwonband.hakwon.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

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
	public List<AllSearchResultModel> allSearch(@Param("user_no")long user_no, @Param("hakwon_no")long hakwon_no, @Param("user_type")String user_type, @Param("search_text")String search_text);
}