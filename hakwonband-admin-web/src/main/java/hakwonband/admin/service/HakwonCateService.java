package hakwonband.admin.service;

import hakwonband.admin.dao.HakwonCateDAO;
import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.util.DataMap;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 학원 서비스
 * @author bumworld
 *
 */
@Service
public class HakwonCateService {

	public static final Logger logger = LoggerFactory.getLogger(HakwonCateService.class);

	@Autowired
	private HakwonCateDAO hakwonCateDAO;

	/**
	 * 학원 카테고리 리스트
	 * @return
	 */
	public List<DataMap> hakwonCateList() {
		return hakwonCateDAO.hakwonCateList();
	}

	/**
	 * 카테고리 삭제
	 * @return
	 */
	public String deleteHakwonCate(DataMap param) {

		/*	맵핑 카운트	*/
		int mappingCount = hakwonCateDAO.hakwonCateMappingCount(param);
		if( mappingCount != 0 ) {
			return CommonConstant.Flag.exist;
		}

		int checkCount = hakwonCateDAO.deleteHakwonCate(param);
		if( checkCount != 1 ) {
			throw new HKBandException("checkCount Error["+checkCount+"]");
		}

		return CommonConstant.Flag.success;
	}

	/**
	 * 카테고리 수정
	 * @return
	 */
	public void modifyHakwonCate(DataMap param) {
		int checkCount = hakwonCateDAO.modifyHakwonCate(param);
		if( checkCount != 1 ) {
			throw new HKBandException("checkCount Error["+checkCount+"]");
		}
	}

	/**
	 * 카테고리 등록
	 * @param param
	 * @return
	 */
	public void insertHakwonCate(DataMap param) {
		hakwonCateDAO.insertHakwonCate(param);
	}

}