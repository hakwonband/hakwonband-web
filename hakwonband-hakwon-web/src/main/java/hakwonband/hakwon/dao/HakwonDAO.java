package hakwonband.hakwon.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 학원 DAO
 * @author bumworld.kim
 *
 */
public interface HakwonDAO {

	/**
	 * 학원 카테고리 리스트
	 * @return
	 */
	public List<DataMap> hakwonCateList();

	/**
	 * 학원 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonList(DataMap param);

	/**
	 * 학원 상세정보
	 * @param param
	 * @return
	 */
	public DataMap hakwonDetail(DataMap param);

	/**
	 * 학원 심플 정보
	 * @param param
	 * @return
	 */
	public DataMap hakwonSimpleDetail(DataMap param);

	/**
	 * 반 심플 정보
	 * @param param
	 * @return
	 */
	public DataMap classSimpleDetail(DataMap param);


	/**
	 * 학원 유저 COUNT
	 * @param param
	 * @return
	 */
	public DataMap hakwonUserCount(DataMap param);

	/**
	 * 학원내 반 목록 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonClassList(DataMap param);

	/**
	 * 학원내 반 목록 카운트
	 * @param param
	 * @return
	 */
	public int hakwonClassListTotCount(DataMap param);

	/**
	 * 반 상세정보
	 * @param param
	 * @return
	 */
	public DataMap hakwonClassDetail(DataMap param);

	/**
	 * 반소속 선생님 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> classTeacherList(DataMap param);

	/**
	 * 반소속 선생님 리스트 카운트
	 * @param param
	 * @return
	 */
	public int classTeacherListTotCount(DataMap param);

	/**
	 * 반 이름 검색
	 * @param param
	 * @return
	 */
	public List<DataMap> searchClassName(DataMap param);

	/**
	 * 반 이름 검색 카운트
	 * @param param
	 * @return
	 */
	public int searchClassNameTotCount(DataMap param);

	/**
	 * 반에 학생 등록
	 * @param param
	 * @return
	 */
	public int insertClassStudent(DataMap param);

	/**
	 * 반 소속 학생 등록
	 * @param param
	 * @return
	 */
	public int deleteClassStudent(DataMap param);

	/**
	 * 사용자 학원 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> userHakwonList(DataMap param);

	/**
	 * 학원 사용자 반 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonUserClassList(DataMap param);

	/**
	 * 공지사항 작성시 카테고리 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> noticeCateList(DataMap param);

	/**
	 * 학원 멤버 업데이트
	 * @param param
	 * @return
	 */
	public int updateHakwonMember(DataMap param);

	/**
	 * 대상 반 to String
	 * @param param
	 * @return
	 */
	public String hakwonClassListToString(DataMap param);

	/**
	 * 학원 소개 미리보기
	 * @param param
	 */
	public void insertPreviewIntro(DataMap param);
}