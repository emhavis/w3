CURRENT_TIME = $(shell date +'%y.%m.%d %H:%M:%S')
CURRENT_TAG = "v0.1"

buildPush:
	npm run build
	docker build -t emhavis/w3_catalogue:${CURRENT_TAG} .
	docker push emhavis/w3_catalogue:v0.1

build:
#	npm run build
	docker build -t emhavis/w3_catalogue:${CURRENT_TAG} .