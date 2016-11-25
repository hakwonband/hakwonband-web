package hakwonband.admin.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 테스트 DAO
 * @author bumworld
 *
 */
public interface TestDAO {


	/**
	 * 학원 멤버 리스트
	 * @return
	 */
	public List<DataMap> hakwonMemberList();


	/**
	 * 멤버 체크
	 * @return
	 */
	public String hakwonMemberCheck(DataMap param);

	/**
	 * 업데이트
	 * @param param
	 */
	public int updateHakwonMember(DataMap param);

	/**
	 * 자식 학원 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> childHakwonList();

	/**
	 * 학부모 학원에 가입
	 * @param param
	 * @return
	 */
	public int parentHakwonInsert(DataMap param);
}