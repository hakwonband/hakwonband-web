package hakwonband.admin.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.dao.UserDAO;
import hakwonband.admin.dao.WonjangDAO;
import hakwonband.common.exception.HKBandException;
import hakwonband.util.DataMap;

/**
 * 공통 서비스
 * @author bumworld
 *
 */
@Service
public class WonjangService {

	public static final Logger logger = LoggerFactory.getLogger(WonjangService.class);

	@Autowired
	private WonjangDAO wonjangDAO;

	@Autowired
	private UserDAO userDAO;

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

		int checkCnt = wonjangDAO.approvedUserUpdate(param);
		if( userNoArray.length != checkCnt ) {
			throw new HKBandException("updateCountError["+checkCnt+"]["+param+"]");
		}

		checkCnt = wonjangDAO.approvedUserInfoUpdate(param);
		if( userNoArray.length != checkCnt ) {
			throw new HKBandException("updateCountError["+checkCnt+"]["+param+"]");
		}
	}
}