.PHONY: start-redis, run

start-redis:
	docker run -p 6379:6379 -d redis redis-server --appendonly yes

run:
	yarn
	npm start
