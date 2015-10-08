package hakwonband.hakwon.dao;

import java.util.List;

import hakwonband.util.DataMap;

public interface ReceiptDAO {

	public void insertReceipt(DataMap param);

	public List<DataMap> selectStudent(DataMap param);

	public List<DataMap> selectReceiptList(DataMap param);

	public List<DataMap> selectReceiptListAll(DataMap param);

	public int selectReceiptCount(DataMap param);

	public List<DataMap> selectClassList(DataMap param);

	public DataMap selectReceiptDetail(DataMap param);

	public void updateReceipt(DataMap param);

	public void deleteReceipt(DataMap param);

	public List<String> selectReceiptYear(DataMap param);

	public void insertReceiptMonth(DataMap param);

	public List<DataMap> selectReceiptYearList(DataMap param);

	public List<DataMap> selectReceiptYearListAll(DataMap param);

	public int selectTotalStudentCount(DataMap param);

	public List<String> selectReceiptMonth(DataMap param);

	public void deleteReceiptMonth(DataMap param);

	public List<DataMap> selectInAndOutMoneySum(DataMap param);

	public void yearMonthInsert(DataMap param);
}