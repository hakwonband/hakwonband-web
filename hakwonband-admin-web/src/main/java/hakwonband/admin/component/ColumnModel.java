package hakwonband.admin.component;

/**
 * 컬럼 모델
 * @author bumworld
 *
 */
public class ColumnModel {

	/**
	 * 헤더 이름
	 */
	private String headerName;

	/**
	 * 컬럼 이름
	 */
	private String columnName;

	public ColumnModel() {
	}

	public ColumnModel(String headerName, String columnName) {
		this.headerName = headerName;
		this.columnName = columnName;
	}

	public String getHeaderName() {
		return headerName;
	}
	public void setHeaderName(String headerName) {
		this.headerName = headerName;
	}
	public String getColumnName() {
		return columnName;
	}
	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}
}