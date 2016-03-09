#!/bin/sh

export LANG=ko_KR.UTF-8

JAVA_HOME=/hakwon-band/sdk/jdk1.8.0_25
RUNNTIME_HOME=/hakwon-band/source/hakwon-runtime/rms


CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/activation-1.1.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/aopalliance-1.0.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/apns-1.0.0.Beta6.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/asm-3.3.1.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/asm-4.2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/aspectjrt-1.8.2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/aspectjtools-1.8.2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/aspectjweaver-1.8.2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/bcprov-jdk16-1.46.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/cglib-3.1.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/commons-beanutils-1.8.3.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/commons-codec-1.9.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/commons-collections-3.2.1.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/commons-configuration-1.10.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/commons-dbcp-1.4.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/commons-digester-1.8.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/commons-fileupload-1.3.1.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/commons-httpclient-3.1.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/commons-io-2.2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/commons-jxpath-1.3.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/commons-lang-2.6.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/commons-logging-1.0.4.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/commons-pool-1.5.4.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/commons-validator-1.4.0.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/dom4j-1.6.1.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/gcm-server-1.0.2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/guava-18.0.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/hakwonband-core-0.0.1-20160309-01.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/htmlcleaner-2.9.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/httpclient-4.3.2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/httpclient-cache-4.3.2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/httpcore-4.3.2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/httpmime-4.3.2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/jackson-annotations-2.1.4.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/jackson-core-2.1.4.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/jackson-core-asl-1.9.13.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/jackson-databind-2.1.4.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/jackson-mapper-asl-1.9.13.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/javapns-jdk16-2.2.1.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/javax.mail-1.5.1.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/javax.servlet-api-3.1.0.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/jcl-over-slf4j-1.7.7.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/jdom2-2.0.5.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/jmagick-6.6.9.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/jna-3.3.0-platform.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/jna-3.3.0.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/json-simple-1.1.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/jsr250-api-1.0.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/jsr305-2.0.3.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/jstl-1.2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/junit-4.7.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/jxl-2.6.12.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/log4j-1.2.12.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/log4j-over-slf4j-1.7.7.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/logback-classic-1.1.2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/logback-core-1.1.2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/logback-ext-spring-0.1.2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/logstash-logback-encoder-3.3.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/mail-1.4.7.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/mariadb-java-client-1.1.8.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/mybatis-3.2.7.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/mybatis-spring-1.2.2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/poi-3.10-FINAL.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/poi-ooxml-3.10-FINAL.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/poi-ooxml-schemas-3.10-FINAL.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/quality-check-1.3.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/slf4j-api-1.7.2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/spring-aop-3.2.11.RELEASE.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/spring-aspects-3.2.11.RELEASE.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/spring-beans-3.2.11.RELEASE.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/spring-context-3.2.11.RELEASE.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/spring-context-support-3.2.11.RELEASE.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/spring-core-3.2.11.RELEASE.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/spring-expression-3.2.11.RELEASE.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/spring-jdbc-3.2.11.RELEASE.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/spring-orm-3.2.11.RELEASE.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/spring-oxm-3.2.11.RELEASE.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/spring-tx-3.2.11.RELEASE.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/spring-web-3.2.11.RELEASE.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/spring-webmvc-3.2.11.RELEASE.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/standard-1.1.2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/stax-api-1.0.1.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/tika-core-1.5.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/uadetector-core-0.9.18.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/uadetector-resources-2014.06.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/xmemcached-2.0.0.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/xml-apis-1.0.b2.jar
CLASSPATH=$CLASSPATH:$RUNNTIME_HOME/lib/xmlbeans-2.3.0.jar

cd $RUNNTIME_HOME/classes

export PATH=$JAVA_HOME/bin:$PATH
export CLASSPATH=.:$CLASSPATH
echo $CLASSPATH


# ----Server Infomation----
# SERVICE_NAME 은 꼭 지정해야 한다.
SERVER_TYPE=$1
SERVICE_NAME="rms"
LOG_HOME="/hakwon-band/logs/runtime"
NOHUP_LOG_FILE="${LOG_HOME}/${SERVICE_NAME}-nohup"
HEAP_DIR="${LOG_HOME}"
TODATE=$(date +%Y%m%d_%H%M%S);

if [ -n "$1" ]; then
    echo "parameter $1"
else
	echo "***********************************"
    echo "* parameter is null"
    echo "***********************************"
    exit
fi

# ---------------------------
#  Java Heap Options(꼭 필요한 경우에만 메모리 지정)
# ---------------------------
#MEM_ARGS="-Xms512m -Xmx1024m -XX:PermSize=128m -XX:MaxPermSize=256m"

# ---------------------------
#  JVM GC Options
# ---------------------------
GC_OPTIONS="-verbose:gc -Xloggc:${LOG_HOME}/${SERVER_TYPE}_${SERVICE_NAME}_gc_${TODATE}.log -XX:+PrintGCDetails -XX:+PrintGCTimeStamps"

# ---------------------------
#  Heap Dump Options
# ---------------------------
HEAP_DUMP="-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=${HEAP_DIR}"

# ---------------------------
#  Export Java Options
# ---------------------------
USER_OPTS_ARGS="-Dserver.type=${SERVER_TYPE} -Druntime.service.name=${SERVICE_NAME} ${MEM_ARGS} ${GC_OPTIONS} ${HEAP_DUMP}"
echo $USER_OPTS_ARGS


java $USER_OPTS_ARGS hakwonband.runtime.main.ReservationNoticeSendMain > $NOHUP_LOG_FILE &