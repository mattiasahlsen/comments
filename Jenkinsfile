pipeline {
    agent { docker { image 'node:8.15-jessie' } }
    stages {
        stage('build') {
            steps {
              sh 'yarn install --production=true'
              sh 'yarn build'
              sh 'yarn server'
              input message: 'Finished serving the web site? (Click "Proceed" to continue)'
            }
        }
    }
}
