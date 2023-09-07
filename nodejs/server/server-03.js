const express = require('express')
const mongoose = require('mongoose')
// const { emit } = require('process')
const EventEmitter = require('events').EventEmitter
const ev = new EventEmitter()

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/test')
    .then((con) => console.log('MongoDB connected.'))
    .catch(err => console.log('MongoDB connection connect fail', err.message))

const User = mongoose.model('User', {name: String})

app.post('/user', async (req, res) => {
    try {
        const user = new User({ name: req.body.username })
        await user.save()
        // server.close callback wait till setTimeout done
        ev.emit('event 1')
        res.send('Success!').status(201)
    } catch (err) {
        res.send(err.message).status(500)
    }
})

ev.on('event 1', () => {
    setTimeout(() => {
        ev.emit('event 2')
        console.log('event 1 done.')
    }, 15000);
})

ev.on('event 2', () => {
    setTimeout(() => {
        console.log('event 2 done.')
    }, 5000);
})
const port = process.env.PORT || 3000
const server = app.listen(port, () => console.log(`Api Server running on ${port} port, PID: ${process.pid}`))

/**
 * use cmd `pgrep node` to get the pid
 * kill -SIGTERM [pid]
 * nodejs exit signal: https://nodejs.org/api/process.html?ref=hackernoon.com#exit-codes
 * Termination signal: https://www.gnu.org/software/libc/manual/html_node/Termination-Signals.html?ref=hackernoon.com
 */
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.')
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