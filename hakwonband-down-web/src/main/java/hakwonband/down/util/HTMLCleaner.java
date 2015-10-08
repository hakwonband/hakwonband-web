package hakwonband.down.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * HTMLCleaner
 * @author bumworld
 *
 */
public class HTMLCleaner {
	private static interface Patterns {
		// javascript tags and everything in between
		public static final Pattern SCRIPTS = Pattern.compile("<(no)?script[^>]*>.*?</(no)?script>", Pattern.DOTALL);

		public static final Pattern STYLE = Pattern.compile("<style[^>]*>.*</style>", Pattern.DOTALL);
		// HTML/XML tags

		public static final Pattern TAGS = Pattern.compile("<(\"[^\"]*\"|\'[^\']*\'|[^\'\">])*>");

		public static final Pattern nTAGS = Pattern.compile("<\\w+\\s+[^<]*\\s*>");
		// entity references
		public static final Pattern ENTITY_REFS = Pattern.compile("&[^;]+;");
		// repeated whitespace
		public static final Pattern WHITESPACE = Pattern.compile("\\s\\s+");
	}

	/**
	 * Clean the HTML input.
	 */
	public static String clean(String s) {
		if (s == null) {
			return null;
		}

		Matcher m;

		m = Patterns.SCRIPTS.matcher(s);
		s = m.replaceAll("");
		m = Patterns.STYLE.matcher(s);
		s = m.replaceAll("");
		m = Patterns.TAGS.matcher(s);
		s = m.replaceAll("");
		m = Patterns.ENTITY_REFS.matcher(s);
		s = m.replaceAll("");
		m = Patterns.WHITESPACE.matcher(s);
		s = m.replaceAll(" ");

		return s;
	}
}