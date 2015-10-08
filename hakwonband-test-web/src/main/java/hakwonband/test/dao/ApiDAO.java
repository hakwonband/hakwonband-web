package hakwonband.test.dao;

import hakwonband.test.model.ApiForm;

import java.util.List;


public interface ApiDAO {


	/**
	 * api 등록
	 * @return
	 */
	public void insertApi(ApiForm apiForm);

	/**
	 * api 이력 등록
	 * @return
	 */
	public int insertApiHist(ApiForm apiForm);

	/**
	 * api 수정
	 * @return
	 */
	public int modifyApi(ApiForm apiForm);

	/**
	 * api 리스트 조회
	 * @param apiForm
	 * @return
	 */
	public List<ApiForm> selectApiList(ApiForm apiForm);

	/**
	 * api 조회
	 * @param apiForm
	 * @return
	 */
	public ApiForm selectApi(ApiForm apiForm);

	/**
	 * api 등록자 리스트
	 * @return
	 */
	public List<String> selectApiRegUserList();
}