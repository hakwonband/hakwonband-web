package hakwonband.manager.dao;

import hakwonband.util.DataMap;

import java.util.List;

/**
 * 파일 DAO
 * @author bumworld.kim
 *
 */
public interface FileDAO {

	/**
	 * 파일 등록
	 * @param param
	 * @return
	 */
	public long insertFile(DataMap param);

	/**
	 * 파일들을 사용 상태로 업데이트
	 * @param param
	 * @return
	 */
	public int usingUpdate(DataMap param);

	/**
	 * 파일들을 미사용 상태로 업데이트
	 * @param param
	 * @return
	 */
	public int unUsingUpdate(DataMap param);

	/**
	 * 파일 상태 삭제로 변경
	 * @param param
	 * @return
	 */
	public int deleteFile(DataMap param);

	/**
	 * 파일 정보 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> fileList(DataMap param);
	public List<DataMap> fileList2(DataMap param);

	/**
	 * 학원 로고 업데이트
	 * @param param
	 * @return
	 */
	public int updateHakwonLogo(DataMap param);

	/**
	 * 학원 반 로고 업데이트
	 * @param param
	 * @return
	 */
	public int updateHakwonClassLogo(DataMap param);
}