package hakwonband.mobile.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.mobile.common.constant.HakwonConstant;
import hakwonband.mobile.dao.HakwonDAO;
import hakwonband.util.DataMap;

/**
 * 학원 Service
 * @author jszzang9
 */
@Service
public class HakwonService {

	public static final Logger logger = LoggerFactory.getLogger(HakwonService.class);

	@Autowired
	private HakwonDAO hakwonDAO;

	/**
	 * 학원 상세정보
	 * @param param
	 * @return
	 */
	public DataMap hakwonDetail(DataMap param) {
		logger.debug("hakwonDetail param["+param+"]");

		/*	학원 상세 정보	*/
		DataMap hakwonDetail = hakwonDAO.hakwonDetail(param);

		/*	사용자 반 리스트	*/
		if( param.isNotNull("user_no") ) {
			List<DataMap> classList = hakwonDAO.hakwonUserClassList(param);
			hakwonDetail.put("classList", classList);
		} else {
			hakwonDetail.put("classList", null);
		}

		return hakwonDetail;
	}

	/**
	 * 학원 선생님 전체 목록
	 * @param param
	 * @return
	 */
	public DataMap getHakwonTeacherList(DataMap param) {
		List<DataMap> hakwonTeacherList	= hakwonDAO.hakwonTeacherList(param);

		DataMap result = new DataMap();
		result.put("hakwonTeacherList",			hakwonTeacherList);

		return result;
	}

	/**
	 * 학생 소속 반 전체의 선생님 리스트
	 * @param param
	 * @return
	 */
	public DataMap getAllClassTeacherList(DataMap param) {
		DataMap result = new DataMap();

		if( param.equals("user_type", HakwonConstant.UserType.PARENT) ) {
			List<DataMap> allClassTeacherList	= hakwonDAO.parentAllClassTeacherList(param);
			result.put("allClassTeacherList",	allClassTeacherList);
		} else if( param.equals("user_type", HakwonConstant.UserType.STUDENT) ) {
			List<DataMap> allClassTeacherList	= hakwonDAO.allClassTeacherList(param);
			result.put("allClassTeacherList",	allClassTeacherList);
		}

		return result;
	}

	/**
	 * 학원 멤버 탈퇴
	 * @param param
	 */
	public String executeHakwonMemberOut(DataMap param) {
		if( HakwonConstant.UserType.STUDENT.equals(param.getString("user_type")) ) {
			/*	학생이면 반에 속해 있는지 확인	*/
			int checkCount	= hakwonDAO.selectClassStudent(param);
			if( checkCount > 0 ) {
				return "classMember";
			}
		} else if( HakwonConstant.UserType.PARENT.equals(param.getString("user_type")) ) {
			/*	학부모이면 자식이 반에 속해 있는지 확인	*/
			int checkCount	= hakwonDAO.checkChildHakwonMember(param);
			if( checkCount > 0 ) {
				return "childClassMember";
			}
		} else {
			throw new HKBandException("executeHakwonMemberOut User Type Fail");
		}

		/**
		 * 멤버 탈퇴
		 */
		int memberDelCount	= hakwonDAO.deleteHakwonMember(param);
		if( memberDelCount > 1 ) {
			throw new HKBandException("memberDelCount Error["+memberDelCount+"]");
		}
		return CommonConstant.Flag.success;
	}
}