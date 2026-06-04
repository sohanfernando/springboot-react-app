pipeline {
    agent any

    environment {
        PROJECT_ID = 'crucial-media-453406-e3'
        REGION = 'us-central1'
        BACKEND_IMAGE = "us-central1-docker.pkg.dev/${PROJECT_ID}/challengeapp/challengeapp-backend"
        FRONTEND_IMAGE = "us-central1-docker.pkg.dev/${PROJECT_ID}/challengeapp/challengeapp-frontend"
        RUNTIME_SERVICE_ACCOUNT = "cloud-run-runtime@${PROJECT_ID}.iam.gserviceaccount.com"
        STRIPE_SECRET = credentials('stripe-secret-key')
        STRIPE_PUBLIC = credentials('stripe-public-key')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Auth GCP') {
            steps {
                withCredentials([file(credentialsId: 'gcp-key', variable: 'GCP_KEY')]) {
                    sh '''
                    gcloud auth activate-service-account --key-file=$GCP_KEY
                    gcloud config set project $PROJECT_ID
                    gcloud auth configure-docker us-central1-docker.pkg.dev --quiet
                    '''
                }
            }
        }

        stage('Build Backend') {
            steps {
                sh 'docker build -t $BACKEND_IMAGE ./challengeApp'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'docker build -t $FRONTEND_IMAGE ./frontend'
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                docker push $BACKEND_IMAGE
                docker push $FRONTEND_IMAGE
                '''
            }
        }

        stage('Deploy to Cloud Run') {
            steps {
                sh '''
                gcloud run deploy challengeapp-backend \
                --image $BACKEND_IMAGE \
                --platform managed \
                --region $REGION \
                --allow-unauthenticated \
                --port 8080 \
                --service-account $RUNTIME_SERVICE_ACCOUNT \
                --add-cloudsql-instances crucial-media-453406-e3:us-central1:challengeapp-db \
                --set-env-vars "^|^SPRING_DATASOURCE_URL=jdbc:mysql:///userDB?cloudSqlInstance=crucial-media-453406-e3:us-central1:challengeapp-db&socketFactory=com.google.cloud.sql.mysql.SocketFactory&useSSL=false|SPRING_DATASOURCE_USERNAME=challenge_user|SPRING_DATASOURCE_PASSWORD=AppPassword123!|STRIPE_SECRET_KEY=$STRIPE_SECRET|STRIPE_PUBLIC_KEY=$STRIPE_PUBLIC" \
                --quiet

                gcloud run deploy challengeapp-frontend \
                  --image $FRONTEND_IMAGE \
                  --platform managed \
                  --region $REGION \
                  --allow-unauthenticated \
                  --port 80 \
                  --service-account $RUNTIME_SERVICE_ACCOUNT \
                  --quiet
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment successful! 🚀'
        }
        failure {
            echo 'Deployment failed! Check logs.'
        }
    }
}