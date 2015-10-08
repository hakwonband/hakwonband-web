package hakwonband.manager.service;

import hakwonband.manager.common.constant.HakwonConstant;
import hakwonband.manager.dao.UserDAO;
import hakwonband.util.DataMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 원장 서비스
 * @author bumworld
 *
 */
@Service
public class MasterService {

	public static final Logger logger = LoggerFactory.getLogger(MasterService.class);

	@Autowired
	private UserDAO userDAO;


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

		return colData;
	}
}