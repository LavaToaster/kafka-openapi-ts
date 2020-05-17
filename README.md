# kafka-openapi-ts

### Running:

Bring up service:
```
docker-compose up -d
```

Service of note: You'll be able to see kafka cluster info at `http://localhost:9021/clusters`

Bring up build watcher:
```
yarn watch
```

Then start the individual services:
```
yarn start:http
yarn start:worker
```

### Notes:

`start:http` uses `src/index.ts` <br />
`start:worker` uses `src/worker.ts`
