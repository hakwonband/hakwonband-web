package hakwonband.hakwon.component;

import java.util.List;

import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 시트 모델
 * @author bumworld
 *
 */
public class SheetModel {

	/**
	 * 데이타 리스트
	 */
	private List<DataMap> dataList;

	/**
	 * 컬럼 리스트
	 */
	private List<ColumnModel> columnList;

	/**
	 * 시트 이름
	 */
	private String sheetName;

	public SheetModel() {
	}

	public SheetModel(List<DataMap> dataList, List<ColumnModel> columnList) {
		this.dataList = dataList;
		this.columnList = columnList;
	}

	public SheetModel(List<DataMap> dataList, List<ColumnModel> columnList, String sheetName) {
		this.dataList = dataList;
		this.columnList = columnList;
		this.sheetName = sheetName;
	}

	public String getSheetName() {
		if( StringUtil.isBlank(sheetName) ) {
			return "학원밴드";
		} else {
			return sheetName;
		}
	}
	public void setSheetName(String sheetName) {
		this.sheetName = sheetName;
	}
	public List<DataMap> getDataList() {
		return dataList;
	}
	public void setDataList(List<DataMap> dataList) {
		this.dataList = dataList;
	}
	public List<ColumnModel> getColumnList() {
		return columnList;
	}
	public void setColumnList(List<ColumnModel> columnList) {
		this.columnList = columnList;
	}
}