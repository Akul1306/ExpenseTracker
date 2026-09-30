FROM jenkins/jenkins:lts-jdk21

USER root

# 1. Maven installation via direct tarball download
ARG MAVEN_VERSION=3.9.6
RUN curl -fsSL https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz | tar -xz -C /opt \
    && ln -s /opt/apache-maven-${MAVEN_VERSION} /opt/maven
ENV MAVEN_HOME=/opt/maven
ENV PATH=$PATH:$MAVEN_HOME/bin

# 2. Node.js installation (Upgraded to Node 20 for modern Vite/Rollup support)
ARG NODE_VERSION=20.11.0
RUN curl -fsSL https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz | tar -xz -C /opt \
    && ln -s /opt/node-v${NODE_VERSION}-linux-x64 /opt/node
ENV NODE_HOME=/opt/node
ENV PATH=$PATH:$NODE_HOME/bin

# 3. Install Docker CLI binary directly
RUN curl -fsSL https://download.docker.com/linux/static/stable/x86_64/docker-26.1.0.tgz | tar -xz -C /tmp \
    && mv /tmp/docker/docker /usr/local/bin/docker \
    && chmod +x /usr/local/bin/docker \
    && rm -rf /tmp/docker