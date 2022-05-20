const dotenv = require('dotenv')
const result = dotenv.config({ path: __dirname+'/.env'})
const fs = require('fs')

require('./cron-runner')();

const express = require('express')
const app = express()

const auth = (req, res, next) => {
    if(req.query.username == process.env.ADMIN_USER && req.query.password == process.env.ADMIN_PASS) {
        next();
    } else {
        return res.status(401).send('Not authenticated')
    }
}
app.use(auth, express.static('files') )

app.get('/backups', auth, async (req, res, next) => {
    fs.readdir('files', (err, files) => {
        res.send(files.filter(f => f != '.gitkeep'))
    })

})

app.listen(process.env.PORT, () => {
    console.log(`app started on port ${process.env.PORT}...`)
})