package hakwonband.hakwon.controller;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.tika.Tika;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.service.HakwonService;
import hakwonband.hakwon.service.NoticeService;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 학원 컨트롤러
 * @author bumworld, jszzang9
 *
 */
@RequestMapping("/hakwon")
@Controller
public class HakwonController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(HakwonController.class);

	@Autowired
	private HakwonService hakwonService;

	@Autowired
	private NoticeService noticeService;

	/**
	 * 학원 카테고리 리스트
	 * @param request
	 * @param response
	 * @param reqParam
	 *
	 * /hakwon/cateList.do
	 *
	 */
	@RequestMapping("/cateList")
	public void hakwonCateList(HttpServletRequest request, HttpServletResponse response) {
		List<DataMap> hakwonCateList = hakwonService.hakwonCateList();

		sendList(hakwonCateList, request, response);
	}

	/**
	 * 학원 리스트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonList")
	public void hakwonList(HttpServletRequest request, HttpServletResponse response) {

		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("master_user_no", authUserInfo.getString("user_no"));

		sendList(hakwonService.hakwonList(param), request, response);
	}

	/**
	 * 학원 상세정보
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonDetail")
	public void hakwonDetail(HttpServletRequest request, HttpServletResponse response) {
		String hakwon_no = request.getParameter("hakwon_no");

		DataMap param = new DataMap();
		param.put("hakwon_no", hakwon_no);

		sendColData(hakwonService.hakwonDetail(param), request, response);
	}

	/**
	 * 학원 소개정보
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonIntroDetail")
	public void hakwonIntroDetail(HttpServletRequest request, HttpServletResponse response) {
		String hakwon_no = request.getParameter("hakwon_no");

		DataMap param = new DataMap();
		param.put("hakwon_no",			hakwon_no);
		param.put("file_parent_type",	CommonConstant.File.TYPE_INTRODUCTION);			// 파일타입 : 005 학원소개
		param.put("file_parent_no",		hakwon_no);		// 파일부모번호 : 학원번호

		sendColData(hakwonService.hakwonIntroDetail(param), request, response);
	}

	/**
	 * 학원내 반 리스트 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonClassList")
	public void hakwonClassList(HttpServletRequest request, HttpServletResponse response) {

		/*	인증정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no	= request.getParameter("hakwon_no");
		int page_no			= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale		= HakwonConstant.PageScale.CLASS_REQ;
		String search_text	= request.getParameter("search_text");

		DataMap param = new DataMap();
		param.put("hakwon_no",		hakwon_no);
		param.put("start_no",		(page_no-1)*page_scale);
		param.put("page_scale",		page_scale);
		param.put("search_text",	search_text);
		param.put("user_no",		authUserInfo.get("user_no"));
		param.put("user_type",		authUserInfo.get("user_type"));

		/* 반 리스트 조회 */
		DataMap colData = hakwonService.hakwonClassList(param);
		colData.put("pageScale", page_scale);

		sendColData(colData, request, response);
	}

	/**
	 * 반 선생님 목록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/classTeacherList")
	public void classTeacherList(HttpServletRequest request, HttpServletResponse response) {
		String class_no		= request.getParameter("class_no");
		int page_no			= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale		= HakwonConstant.PageScale.TEACHER_REQ;

		DataMap param = new DataMap();
		param.put("class_no",	class_no);
		param.put("start_no",	(page_no-1)*page_scale);
		param.put("page_scale",	page_scale);

		DataMap colData = hakwonService.classTeacherList(param);
		colData.put("pageScale", page_scale);

		sendColData(colData, request, response);
	}

	/**
	 * 반 상세조회 (소속 선생님 리스트 포함)
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonClassDetail")
	public void hakwonClassDetail(HttpServletRequest request, HttpServletResponse response) {
		String class_no = request.getParameter("class_no");

		DataMap param = new DataMap();
		param.put("class_no", class_no);

		/* 반 상세정보 조회 */
		sendColData(hakwonService.hakwonClassDetail(param), request, response);
	}

	/**
	 * 반에 학생 등록
	 * @param request
	 */
	@RequestMapping("/registClassStudent")
	public void registClassStudent(HttpServletRequest request, HttpServletResponse response) {

		String hakwon_no			= request.getParameter("hakwon_no");
		String class_no				= request.getParameter("class_no");
		String student_user_no		= request.getParameter("student_user_no");

		DataMap	param = new DataMap();
		param.put("hakwon_no", 			hakwon_no);
		param.put("class_no", 			class_no);
		param.put("student_user_no", 	student_user_no);

		/*	반에 등록	*/
		hakwonService.insertClassStudent(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 반 소속 학생 삭제
	 * @param request
	 * @param response
	 */
	@RequestMapping("/removeClassStudent")
	public void removeClassStudent(HttpServletRequest request, HttpServletResponse response) {

		/*	인증정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no			= request.getParameter("hakwon_no");
		String class_no				= request.getParameter("class_no");
		String student_user_no		= request.getParameter("student_user_no");

		DataMap param = new DataMap();
		param.put("hakwon_no", 			hakwon_no);
		param.put("class_no", 			class_no);
		param.put("student_user_no", 	student_user_no);
		param.put("user_no", 			authUserInfo.get("user_no"));

		/*	반에서 삭제	*/
		hakwonService.deleteClassStudent(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 학원 공지사항 리스트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonNoticeList")
	public void hakwonNoticeList(HttpServletRequest request, HttpServletResponse response) {

		/*	인증정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no	= request.getParameter("hakwon_no");
		int page_no			= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale		= HakwonConstant.PageScale.NOTICE_REQ;

		DataMap param = new DataMap();
		param.put("user_no", 			authUserInfo.get("user_no"));	// 현재 사용자의 공지사항 읽은상태 체크용
		param.put("notice_type",		"002");							// 공지사항 타입 = 학원 공지
		param.put("notice_parent_no",	hakwon_no);						// 공지사항 부모 번호 = 학원 번호
		param.put("start_no",			(page_no-1)*page_scale);
		param.put("page_scale",			page_scale);

		DataMap noticeMap = noticeService.noticeList(param);

		DataMap colData = new DataMap();
		colData.put("pageScale",			page_scale);
		colData.put("noticeList",			noticeMap.get("noticeList"));
		colData.put("noticeListTotCount",	noticeMap.get("noticeCount"));

		sendColData(colData, request, response);
	}

	/**
	 * 반 공지사항 리스트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/classNoticeList")
	public void classNoticeList(HttpServletRequest request, HttpServletResponse response) {

		/*	인증정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String class_no		= request.getParameter("class_no");
		int page_no			= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale		= HakwonConstant.PageScale.NOTICE_REQ;

		DataMap param = new DataMap();
		param.put("user_no", 			authUserInfo.get("user_no"));	// 현재 사용자의 공지사항 읽은상태 체크용
		param.put("notice_type",		"003");							// 공지사항 타입 = 반 공지
		param.put("notice_parent_no",	class_no);						// 공지사항 부모 번호 = 반 번호
		param.put("start_no",			(page_no-1)*page_scale);
		param.put("page_scale",			page_scale);

		/* 반 공지사항 리스트 조회 */
		DataMap noticeMap = noticeService.noticeList(param);

		DataMap colData = new DataMap();
		colData.put("pageScale",			page_scale);
		colData.put("classNoticeList",			noticeMap.get("noticeList"));
		colData.put("classNoticeListTotCount",	noticeMap.get("noticeCount"));

		sendColData(colData, request, response);
	}

	/**
	 * 공지사항 상제정보 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/noticeDetail")
	public void noticeDetail(HttpServletRequest request, HttpServletResponse response) {

		/* 인증 정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String notice_no = request.getParameter("notice_no");

		DataMap param = new DataMap();
		param.put("notice_no",			notice_no);
		param.put("content_type", 		"001");								// 댓글 컨텐츠 타입 001 공지
		param.put("content_parent_no",	notice_no);
		param.put("file_parent_type",	CommonConstant.File.TYPE_NOTICE);	// 파일 타입 001 공지
		param.put("file_parent_no",		notice_no);
		param.put("user_no", 			authUserInfo.get("user_no"));		// 읽은상태 등록시 사용

		/* 공지사항 상세조회, 공지사항 댓글 조회, 공지사항 파일 조회, 읽은상태 등록 */
		DataMap noticeDetail = noticeService.noticeDetail(param);

		sendColData(noticeDetail, request, response);
	}

	/**
	 * 공지사항 작성시 카테고리 리스트 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/noticeCateList")
	public void noticeCateList(HttpServletRequest request, HttpServletResponse response) {
		String hakwon_no = request.getParameter("hakwon_no");

		DataMap param = new DataMap();
		param.put("hakwon_no", hakwon_no);

		sendColData(hakwonService.getNoticeCateList(param), request, response);
	}

	/**
	 * 학원 반 리스트 전체
	 * @param request
	 * @param response
	 */
	@RequestMapping("/classListAll")
	public void hakwonClassListAll(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no = request.getParameter("hakwon_no");

		DataMap param = new DataMap();
		param.put("hakwon_no",	hakwon_no);
		param.put("user_no", 	authUserInfo.get("user_no"));		// 읽은상태 등록시 사용

		/*	학원 반 리스트	*/
		List<DataMap> classList = hakwonService.hakwonClassListAll(param);

		sendList(classList, request, response);
	}

	/**
	 * 학원 반 리스트 전체
	 * @param request
	 * @param response
	 */
	@RequestMapping("/search")
	public void search(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String search_text	= request.getParameter("search_text");
		String hakwon_no	= request.getParameter("hakwon_no");

		DataMap param = new DataMap();
		param.put("search_text",	search_text);
		param.put("hakwon_no",		hakwon_no);
		param.put("user_no", 		authUserInfo.get("user_no"));		// 읽은상태 등록시 사용

		/*	학원 리스트	*/
		List<DataMap> hakwonList = hakwonService.hakwonSearchList(param);

		sendList(hakwonList, request, response);
	}

	/**
	 * 학생 및 학부모 탈퇴
	 * @param request
	 * @param response
	 */
	@RequestMapping("/without")
	public void without(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String user_no		= request.getParameter("user_no");
		String hakwon_no	= request.getParameter("hakwon_no");

		DataMap param = new DataMap();
		param.put("user_no",			user_no);
		param.put("hakwon_no",			hakwon_no);
		param.put("master_user_no", 	authUserInfo.get("user_no"));		// 읽은상태 등록시 사용

		/*	멤버 삭제	*/
		hakwonService.deleteHakwonMember(param);


		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 엑셀 가입
	 * @param request
	 * @param response
	 */
	@RequestMapping("/excel_join")
	public void excelJoin(HttpServletRequest request, HttpServletResponse response) {

		DataMap colData = new DataMap();
		try {
			/*	인증 정보	*/
			DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

			MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
			MultiValueMap<String, MultipartFile> map = multipartRequest.getMultiFileMap();

			String hakwonNo		= multipartRequest.getParameter("hakwonNo");

			String newUploadDirPath = System.getProperty("java.io.tmpdir")+"/hakwon/";

			File dirFilePath = new File(newUploadDirPath);
			if( !dirFilePath.exists() ) {
				dirFilePath.mkdirs();
			}

			if(map != null) {
				@SuppressWarnings("rawtypes")
				Iterator iter = map.keySet().iterator();
				while(iter.hasNext()) {
					List<MultipartFile> fileList =  map.get(iter.next());
					for(MultipartFile mpf : fileList) {

						String uploadFilePath = newUploadDirPath + UUID.randomUUID().toString() + authUserInfo.getString("user_no");

						/*	파일 타입	*/
						String mimeType = (new Tika()).detect(mpf.getInputStream());
						logger.debug("mimeType : " + mimeType);

						/*	파일 이동	*/
						File newFile = new File(uploadFilePath);
						mpf.transferTo(newFile);

						List<DataMap> dataList = null;
						List<DataMap> resultList = new ArrayList<DataMap>();
						if( "application/x-tika-msoffice".equals(mimeType) ) {
							//	xls
							dataList = getXlsDataList(newFile);
						} else if( "application/x-tika-ooxml".equals(mimeType) ) {
							//	xlsx
							dataList = getXlsxDataList(newFile);
						}

						resultList = hakwonService.registExcelUser(hakwonNo, dataList);

						colData.put("resultList",	resultList);
						colData.put("fileNo",		"1");	//	임시로 넣는다.
					}
				}
			} else {
				throw new HKBandException();
			}
		} catch(Exception e) {
			logger.error("", e);
			colData.put("error",	"fail");
		} finally {
			sendColData(colData, request, response);
		}
	}

	/**
	 * xls 데이타 조회
	 * @param newFile
	 * @return
	 * @throws Exception
	 */
	private List<DataMap> getXlsDataList(File newFile) throws Exception {

		List<DataMap> list = new ArrayList<DataMap>();

		FileInputStream fis = null;
		try {
			fis		= new FileInputStream(newFile);
			HSSFWorkbook workbook	= new HSSFWorkbook(fis);

			int rowindex	= 0;
			int columnindex	= 0;
			//시트 수 (첫번째에만 존재하므로 0을 준다)

			//만약 각 시트를 읽기위해서는 FOR문을 한번더 돌려준다
			HSSFSheet sheet	= workbook.getSheetAt(0);

			//행의 수
			int rows = sheet.getPhysicalNumberOfRows();
			for(rowindex=1; rowindex<rows; rowindex++) {
				//행을 읽는다
				HSSFRow row = sheet.getRow(rowindex);
				if( row != null ) {

					DataMap userDataMap = new DataMap();

					//셀의 수
					int cells = row.getPhysicalNumberOfCells();
					for(columnindex=0; columnindex<=cells; columnindex++){
						//셀값을 읽는다
						HSSFCell cell = row.getCell(columnindex);
						String value="";
						//셀이 빈값일경우를 위한 널체크
						if( cell==null ) {
							continue;
						} else {
							//타입별로 내용 읽기
							switch (cell.getCellType()){
								case HSSFCell.CELL_TYPE_FORMULA:
									value=cell.getCellFormula();
									break;
								case HSSFCell.CELL_TYPE_NUMERIC:
									value=cell.getNumericCellValue()+"";
									break;
								case HSSFCell.CELL_TYPE_STRING:
									value=cell.getStringCellValue()+"";
									break;
								case HSSFCell.CELL_TYPE_BLANK:
									value=cell.getBooleanCellValue()+"";
									break;
								case HSSFCell.CELL_TYPE_ERROR:
									value=cell.getErrorCellValue()+"";
									break;
							}
						}

						if( columnindex == 0 ) {
							userDataMap.put("type", value);
						} else if( columnindex == 1 ) {
							userDataMap.put("user_name", value);
						} else if( columnindex == 2 ) {
							userDataMap.put("user_id", value);
						} else if( columnindex == 3 ) {
							userDataMap.put("passwd", value);
						} else if( columnindex == 4 ) {
							userDataMap.put("user_email", value);
						} else if( columnindex == 5 ) {
							userDataMap.put("sex", value);
						} else if( columnindex == 6 ) {
							userDataMap.put("birthday", value);
						} else if( columnindex == 7 ) {
							userDataMap.put("tel", value);

							list.add(userDataMap);
						}
					}
				}
			}
		} finally {
			if( fis != null ) {
				fis.close();
			}
		}

		return list;
	}

	/**
	 * xlsx 데이타 조회
	 * @param newFile
	 * @return
	 * @throws Exception
	 */
	private List<DataMap> getXlsxDataList(File newFile) throws Exception {

		List<DataMap> list = new ArrayList<DataMap>();

		FileInputStream fis = null;
		try {
			fis		= new FileInputStream(newFile);
			XSSFWorkbook workbook	= new XSSFWorkbook(fis);

			int rowindex	= 0;
			int columnindex	= 0;
			//시트 수 (첫번째에만 존재하므로 0을 준다)

			//만약 각 시트를 읽기위해서는 FOR문을 한번더 돌려준다
			XSSFSheet sheet = workbook.getSheetAt(0);

			//행의 수
			int rows = sheet.getPhysicalNumberOfRows();
			for(rowindex=1; rowindex<rows; rowindex++) {
				//행을 읽는다
				XSSFRow row = sheet.getRow(rowindex);
				if( row != null ) {

					DataMap userDataMap = new DataMap();

					//셀의 수
					int cells = row.getPhysicalNumberOfCells();
					for(columnindex=0; columnindex<=cells; columnindex++){
						//셀값을 읽는다
						XSSFCell cell = row.getCell(columnindex);
						String value="";
						//셀이 빈값일경우를 위한 널체크
						if( cell==null ) {
							continue;
						} else {
							//타입별로 내용 읽기
							switch (cell.getCellType()){
								case HSSFCell.CELL_TYPE_FORMULA:
									value=cell.getCellFormula();
									break;
								case HSSFCell.CELL_TYPE_NUMERIC:
									value=cell.getNumericCellValue()+"";
									break;
								case HSSFCell.CELL_TYPE_STRING:
									value=cell.getStringCellValue()+"";
									break;
								case HSSFCell.CELL_TYPE_BLANK:
									value=cell.getBooleanCellValue()+"";
									break;
								case HSSFCell.CELL_TYPE_ERROR:
									value=cell.getErrorCellValue()+"";
									break;
							}
						}

						if( columnindex == 0 ) {
							userDataMap.put("type", value);
						} else if( columnindex == 1 ) {
							userDataMap.put("user_name", value);
						} else if( columnindex == 2 ) {
							userDataMap.put("user_id", value);
						} else if( columnindex == 3 ) {
							userDataMap.put("passwd", value);
						} else if( columnindex == 4 ) {
							userDataMap.put("user_email", value);
						} else if( columnindex == 5 ) {
							userDataMap.put("sex", value);
						} else if( columnindex == 6 ) {
							userDataMap.put("birthday", value);
						} else if( columnindex == 7 ) {
							userDataMap.put("tel", value);

							list.add(userDataMap);
						}
					}
				}
			}
		} finally {
			if( fis != null ) {
				fis.close();
			}
		}


		return list;
	}
}