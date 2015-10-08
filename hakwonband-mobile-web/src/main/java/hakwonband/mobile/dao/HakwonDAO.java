package hakwonband.mobile.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 학원 DAO
 * @author bumworld.kim
 *
 */
public interface HakwonDAO {

	/**
	 * 소속 학원 상세정보
	 * @param param
	 * @return
	 */
	public DataMap hakwonDetail(DataMap param);

	/**
	 * 선택 학원 학생 반 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonUserClassList(DataMap param);

	/**
	 * 학원 선생님 목록
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonTeacherList(DataMap param);

	/**
	 * 학생 소속 반 전체의 선생님 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> allClassTeacherList(DataMap param);

	/**
	 * 학부모의 학생 소속 반 전체의 선생님 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> parentAllClassTeacherList(DataMap param);

	/**
	 * 학원에서 멤버 삭제
	 * @param param
	 * @return
	 */
	public int deleteHakwonMember(DataMap param);

	/**
	 * 반 가입수 체크
	 * @param param
	 * @return
	 */
	public int selectClassStudent(DataMap param);

	/**
	 * 자식이 정회원인지 체크
	 * @param param
	 * @return
	 */
	public int checkChildHakwonMember(DataMap param);

	/**
	 * 메세지 이동 원장님 학원 번호
	 * @param param
	 * @return
	 */
	public DataMap messageMoveMasterHakwonInfo(DataMap param);

	/**
	 * 메세지 이동 선생님 학원 번호
	 * @param param
	 * @return
	 */
	public DataMap messageMoveTeacherHakwonInfo(DataMap param);
}