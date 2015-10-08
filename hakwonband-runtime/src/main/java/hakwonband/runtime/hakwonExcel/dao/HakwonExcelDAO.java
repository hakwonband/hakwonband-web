package hakwonband.runtime.hakwonExcel.dao;

import hakwonband.runtime.hakwonExcel.model.HakwonExcel;

public interface HakwonExcelDAO {

	String getTime();

	void insertHakwon(HakwonExcel hakwonExcel);

	void insertHakwonInfo(HakwonExcel hakwonExcel);

	void insertHakwonAddress(HakwonExcel hakwonExcel);

}
