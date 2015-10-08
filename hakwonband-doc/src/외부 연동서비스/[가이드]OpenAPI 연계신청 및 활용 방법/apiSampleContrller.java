import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springmodules.validation.commons.DefaultBeanValidator;


@Controller
@SessionAttributes(types=SampleVO.class)
public class EgovSampleController {
	

    @Resource(name = "sampleService")
    private EgovSampleService sampleService;
    

    @Resource(name = "propertiesService")
    protected EgovPropertyService propertiesService;


    @Resource(name = "beanValidator")
	protected DefaultBeanValidator beanValidator;
	
    @RequestMapping(value="/sample/getAddrApi.do")
    public void getAddrApi(@ModelAttribute("searchVO") SampleDefaultVO searchVO, HttpServletRequest req, ModelMap model, HttpServletResponse response) throws Exception {

    	String currentPage = req.getParameter("currentPage");
		String countPerPage = req.getParameter("countPerPage");
		String confmKey = req.getParameter("confmKey");
		String keyword = req.getParameter("keyword");
		String apiUrl = "http://www.juso.go.kr/addrlink/addrLinkApi.do?currentPage="+currentPage+"&countPerPage="+countPerPage+"&keyword="+URLEncoder.encode(keyword,"UTF-8")+"&confmKey="+confmKey;
		URL url = new URL(apiUrl);
    	BufferedReader br = new BufferedReader(new InputStreamReader(url.openStream(),"UTF-8"));
    	StringBuffer sb = new StringBuffer();
    	String tempStr = null;
    	while(true){
    		tempStr = br.readLine();
    		if(tempStr == null) break;
    		sb.append(tempStr);	
    	}
    	br.close();
    	response.setCharacterEncoding("UTF-8");
		response.setContentType("text/xml");
		response.getWriter().write(sb.toString());
    }
    
    @RequestMapping(value="/sample/getAddrApiTest.do")
    public void getAddrApiTest(@ModelAttribute("searchVO") SampleDefaultVO searchVO, HttpServletRequest req, ModelMap model, HttpServletResponse response) throws Exception {

    	String currentPage = req.getParameter("currentPage");
		String countPerPage = req.getParameter("countPerPage");
		String confmKey = req.getParameter("confmKey");
		String keyword = req.getParameter("keyword");
		String apiUrl = "http://www.juso.go.kr/addrlink/addrLinkApiTest.do?currentPage="+currentPage+"&countPerPage="+countPerPage+"&keyword="+URLEncoder.encode(keyword,"UTF-8")+"&confmKey="+confmKey;
		URL url = new URL(apiUrl);
    	BufferedReader br = new BufferedReader(new InputStreamReader(url.openStream(),"UTF-8"));
    	StringBuffer sb = new StringBuffer();
    	String tempStr = null;
    	while(true){
    		tempStr = br.readLine();
    		if(tempStr == null) break;
    		sb.append(tempStr);	
    	}
    	br.close();
    	response.setCharacterEncoding("UTF-8");
		response.setContentType("text/xml");
		response.getWriter().write(sb.toString());
    }
}
