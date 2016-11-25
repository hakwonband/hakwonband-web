package hakwonband.admin.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 학원 DAO
 * @author bumworld
 *
 */
public interface HakwonDAO {


	/**
	 * 학원 리스트
	 * @return
	 */
	public List<DataMap> hakwonList(DataMap param);

	/**
	 * 학원 카운트
	 * @param param
	 * @return
	 */
	public int hakwonCount(DataMap param);

	/**
	 * 학원 등록
	 * @param param
	 */
	public void insertHakwon(DataMap param);

	/**
	 * 학원 정보 등록
	 * @param param
	 */
	public void insertHakwonInfo(DataMap param);

	/**
	 * 학원 주소 등록
	 * @param param
	 */
	public void insertHakwonAddress(DataMap param);

	/**
	 * 학원 주소 체크
	 * @param param
	 * @return
	 */
	public int hakwonAddressCheck(DataMap param);

	/**
	 * 학원 상세 정보
	 * @return
	 */
	public DataMap hakwonInfo(DataMap param);


	/**
	 * 학원 수정
	 * @param param
	 */
	public int modifyHakwon(DataMap param);

	/**
	 * 학원 정보 수정
	 * @param param
	 */
	public int modifyHakwonInfo(DataMap param);

	/**
	 * 학원 주소 삭제
	 * @param param
	 */
	public int deleteHakwonAddress(DataMap param);

	/**
	 * 학원 삭제
	 * @param param
	 */
	public int deleteHakwon(DataMap param);

	/**
	 * 학원 정보 삭제
	 * @param param
	 */
	public int deleteHakwonInfo(DataMap param);

	/**
	 * 사용자 학원 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> userHakwonList(DataMap param);


	/**
	 * 학원 반 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonClassList(DataMap param);

	/**
	 * 학원 리스트 to String
	 * @param param
	 * @return
	 */
	public String hakwonListToString(DataMap param);

	/**
	 * 학원 상태 업데이트
	 * @return
	 */
	public int hakwonStatusUpdate(DataMap param);

	/**
	 * 학원 소개 미리보기
	 * @param param
	 */
	public void insertPreviewIntro(DataMap param);


	/**
	 * 학원 소개 수정 및 등록
	 * @param param
	 * @return
	 */
	public int updateHakwonIntro(DataMap param);
}