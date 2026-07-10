pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
        DOCKERHUB_USER  = 'kanishkdoc'
        VM_IP           = '192.168.64.9'
        BACKEND_IMAGE   = "${DOCKERHUB_USER}/cicd-backend"
        FRONTEND_IMAGE  = "${DOCKERHUB_USER}/cicd-frontend"
        IMAGE_TAG       = "${env.BUILD_NUMBER}"
        PATH            = "/usr/local/bin:${env.PATH}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} -t ${BACKEND_IMAGE}:latest ./backend"
                sh """
                  docker build \
                    --build-arg VITE_API_URL=http://${VM_IP}:30081 \
                    -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -t ${FRONTEND_IMAGE}:latest ./frontend
                """
            }
        }

        stage('Run Basic Validation') {
            steps {
                sh '''
                  docker run -d --rm --name backend-smoketest-${BUILD_NUMBER} -p 5055:5000 ${BACKEND_IMAGE}:${IMAGE_TAG}
                  sleep 5
                  curl -f http://localhost:5055/health
                  docker stop backend-smoketest-${BUILD_NUMBER}
                '''
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                sh "docker push ${BACKEND_IMAGE}:${IMAGE_TAG}"
                sh "docker push ${BACKEND_IMAGE}:latest"
                sh "docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                sh "docker push ${FRONTEND_IMAGE}:latest"
            }
        }

        stage('Update Kubernetes Deployment') {
            steps {
                sh "kubectl set image deployment/backend backend=${BACKEND_IMAGE}:${IMAGE_TAG}"
                sh "kubectl set image deployment/frontend frontend=${FRONTEND_IMAGE}:${IMAGE_TAG}"
            }
        }

        stage('Verify Rollout') {
            steps {
                sh "kubectl rollout status deployment/backend --timeout=120s"
                sh "kubectl rollout status deployment/frontend --timeout=120s"
                sh "kubectl get pods -o wide"
                sh "kubectl get svc"
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed - check the first red stage above.'
        }
    }
}
