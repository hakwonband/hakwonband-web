package hakwonband.admin.service;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.dao.HakwonDAO;
import hakwonband.admin.dao.ManagerDAO;
import hakwonband.admin.dao.UserDAO;
import hakwonband.common.exception.HKBandException;
import hakwonband.util.DataMap;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 매니저 서비스
 * @author bumworld
 *
 */
@Service
public class ManagerService {

	public static final Logger logger = LoggerFactory.getLogger(ManagerService.class);

	@Autowired
	private ManagerDAO managerDAO;

	@Autowired
	private UserDAO userDAO;

	@Autowired
	private HakwonDAO hakwonDAO;

	/**
	 * 매니저 리스트
	 * @return
	 */
	public DataMap managerList(DataMap param) {

		DataMap colData = new DataMap();

		List<DataMap> dataList = managerDAO.managerList(param);
		colData.put("dataList",	dataList);

		int dataCount	= managerDAO.managerCount(param);
		colData.put("dataCount",	dataCount);

		return colData;
	}

	/**
	 * 미승인 매니저 리스트
	 * @return
	 */
	public DataMap unauthorizedUserList(DataMap param) {
		param.put("userType",	HakwonConstant.UserType.MANAGER);

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

		int checkCnt = managerDAO.approvedUserUpdate(param);
		if( userNoArray.length != checkCnt ) {
			throw new HKBandException("updateCountError["+checkCnt+"]["+param+"]");
		}

		checkCnt = managerDAO.approvedUserInfoUpdate(param);
		if( userNoArray.length != checkCnt ) {
			throw new HKBandException("updateCountError["+checkCnt+"]["+param+"]");
		}
	}

	/**
	 * 매니저 정보
	 * @return
	 */
	public DataMap managerView(DataMap param) {

		DataMap colData = new DataMap();

		/**
		 * 사용자 정보
		 */
		param.put("user_type", HakwonConstant.UserType.MANAGER);
		DataMap userInfo = userDAO.userInfo(param);
		colData.put("userInfo",	userInfo);

		/**
		 * 학원 리스트
		 */
		List<DataMap> hakwonList	= managerDAO.hakwonList(param);
		colData.put("hakwonList",	hakwonList);

		return colData;
	}
}