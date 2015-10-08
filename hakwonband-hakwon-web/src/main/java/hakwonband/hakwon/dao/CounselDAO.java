package hakwonband.hakwon.dao;

import java.util.List;

import hakwonband.util.DataMap;

public interface CounselDAO {

	void insertCounsel(DataMap param);

	List<DataMap> selectCounselList(DataMap param);

	DataMap selectCounselDetail(DataMap param);

	List<DataMap> selectCounselFiles(DataMap param);

	void deleteCounsel(DataMap param);

	int selectCounselCount(DataMap param);

	List<DataMap> selectCounselee(DataMap param);

	void updateFileInfo(DataMap param);

	List<DataMap> selectParents(DataMap param);

	List<DataMap> selectChildren(DataMap param);

	/**
	 * 상담 업데이트
	 * @param param
	 * @return
	 */
	public int updateCounsel(DataMap param);
}