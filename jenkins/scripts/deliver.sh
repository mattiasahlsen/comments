yarn server &
sleep 1
echo $! > .pidfile
cat .pidfile
set +x
