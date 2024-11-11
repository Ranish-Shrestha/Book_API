FROM jenkins/jenkins:lts
USER root
RUN apt-get update && apt-get --no-install-recommends install -y zip && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*
USER jenkins
