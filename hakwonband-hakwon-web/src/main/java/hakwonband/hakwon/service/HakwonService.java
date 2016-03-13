package hakwonband.hakwon.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.hakwon.dao.CommonDAO;
import hakwonband.hakwon.dao.FileDAO;
import hakwonband.hakwon.dao.HakwonDAO;
import hakwonband.hakwon.dao.ManagerDAO;
import hakwonband.hakwon.dao.MasterDAO;
import hakwonband.hakwon.model.DevicePushData;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

/**
 * 주소 서비스
 * @author bumworld
 *
 */
@Service
public class HakwonService {

	public static final Logger logger = LoggerFactory.getLogger(HakwonService.class);

	@Autowired
	private HakwonDAO hakwonDAO;

	@Autowired
	private MasterDAO masterDAO;

	@Autowired
	private FileDAO fileDAO;

	@Autowired
	private CommonDAO commonDAO;

	@Autowired
	private ManagerDAO managerDAO;

	/**
	 * 학원 카테고리 리스트
	 * @return
	 */
	public List<DataMap> hakwonCateList() {
		return hakwonDAO.hakwonCateList();
	}

	/**
	 * 학원 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonList(DataMap param) {
		logger.debug("hakwonList param["+param+"]");

		return masterDAO.masterHakwonList(param);
	}

	/**
	 * 학원 상세정보
	 * @param param
	 * @return
	 */
	public DataMap hakwonDetail(DataMap param) {
		logger.debug("hakwonDetail param["+param+"]");

		/*	학원상세정보	*/
		DataMap hakwonDetail	= hakwonDAO.hakwonDetail(param);

		/*	학원소속 유저별 카운트	*/
		DataMap hakwonUserCount	= hakwonDAO.hakwonUserCount(param);

		DataMap resultObj = new DataMap();
		resultObj.put("content",			hakwonDetail);
		resultObj.put("count",				hakwonUserCount);
		return resultObj;
	}

	/**
	 * 학원 소개 introduction 정보
	 * @param param
	 * @return
	 */
	public DataMap hakwonIntroDetail(DataMap param) {
		logger.debug("hakwonIntroDetail param["+param+"]");

		/*	학원상세정보	*/
		DataMap hakwonDetail = hakwonDAO.hakwonDetail(param);

		/*	학원소개 파일 리스트 조회	*/
		List<DataMap> fileList = fileDAO.fileList(param);

		DataMap resultObj = new DataMap();
		resultObj.put("content",			hakwonDetail);
		resultObj.put("fileList",			fileList);
		return resultObj;
	}

	/**
	 * 학원내 반 리스트
	 * @param param
	 * @return
	 */
	public DataMap hakwonClassList(DataMap param) {
		logger.debug("hakwonClassList param["+param+"]");

		List<DataMap> classList = hakwonDAO.hakwonClassList(param);

		int classListTotCount = hakwonDAO.hakwonClassListTotCount(param);

		DataMap resultObj = new DataMap();
		resultObj.put("result", 			CommonConstant.Flag.success);
		resultObj.put("classList",			classList);
		resultObj.put("classListTotCount",	classListTotCount);

		return resultObj;
	}


	/**
	 * 반 소속 선생님 리스트
	 * @param param
	 * @return
	 */
	public DataMap classTeacherList(DataMap param) {
		logger.debug("classTeacherList param["+param+"]");

		List<DataMap> classTeacherList 	= hakwonDAO.classTeacherList(param);
		int classTeacherListTotCount 	= hakwonDAO.classTeacherListTotCount(param);

		DataMap resultObj = new DataMap();
		resultObj.put("result",						CommonConstant.Flag.success);
		resultObj.put("classTeacherList",			classTeacherList);
		resultObj.put("classTeacherListTotCount",	classTeacherListTotCount);

		return resultObj;
	}

	/**
	 * 반 상세조회 (반소속 선생님 리스트 포함)
	 * @param param
	 * @return
	 */
	public DataMap hakwonClassDetail(DataMap param) {
		logger.debug("hakwonClassDetail param["+param+"]");

		/*	반정보 조회	*/
		DataMap classDetail = hakwonDAO.hakwonClassDetail(param);

		/*	반 선생님 리스트	*/
		List<DataMap> classTeacherList = hakwonDAO.classTeacherList(param);

		/*	반 선생님 리스트 카운트	*/
		int classTeacherListTotCount = hakwonDAO.classTeacherListTotCount(param);

		DataMap resultObj = new DataMap();
		resultObj.put("result", 					CommonConstant.Flag.success);
		resultObj.put("classDetail",				classDetail);
		resultObj.put("classTeacherList",			classTeacherList);
		resultObj.put("classTeacherListTotCount",	classTeacherListTotCount);

		return resultObj;
	}

	/**
	 * 반에 학생 등록
	 * @param param
	 * @return
	 */
	public void insertClassStudent(DataMap param) {
		logger.debug("insertClassStudent param["+param+"]");

		int insertClassStudent = hakwonDAO.insertClassStudent(param);

		/*	정회원 여부 업데이트	*/
		int checkCount = hakwonDAO.updateHakwonMember(param);
		if( checkCount != 1 ) {
			throw new HKBandException("updateHakwonMember checkCount["+checkCount+"]");
		}

		/**
		 * 부모가 있는 경우 부모를 학원에 가입 시킨다.
		 * TODO 주말 할일~
		 */
	};

	/**
	 * 반 소속 학생 삭제
	 * @param param
	 * @return
	 */
	public void deleteClassStudent(DataMap param) {
		logger.debug("deleteClassStudent param["+param+"]");

		int deleteClassStudent = hakwonDAO.deleteClassStudent(param);
		if (deleteClassStudent != 1)
			throw new HKBandException("HakownDAO.deleteClassStudent error, [" + deleteClassStudent + "], [" + param + "]");

		/*	정회원 여부 업데이트	*/
		int checkCount = hakwonDAO.updateHakwonMember(param);
		if( checkCount != 1 ) {
			throw new HKBandException("updateHakwonMember checkCount["+checkCount+"]");
		}
	}

	/**
	 * 공지사항 작성시 카테고리 리스트 조회
	 * @param param
	 * @return
	 */
	public DataMap getNoticeCateList(DataMap param) {
		List<DataMap> noticeCateList	= hakwonDAO.noticeCateList(param);

		DataMap result = new DataMap();
		result.put("result", 			CommonConstant.Flag.success);
		result.put("noticeCateList",	noticeCateList);

		return result;
	}

	/**
	 * 학원 소개 미리보기 등록
	 * @param param
	 * @return
	 */
	public DataMap insertPreviewIntro(DataMap param) {

		DataMap rtnMap = new DataMap();

		hakwonDAO.insertPreviewIntro(param);
		long previewNo = param.getLong("id");


		List<UserDevice> deviceList = commonDAO.getUserDeviceToken(param);

		PushMessage pushMessage = new PushMessage();
		pushMessage.setTicker("학원밴드");
		pushMessage.setTitle("학원 소개 미리보기 정보 입니다.");
		pushMessage.setIos_title("학원 소개 미리보기 정보 입니다.");
		pushMessage.setLink_url("https://m.hakwonband.com/preview.do?preview_no="+previewNo);

		DevicePushData devicePushData = new DevicePushData(pushMessage, deviceList);

		rtnMap.put("previewNo",		previewNo);
		rtnMap.put("devicePushData",devicePushData);

		return rtnMap;
	}

	/**
	 * 학원 매니저 정보 조회
	 * @param param
	 * @return
	 */
	public DataMap managerInfo(DataMap param) {
		return managerDAO.hakwonManagerInfo(param);
	}

	/**
	 * 학원 매니저 검색
	 * @param param
	 * @return
	 */
	public List<DataMap> managerSearch(DataMap param) {
		return managerDAO.managerSearch(param);
	}

	/**
	 * 매니저 업데이트
	 * @param param
	 */
	public void updateHakwonManager(DataMap param) {
		int updateCnt = managerDAO.hakwonManagerSetting(param);
		if( updateCnt != 1 ) {
			throw new HKBandException();
		}
	}

	/**
	 * 학원 반 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonClassListAll(DataMap param) {
		return hakwonDAO.hakwonClassListAll(param);
	}

	/**
	 * 학원 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonSearchList(DataMap param) {
		return hakwonDAO.hakwonSearchList(param);
	}

	/**
	 * 멤버 삭제
	 * @param param
	 */
	public void deleteHakwonMember(DataMap param) {

		/**
		 * 학원 멤버 삭제
		 */
		int delCnt = hakwonDAO.hakwonMemberDelete(param);
		if( delCnt != 1 ) {
			throw new HKBandException("delCnt : " + delCnt);
		}

		/**
		 * 학생 삭제
		 */
		hakwonDAO.hakwonStudentDelete(param);
	}
}