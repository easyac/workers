.PHONY: start-redis, run

run:
	npm start

docker-start-redis:
	-@docker stop redis
	-@docker rm redis
	docker run --name redis -p 6379:6379 -d redis redis-server --appendonly yes

docker-run:
	docker run -d \
	--name easyac-worker \
	--link redis:redis \
	--env REDIS_HOST=redis \
	--env REDIS_PORT=6379 \
	easyac/worker

docker-stop:
	-@docker stop easyac-worker redis
	-@docker rm easyac-worker redis

docker-build:
	docker build -t easyac/worker:latest .

docker-push:
	docker push easyac/worker:latest
