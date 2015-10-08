package hakwonband.hakwon.component;

import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import hakwonband.common.exception.HKBandException;
import hakwonband.util.DataMap;
import jxl.Workbook;
import jxl.format.Alignment;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.format.Colour;
import jxl.format.UnderlineStyle;
import jxl.format.VerticalAlignment;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

@Component
public class ExcelComponent {

	public static final Logger logger = LoggerFactory.getLogger(ExcelComponent.class);

	/**
	 * 엑셀 저장
	 * @param response
	 * @param sheetModel
	 */
	public void writeExcel(HttpServletResponse response, SheetModel sheetModel) {
		List<SheetModel> sheetModelList = new ArrayList<SheetModel>();
		sheetModelList.add(sheetModel);
		writeExcel(response, sheetModelList, "학원밴드");
	}
	public void writeExcel(HttpServletResponse response, SheetModel sheetModel, String fileName) {
		List<SheetModel> sheetModelList = new ArrayList<SheetModel>();
		sheetModelList.add(sheetModel);
		writeExcel(response, sheetModelList, fileName);
	}
	/**
	 * 엑셀 저장
	 * @param response
	 * @param dataList
	 */
	public void writeExcel(HttpServletResponse response, List<SheetModel> sheetModelList) {
		writeExcel(response, sheetModelList, "학원밴드");
	}

	/**
	 * 엑셀 저장
	 * @param response
	 */
	public void writeExcel(HttpServletResponse response, List<SheetModel> sheetModelList, String fileName) {
		OutputStream out = null;
		try {

			WritableWorkbook workbook	= Workbook.createWorkbook(response.getOutputStream());
			response.setContentType("application/vnd.ms-excel");
			response.setHeader("Content-Disposition", "attachment; filename="+fileName+".xls");

			logger.debug("fileName["+fileName+"]");

			for(int shidx=0; shidx<sheetModelList.size(); shidx++) {
				SheetModel sheetModel = sheetModelList.get(shidx);

				List<DataMap> dataList			= sheetModel.getDataList();
				List<ColumnModel> columnList	= sheetModel.getColumnList();

				logger.debug("dataList["+dataList.size()+"]");
				logger.debug("columnList["+columnList.size()+"]");

				WritableSheet sheet = workbook.createSheet(sheetModel.getSheetName(), 0);

				WritableCellFormat headFormat	= getHeaderFormat();
				WritableCellFormat cellFormat	= getCellFormat();

				int row = 0;
				int colCount = 0;
				for(int i=0; i<columnList.size(); i++) {
					ColumnModel columnModel = columnList.get(i);
					String headerName = columnModel.getHeaderName();

					Label label = new jxl.write.Label(colCount++, row, headerName, headFormat);
					sheet.addCell(label);
				}
				row++;

				for(int i=0; i<dataList.size(); i++) {
					DataMap dataMap = dataList.get(i);
					colCount = 0;
					for(int j=0; j<columnList.size(); j++) {
						ColumnModel columnModel = columnList.get(j);
						String columnName = columnModel.getColumnName();

						Label label = new jxl.write.Label(colCount++, row, dataMap.getString(columnName), cellFormat);
						sheet.addCell(label);
					}
					row++;
				}
			}
			workbook.write();
			workbook.close();
		} catch (Exception e) {
			throw new HKBandException(e);
		} finally {
			if (out != null)
				try {
					out.close();
				} catch(Exception e) {
					throw new HKBandException(e);
				}
		}
	}

	/**
	 * 헤더 포멧
	 * @return
	 */
	private WritableCellFormat getHeaderFormat() {
		try {
			WritableFont heard14font = new WritableFont(WritableFont.ARIAL, // 폰트이름
					12, // 폰트 크기
					WritableFont.BOLD, // 폰트 두께
					false, // 이탤릭 사용 유무
					UnderlineStyle.NO_UNDERLINE, // 밑줄 스타일
					Colour.BLACK);  // 폰트색
			// 헤더 형식
			WritableCellFormat headFormat = new WritableCellFormat(heard14font);
			// 헤더 좌우 정렬
			headFormat.setAlignment(Alignment.CENTRE);
			// 헤더 상하 정렬
			headFormat.setVerticalAlignment(VerticalAlignment.CENTRE);
			// 헤더 테두리
			headFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
			// 백그라운드 색
			headFormat.setBackground(jxl.format.Colour.GRAY_25);

			return headFormat;
		} catch(Exception e) {
			throw new HKBandException(e);
		}
	}

	/**
	 * 셀 포멧
	 * @return
	 */
	public WritableCellFormat getCellFormat() {
		WritableCellFormat textFormat = null;
		try {
			// 셀형식
			textFormat = new WritableCellFormat();
			// 셀 좌우 정렬
			textFormat.setAlignment(Alignment.CENTRE);
			// 셀 상하 정렬
			textFormat.setVerticalAlignment(VerticalAlignment.CENTRE);
			// 테두리
			textFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
		} catch(Exception e) {
			throw new HKBandException(e);
		}

		return textFormat;
	}

	/**
	 * 파일 이름을 변환한다.
	 * @param userAgent
	 * @param fileName
	 * @return
	 */
	public String convertFileName(String userAgent, String fileName) {
		try {
			logger.debug("fileName["+fileName+"]");
			if( userAgent.indexOf("Trident") > -1 ) {
				/*	IE	*/
				fileName = URLEncoder.encode(fileName, "UTF-8");
			} else {
				if(userAgent.indexOf("MSIE") == -1) {
					fileName = new String(fileName.getBytes("UTF-8"), "8859_1");
				} else {
					fileName = new String(fileName.getBytes("EUC-KR"), "8859_1");
				}
			}
		} catch (UnsupportedEncodingException e) {
			logger.error("", e);
			fileName = "hakwonband";
		}

		return fileName;
	}
}