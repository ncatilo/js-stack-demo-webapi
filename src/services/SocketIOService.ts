// const db = require('../_aux/db');
import { db } from './DbService'

export default function (ioServer: SocketIO.Server) {

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

            const pingback: any = await db.upsert(collection, body)

            if (pingback.department) {

                // this sends the pingback to all users in this department, including the poster
                ioServer.in(pingback.department).emit('api-posted', pingback);
            }
        });

        socket.on('process-job', async ({ collection, body, _id }) => {

            const { department } = body;

            const jobSequence: { [key: string]: string }[] = [

                { "sales": "creative" },
                { "creative": "production" },
                { "production": "logistics" }
            ]

            // if department is the last item in the sequence...
            if (Object.values(jobSequence[jobSequence.length - 1])[0] === department) {

                await db.delete(collection, { _id })

                return ioServer.emit('job-processed', { _id })
            }

            if (department) {


                const nextDept = jobSequence.filter(x => x[department])[0];

                if (nextDept) {

                    body.department = nextDept[department];
                }
            }

            const pingback: any = await db.upsert(collection, body, _id)

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