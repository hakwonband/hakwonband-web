package hakwonband.hakwon.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 이벤트 DAO
 * @author jrlim
 *
 */
public interface EventDAO {

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
	 * 이벤트 상세
	 * @param param
	 * @return
	 */
	public DataMap eventDetail(DataMap param);

	/**
	 * 이벤트 참여 멤버 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> eventMemberList(DataMap param);

	/**
	 * 이벤트 등록
	 * @param param
	 * @return
	 */
	public int eventInsert(DataMap param);

	/**
	 * 이벤트 수정
	 * @param param
	 * @return
	 */
	public int eventUpdate(DataMap param);

	/**
	 * 이벤트 상태 삭제로 변경
	 * @param param
	 * @return
	 */
	public int eventDelete(DataMap param);

	/**
	 * 이벤트 완전 삭제
	 * @param param
	 * @return
	 */
	public int eventCompletelyRemove(DataMap param);

	/**
	 * 이벤트 참여자 카운트
	 * @param param
	 * @return
	 */
	public int eventMemberCount(DataMap param);


	/**
	 * 이벤트 참여자 목록 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> eventJoinUserList(DataMap param);

	/**
	 * 이벤트 참여자 카운트 확인
	 * @param param
	 * @return
	 */
	public int eventJoinUserListTotCount(DataMap param);

	/**
	 * 이벤트 푸시 발송 업데이트 처리
	 * @param param
	 * @return
	 */
	public int eventPushSendUpdate(DataMap param);

	/**
	 * 추천 받은 리스트
	 * @param event_no
	 * @return
	 */
	public List<DataMap> eventRecommendList(long event_no);
}