package hakwonband.mobile.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 출결 다오
 * @author eggrok-home
 *
 */
public interface AttendanceDAO {

	List<DataMap> selectAttendanceList(DataMap param);

	DataMap selectStudentInfo(DataMap param);

}