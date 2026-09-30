FROM jenkins/jenkins:lts-jdk21

USER root

# ============================================================
# Maven
# ============================================================
ARG MAVEN_VERSION=3.9.6

RUN curl -fsSL "https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz" \
    | tar -xz -C /opt \
    && ln -s "/opt/apache-maven-${MAVEN_VERSION}" /opt/maven

ENV MAVEN_HOME=/opt/maven


# ============================================================
# Node.js
# ============================================================
ARG NODE_VERSION=24.15.0

RUN curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz" \
    | tar -xz -C /opt \
    && ln -s "/opt/node-v${NODE_VERSION}-linux-x64" /opt/node

ENV NODE_HOME=/opt/node

# IMPORTANT: Node must come BEFORE any system Node installation
ENV PATH=/opt/node/bin:/opt/maven/bin:$PATH


# ============================================================
# Verify Node/npm during image build
# ============================================================
RUN echo "===== NODE VERSION =====" \
    && /opt/node/bin/node --version \
    && echo "===== NPM VERSION =====" \
    && /opt/node/bin/npm --version \
    && echo "===== WHICH NODE =====" \
    && which node \
    && echo "===== WHICH NPM =====" \
    && which npm


# ============================================================
# Docker CLI
# ============================================================
ARG DOCKER_VERSION=26.1.0

RUN curl -fsSL "https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER_VERSION}.tgz" \
    | tar -xz -C /tmp \
    && mv /tmp/docker/docker /usr/local/bin/docker \
    && chmod +x /usr/local/bin/docker \
    && rm -rf /tmp/docker


# ============================================================
# Verify Docker
# ============================================================
RUN docker --version


USER jenkins