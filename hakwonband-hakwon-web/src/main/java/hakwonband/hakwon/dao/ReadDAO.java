package hakwonband.hakwon.dao;

import hakwonband.util.DataMap;

/**
 * 읽은 컨텐츠 DAO
 * @author jrlim
 *
 */
public interface ReadDAO {
	
	/**
	 * 컨텐츠 확인시 읽은 상태로 등록
	 * @param param
	 * @return
	 */
	public int insertContentRead(DataMap param);
	
	/**
	 * 기존 읽은상태 등록체크
	 * @param param
	 * @return
	 */
	public int contentReadCount(DataMap param);
}
