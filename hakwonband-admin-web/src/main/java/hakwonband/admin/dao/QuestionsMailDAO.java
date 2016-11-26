package hakwonband.admin.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 문의메일 DAO
 * @author bumworld.kim
 *
 */
public interface QuestionsMailDAO {

	/**
	 * 문의 메일 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> questionsMailList(DataMap param);

	/**
	 * 문의 메일 카운트
	 * @param param
	 * @return
	 */
	public int questionsMailCount(DataMap param);

	/**
	 * 문의 메일 상세
	 * @param param
	 * @return
	 */
	public DataMap questionsMailDetail(DataMap param);

}