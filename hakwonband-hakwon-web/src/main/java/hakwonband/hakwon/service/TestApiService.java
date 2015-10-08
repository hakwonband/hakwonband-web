package hakwonband.hakwon.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.hakwon.dao.FileDAO;
import hakwonband.util.DataMap;

/**
 * 테스트 API 서비스 (DAO, XML만 존재하는 몇몇 기능의 API테스트를 위해 임시 생성)
 * @author jrlim
 */
@Service
public class TestApiService {

	public static final Logger logger = LoggerFactory.getLogger(TestApiService.class);

	@Autowired
	private FileDAO fileDAO;

	/**
	 * 특정 컨텐츠의 파일 정보 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> fileList(DataMap param) {
		logger.debug("fileList param["+param+"]");

		/* 댓글 목록 */
		return fileDAO.fileList(param);
	}
}
