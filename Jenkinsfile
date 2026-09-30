pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend (Maven)') {
            steps {
                dir('ExpenseTracker') {
                    // Assuming a Maven project (pom.xml)
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend (Node/npm)') {
            steps {
                dir('Frontend') {
                    sh 'npm install'
                    sh 'npm run dev'
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                // Since docker.sock is mounted, Jenkins can run docker commands
                sh 'docker compose down'
                sh 'docker compose up --build -d'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully! Expense Tracker deployed.'
        }
        failure {
            echo 'Pipeline failed. Check the logs for errors.'
        }
    }
}