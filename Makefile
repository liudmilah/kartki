init: docker-down-clear frontend-clear docker-pull docker-build docker-up frontend-init frontend-ready
init-ci: docker-create-traefik-network init

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down --remove-orphans

docker-down-clear:
	docker-compose down -v --remove-orphans

docker-pull:
	docker-compose pull

docker-build:
	DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker-compose build --build-arg BUILDKIT_INLINE_CACHE=1 --pull

docker-create-traefik-network:
	docker network create traefik-public

frontend-ready:
	docker run --rm -v ${PWD}:/app -w /app alpine touch .ready

frontend-clear:
	docker run --rm -v ${PWD}:/app -w /app alpine sh -c 'rm -rf .ready build'

frontend-init: yarn-install

yarn-install:
	docker-compose run --rm kartki-node-cli yarn install

yarn-upgrade:
	docker-compose run --rm kartki-node-cli yarn upgrade

yarn-add:
	docker-compose run --rm kartki-node-cli yarn add $(p) $(f)

yarn-rm:
	docker-compose run --rm kartki-node-cli yarn remove $(p)

frontend-lint:
	docker-compose run --rm kartki-node-cli yarn eslint

frontend-eslint-fix:
	docker-compose run --rm kartki-node-cli yarn eslint-fix

frontend-pretty:
	docker-compose run --rm kartki-node-cli yarn prettier

frontend-test:
	docker-compose run --rm kartki-node-cli yarn test --watchAll=false

push-dev-cache:
	docker-compose push

push-build-cache:
	docker push ${REGISTRY}/kartki:cache-builder
	docker push ${REGISTRY}/kartki:cache

push:
	docker push ${REGISTRY}/kartki:${IMAGE_TAG}

build:
	DOCKER_BUILDKIT=1 docker --log-level=debug build --pull --build-arg BUILDKIT_INLINE_CACHE=1 \
    --target builder \
    --cache-from ${REGISTRY}/kartki:cache-builder \
    --tag ${REGISTRY}/kartki:cache-builder \
	--file docker/production/nginx/Dockerfile .

	DOCKER_BUILDKIT=1 docker --log-level=debug build --pull --build-arg BUILDKIT_INLINE_CACHE=1 \
    --cache-from ${REGISTRY}/kartki:cache-builder \
    --cache-from ${REGISTRY}/kartki:cache \
    --tag ${REGISTRY}/kartki:cache \
    --tag ${REGISTRY}/kartki:${IMAGE_TAG} \
	--file docker/production/nginx/Dockerfile .

deploy:
	ssh -v deploy@${HOST} -p ${PORT} 'rm -rf site_${BUILD_NUMBER}'
	ssh -v deploy@${HOST} -p ${PORT} 'mkdir site_${BUILD_NUMBER}'
	scp -v -P ${PORT} docker-compose-production.yml deploy@${HOST}:site_${BUILD_NUMBER}/docker-compose.yml
	ssh -v deploy@${HOST} -p ${PORT} 'cd site_${BUILD_NUMBER} && echo "COMPOSE_PROJECT_NAME=kartki" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd site_${BUILD_NUMBER} && echo "REGISTRY=${REGISTRY}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd site_${BUILD_NUMBER} && echo "IMAGE_TAG=${IMAGE_TAG}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd site_${BUILD_NUMBER} && docker-compose pull'
	ssh -v deploy@${HOST} -p ${PORT} 'cd site_${BUILD_NUMBER} && docker-compose up --build --remove-orphans -d'
	ssh -v deploy@${HOST} -p ${PORT} 'rm -f site'
	ssh -v deploy@${HOST} -p ${PORT} 'ln -sr site_${BUILD_NUMBER} site'

rollback:
	ssh deploy@${HOST} -p ${PORT} 'cd site_${BUILD_NUMBER} && docker-compose pull'
	ssh deploy@${HOST} -p ${PORT} 'cd site_${BUILD_NUMBER} && docker-compose up --build --remove-orphans -d'
	ssh deploy@${HOST} -p ${PORT} 'rm -f site'
	ssh deploy@${HOST} -p ${PORT} 'ln -sr site_${BUILD_NUMBER} site'
