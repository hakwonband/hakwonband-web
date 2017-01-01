package hakwonband.mobile.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 이벤트 DAO
 * @author jrlim
 *
 */
public interface EventDAO {

	/**
	 * 이벤트 대시보드 목록 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> eventDashList(DataMap param);

	/**
	 * 이벤트 목록 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> eventList(DataMap param);

	/**
	 * 이벤트 카운트 확인
	 * @param param
	 * @return
	 */
	public int eventListTotCount(DataMap param);

	/**
	 * 이벤트 추천받은 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> eventRecommendList(DataMap param);


	/**
	 * 이벤트 추천 받은 확인
	 * @param param
	 * @return
	 */
	public Integer eventRecommendListTotCount(DataMap param);

	/**
	 * 이벤트 상세
	 * @param param
	 * @return
	 */
	public DataMap eventDetail(DataMap param);

	/**
	 * 기존 이벤트 참여 검증
	 * @param param
	 * @return
	 */
	public int eventUserCheck(DataMap param);

	/**
	 * 사용자 이벤트 참여신청
	 * @param param
	 * @return
	 */
	public int insertEventUser(DataMap param);

	/**
	 * 사용자 참여한 이벤트 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> eventMyJoinList(DataMap param);

	/**
	 * 사용자 참여한 이벤트 리스트 카운트
	 * @param param
	 * @return
	 */
	public int eventMyJoinListTotCount(DataMap param);

	/**
	 * 이벤트 추천인 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> eventRecommendUserList(DataMap param);
}