package hakwonband.down.controller;

import hakwonband.common.BaseAction;
import hakwonband.down.service.CommonService;
import hakwonband.util.CommonConfig;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;

import javax.activation.MimetypesFileTypeMap;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 공통 컨트롤러
 * @author bumworld
 *
 */
@Controller
public class CommonController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(CommonController.class);


	@Resource(name = "messageSourceAccessor")
	protected MessageSourceAccessor messageSource;

	@Autowired
	private CommonService commonService;

	/**
	 * 첨부 파일 디렉토리
	 */
	private static final String STORAGE_DIR = CommonConfig.getString("fileServer/storage/dir");

	/**
	 * 문의 메일
	 *
	 * @param request
	 * @param response
	 */
	@RequestMapping("/down")
	public void down(HttpServletRequest request, HttpServletResponse response) throws Exception {

		InputStream in = null;
		OutputStream out = null;

		String path = request.getParameter("path");

		String userAgent = request.getHeader("User-Agent");

		logger.info("path : " + path);

		try {
			DataMap param = new DataMap();
			param.put("filePath", path);
			DataMap fileInfo = commonService.fileInfo(param);
			logger.info("fileInfo : " + fileInfo);

			String fileName = fileInfo.getString("file_name");
			logger.info("fileName["+fileName+"]");
			String mimeType = fileInfo.getString("file_ext_type");
			try {
				logger.info("User-Agent["+userAgent+"] MSIE["+userAgent.indexOf("MSIE")+"]");
				boolean isInternetExplorer = (userAgent.indexOf("MSIE") > -1);

				if( isInternetExplorer ) {
					fileName = new String(fileName.getBytes("EUC-KR"), "8859_1");
				} else if( userAgent.indexOf("Android 5.") >= 0 ) {
					fileName = new String(fileName.getBytes("UTF-8"), "8859_1");
				} else {
					fileName = new String(fileName.getBytes("UTF-8"), "8859_1");
				}
			} catch (UnsupportedEncodingException e) {
				logger.error("", e);
			}
			if( StringUtil.isBlank(mimeType) ) {
				mimeType = "application/octet-stream";
			}
			logger.info("mimeType : " + mimeType);
//			response.setContentType(mimeType);
	        response.setContentLength(fileInfo.getInt("file_size"));
	        response.setHeader("Content-Transfer-Encoding", "binary");
	        response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");

			in = new FileInputStream(STORAGE_DIR+path);
		    out = response.getOutputStream();
		    IOUtils.copy(in, out);
		} finally {
		    IOUtils.closeQuietly(in);
		    IOUtils.closeQuietly(out);
		}
	}
}