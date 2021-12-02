// const db = require('../_aux/db');
const db = require('./DbService')

module.exports = (ioServer) => {

    // NOTE:
    // Refer to file, 'notes on socket.io.txt' for further info re socket commands

    ioServer.on('connect', socket => {

        console.log(`${socket.id} is connected`);

        socket.broadcast.emit('message-from-server', `${socket.id} is connected`);

        socket.on('join-dept', async ({ department }) => {

            const response = await db.getMany("jobs", { department })

            socket.leaveAll();

            socket.join(department);

            // send the jobs list belonging to dept to the caller
            socket.emit('joined-dept', response);

            setTimeout(function () {

                // this sends the message only to other users within the user's own department, not the sending user
                socket.broadcast.to(department).emit('message-from-server', `${socket.id} joined ${department}`);
            });
        });

        socket.on('api-post', async ({ collection, body }) => {

            const pingback = await db.upsert(collection, body)

            if (pingback.department) {

                // this sends the pingback to all users in this department, including the poster
                ioServer.in(pingback.department).emit('api-posted', pingback);
            }
        });

        socket.on('process-job', async ({ collection, body, _id }) => {

            const { department } = body;

            const jobSequence = ['sales', 'creative', 'production', 'logistics']

            // if department is the last item in the sequence...
            if (jobSequence[jobSequence.length - 1] === department) {

                await db.delete(collection, { _id })

                return ioServer.emit('job-processed', { _id })
            }

            if (department) {

                const idx = jobSequence.indexOf(department)

                if (idx < 0) throw new Error('Department is unknown')

                const nextDept = jobSequence[idx + 1]

                body.department = nextDept
            }

            const pingback = await db.upsert(collection, body, _id)

            if (pingback.department) {

                // Sending the pingback to all subscribers of 'job-processed' at the client-side
                // Subscribers will process/disseminate the pingback themselves at their end
                ioServer.emit('job-processed', pingback);
            }
        });

        socket.on('disconnect', () => {

            console.log(`${socket.id} is disconnected`);
        });
    });
}