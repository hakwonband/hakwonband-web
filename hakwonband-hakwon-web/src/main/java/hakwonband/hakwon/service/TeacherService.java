package hakwonband.hakwon.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.hakwon.dao.EventDAO;
import hakwonband.hakwon.dao.FileDAO;
import hakwonband.hakwon.dao.NoticeDAO;
import hakwonband.hakwon.dao.ReadDAO;
import hakwonband.hakwon.dao.TeacherDAO;
import hakwonband.hakwon.dao.UserDAO;
import hakwonband.util.DataMap;

/**
 * 선생님 서비스
 * @author jrlim
 *
 */
@Service
public class TeacherService {
	public static final Logger logger = LoggerFactory.getLogger(TeacherService.class);

	@Autowired
	private TeacherDAO teacherDAO;

	@Autowired
	private UserDAO userDAO;

	@Autowired
	private NoticeDAO noticeDAO;

	@Autowired
	private EventDAO eventDAO;

	@Autowired
	private ReadDAO readDAO;

	@Autowired
	private FileDAO fileDAO;

	@Autowired
	private ReplyService replyService;

	@Autowired
	private FileService fileService;

	/**
	 * 선생님 목록 (학원과 반에 소속된)
	 * @param param
	 * @return
	 */
	public List<DataMap> teacherReqList(DataMap param) {
		logger.debug("teacherReqList param["+param+"]");

		return teacherDAO.teacherReqList(param);
	}

	/**
	 * 선생님 목록 카운트
	 * @param param
	 * @return
	 */
	public int teacherListTotCount(DataMap param) {
		logger.debug("teacherListTotCount param["+param+"]");

		return teacherDAO.teacherListTotCount(param);
	}

	/**
	 * 선생님 소속 학원 상세정보
	 * @param param
	 * @return
	 */
	public DataMap hakwonReqDetail(DataMap param) {
		logger.debug("hakwonReqDetail param["+param+"]");

		return teacherDAO.hakwonReqDetail(param);
	}

	/**
	 * 선생님 개인 상세정보
	 * @param param
	 * @return
	 */
	public DataMap teacherReqDetail(DataMap param) {
		logger.debug("teacherReqDetail param["+param+"]");

		return userDAO.userDetail(param);
	}

	/**
	 * 선생님 정보 수정
	 * @param param
	 * @return
	 */
	public DataMap updateTeacherInfo(DataMap param) {
		logger.debug("updateTeacherInfo param["+param+"]");

		int resultUpdateUser = userDAO.updateUser(param);

		if (resultUpdateUser != 1) {
			throw new HKBandException("UserDAO.updateUser error");
		}

		int resultUpdateUserInfo = userDAO.updateUserInfo(param);

		if (resultUpdateUserInfo != 1) {
			throw new HKBandException("UserDAO.updateUserInfo error");
		}

		DataMap resultObj = new DataMap();
		resultObj.put("result", 		CommonConstant.Flag.success);
		resultObj.put("updateUser", 	resultUpdateUser);
		resultObj.put("updateUserInfo",	resultUpdateUserInfo);

		return resultObj;
	}

	/**
	 * 선생님 소속 학원목록
	 * @param param
	 * @return
	 */
	public List<DataMap> teacherHakwonReqList(DataMap param) {
		logger.debug("teacherReqDetail param["+param+"]");

		return teacherDAO.teacherHakwonList(param);
	}

	/**
	 * 학원내 선생님, 학부모, 학생 카운트
	 * @param param
	 * @return
	 */
	public DataMap hakwonUsersCount(DataMap param) {
		logger.debug("hakwonUsersCount param["+param+"]");

		return teacherDAO.hakwonUsersCount(param);
	}

	/**
	 * 반에 학생 추가 (선생님 권한)
	 * @param param
	 * @return
	 */
	public DataMap registClassStudentForTeacher(DataMap param) {
		logger.debug("registClassStudentForTeacher param["+param+"]");

		int resultStudent = 0;

		/* 선생님이 해당 반에 학생 추가 */
		resultStudent = teacherDAO.insertClassStudentForTeacher(param);

		if (resultStudent != 1) {
			throw new HKBandException("TeacherDAO.registClassStudentForTeacher error");
		}

		DataMap resultObj = new DataMap();
		resultObj.put("registClassStudentForTeacher", CommonConstant.Flag.success);
		resultObj.put("insertClassStudentForTeacher", resultStudent);

		return resultObj;
	}

	/**
	 * 학원내 반 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonClassList(DataMap param) {
		logger.debug("hakwonClassList param["+param+"]");

		return teacherDAO.hakwonClassList(param);
	}

	/**
	 * 학원내 반 리스트 카운트
	 * @param param
	 * @return
	 */
	public int hakwonClassListTotCount(DataMap param) {
		logger.debug("hakwonClassListTotCount param["+param+"]");

		return teacherDAO.hakwonClassListTotCount(param);
	}

	/**
	 * 반 선생님 리스트 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> classTeacherList(DataMap param) {
		logger.debug("classTeacherList param["+param+"]");

		return teacherDAO.classTeacherList(param);
	}

	/**
	 * 반 선생님 리스트 카운트
	 * @param param
	 * @return
	 */
	public int classTeacherListTotCount(DataMap param) {
		logger.debug("classTeacherListTotCount param["+param+"]");

		return teacherDAO.classTeacherListTotCount(param);
	}

	/**
	 * 반 학생 리스트 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> classStudentList(DataMap param) {
		logger.debug("classStudentList param["+param+"]");

		return teacherDAO.classStudentList(param);
	}

	/**
	 * 반 학생 리스트 카운트
	 * @param param
	 * @return
	 */
	public int classStudentListTotCount(DataMap param) {
		logger.debug("classStudentListTotCount param["+param+"]");

		return teacherDAO.classStudentListTotCount(param);
	}

	/**
	 * 반 학생의 학부모 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> classParentList(DataMap param) {
		logger.debug("classParentList param["+param+"]");

		return teacherDAO.classParentList(param);
	}

	/**
	 * 반 학생의 학부모 카운트
	 * @param param
	 * @return
	 */
	public int classParentListTotCount(DataMap param) {
		logger.debug("classParentListTotCount param["+param+"]");

		return teacherDAO.classParentListTotCount(param);
	}

	/**
	 * 학원 이벤트 리스트 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> eventList(DataMap param) {
		logger.debug("eventList param["+param+"]");

		return eventDAO.eventList(param);
	}

	/**
	 * 학원 이벤트 리스트 카운트
	 * @param param
	 * @return
	 */
	public int eventListTotCount(DataMap param) {
		logger.debug("eventListTotCount param["+param+"]");

		return eventDAO.eventListTotCount(param);
	}

	/**
	 * 학원 이벤트 상세정보
	 * @param param
	 * @return
	 */
	public DataMap procEventDetail(DataMap param) {
		logger.debug("procEventDetail param["+param+"]");

		/* 이벤트 상세정보 */
		DataMap eventDetail = eventDAO.eventDetail(param);

		/* 이벤트 참여자 리스트 및 카운트 */
		List<DataMap> eventJoinUserList = eventDAO.eventJoinUserList(param);
		int eventJoinUserListTotCount 	= eventDAO.eventJoinUserListTotCount(param);

		/* 이벤트 관련 파일 리스트 및 카운트 */
		List<DataMap> fileList	= fileService.fileList(param);

		DataMap resultObj = new DataMap();
		resultObj.put("eventDetail",				eventDetail);
		resultObj.put("eventJoinUserList",			eventJoinUserList);
		resultObj.put("eventJoinUserListTotCount",	eventJoinUserListTotCount);
		resultObj.put("fileList",				fileList);

		return resultObj;
	}

	/**
	 * 선생님 반 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> classList(DataMap param) {
		return teacherDAO.classList(param);
	}

	/**
	 * 등록 학원 검색
	 * @param param
	 * @return
	 */
	public DataMap registHakwonSearch(DataMap param) {
		return teacherDAO.registHakwonSearch(param);
	}

	/**
	 * 선생님 타 학원에 추가 등록신청
	 * @param param
	 * @return
	 */
	public void registHakwonTeacher(DataMap param) {
		logger.debug("registHakwonTeacher param["+param+"]");

		/* 선생님 학원에 등록신청 */
		int resultTeachear = teacherDAO.insertHakwonTeacher(param);
		if (resultTeachear != 1) {
			throw new HKBandException("TeacherDAO.insertHakwonTeacher error");
		}
	}

	/**
	 * 선생님 타 학원에 추가 등록신청 취소
	 * @param param
	 * @return
	 */
	public void deleteRegistHakwonReqCancel(DataMap param) {
		logger.debug("deleteRegistHakwonReqCancel param["+param+"]");

		/* 선생님 학원에 등록신청 취소 */
		int resultTeachear = teacherDAO.deleteRegistHakwonReqCancel(param);
		if (resultTeachear != 1) {
			throw new HKBandException("TeacherDAO.deleteRegistHakwonReqCancel error");
		}
	}

	/**
	 * 학원 전체 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonAllList(DataMap param) {
		return teacherDAO.hakwonAllList(param);
	}
}