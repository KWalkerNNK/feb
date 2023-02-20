<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>


## ROUTES

Describe some routes

| METHOD | LINK |
| ------ | ------ |
| GET | [http://localhost:3000/auth/login][Login] |
| GET | [http://localhost:3000/auth/register][Register] |
| GET | [http://localhost:3000/chat/1][Chat] |
| GET | [http://localhost:3000/chat/messages?conversation-id=1][Show all messages by conversation] |
| GET | [http://localhost:3000/chat/messages/find?conversation-id=1&limit=5][Get messages by conversation but limit message display. For example limit = 5, get the last 5 messages] |
| POST | [http://localhost:3000/group/create/1][Create a conversation, with id = 1 is an user id, title ="New Conversation" is a name conversation] |


## IMAGES
Register
![Register](./plugins/Screenshot%20Register.png)

Login
![Login](./plugins/Screenshot%20Login.png)

Chat I
![Chat](./plugins/Screenshot%20Feb.png)

Chat II
![Chat](./plugins/Screenshot%20Feb%20II.png)


## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
