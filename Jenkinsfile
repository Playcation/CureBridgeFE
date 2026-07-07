pipeline {
    agent any

    stages {
        stage('1. Code Checkout') {
            steps {
                // 젠킨스가 프론트엔드 소스코드를 깃허브에서 가져옵니다.
                checkout scm
            }
        }

        stage('2. Deploy Frontend via SSH to Swarm') {
            steps {
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: 'curebridge-swarm-manager', // 젠킨스 시스템 설정에 등록된 SSH 서버 이름
                        verbose: true,
                        transfers: [
                            sshTransfer(
                                execCommand: '''
                                    set -e
                                    cd ~/curebridge

                                    # [1] GitHub Actions가 푸시해둔 최신 프론트엔드 이미지 다운로드
                                    # (username 부분은 본인의 도커 허브 ID로 채워주세요)
                                    docker pull 도커허브_ID/curebridge-frontend:latest

                                    # [2] 도커 스웜 스택 업데이트 (GitHub Actions와 동일한 명령어)
                                    docker stack deploy -c docker-stack.yml curebridge --with-registry-auth

                                    # [3] 안 쓰는 찌꺼기 이미지 정리
                                    docker system prune -f
                                ''',
                                execTimeout: 120000
                            )
                        ]
                    )
                ])
            }
        }
    }
}