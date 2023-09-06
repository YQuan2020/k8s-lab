const express = require('express')
const mongoose = require('mongoose')
const EventEmitter = require('events').EventEmitter
const ev = new EventEmitter()
const state = { isShutdown: false }

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
const DB = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/test`
console.log('db url: ', DB)

mongoose.connect(DB)
    .then((con) => console.log('MongoDB connected.'))
    .catch(err => console.log('MongoDB connection connect fail', err.message))

const User = mongoose.model('User', {name: String})

app.post('/user', async (req, res) => {
    try {
        const user = new User({ name: req.body.username })
        await user.save()
        res.send('Success!').status(201)
    } catch (err) {
        res.send(err.message).status(500)
    }
})

app.get('/heath', async (req, res) => {
    if (state.isShutdown) {
        res.writeHead(500)
        return res.end('not ok')
    }
    res.writeHead(200)
    return res.end('ok')
})

ev.on('event 1', () => {
    setTimeout(() => {
        ev.emit('event 2')
        console.log('event 1 done.')
    }, 5000);
})

ev.on('event 2', () => {
    setTimeout(() => {
        console.log('event 2 done.')
    }, 5000);
})
const port = process.env.PORT || 3000
const server = app.listen(port, () => console.log(`Api Server running on ${port} port, PID: ${process.pid}`))

// server.close callback wait till setTimeout done
ev.emit('event 1')
/**
 * use cmd `pgrep node` to get the pid
 * kill -SIGTERM [pid]
 * nodejs exit signal: https://nodejs.org/api/process.html?ref=hackernoon.com#exit-codes
 * Termination signal: https://www.gnu.org/software/libc/manual/html_node/Termination-Signals.html?ref=hackernoon.com
 */
process.on('SIGTERM', () => {
    console.info(`[${Date.now()}] SIGTERM signal received.`)
    state.isShutdown = true
    console.log('Closing http server.')
    server.close(() => {
        console.log('Http server closed.')
        // boolean means [force], ser in mongoose doc
        mongoose.connection.close(false)
        .then((con) => {
            console.log('MongoDB connection closed.')
            // process will close automatically cause event loop is empty, and nothing 
            // process.exit()
            // console.log('process.exit(0). called')
        })
        .catch(err => console.log('MongoDB connection closed fail', err.message))
    })
})

process.on('exit', (code) => {
    console.log('This will not run', code);
});