package hakwonband.down.dao;

import hakwonband.util.DataMap;

public interface CommonDAO {


	/**
	 * 인증 체크 유저
	 * @param param
	 * @return
	 */
	public DataMap authCheckUser(DataMap param);

	/**
	 * 파일 정보
	 * @param param
	 * @return
	 */
	public DataMap fileInfo(DataMap param);
}