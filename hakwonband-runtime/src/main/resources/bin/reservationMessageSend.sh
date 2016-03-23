#!/bin/sh

export LANG=ko_KR.UTF-8

JAVA_HOME=/hakwon-band/sdk/jdk1.8.0_25
RUNNTIME_HOME=/hakwon-band/source/hakwon-runtime/rms


for f in ${RUNNTIME_HOME}/lib/*.jar
do
  if [ ! -z "$f" ]; then
    CLASSPATH=${CLASSPATH}:$f
  fi
done

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


java $USER_OPTS_ARGS hakwonband.runtime.main.ReservationMessageSendMain > $NOHUP_LOG_FILE &