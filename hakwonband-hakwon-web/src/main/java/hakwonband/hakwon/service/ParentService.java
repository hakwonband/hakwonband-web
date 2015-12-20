package hakwonband.hakwon.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.exception.HKBandException;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.dao.HakwonDAO;
import hakwonband.hakwon.dao.ParentDAO;
import hakwonband.hakwon.dao.UserDAO;
import hakwonband.util.DataMap;

/**
 * 학부모 서비스
 * @author bumworld
 *
 */
@Service
public class ParentService {

	public static final Logger logger = LoggerFactory.getLogger(ParentService.class);

	@Autowired
	private ParentDAO parentDAO;

	@Autowired
	private UserDAO userDAO;

	@Autowired
	private HakwonDAO hakwonDAO;


	/**
	 * 학부모 리스트
	 * @return
	 */
	public DataMap parentList(DataMap param) {

		DataMap colData = new DataMap();

		List<DataMap> dataList = parentDAO.parentList(param);
		colData.put("dataList",	dataList);

		int dataCount	= parentDAO.parentCount(param);
		colData.put("dataCount",	dataCount);

		return colData;
	}

	/**
	 * 학부모 정보
	 * @return
	 */
	public DataMap parentView(DataMap param) {

		DataMap colData = new DataMap();

		/**
		 * 사용자 정보
		 */
		param.put("user_type", HakwonConstant.UserType.PARENT);
		DataMap userInfo = userDAO.userInfo(param);
		colData.put("userInfo",	userInfo);

		/**
		 * 자식 리스트
		 */
		List<DataMap> childList = userDAO.childList(param);
		colData.put("childList",	childList);

		/**
		 * 학원 리스트
		 */
		//List<DataMap> hakwonList	= hakwonDAO.userHakwonList(param);
		//colData.put("hakwonList",	hakwonList);

		return colData;
	}

	/**
	 * 반소속 학부모 리스트
	 * @return
	 */
	public DataMap classParentList(DataMap param) {

		DataMap colData = new DataMap();

		List<DataMap> dataList = parentDAO.classParentList(param);
		colData.put("dataList",	dataList);

		int dataCount	= parentDAO.classParentCount(param);
		colData.put("dataCount",	dataCount);

		return colData;
	}

	/**
	 * 학생 수정
	 * @return
	 */
	public void updateParent(DataMap param) {
		DataMap authUserInfo = (DataMap)param.get("authUserInfo");

		DataMap checkParam = new DataMap();
		checkParam.put("user_no",		authUserInfo.getString("user_no"));
		checkParam.put("user_type",		authUserInfo.getString("user_type"));
		checkParam.put("hakwon_no",		param.getString("hakwon_no"));
		checkParam.put("parent_user_no",param.getString("parent_user_no"));

		/*	학생 권한 체크	*/
		DataMap checkMap = parentDAO.parentRoleCheck(checkParam);
		if( checkMap.getInt("cnt") == 1 && checkMap.getInt("role_cnt") == 1 ) {
		} else {
			System.out.println("checkMap : " + checkMap);
			throw new HKBandException("권한 실패~");
		}


		/*	사용자 정보 업데이트	*/
		DataMap userInfoParam = new DataMap();
		userInfoParam.put("user_no",		param.getString("parent_user_no"));
		userInfoParam.put("user_name",		param.getString("user_name"));
		userInfoParam.put("user_gender",	param.getString("user_gender"));
		userInfoParam.put("user_birthday",	param.getString("user_birthday"));
		userInfoParam.put("tel1_no",		param.getString("tel1_no"));
		userDAO.updateUserInfo(userInfoParam);

		/*	이메일 및 패스워드 업데이트	*/
		DataMap userParam = new DataMap();
		userParam.put("user_password",	param.getString("user_pwd"));
		userParam.put("user_email",		param.getString("user_email"));
		userParam.put("user_no",		param.getString("parent_user_no"));
		userDAO.updateUser(userParam);
	}
}