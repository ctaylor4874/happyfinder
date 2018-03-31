#!/usr/bin/env groovy

node {
    def app

    stage('Clone repository') {
        /* Let's make sure we have the repository cloned to our workspace */

        checkout scm
    }

    stage('Build image') {
        /* This builds the actual image; synonymous to
         * docker build on the command line */

        app = docker.build("ctaylor4874/happyfinder")
    }

    stage('Push image') {
        /* Finally, we'll push the image with two tags:
         * First, the incremental build number from Jenkins
         * Second, the 'latest' tag.
         * Pushing multiple tags is cheap, as all the layers are reused. */
        docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
            app.push("${env.BUILD_NUMBER}")
            app.push("latest")
        }
    }
    stage('Run image') {
    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
            sh """
            if [ ! "\$(docker ps -q -f name=happyfinder)" ]; then
                if [ "\$(docker ps -aq -f status=exited -f name=happyfinder)" ]; then
                    # cleanup
                    docker stop happyfinder
                    docker rm happyfinder
                fi
                # run your container
                docker run -it \
                  -v ${PWD}:/usr/src/app \
                  -v /usr/src/app/node_modules \
                  -p 3000:3000 \
                  --name happyfinder \
                  --rm \
                  ctaylor4874/happyfinder:latest
            fi
            """
            }
        }
}