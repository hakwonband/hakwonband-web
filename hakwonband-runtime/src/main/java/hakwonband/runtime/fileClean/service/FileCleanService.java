package hakwonband.runtime.fileClean.service;

import hakwonband.runtime.fileClean.dao.FileCleanDAO;
import hakwonband.util.DataMap;

import java.io.File;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 파일 관리
 *
 * @author bumworld
 */
@Service
public class FileCleanService {

	public static final Logger logger = LoggerFactory.getLogger(FileCleanService.class);

	@Autowired
	private FileCleanDAO fileCleanDAO;

	/**
	 * 사용하지 않는 파일 삭제
	 */
	public void deleteUnUsingFile() {

		logger.info("unUsingFileRemove start");

		/*	사용하지 않는 파일 리스트 조회	*/
		List<DataMap> unUsingFileList = fileCleanDAO.getUnUsingFileList();
		logger.debug("unUsingFileList size : " + unUsingFileList.size());
		if( unUsingFileList != null && unUsingFileList.size() > 0 ) {
			for(int i=0; i<unUsingFileList.size(); i++) {
				DataMap fileInfo = unUsingFileList.get(i);

				String fileNo			= fileInfo.getString("file_no");
				String saveFileName		= fileInfo.getString("save_file_name");
				String filePath			= fileInfo.getString("file_path");
				String thumbFilePath	= fileInfo.getString("thumb_file_path");
				String mobileFilePath	= fileInfo.getString("mobile_file_path");
				String filePathPrefix	= fileInfo.getString("file_path_prefix");

				try {
					File originFile	= new File(filePathPrefix+filePath);
					File thumbFile	= new File(filePathPrefix+thumbFilePath);
					File mobileFile	= new File(filePathPrefix+mobileFilePath);
					if( originFile != null && originFile.exists() ) {
						boolean result = originFile.delete();
						if( result == false ) {
							logger.error("fileNo["+fileNo+"] filePath["+originFile.getAbsolutePath()+"]");
						} else {
							logger.debug("del filePath["+originFile.getAbsolutePath()+"]");
						}
					} else {
						logger.debug("NO originFile["+originFile.getAbsolutePath()+"]");
					}
					if( thumbFile != null && thumbFile.exists() ) {
						boolean result = thumbFile.delete();
						if( result == false ) {
							logger.error("fileNo["+fileNo+"] filePath["+thumbFile.getAbsolutePath()+"]");
						} else {
							logger.debug("del filePath["+thumbFile.getAbsolutePath()+"]");
						}
					} else {
						logger.debug("NO thumbFile["+thumbFile.getAbsolutePath()+"]");
					}

					//fileCleanDAO.unUsingFileDelete(fileInfo);
				} catch(Exception e) {
					logger.error("파일 삭제 처리 실패\n"+fileInfo, e);
				}
			}
		}

		logger.info("unUsingFileRemove END");
	}
}