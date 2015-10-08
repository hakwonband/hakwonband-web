package hakwonband.admin.service;

import hakwonband.admin.dao.UserDAO;
import hakwonband.common.exception.HKBandException;
import hakwonband.util.DataMap;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 사용자 서비스
 * @author bumworld
 *
 */
@Service
public class UserService {

	public static final Logger logger = LoggerFactory.getLogger(UserService.class);

	@Autowired
	private UserDAO userDAO;

	/**
	 * 사용자 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> userList(DataMap param) {
		return userDAO.userList(param);
	}

	/**
	 * 사용자 정지 및 활성화
	 * @param param
	 * @return
	 */
	public void updateUserStopChange(DataMap param) {
		int updateCnt = userDAO.userStopChange(param);
		if( updateCnt != 1 ) {
			throw new HKBandException();
		}
	}
}