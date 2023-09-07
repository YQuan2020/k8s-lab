const express = require('express')
const mongoose = require('mongoose')

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
        res.send('Success!').status(201)
    } catch (err) {
        res.send(err.message).status(500)
    }
})

const server = app.listen(3000, () => console.log('Example app listening on port 3000!'))

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
            process.exit(0)
            console.log('process.exit(0). called')
        })
        .catch(err => console.log('MongoDB connection closed fail', err.message))
        // the node process will exit automatically, cause the event loop is empty and noting left to do.
    })
})