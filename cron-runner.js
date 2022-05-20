const schedule = require('node-schedule')
const { exec } = require("child_process");

module.exports = () => {
    schedule.scheduleJob('*/10 * * * * *', function() {
        const date = new Date()
        const path = `files/${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.sql`
        console.log(path);
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
