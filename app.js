import express from 'express'
import { userRouter } from './users/router.js'

const app = express()
const port = 8080

app.use(express.json())

//NRS-2: Log request/respons
app.use(function responseLogger(req, res, next) {
  const originalSendFunc = res.send.bind(res)
  res.send = function (body) {
    res.locals.body = body
    return originalSendFunc(body)
  }
  next()
})
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(
      `Request:
  Method: ${req.method}
  URL: ${req.url}
  Headers: ${JSON.stringify(req.headers)}
  Query: ${JSON.stringify(req.query)}
  Body:  ${JSON.stringify(req.body)}
Response:
  Code: ${res.statusCode}
  Headers: ${JSON.stringify(res.getHeaders())}
  Body: ${res.locals.body}`
    )
  })
  next()
})

//NRS-3: Request time by performance.now
app.use((req, res, next) => {
  req.start = performance.now()
  res.on('finish', () => {
    console.log(
      `Request time: ${(performance.now() - req.start).toFixed(3)} ms`
    )
  })
  next()
})

//NRS-1: Implement hello world API
app.get('/api/hello', (req, res, next) => {
  res.send('Hello World')
  // next()
})

//NRS-4: Add userRouter with CRUD-operations
app.use('/api/users', userRouter)

//error handler 404
app.use(function (req, res, next) {
  res.status(404).send('Not Found')
})

app.listen(port, () => {
  console.log(`Server has started on ${port}`)
})
