package hakwonband.mobile.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.mobile.dao.AddressDAO;
import hakwonband.util.DataMap;

/**
 * 주소 서비스
 * @author bumworld
 *
 */
@Service
public class AddressService {

	public static final Logger logger = LoggerFactory.getLogger(AddressService.class);

	@Autowired
	private AddressDAO addressDAO;

	/**
	 * 시도 리스트
	 * @param param
	 * @return
	 */
	public List<String> sidoList(DataMap param) {
		return addressDAO.sidoList(param);
	}

	/**
	 * 구군 리스트
	 * @param param
	 * @return
	 */
	public List<String> gugunList(DataMap param) {
		return addressDAO.gugunList(param);
	}
}