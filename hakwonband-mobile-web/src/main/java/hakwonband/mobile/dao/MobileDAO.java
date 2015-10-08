package hakwonband.mobile.dao;

import java.util.List;

import hakwonband.util.DataMap;


/**
 * 모바일 회원 DAO
 * @author jszzang9
 *
 */
public interface MobileDAO {

	/**
	 * 학원 검색
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonSearch(DataMap param);

	/**
	 * 학원 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> userHakwonList(DataMap param);

	/**
	 * 사용자 학원 반 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> allHakwonClassList(DataMap param);

	/**
	 * 자식 가입 학원 반 전체 목록
	 * @param param
	 * @return
	 */
	public List<DataMap> childHakwonClassList(DataMap param);


	/**
	 * 학생 학부모 승인 목록 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> parentApprovedYn(DataMap param);

	/**
	 * 학부모 승인
	 * @param param
	 * @return
	 */
	public int updateParentApproved(DataMap param);

	/**
	 * 학부모 승인 거절
	 * @param param
	 * @return
	 */
	public int deleteParentApproved(DataMap param);


	/**
	 * 학생 검색(id)
	 * @param param
	 * @return
	 */
	public DataMap studentSearch(DataMap param);

	/**
	 * 학원 상세
	 * @param param
	 * @return
	 */
	public DataMap selectHakwonDetail(DataMap param);

	/**
	 * 학원 멤버 가져오기
	 * @param param
	 * @return
	 */
	public DataMap selectHakwonMember(DataMap param);


	/**
	 * 학원 소개
	 * @param param
	 * @return
	 */
	public DataMap selectHakwonIntroduction(DataMap param);

	/**
	 * 학부모 신청
	 * @param param
	 * @return
	 */
	public int insertParentApproved(DataMap param);

	/**
	 * 반정보 상세
	 * @param param
	 * @return
	 */
	public DataMap selectClassDetail(DataMap param);

	/**
	 * 반 소속 선생님
	 * @param param
	 * @return
	 */
	public List<DataMap> selectClassTeacher(DataMap param);

	/**
	 * 학원 검색 라이크
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonSearchList(DataMap param);

	/**
	 * 학원 검색 카운트
	 */
	public int hakwonSearchListCount(DataMap param);

	/**
	 * 카테고리 네임
	 * @param param
	 * @return
	 */
	public List<DataMap> selectHakwonCateName(DataMap param);

	/**
	 * 학생 승인 체크
	 * @param param
	 * @return
	 */
	public DataMap selectCheckStudentParent(DataMap param);
}
