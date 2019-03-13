echo "\n" >> /var/jenkins_home/logs/jobs.log
yarn server >> /var/jenkins_home/logs/jobs.log &
sleep 1
echo $! > .pidfile
set +x
