package hakwonband.hakwon.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.hakwon.dao.AttendanceDAO;
import hakwonband.hakwon.model.DevicePushData;
import hakwonband.hakwon.util.HakwonUtilSupportBox;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;
import hakwonband.util.DateUtil;
import hakwonband.util.StringUtil;

/**
 * 학생 서비스
 * @author bumworld
 *
 */
@Service
public class AttendanceService {

	public static final Logger logger = LoggerFactory.getLogger(AttendanceService.class);

	@Autowired
	private AttendanceDAO attendanceDAO;

	public String createAttCode(DataMap param) throws InterruptedException {
		try {
			attendanceDAO.createAttCode(param);

		/*	실패시에 5번 시도	*/
		} catch(Exception e) {
			Thread.sleep(300);
			int tryCount = param.getInt("try");

			if(tryCount <= 5) {
				param.put("try", tryCount + 1);
				createAttCode(param);
			} else {
				return "failure";
			}
		}
		return "success";
	}

	/**
	 * 학생코드 조회
	 * @param param
	 * @return
	 */
	public DataMap selectAttCode(DataMap param) {
		return attendanceDAO.selectAttCode(param);
	}

	/**
	 * 학생코드로 학생정보 조회
	 * @param param
	 * @return
	 */
	public DataMap selectStudentByAttCode(DataMap param) {
		return attendanceDAO.selectStudentByAttCode(param);
	}

	/**
	 * 학생 조회
	 * @param param
	 * @return
	 */
	public DataMap selectStudent(DataMap param) {
		return attendanceDAO.selectStudent(param);
	}

	/**
	 * 출결 리스트 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> selectAttendanceList(DataMap param) {
		return attendanceDAO.selectAttendanceList(param);
	}

	/**
	 * 출결코드 생성 일괄 처리
	 * @return
	 */
	public void createAttCodeAll() {
		/*	출결코드가 없는 학생 조회	*/
		List<DataMap> studentList = attendanceDAO.selectStudentHasNoCode();

		/*	코드 생성	*/
		for(DataMap student : studentList) {
			attendanceDAO.createAttCode(student);
		}
	}

	/**
	 * 등,하원 / 승,하차 등록
	 * 1. 등원을 시도하는데, 오늘 날짜로 등원 데이터가 있고, 하원을 안했으면 하원 먼저 처리.
	 * 2. 데이터가 있는데..오늘 날짜가 아니면. 냅두고 오늘날짜 등원 처리.
	 * 3.
	 *
	 * @param param
	 * @return
	 */
	public DataMap insertAttAndBusTime(DataMap param) {

		DataMap hakwonInfo = attendanceDAO.selectHakwonInfo(param);

		/* 학원정보가 없을시에, 가입 안 된 학생.	*/
		if(hakwonInfo == null || StringUtil.isBlank(hakwonInfo.getString("hakwon_name"))) {
			param.clear();
			param.put("flag", "needToJoin");
			return param;
		}

		String attendance_no = "";

		DataMap todayBus = attendanceDAO.selectBusTime(param);

		/*	등원,승차 등록	*/
		if("start".equals(param.get("attendanceType"))) {
			/*	하차를 안한 데이터가 있는경우	*/
			if(todayBus != null && !StringUtil.isBlank(todayBus.getString("start_date")) && StringUtil.isBlank(todayBus.getString("end_date"))) {
				String[] currentDate = DateUtil.getDate("yyyy-MM-dd HH:mm").split(" ");

				/*	오늘 날짜에 하원을 안한 데이터가 있으면, 하원 먼저 등록해야함.	*/
				if(todayBus.getString("start_date").indexOf(currentDate[0]) >= 0) {
					param.put("flag", "unavailable");		// 하차를 안한 데이터가 있는경우, 하차 등록 먼저
				} else {
					attendanceDAO.insertAttendance(param);
					attendance_no = param.getString("idx");
					param.put("flag", "success");
				}

			/*	승차	*/
			} else {
				attendanceDAO.insertAttendance(param);
				attendance_no = param.getString("idx");
				param.put("flag", "success");
			}
		/*	하원,하차 등록	*/
		} else {
			/*	이미 하차 등록이 된경우.	*/
			if(todayBus != null && !StringUtil.isBlank(todayBus.getString("end_date"))) {
				param.put("flag", "unavailable");		// 승차 데이터가 없으므로, 승차 등록 먼저

			} else if(todayBus == null || StringUtil.isBlank(todayBus.getString("start_date"))) {
				param.put("flag", "unavailable");		// 승차 데이터가 없으므로, 승차 등록 먼저

			/*	하원	*/
			} else {
				param.put("attNo", todayBus.getString("attendance_no"));
				attendanceDAO.updateAttendance(param);
				attendance_no = todayBus.getString("attendance_no");
				param.put("flag", "success");
			}
		}
		boolean isPushAtt = false;		// class별, 출결알림 발송 여부

		if( todayBus != null && (StringUtil.isBlank(todayBus.getString("use_att_push")) || "Y".equals(todayBus.getString("use_att_push"))) ) {
			isPushAtt = true;
		}

		/*	성공시.. 승/하차에 대한 푸시메세지 발송	*/
		if("success".equals(param.getString("flag")) && isPushAtt && "true".equals(param.getString("isSendingMsg"))) {
			List<UserDevice> parentDeviceList = attendanceDAO.selectParentDevice(param);		// 부모 디바이스 리스트 조회

			if(parentDeviceList != null && !parentDeviceList.isEmpty()) {
				String currentTime = DateUtil.getDate("HH시 mm분");
				PushMessage pushMessage = new PushMessage();

				String title = "", ticker = "";
				if("001".equals(param.getString("dataType"))) {
					/*	등,하원 알림 발송	*/
					title = hakwonInfo.getString("user_name") + "님이 " + hakwonInfo.getString("hakwon_name");
					if("start".equals(param.getString("attendanceType"))) {
						title += "에 등원 하셨습니다.";
						ticker = hakwonInfo.getString("hakwon_name")+" 등원 알림";
					} else {
						title += "에서 하원 하셨습니다.";
						ticker = hakwonInfo.getString("hakwon_name")+" 하원 알림";
					}
				} else {
					/*	승,하차 알림 발송	*/
					title = hakwonInfo.getString("user_name") + "님이 '" + hakwonInfo.getString("hakwon_name");
					if("start".equals(param.getString("attendanceType"))) {
						title += "'버스에 승차 하셨습니다.(" + currentTime + ")";
						ticker = hakwonInfo.getString("hakwon_name")+" 승차 알림";
					} else {
						title += "'버스에서 하차 하셨습니다.(" + currentTime + ")";
						ticker = hakwonInfo.getString("hakwon_name")+" 하차 알림";
					}
				}

				pushMessage.setTicker(ticker);
				pushMessage.setTitle(title);
				pushMessage.setContent(title);
				pushMessage.setImage_url("");
				pushMessage.setLink_url("https://m.hakwonband.com/attendanceList.do?student_no="+hakwonInfo.getString("user_no")+"&attendance_no="+attendance_no+"&attendance_type="+param.getString("attendanceType")+"&t="+System.currentTimeMillis());

				DevicePushData devicePushData = new DevicePushData(pushMessage, parentDeviceList);
				param.put("devicePushData",	devicePushData);
			}
		}

		return param;
	}

	/**
	 * 월별 출결 데이타
	 * @param param
	 * @return
	 */
	public List<DataMap> getAttendanceMonthList(DataMap param) {
		List<DataMap> userList = attendanceDAO.getAttendanceMonthList(param);
		for(int i=0; i<userList.size(); i++) {
			DataMap userMap = userList.get(i);

			String days = userMap.getString("days");
			if( StringUtil.isNotBlank(days) ) {
				String [] dayArray = days.split(",");

				for(int j=0; j<dayArray.length; j++) {
					userMap.put(dayArray[j],	"O");
				}
			}
		}
		return userList;
	}
	/**
	 * 이번주의 출결 결과 리스트
	 * @param param
	 * @return
	 */
	public DataMap getAttendanceWeekList(DataMap param) {

		List<DataMap> studentList = null;		// 학생 리스트
		List<DataMap> attendanceList = null;	// 출결 리스트

		/*	학생 전체 카운트	*/
		int studentCount = attendanceDAO.getStudentCount(param);

		if(studentCount > 0) {
			/*	학생 리스트	*/
			studentList = attendanceDAO.getAttendanceStudentList(param);

			/*	주간 출결 리스트 조회	*/
			String students = "";
			for(int i=0,imax=studentList.size(); i<imax; i++) {
				if(i != 0) students += ",";
				students += studentList.get(i).getString("user_no");
			}
			param.put("students", students);
			attendanceList = attendanceDAO.getAttendanceWeekList(param);

			/*	학생 정보에 출결리스트 담기	*/
			String startDate = param.getString("startDate");
			List<String> dates = HakwonUtilSupportBox.getDates(startDate, param.getString("endDate"), "yyyy-MM-dd");	// 이번주 날짜 구하기.

			String userNo;
			String studentNo;
			String attDate;
			for(int i=0,imax=studentList.size(); i<imax; i++) {
				userNo = studentList.get(i).getString("user_no");
				for(int j=0,jmax=attendanceList.size(); j<jmax; j++) {
					studentNo = attendanceList.get(j).getString("student_no");
					attDate = attendanceList.get(j).getString("att_date");
					if(userNo.equals(studentNo)) {
						if(startDate.equals(attDate)) {
							studentList.get(i).put("mon", "O");
						} else if(dates.get(0).equals(attDate)) {
							studentList.get(i).put("tue", "O");
						} else if(dates.get(1).equals(attDate)) {
							studentList.get(i).put("wed", "O");
						} else if(dates.get(2).equals(attDate)) {
							studentList.get(i).put("thu", "O");
						} else if(dates.get(3).equals(attDate)) {
							studentList.get(i).put("fri", "O");
						} else if(dates.get(4).equals(attDate)) {
							studentList.get(i).put("sat", "O");
						} else if(dates.get(5).equals(attDate)) {
							studentList.get(i).put("sun", "O");
						}
					}
				}
			}
		}

		DataMap result = new DataMap();
		result.put("totalCount", studentCount);
		result.put("studentList", studentList);

		return result;
	}

	/**
	 *  출결 일괄 처리
	 * @param param
	 * @return
	 */
	public DataMap allAttendance(DataMap param) {
		DataMap rtnMap = new DataMap();

		List<DevicePushData> deviceList = new ArrayList<DevicePushData>();

		List<DataMap> unavailableList = new ArrayList<DataMap>();		// 출결처리 실패한 학생들 리스트

		String[] studentNoArr	= (String[]) param.get("studentArray");
		String attType			= param.getString("attType");
		boolean alramFlag		= "true".equals(param.getString("alramFlag"));	// 알림발송 boolean

		/*	등하원으로	*/
		param.put("dataType", "001");

		/*	등/하원 가능한 학생에 대한 정렬	*/
		for(String studentNo : studentNoArr) {
			/*	출결처리 할려는 학생정보와 오늘 출결정보 조회	*/
			param.put("studentNo",	studentNo);
			DataMap studentInfo	= attendanceDAO.getAttendanceNStudentInfo(param);
			String startDate	= studentInfo.getString("start_date");
			String endDate		= studentInfo.getString("end_date");
			String attendanceNo	= "";

			if("start".equals(attType)) {
				/*	등원처리	*/
				if((startDate == null && endDate == null) || (startDate != null && endDate != null)) {
					/*	등원처리 가능	*/
					attendanceDAO.insertAttendance(param);
					attendanceNo = param.getString("idx");
				} else {
					/*	등원처리 불가능	*/
					studentInfo.put("reason", "unavailable");
					unavailableList.add(studentInfo);
				}
			} else {
				/*	하원처리	*/
				if(startDate != null && endDate == null) {
					/*	하원처리 가능	*/
					param.put("startDate", startDate);
					attendanceDAO.updateAttendance(param);
					attendanceNo = studentInfo.getString("attendance_no");
				} else {
					/*	하원처리 불가능	*/
					studentInfo.put("reason", "unavailable");
					unavailableList.add(studentInfo);
				}
			}

			/*	출결처리 성공시 알림 발송	*/
			if( alramFlag && StringUtil.isNotBlank(attendanceNo) ) {
				deviceList.add(pushAttMessage(param, studentInfo, attendanceNo));
			}
		}

		rtnMap.put("deviceList",		deviceList);
		rtnMap.put("unavailableList",	unavailableList);

		return rtnMap;
	}

	/**
	 * class의 출결 알림 발송 설정
	 * @param param
	 */
	public void pushActive(DataMap param) {
		attendanceDAO.pushActive(param);
	}

	public String getPushActive(DataMap param) {
		/*	class의 알림발송 사용여부	*/
		return attendanceDAO.getUseAttPush(param);
	}

	/**
	 * 출결 알림 발송 : 일괄처리용
	 * @param param
	 * @param studentInfo
	 * @param attendanceNo
	 */
	private DevicePushData pushAttMessage(DataMap param, DataMap studentInfo, String attendanceNo) {
		DevicePushData devicePushData = null;
		List<UserDevice> parentDeviceList = attendanceDAO.selectParentDevice(param);		// 부모 디바이스 리스트 조회

		if(parentDeviceList != null && !parentDeviceList.isEmpty()) {
			String currentTime = DateUtil.getDate("HH시 mm분");
			PushMessage pushMessage = new PushMessage();

			String title = "", ticker = "";
			if("001".equals(param.getString("dataType"))) {
				/*	등,하원 알림 발송	*/
				title = studentInfo.getString("user_name") + "님이'" + studentInfo.getString("hakwon_name");
				if("start".equals(param.getString("attType"))) {
					title += "에 등원 하셨습니다.";
					ticker = studentInfo.getString("hakwon_name")+" 등원 알림";
				} else {
					title += "에서 하원 하셨습니다.";
					ticker = studentInfo.getString("hakwon_name")+" 하원 알림";
				}
			} else {
				/*	승,하차 알림 발송	*/
				title = studentInfo.getString("user_name") + "님이 '" + studentInfo.getString("hakwon_name");
				if("start".equals(param.getString("attType"))) {
					title += "'버스에 승차 하셨습니다.(" + currentTime + ")";
					ticker = studentInfo.getString("hakwon_name")+" 승차 알림";
				} else {
					title += "'버스에서 하차 하셨습니다.(" + currentTime + ")";
					ticker = studentInfo.getString("hakwon_name")+" 하차 알림";
				}
			}

			pushMessage.setTicker(ticker);
			pushMessage.setTitle(title);
			pushMessage.setContent(title);
			pushMessage.setImage_url("");
			pushMessage.setLink_url("https://m.hakwonband.com/attendanceList.do?student_no="+studentInfo.getString("user_no")+"&attendance_no="+attendanceNo+"&attendance_type="+param.getString("attType")+"&t="+System.currentTimeMillis());

			devicePushData = new DevicePushData(pushMessage, parentDeviceList);
		}

		return devicePushData;
	}


	/**
	 * 학원 소속 학생들의 한달치 출결 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> getAttendanceMonth(DataMap param) {

		/*	이번달 구하기	*/
		String startDate = DateUtil.getDate("yyyy-MM");
		String endDate = startDate;
		String[] currentDate = startDate.split("-");

		startDate += "-01";
		endDate += ("-" + DateUtil.getLastDay(Integer.parseInt(currentDate[0]), Integer.parseInt(currentDate[1])));

		param.put("startDate", startDate);
		param.put("endDate", endDate);

		/*	이번달의 월 리스트 구하기	*/
		List<String> daysOfMonth = new ArrayList<String>();
		daysOfMonth.add(startDate);
		daysOfMonth.addAll(HakwonUtilSupportBox.getDates(startDate, endDate, "yyyy-MM-dd"));
		daysOfMonth.add(endDate);


		/*	학원 소속 학생 조회	*/
		List<DataMap> studentList = attendanceDAO.getHakwonStudents(param);

		DataMap attendance;
		for(int i=0,imax=studentList.size(); i<imax; i++) {
			param.put("studentNo", studentList.get(i).getString("user_no"));
			attendance = attendanceDAO.getAttendanceMonth(param);

			String[] attDates = attendance.getString("att_date").split(",");

			for(String str : daysOfMonth) {

			}

			studentList.get(i).put("att_date", attendance.getString("att_date"));
		}

		return null;
	}
}