package hakwonband.hakwon.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.hakwon.dao.SettingDAO;
import hakwonband.util.DataMap;
/**
 * User Service
 * @author jszzang9
 *
 */
@Service
public class SettingService {

	public static final Logger logger = LoggerFactory.getLogger(SettingService.class);

	@Autowired
	private SettingDAO settingDAO;


	/**
	 * 공지 카테고리 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> noticeCateList(DataMap param) {
		return settingDAO.noticeCateList(param);
	}

	/**
	 * 공지 카테고리 삭제
	 * @return
	 */
	public String deleteNoticeCate(DataMap param) {

		int checkCount = settingDAO.deleteNoticeCate(param);
		if( checkCount != 1 ) {
			throw new HKBandException("checkCount Error["+checkCount+"]");
		}

		return CommonConstant.Flag.success;
	}

	/**
	 * 공지 카테고리 수정
	 * @return
	 */
	public void modifyNoticeCate(DataMap param) {
		int checkCount = settingDAO.modifyNoticeCate(param);
		if( checkCount != 1 ) {
			throw new HKBandException("checkCount Error["+checkCount+"]");
		}
	}

	/**
	 * 공지 카테고리 등록
	 * @param param
	 * @return
	 */
	public void insertNoticeCate(DataMap param) {
		settingDAO.insertNoticeCate(param);
	}
}