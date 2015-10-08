package hakwonband.admin.service;

import hakwonband.admin.dao.ExcelUploadDAO;
import hakwonband.admin.util.ExcelUploadUtil;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 파일 서비스
 * @author bumworld
 *
 */
@Service
public class ExcelUploadService {

	public static final Logger logger = LoggerFactory.getLogger(ExcelUploadService.class);

	@Autowired
	private ExcelUploadDAO excelDao;

	public DataMap insertHakwon(DataMap param) throws Exception {

		List<String> invalidList = null;	// 유효하지 않은 학원 데이터 리스트
		String dataCount = "";
		ExcelUploadUtil excelUtil = new ExcelUploadUtil();

		/*	엑셀 파일 셋팅	*/
		String fileExt = param.getString("fileExt");
		if(!"xlsx".equals(fileExt) && !"xls".equals(fileExt)) {
			throw new Exception("엑셀 파일이 아닙니다.");
		}

		/*	학원 카테고리 조회 (데이터 검증용)	*/
		excelUtil.setCateList(excelDao.selectHakwonCate());
		excelUtil.setFilePath(param.getString("filePath") + param.getString("fileName"));
		excelUtil.setFileExt(fileExt);
		excelUtil.setExcelData();
		dataCount = excelUtil.getDataCount();

		/*	잘못된 데이터가 있을시에 로그 리스트 리턴	*/
		if(excelUtil.getInvalidList() != null && excelUtil.getInvalidList().size() > 0) {
			invalidList = excelUtil.getInvalidList();
		} else {
			for(int i=0,max=excelUtil.getHakwonList().size(); i<max; i++) {
				/*	주소 조회	*/
				DataMap address = excelDao.selectHakwonAddressInfo(excelUtil.getHakwonList().get(i));
				if(StringUtil.isNull(address)) {
					throw new Exception("존재 하지 않는 주소입니다. [" + excelUtil.getHakwonList().get(i).getOriginData() + " ]");
				} else {
					excelUtil.getHakwonList().get(i).setAddressNo(address.getString("addr_no"));
					excelUtil.getHakwonList().get(i).setHakwonZipCode(address.getString("zip_code"));
				}

				/*	학원 등록	*/
				excelDao.insertHakwon(excelUtil.getHakwonList().get(i));

				/*	정보 등록	*/
				excelDao.insertHakwonInfo(excelUtil.getHakwonList().get(i));

				/*	주소 등록	*/
				excelDao.insertHakwonAddress(excelUtil.getHakwonList().get(i));
			}
			excelUtil = null;
		}
		DataMap result = new DataMap();
		result.put("invalidList", invalidList);
		result.put("dataCount", dataCount);
		return result;
	}


}