node('master') {
    stage ('Checkout') {
        checkout scm
    }
    stage ('Build') {
        sh "docker build -m 3g -t neochrono/${PROJECT_NAME}:B${BUILD_NUMBER} -f Dockerfile ."
    }
    stage ('Deployment') {
        try {
            sh "docker stop ${PROJECT_NAME}"
            sh "docker rm ${PROJECT_NAME}"
        } catch (Exception e) {
            sh "echo 'container not running'"
        }

        sh "docker run --name ${PROJECT_NAME} \
        -p ${PORT}:${PORT} \
        -e PORT='${PORT}' \
        -e FRONTEND_URL='${FRONTEND_URL}' \
        -e KEYCLOAK_URL='${KEYCLOAK_URL}' \
        -e KEYCLOAK_REALM='${KEYCLOAK_REALM}' \
        -e KEYCLOAK_CLIENT_ID='${KEYCLOAK_CLIENT_ID}' \
        -e KEYCLOAK_CLIENT_SECRET='${KEYCLOAK_CLIENT_SECRET}' \
        -e DB_HOST='${DB_HOST}' \
        -e DB_PORT='${DB_PORT}' \
        -e DB_USERNAME='${DB_USERNAME}' \
        -e DB_PASSWORD='${DB_PASSWORD}' \
        -e DB_DATABASE='${DB_DATABASE}' \
        -e CLOUDINARY_NAME='${CLOUDINARY_NAME}' \
        -e CLOUDINARY_API_KEY='${CLOUDINARY_API_KEY}' \
        -e CLOUDINARY_API_SECRET='${CLOUDINARY_API_SECRET}'
        -e CLOUDINARY_URL='${CLOUDINARY_URL}' \
        blog-api"
    }
}