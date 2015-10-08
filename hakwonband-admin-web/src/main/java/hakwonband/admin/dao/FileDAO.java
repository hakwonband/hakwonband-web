package hakwonband.admin.dao;

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
	 * 파일들을 소유한 부모번호 업데이트
	 * @param param
	 * @return
	 */
	public int usingUpdate(DataMap param);

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

	/**
	 * 파일 리스트 카운트
	 * @param param
	 * @return
	 */
	public int fileReqListTotCount(DataMap param);

	/**
	 * 파일들을 미사용 상태로 업데이트
	 * @param param
	 * @return
	 */
	public int unUsingUpdate(DataMap param);

}