// const db = require('../_aux/db');
import { db } from './DbService'

export default function (io: SocketIO.Server) {

    // NOTE:
    // Refer to file, 'notes on socket.io.txt' for further info re socket commands

    io.on('connect', socket => {

        console.log(`${socket.id} is connected`);

        socket.broadcast.emit('message-from-server', `${socket.id} is connected`);

        socket.on('join-dept', async message => {

            var dept = message.department;

            const response = await db.getMany("jobs", { department: dept })

            socket.leaveAll();

            socket.join(dept);

            // send the jobs list belonging to dept to the caller
            socket.emit('joined-dept', response);

            setTimeout(function () {

                // this sends the message only to other users within the user's own department, not the sending user
                socket.broadcast.to(dept).emit('message-from-server', `${socket.id} joined ${dept}`);
            });
        });

        socket.on('api-post', async packet => {

            const pingback: any = await db.upsert(packet.collection, packet.body)

            if (pingback.department) {

                // this sends the pingback to all users in this department, including the poster
                io.in(pingback.department).emit('api-posted', pingback);
            }
        });

        socket.on('process-job', async packet => {

            var dept: string = packet.body.department;

            if (dept) {

                const jobSequence: { [key: string]: string }[] = [

                    { "sales": "creative" },
                    { "creative": "production" },
                    { "production": "logistics" }
                ]

                const nextDept = jobSequence.filter(x => x[dept])[0];

                if (nextDept) {

                    packet.body.department = nextDept[dept];
                }
            }

            const pingback: any = await db.upsert(packet.collection, packet.body, packet._id)

            if (pingback.department) {

                // Sending the pingback to all subscribers of 'job-processed' at the client-side
                // Subscribers will process/disseminate the pingback themselves at their end
                io.emit('job-processed', pingback);
            }
        });

        socket.on('disconnect', () => {

            console.log(`${socket.id} is disconnected`);
        });
    });
}