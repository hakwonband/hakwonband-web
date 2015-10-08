package hakwonband.mobile.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.mobile.dao.FileDAO;
import hakwonband.mobile.dao.UserDAO;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 파일 서비스
 * @author bumworld
 *
 */
@Service
public class FileService {

	public static final Logger logger = LoggerFactory.getLogger(FileService.class);

	@Autowired
	private FileDAO fileDAO;

	@Autowired
	private UserDAO userDAO;

	/**
	 * 파일 등록
	 * @param param
	 * @return
	 */
	public long insertFile(DataMap param) {
		fileDAO.insertFile(param);

		long fileNo = param.getLong("id");

		/**
		 * 프로필 사진이면 사용자 프로필 번호 업데이트
		 */
		if( param.equals("file_parent_type", CommonConstant.File.TYPE_PROFILE) ) {
			param.put("photo_file_no", fileNo);

			int resultUpdate = userDAO.updateUserPhoto(param);

			if (resultUpdate != 1) {
				throw new HKBandException("UserDAO.updateUserPhoto error resultUpdate["+resultUpdate+"]");
			}
		}

		return fileNo;
	}

	/**
	 * 파일들을 소유한 부모번호 업데이트
	 * @param param
	 * @return
	 */
	public DataMap updateFile(DataMap param) {
		logger.debug("updateFile param["+param+"]");

		String strFileList 		= (String) param.get("file_no_list");
		String [] tempFileList 	= strFileList.split(",");
		int fileNoCount			= tempFileList.length;

		/* 파일 등록자 validate */
		if (StringUtil.isBlank(String.valueOf(param.get("reg_user_no")))) {
			throw new HKBandException("FileService.updateFile error, is blank [reg_user_no]");
		}

		/* 파일정보 업데이트 */
		int resultUpdateCount = fileDAO.usingUpdate(param);

		if (resultUpdateCount != fileNoCount) {
			throw new HKBandException("FileDAO.updateFile error, update files : " + resultUpdateCount);
		}

		DataMap resultObj = new DataMap();
		resultObj.put("resultUpdateFile",	CommonConstant.Flag.success);
		resultObj.put("updateFileCount",	resultUpdateCount);

		return resultObj;
	}

	/**
	 * 파일 상태값 삭제로 변경
	 * @param param
	 * @return
	 */
	public DataMap deleteFile(DataMap param) {
		logger.debug("deleteFile param["+param+"]");

		/* 파일 상태값 삭제로 변경 */
		int resultDeleteCount = fileDAO.deleteFile(param);

		if (resultDeleteCount != 1) {
			throw new HKBandException("FileDAO.deleteFile error");
		}

		DataMap resultObj = new DataMap();
		resultObj.put("resultDeleteFile", CommonConstant.Flag.success);
		resultObj.put("deleteFileCount", resultDeleteCount);

		return resultObj;
	}

	/**
	 * 특정 컨텐츠의 파일 정보 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> fileList(DataMap param) {
		logger.debug("fileList param["+param+"]");

		/* 파일 목록 */
		return fileDAO.fileList(param);
	}
}
