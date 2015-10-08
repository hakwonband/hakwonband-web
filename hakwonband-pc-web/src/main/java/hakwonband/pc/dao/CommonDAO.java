package hakwonband.pc.dao;

import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

import java.util.List;

public interface CommonDAO {


	/**
	 * 문의 메일 등록
	 * @param param
	 */
	public void insertQuestionsMail(DataMap param);

	/**
	 * 관리자 디바이스 리스트 조회
	 * @return
	 */
	public List<UserDevice> adminDeviceList();
}