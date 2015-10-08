package hakwonband.mobile.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.mobile.dao.AttendanceDAO;
import hakwonband.util.DataMap;

/**
 * 출결 서비스
 * @author eggrok-home
 *
 */
@Service
public class AttendanceService {

	@Autowired
	private AttendanceDAO attendanceDao;

	public static final Logger logger = LoggerFactory.getLogger(AttendanceService.class);

	/**
	 * 출결 데이타 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> selectAttendanceList(DataMap param) {
		/*	출결정보 조회	*/
		List<DataMap> attendanceList = attendanceDao.selectAttendanceList(param);

		return attendanceList;
	}

}