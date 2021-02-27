FROM debian:buster

MAINTAINER Neszt Tibor <tibor@neszt.hu>

RUN \
	apt-get update && apt-get -y upgrade && \
	apt-get -y install nodejs npm git && \
	git clone https://github.com/revolut-engineering/revolut-merchant-api-example-next-js.git /app && \
	cd /app && \
	npm install

CMD [ "sh", "-c", "cd /app && REVOLUT_API_KEY=$api_key npm run dev" ]
