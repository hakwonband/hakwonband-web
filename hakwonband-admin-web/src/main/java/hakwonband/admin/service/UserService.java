package hakwonband.admin.service;

import java.util.List;

import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.dao.UserDAO;
import hakwonband.common.exception.HKBandException;
import hakwonband.util.DataMap;

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
	 * 엑셀 유저 리스트
	 * @return
	 */
	public List<DataMap> excelUserList() {
		return userDAO.excelUserList();
	}

	/**
	 * 엑셀 사용자 리스트
	 * @return
	 */
	public DataMap excelUserData() {
		DataMap rtnData = new DataMap();

		List<DataMap> studentParentList = userDAO.excelUserStudentParentList();
		List<DataMap> wonjangList = userDAO.excelUserWonjangList();
		List<DataMap> managerList = userDAO.excelUserManagerList();

		rtnData.put("studentParentList",	studentParentList);
		rtnData.put("wonjangList",			wonjangList);
		rtnData.put("managerList",			managerList);

		return rtnData;
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


	/**
	 * 사용자 정보
	 * @return
	 */
	public DataMap getUserInfo(DataMap param) {

		DataMap colData = new DataMap();

		/**
		 * 사용자 정보
		 */
		DataMap userInfo = userDAO.userInfo(param);
		colData.put("userInfo",	userInfo);

		if( userInfo.equals("user_type", HakwonConstant.UserType.MANAGER) ) {
			/*	매니저	*/
		} else if( userInfo.equals("user_type", HakwonConstant.UserType.ADMIN) ) {
			/*	관리자	*/
		} else if( userInfo.equals("user_type", HakwonConstant.UserType.PARENT) ) {
			/*	학부모	*/
		} else if( userInfo.equals("user_type", HakwonConstant.UserType.STUDENT) ) {
			/*	학생	*/
		} else if( userInfo.equals("user_type", HakwonConstant.UserType.TEACHER) ) {
			/*	선생님	*/
		} else if( userInfo.equals("user_type", HakwonConstant.UserType.WONJANG) ) {
			/*	원장님	*/
		}

		return colData;
	}


	/**
	 * 사용자 알림 업데이트
	 * @param param
	 */
	public String updateUserAlarmOff(long user_no, int alarm_off_time) {

		String off_date = null;
		if( alarm_off_time == 0 ) {
			off_date = null;
		} else {
			DateTime dateTime = new DateTime().plusHours(alarm_off_time);
			off_date = dateTime.toString("yyyy-MM-dd HH:mm");
		}

		userDAO.updateUserAlarmOff(user_no, off_date);

		return off_date;
	}
}