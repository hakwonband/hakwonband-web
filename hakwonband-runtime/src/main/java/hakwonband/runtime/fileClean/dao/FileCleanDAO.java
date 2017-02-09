package hakwonband.runtime.fileClean.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import hakwonband.util.DataMap;

/**
 * 파일 관리 DAO
 * @author bumworld
 *
 */
@Repository
public interface FileCleanDAO {

	/**
	 * 사용하지 않는 파일 리스트
	 * @return
	 */
	public List<DataMap> getUnUsingFileList();

	/**
	 * 파일 삭제
	 * @param param
	 * @return
	 */
	public int unUsingFileDelete(DataMap param);
}