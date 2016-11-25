package hakwonband.admin.dao;

import java.util.List;

import hakwonband.admin.model.HakwonExcel;
import hakwonband.util.DataMap;

public interface ExcelUploadDAO {

	void insertHakwon(HakwonExcel hakwonExcel);

	void insertHakwonInfo(HakwonExcel hakwonExcel);

	void insertHakwonAddress(HakwonExcel hakwonExcel);

	DataMap selectHakwonAddressInfo(HakwonExcel hakwonExcel);

	List<Integer> selectHakwonCate();

}
