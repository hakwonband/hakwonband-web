package hakwonband.manager.service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.manager.dao.CommonDAO;
import hakwonband.manager.dao.FileDAO;
import hakwonband.manager.dao.HakwonDAO;
import hakwonband.manager.dao.NoticeDAO;
import hakwonband.manager.dao.ReadDAO;
import hakwonband.manager.dao.ReplyDAO;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 공지 서비스
 * @author bumworld
 *
 */
@Service
public class NoticeService {

	public static final Logger logger = LoggerFactory.getLogger(NoticeService.class);

	@Autowired
	private NoticeDAO noticeDAO;

	@Autowired
	private FileService fileService;

	@Autowired
	private FileDAO fileDAO;

	@Autowired
	private ReplyDAO replyDAO;

	@Autowired
	private ReadDAO readDAO;

	@Autowired
	private CommonDAO commonDAO;

	@Autowired
	private HakwonDAO hakwonDAO;

	/**
	 * 공지사항 목록 조회
	 * @param param
	 * @return
	 */
	public DataMap noticeList(DataMap param) {
		DataMap noticeMap = new DataMap();

		List<DataMap> noticeList = noticeDAO.noticeList(param);
		int noticeCount	= noticeDAO.noticeListTotCount(param);

		noticeMap.put("noticeList", noticeList);
		noticeMap.put("noticeCount", noticeCount);
		noticeMap.put("page_scale", param.getString("page_scale"));

		return noticeMap;
	}

	/**
	 * 공지사항 상세
	 * @param param
	 * @return
	 */
	public DataMap noticeDetail(DataMap param) {

		logger.debug("param", param);

		DataMap noticeDetail = noticeDAO.noticeDetail(param);

		/* 공지사항 댓글 리스트 조회 */
		List<DataMap> replyList = replyDAO.replyList(param);

		/* 공지사항 파일 리스트 조회 */
		List<DataMap> fileList = fileDAO.fileList(param);

		/* 상세확인시, 기존 읽은상태정보 체크 */
		int resultReadCount = readDAO.contentReadCount(param);
		int resultInsert = 0;

		if (resultReadCount == 0) {
			/* 읽은 컨텐츠로 등록 */
			resultInsert = readDAO.insertContentRead(param);
			if (resultInsert != 1) {
				throw new HKBandException("ReadDAO.insertContentRead error [" + resultInsert + "],[" + param + "]");
			}
		}

		DataMap resultObj = new DataMap();

		resultObj.put("result",				CommonConstant.Flag.success);
		resultObj.put("noticeDetail",		noticeDetail);
		resultObj.put("replyList",			replyList);
		resultObj.put("fileList",			fileList);
		resultObj.put("insertContentRead", 	resultInsert);

		return resultObj;
	}

	/**
	 * 공지사항 등록
	 * @param param
	 * @return
	 */
	public DataMap registNotice(DataMap param) {
		logger.debug("registNotice param["+param+"]");

		/* 공지사항 등록 */
		int resultInsert = noticeDAO.noticeInsert(param);

		if (resultInsert != 1) {
			throw new HKBandException("NoticeDAO.resultInsert error [" + resultInsert + "],[" + param + "]");
		}

		/* 공지사항 번호를 파일 부모번호로 입력 */
		long noticeNo = param.getLong("idx");
		param.put("file_parent_no", noticeNo);

		/* 공지사항 파일정보들 업데이트 */
		DataMap updateFile = new DataMap();
		if (StringUtil.isNotBlank( (String)param.get("file_no_list") )) {
			updateFile = fileService.updateFile(param);
		}

		DataMap resultObj = new DataMap();
		resultObj.put("result", 			CommonConstant.Flag.success);
		resultObj.put("noticeInsert", 		resultInsert);
		resultObj.put("resultUpdateFile",	updateFile.get("resultUpdateFile"));
		resultObj.put("updateFileCount",	updateFile.get("updateFileCount"));

		return resultObj;
	}

	/**
	 * 학원, 반 공지사항 수정
	 * @param param
	 * @return
	 */
	public DataMap editNotice(DataMap param) {
		logger.debug("editNotice param["+param+"]");

		/* 공지사항 변경 */
		int resultUpdate = noticeDAO.noticeUpdate(param);
		if (resultUpdate != 1) {
			throw new HKBandException("NoticeDAO.noticeUpdate error [" + resultUpdate + "],[" + param + "]");
		}

		/**
		 * 공지사항 파일 수정
		 * 1. 기존 파일 모두 unUsingUpdate 하고
		 * 2. 남은 파일을 다시 UsingUpdate 한다.
		 */
		int usingFiles		= 0;

		DataMap fileParam = new DataMap();
		fileParam.put("file_parent_no",		param.getString("notice_no"));
		fileParam.put("file_parent_type",	CommonConstant.File.TYPE_NOTICE);
		fileParam.put("reg_user_no",		param.getString("user_no"));
		fileParam.put("user_type",			param.getString("user_type"));
		int unUsingFiles = fileDAO.unUsingUpdate(fileParam);
		if (param.isNotNull("file_no_list")) {
			/*	남은 파일들을 다시 사용 상태로 업데이트	*/
			fileParam.put("file_no_list",		param.getString("file_no_list"));
			usingFiles = fileDAO.usingUpdate(fileParam);
		}

		DataMap resultObj = new DataMap();
		resultObj.put("result", 		CommonConstant.Flag.success);
		resultObj.put("noticeUpdate", 	resultUpdate);
		resultObj.put("unUsingFiles", 	unUsingFiles);
		resultObj.put("usingFiles", 	usingFiles);
		return resultObj;
	}

	/**
	 * 학원, 반 공지사항 삭제
	 * @param param
	 * @return
	 */
	public DataMap deleteNotice(DataMap param) {
		logger.debug("deleteNotice param["+param+"]");

		/* 반공지사항 상태 삭제로 변경 */
		int resultDelete = noticeDAO.noticeDelete(param);

		if (resultDelete != 1) {
			throw new HKBandException("NoticeDAO.noticeDelete error [" + resultDelete + "],[" + param + "]");
		}

		DataMap resultObj = new DataMap();
		resultObj.put("result", CommonConstant.Flag.success);
		resultObj.put("noticeDelete", resultDelete);

		return resultObj;
	}
}