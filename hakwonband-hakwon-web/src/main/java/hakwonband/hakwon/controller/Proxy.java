package hakwonband.hakwon.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Proxy extends HttpServlet {

	private ServletContext servletContext;
	private static final Logger logger = LoggerFactory.getLogger(Proxy.class);

	public void init(ServletConfig servletConfig) throws ServletException {
		servletContext = servletConfig.getServletContext();
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) {
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) {

		BufferedInputStream webToProxyBuf = null;
		BufferedOutputStream proxyToClientBuf = null;
		HttpURLConnection con = null;

		try {
			int statusCode;
			int oneByte;
			String methodName;

			String urlString = request.getRequestURL().toString();
			String queryString = request.getQueryString();

			urlString += queryString == null ? "" : "?" + queryString;
			URL url = new URL(urlString);

			logger.info("Fetching >" + url.toString());

			con = (HttpURLConnection) url.openConnection();

			methodName = request.getMethod();
			con.setRequestMethod(methodName);
			con.setDoOutput(true);
			con.setDoInput(true);
			con.setFollowRedirects(false);
			con.setUseCaches(true);

			for (Enumeration enums = request.getHeaderNames(); enums.hasMoreElements();) {
				String headerName = enums.nextElement().toString();
				con.setRequestProperty(headerName, request.getHeader(headerName));
			}
			con.connect();

			if (methodName.equals("POST")) {
				BufferedInputStream clientToProxyBuf = new BufferedInputStream(request.getInputStream());
				BufferedOutputStream proxyToWebBuf = new BufferedOutputStream(con.getOutputStream());

				while ((oneByte = clientToProxyBuf.read()) != -1) {
					proxyToWebBuf.write(oneByte);
				}
				proxyToWebBuf.flush();
				proxyToWebBuf.close();
				clientToProxyBuf.close();
			}

			statusCode = con.getResponseCode();
			response.setStatus(statusCode);

			for (Iterator i = con.getHeaderFields().entrySet().iterator(); i.hasNext();) {
				Map.Entry mapEntry = (Map.Entry) i.next();
				if (mapEntry.getKey() != null) {
					response.setHeader(mapEntry.getKey().toString(), ((List) mapEntry.getValue()).get(0).toString());
				}
			}

			webToProxyBuf = new BufferedInputStream(con.getInputStream());
			proxyToClientBuf = new BufferedOutputStream(response.getOutputStream());

			while ((oneByte = webToProxyBuf.read()) != -1) {
				proxyToClientBuf.write(oneByte);
			}
		} catch (Exception e) {
			logger.error("", e);
		} finally {
			try {
				if( proxyToClientBuf != null ) {
					proxyToClientBuf.flush();
					proxyToClientBuf.close();
				}

				if( webToProxyBuf != null ) {
					webToProxyBuf.close();
				}
				if( con != null ) {
					con.disconnect();
				}
			} catch(Exception e) {
				logger.error("", e);
			}
		}
	}
}