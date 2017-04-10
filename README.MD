# Easyac Workers

PUB/SUB worker that wait for commands from Easyac API like `worker:login` and `worker:sync`.

`worker:login`: Expect student credentials, calls Easyac Crawler, auth the student and re-send to API the authenticated cookie.

`worker:sync`: Expect authenticated cookie, calls Easyac Crawler, search for classes and ... WIP :smile:



## Run

Start Redis container and start the project.

```sh
make start-redis
make run
```

## Dependencies

This project has the following dependencies.

- Yarn
- Docker
