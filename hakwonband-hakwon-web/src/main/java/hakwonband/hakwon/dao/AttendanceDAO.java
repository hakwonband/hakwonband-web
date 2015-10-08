package hakwonband.hakwon.dao;

import java.util.List;

import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

public interface AttendanceDAO {

	public void createAttCode(DataMap param);

	public DataMap selectAttCode(DataMap param);

	public DataMap selectStudentByAttCode(DataMap param);

	public DataMap selectHakwonInfo(DataMap param);

	public DataMap selectAttendance(DataMap param);

	public void insertAttendance(DataMap param);

	public void updateAttendance(DataMap param);

	public List<UserDevice> selectParentDevice(DataMap param);

	public DataMap selectStudent(DataMap param);

	public List<DataMap> selectAttendanceList(DataMap param);

	public List<DataMap> selectStudentHasNoCode();

	public void insertBusStart(DataMap param);

	public DataMap selectBusTime(DataMap param);

	public List<DataMap> getAttendanceStudentList(DataMap param);

	public int getStudentCount(DataMap param);

	public List<DataMap> getAttendanceWeekList(DataMap param);

	public void pushActive(DataMap param);

	public String getUseAttPush(DataMap param);

	/**
	 * 반 학생 리스트
	 */
	public List<DataMap> getClassStudentList(DataMap param);

	public List<DataMap> getUnableStartStudentList();

	public List<DataMap> getUnableEndStudentList();

	/**
	 * 일괄 출결 처리를 위한, 출결정보&학생정보 조회
	 * @param param
	 * @return
	 */
	public DataMap getAttendanceNStudentInfo(DataMap param);

	/**
	 * 학원 소속 학생 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> getHakwonStudents(DataMap param);

	/**
	 * 학생의 한달치 출결 조회
	 * @param param
	 * @return
	 */
	public DataMap getAttendanceMonth(DataMap param);

	/**
	 * 학원 학생별 월별 출결 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> getAttendanceMonthList(DataMap param);
}