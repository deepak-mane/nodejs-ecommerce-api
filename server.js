import http from 'http';
import app from './app/app.js';
import terminate from './utils/terminate.js'

//create server
const PORT = process.env.PORT || 7000
const server = http.createServer(app);
server.listen(PORT, console.log(`Server is up and running on port ${PORT}`));

// Let It Crash: Best Practices for Handling Node.js Errors on Shutdown
// https://blog.heroku.com/best-practices-nodejs-errors
/*
const exitHandler = terminate(server, {
    coredump: false,
    timeout: 500
  })
  
  process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))
  process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'))
  process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
  process.on('SIGINT', exitHandler(0, 'SIGINT'))
*/