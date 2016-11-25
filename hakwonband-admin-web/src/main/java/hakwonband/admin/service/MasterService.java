package hakwonband.admin.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.dao.HakwonDAO;
import hakwonband.admin.dao.MasterDAO;
import hakwonband.admin.dao.UserDAO;
import hakwonband.common.exception.HKBandException;
import hakwonband.util.DataMap;

/**
 * 원장 서비스
 * @author bumworld
 *
 */
@Service
public class MasterService {

	public static final Logger logger = LoggerFactory.getLogger(MasterService.class);

	@Autowired
	private MasterDAO masterDAO;

	@Autowired
	private UserDAO userDAO;

	@Autowired
	private HakwonDAO hakwonDAO;

	/**
	 * 원장 리스트
	 * @return
	 */
	public DataMap masterList(DataMap param) {

		DataMap colData = new DataMap();

		List<DataMap> dataList = masterDAO.masterList(param);
		colData.put("dataList",	dataList);

		int dataCount	= masterDAO.masterCount(param);
		colData.put("dataCount",	dataCount);

		return colData;
	}

	/**
	 * 미승인 원장 리스트
	 * @return
	 */
	public DataMap unauthorizedUserList(DataMap param) {
		param.put("userType",	HakwonConstant.UserType.WONJANG);

		List<DataMap> userList = userDAO.unauthorizedUserList(param);
		param.put("userList",	userList);

		int userCount = userDAO.unauthorizedUserCount(param);
		param.put("userCount",	userCount);


		return param;
	}

	/**
	 * 승인/거절 처리
	 */
	public void updateApproved(DataMap param) {
		String [] userNoArray = (String [])param.get("userNoArray");

		int checkCnt = masterDAO.approvedUserUpdate(param);
		if( userNoArray.length != checkCnt ) {
			throw new HKBandException("updateCountError["+checkCnt+"]["+param+"]");
		}

		checkCnt = masterDAO.approvedUserInfoUpdate(param);
		if( userNoArray.length != checkCnt ) {
			throw new HKBandException("updateCountError["+checkCnt+"]["+param+"]");
		}
	}

	/**
	 * 원장 정보
	 * @return
	 */
	public DataMap masterView(DataMap param) {

		DataMap colData = new DataMap();

		/**
		 * 사용자 정보
		 */
		param.put("user_type", HakwonConstant.UserType.WONJANG);
		DataMap userInfo = userDAO.userInfo(param);
		colData.put("userInfo",	userInfo);

		/**
		 * 학원 리스트
		 */
		List<DataMap> hakwonList	= masterDAO.hakwonList(param);
		colData.put("hakwonList",	hakwonList);

		return colData;
	}
}