package hakwonband.admin.dao;

import hakwonband.admin.model.HakwonExcel;
import hakwonband.util.DataMap;

import java.util.List;

public interface ExcelUploadDAO {

	void insertHakwon(HakwonExcel hakwonExcel);

	void insertHakwonInfo(HakwonExcel hakwonExcel);

	void insertHakwonAddress(HakwonExcel hakwonExcel);

	DataMap selectHakwonAddressInfo(HakwonExcel hakwonExcel);

	List<Integer> selectHakwonCate();

}
