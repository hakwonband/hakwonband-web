package hakwonband.runtime.main;

import hakwonband.runtime.core.HakwonRuntime;
import hakwonband.runtime.hakwonExcel.service.HakwonExcelService;
import hakwonband.util.DataMap;
import hakwonband.util.HKBandUtil;

import org.apache.commons.lang.StringUtils;
import org.springframework.util.StopWatch;

public class HakwonExcelMain extends HakwonRuntime {

	public HakwonExcelMain(String filePath) {
		super();

		DataMap param = new DataMap();
		param.put("filePath", filePath);
		/**
		 * 메일 발송
		 */
		run(HakwonExcelService.class, "startProcess", param);
	}

    /**
     * 파일 관리
     * 1. 사용하지 않는 파일 삭제
     * 2. 모바일 파일이 생성되지 않은 파일 생성
     * @param args
     */
    public static void main(String[] args) {
    	String filePath = "d:/work/test2.xlsx";
    	
    	/**
		 * 로컬 실행일 경우에만 실행
		 */
		if( StringUtils.isBlank(HKBandUtil.getSysEnv("server.type")) ) {
			System.setProperty("server.type", "local");
		}
		System.setProperty("runtime.service.name", "hakwonExcel");
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		new HakwonExcelMain(filePath);
		System.out.println(stopWatch.getTotalTimeMillis());
    }
}