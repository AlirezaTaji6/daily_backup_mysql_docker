const schedule = require('node-schedule')
const { exec } = require("child_process");
const fs = require('fs')
module.exports = () => {
    schedule.scheduleJob(process.env.CRON_SPEC_STRING, function() {
        const files = fs.readdirSync('files')
        if(files.length > 4) {
            fs.unlinkSync(`files/${files[1]}`)
        } 
        const date = new Date()
        const path = `files/${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.sql`
        exec(`docker exec ${process.env.DB_DOCKER_ID} sh -c 'exec mysqldump --databases ${process.env.DB_NAME} -uroot -p${process.env.DB_PASSWORD}' > ${path}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    })
}
