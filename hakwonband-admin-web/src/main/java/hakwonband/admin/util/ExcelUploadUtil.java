package hakwonband.admin.util;

import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import hakwonband.admin.model.HakwonExcel;
import net.logstash.logback.encoder.org.apache.commons.lang.RandomStringUtils;

public class ExcelUploadUtil {

	public static List<Integer> cateList = null;							// 양의 정수 타입의 카테고리 리스트
	private String filePath;												// 엑셀 파일 경로
	private List<String> invalidList = new ArrayList<String>();				// 잘못된 데이터 리스트
	private List<HakwonExcel> hakwonList = new ArrayList<HakwonExcel>();	// 정상적인 학원 데이터 리스트
	private String fileExt;													// 파일 확장자

	public List<String> getInvalidList() {
		return this.invalidList;
	}

	public List<HakwonExcel> getHakwonList() {
		return this.hakwonList;
	}

	public void setFileExt(String fileExt) {
		this.fileExt = fileExt;
	}

	public void setFilePath(String filePath) throws Exception {
		this.filePath = filePath;
	}

	/**
	 * 엑셀파일 확장자에 맞는 read() 함수 호출
	 * @throws Exception
	 */
	public void setExcelData() throws Exception {
		if("xlsx".equals(fileExt)) {
			readXlsxFile();
		} else if("xls".equals(fileExt))  {
			readXlsFile();
		} else {
			throw new Exception("엑셀 파일이 아닙니다.");
		}
	}

	public void setCateList(List<Integer> cateList) {
		this.cateList = cateList;
	}

	public String getDataCount() {
		return String.valueOf(hakwonList.size());
	}

	private void readXlsxFile() throws Exception {
		FileInputStream fis = new FileInputStream(filePath);
		try {
			XSSFWorkbook workbook = new XSSFWorkbook(fis);
			int rowindex = 0;
			int columnindex = 0;
			XSSFSheet sheet = workbook.getSheetAt(0);		// 시트 수 (첫번째 시트 인덱스 0을 셋팅)
			//int rows = sheet.getPhysicalNumberOfRows();		// 행의 수
			int rows = sheet.getLastRowNum();					// xlsx의 경우. 공백의 줄은 세지 않기 때문에..마지막 라인의 row num을 들고 와야한다.
			
			if(rows > 1001) {
				throw new Exception("1,000개를 초과하는 엑셀 데이터가 들어왔습니다.");
			}

			for (rowindex = 1; rowindex <= rows; rowindex++) {
				XSSFRow row = sheet.getRow(rowindex);		// 행을읽는다
				HakwonExcel hakwon = new HakwonExcel();
				hakwon.setLineNo(String.valueOf(rowindex + 1));
				if (row != null) {
					int cells = row.getPhysicalNumberOfCells();		// 셀의 수

					for (columnindex = 0; columnindex <= cells; columnindex++) {
						XSSFCell cell = row.getCell(columnindex);		// 셀값을 읽는다
						String value = "";
						// 셀이 빈값일경우를 위한 널체크
						if (cell == null) {
							continue;
						} else {
							// 타입별로 내용 읽기
							switch (cell.getCellType()) {
							case XSSFCell.CELL_TYPE_FORMULA:
								value = cell.getCellFormula();
								break;
							case XSSFCell.CELL_TYPE_NUMERIC:
								value = String.valueOf(cell.getNumericCellValue());
								break;
							case XSSFCell.CELL_TYPE_STRING:
								value = String.valueOf(cell.getStringCellValue());
								break;
							case XSSFCell.CELL_TYPE_BLANK:
								value = "";
								break;
							case XSSFCell.CELL_TYPE_ERROR:
								value = String.valueOf(cell.getErrorCellValue());
								break;
							}
						}
						hakwon.setHakwonData(columnindex, value);
					}	// for문 끝
				}
				if(!hakwon.isValidData()) {
					invalidList.add(hakwon.dataLog());
					hakwon = null;
				} else {
					hakwon.setHakwonCode(RandomStringUtils .randomAlphanumeric(10));
					hakwonList.add(hakwon);
				}
			}
		} finally {
			if(fis != null) {
				fis.close();
			}
		}
	}

	private void readXlsFile() throws Exception {
		FileInputStream fis = new FileInputStream(filePath);
		try {
			HSSFWorkbook workbook = new HSSFWorkbook(fis);
			int rowindex = 0;
			int columnindex = 0;
			HSSFSheet sheet = workbook.getSheetAt(0);	// 시트 수 (첫번째 시트 인덱스 0을 셋팅)
			//int rows = sheet.getPhysicalNumberOfRows();		// 행의 수
			int rows = sheet.getLastRowNum();
			if(rows > 1001) {
				throw new Exception("1,000개를 초과하는 엑셀 데이터가 들어왔습니다.");
			}

			for (rowindex = 1; rowindex <= rows; rowindex++) {
				HSSFRow row = sheet.getRow(rowindex);		// 행을 읽는다

				HakwonExcel hakwon = new HakwonExcel();
				hakwon.setLineNo(String.valueOf(rowindex + 1));
				if (row != null) {
					
					int cells = row.getPhysicalNumberOfCells();		// 셀의 수

					for (columnindex = 0; columnindex <= cells; columnindex++) {
						HSSFCell cell = row.getCell(columnindex);		// 셀값을 읽는다
						String value = "";

						if (cell == null) {
							continue;
						} else {
							// 타입별로 내용 읽기
							switch (cell.getCellType()) {
							case HSSFCell.CELL_TYPE_FORMULA:
								value = cell.getCellFormula();
								break;
							case HSSFCell.CELL_TYPE_NUMERIC:
								value = String.valueOf(cell.getNumericCellValue());
								break;
							case HSSFCell.CELL_TYPE_STRING:
								value = String.valueOf(cell.getStringCellValue());
								break;
							case HSSFCell.CELL_TYPE_BLANK:
								value = "";
								break;
							case HSSFCell.CELL_TYPE_ERROR:
								value = String.valueOf(cell.getErrorCellValue());
								break;
							}
						}
						hakwon.setHakwonData(columnindex, value);
					}
				}
				if(!hakwon.isValidData()) {
					invalidList.add(hakwon.dataLog());
					hakwon = null;
				} else {
					hakwon.setHakwonCode(RandomStringUtils .randomAlphanumeric(10));
					hakwonList.add(hakwon);
				}
			}
		} finally {
			if(fis != null) fis.close();
		}
	}

}
