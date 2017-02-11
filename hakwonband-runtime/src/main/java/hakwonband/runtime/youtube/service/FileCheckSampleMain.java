package hakwonband.runtime.youtube.service;

import java.io.File;
import java.io.FileInputStream;

import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.mp4.MP4Parser;
import org.apache.tika.sax.BodyContentHandler;

public class FileCheckSampleMain {

	public static void main(String[] args) {
		try {
			BodyContentHandler handler = new BodyContentHandler();
			Metadata metadata = new Metadata();
			FileInputStream inputstream = new FileInputStream(new File("D:/develop/workspace/project/hakwonband-web/hakwonband-runtime/src/main/resources/sample/aa.mp4"));
			ParseContext pcontext = new ParseContext();

			// Html parser
			MP4Parser MP4Parser = new MP4Parser();
			MP4Parser.parse(inputstream, handler, metadata, pcontext);
			System.out.println("Contents of the document:  :" + handler.toString());
			System.out.println("Metadata of the document:");
			String[] metadataNames = metadata.names();

			for (String name : metadataNames) {
				System.out.println(name + ": " + metadata.get(name));
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
}