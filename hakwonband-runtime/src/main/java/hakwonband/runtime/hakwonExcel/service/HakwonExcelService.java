package hakwonband.runtime.hakwonExcel.service;

import hakwonband.runtime.hakwonExcel.dao.HakwonExcelDAO;
import hakwonband.runtime.hakwonExcel.model.HakwonExcel;
import hakwonband.util.DataMap;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import net.logstash.logback.encoder.org.apache.commons.lang.RandomStringUtils;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 학원 엑셀
 * @author bumworld
 */
@Service
public class HakwonExcelService {

	public static final Logger logger = LoggerFactory.getLogger(HakwonExcelService.class);

	@Autowired
	HakwonExcelDAO excelDao;

	List<String> invalidList = new ArrayList<String>();
	List<HakwonExcel> hakwonList = new ArrayList<HakwonExcel>();

	private boolean isDataOk = true;

	public void getTime(DataMap param) {
		System.out.println(excelDao.getTime());
	}

	/**
	 * 1. verifyExcel
	 * - 데이터 검증
	 * 2.
	 * @param param
	 */
	public void startProcess(DataMap param) {
		try {
			/*	엑셀 파일이 유효할때만 진행	*/
			if(verifyExcel(param.getString("filePath"))) {
				/*	excel 파일 읽고, list 담기	*/
				readExcel(param.getString("filePath"));
			}

			//insertHakwonList();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private boolean verifyExcel(String filePath) throws IOException, InterruptedException {
		boolean isExcelOk = true;		// 해당 엑셀 파일이 유효한 파일인지 검증

		//파일을 읽기위해 엑셀파일을 가져온다
		FileInputStream fis=new FileInputStream(filePath);
		XSSFWorkbook workbook=new XSSFWorkbook(fis);
		int rowindex=0;
		int columnindex=0;
		//시트 수 (첫번째에만 존재하므로 0을 준다)
		//만약 각 시트를 읽기위해서는 FOR문을 한번더 돌려준다
		XSSFSheet sheet=workbook.getSheetAt(0);
		//행의 수
		int rows=sheet.getPhysicalNumberOfRows();
		for(rowindex=1;rowindex<rows;rowindex++){
		    //행을읽는다
		    XSSFRow row=sheet.getRow(rowindex);
		    if(row !=null){
		    	HakwonExcel hakwon = new HakwonExcel();
		    	hakwon.setLineNo(String.valueOf(rowindex+1));
		        //셀의 수
		        int cells=row.getPhysicalNumberOfCells();
		        for(columnindex=0;columnindex<=cells;columnindex++){
		            //셀값을 읽는다
		            XSSFCell cell=row.getCell(columnindex);
		            String value="";
		            //셀이 빈값일경우를 위한 널체크
		            if(cell==null){
		                continue;
		            }else{
		                //타입별로 내용 읽기
		                switch (cell.getCellType()){
		                case XSSFCell.CELL_TYPE_FORMULA:
		                    value=cell.getCellFormula();
		                    break;
		                case XSSFCell.CELL_TYPE_NUMERIC:
		                    value=cell.getNumericCellValue()+"";
		                    break;
		                case XSSFCell.CELL_TYPE_STRING:
		                    value=cell.getStringCellValue()+"";
		                    break;
		                case XSSFCell.CELL_TYPE_BLANK:
		                    value=cell.getBooleanCellValue()+"";
		                    break;
		                case XSSFCell.CELL_TYPE_ERROR:
		                    value=cell.getErrorCellValue()+"";
		                    break;
		                }
		            }
		            if(columnindex == 1) {			// 이름
		            	hakwon.setHakwonName(value);
		            } else if(columnindex == 2) {	// 우편번호
		            	hakwon.setHakwonZipCode(value);
		            } else if(columnindex == 3) {	// 시도
		            	hakwon.setHakwonSido(value);
		            } else if(columnindex == 4) {	// 군구
		            	hakwon.setHakwonGungu(value);
		            } else if(columnindex == 5) {	// 동
		            	hakwon.setHakwonDong(value);
		            } else if(columnindex == 6) {	// 카테고리
		            	hakwon.setHakwonCate(value);
		            }
		        }
		        if(!hakwon.isValidData()) {
		        	isExcelOk = false;
	            	invalidList.add(hakwon.dataLog());
	            	hakwon = null;
		        }
		    }
		}
		return isExcelOk;
	}

	private void readExcel(String filePath) throws IOException, InterruptedException {
		//파일을 읽기위해 엑셀파일을 가져온다
		FileInputStream fis=new FileInputStream(filePath);
		XSSFWorkbook workbook=new XSSFWorkbook(fis);
		int rowindex=0;
		int columnindex=0;
		//시트 수 (첫번째에만 존재하므로 0을 준다)
		//만약 각 시트를 읽기위해서는 FOR문을 한번더 돌려준다
		XSSFSheet sheet=workbook.getSheetAt(0);
		//행의 수
		int rows=sheet.getPhysicalNumberOfRows();
		for(rowindex=1;rowindex<rows;rowindex++){
		    //행을읽는다
		    XSSFRow row=sheet.getRow(rowindex);
		    if(row !=null){
		    	HakwonExcel hakwon = new HakwonExcel();
		    	hakwon.setLineNo(String.valueOf(rowindex+1));
		        //셀의 수
		        int cells=row.getPhysicalNumberOfCells();
		        for(columnindex=0;columnindex<=cells;columnindex++){
		            //셀값을 읽는다
		            XSSFCell cell=row.getCell(columnindex);
		            String value="";
		            //셀이 빈값일경우를 위한 널체크
		            if(cell==null){
		                continue;
		            }else{
		                //타입별로 내용 읽기
		                switch (cell.getCellType()){
		                case XSSFCell.CELL_TYPE_FORMULA:
		                    value=cell.getCellFormula();
		                    break;
		                case XSSFCell.CELL_TYPE_NUMERIC:
		                    value=cell.getNumericCellValue()+"";
		                    break;
		                case XSSFCell.CELL_TYPE_STRING:
		                    value=cell.getStringCellValue()+"";
		                    break;
		                case XSSFCell.CELL_TYPE_BLANK:
		                    value=cell.getBooleanCellValue()+"";
		                    break;
		                case XSSFCell.CELL_TYPE_ERROR:
		                    value=cell.getErrorCellValue()+"";
		                    break;
		                }
		            }
		            if(columnindex == 1) {	// 학원 이름
		            	hakwon.setHakwonName(value);
		            } else if(columnindex == 2) {
		            	hakwon.setHakwonZipCode(value);
		            } else if(columnindex == 3) {
		            	hakwon.setHakwonSido(value);
		            } else if(columnindex == 4) {
		            	hakwon.setHakwonGungu(value);
		            } else if(columnindex == 5) {
		            	hakwon.setHakwonDong(value);
		            } else if(columnindex == 6) {
		            	hakwon.setHakwonCate(value);
		            }
		        }

		        hakwon.setHakwonCode(RandomStringUtils.randomAlphanumeric(10));
            	hakwonList.add(hakwon);

            	if(hakwonList != null && hakwonList.size() >= 500) {
    		    	insertHakwon();
    		    }


		    }


		}
		System.out.println("list size : " + hakwonList.size());
	}

	private void setInsert() {
		if(isDataOk) {


			hakwonList.clear();
		} else {
			hakwonList = null;	// 학원 리스트 널ㅊ
		}
	}

	private void insertHakwon() {
		for(int i=0,max=hakwonList.size(); i<max; i++) {
			/*	학원 등록	*/
			excelDao.insertHakwon(hakwonList.get(i));

			/*	정보 등록	*/
			excelDao.insertHakwonInfo(hakwonList.get(i));

			/*	주소 등록	*/
			excelDao.insertHakwonAddress(hakwonList.get(i));

			//System.out.println(hakwonList.get(i).getHakwonNo());
		}

		hakwonList.clear();
	}

}