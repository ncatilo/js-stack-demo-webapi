const
    {db}    = require('../_aux/db'),
    url     = require('url'),
    cookie  = require('cookie');

module.exports = function(io) {

    // NOTE:
    // Refer to file, 'notes on socket.io.txt' for further info re socket commands

    io.on('connect', socket => {

        console.log(`${socket.id} is connected`);

        socket.broadcast.emit('message-from-server', `${socket.id} is connected`);

        socket.on('join-dept', message => {

            var dept = message.department;

            db  .getMany("jobs", { department : dept })
                .then(response => {

                    socket.leaveAll();

                    socket.join(dept);

                    // send the jobs list belonging to dept to the caller
                    socket.emit('joined-dept', response);

                    setTimeout(function() {

                        // this sends the message only to other users within the user's own department, not the sending user
                        socket.broadcast.to(dept).emit('message-from-server', `${socket.id} joined ${dept}`);
                    });
                })
        });

        socket.on('api-post', packet => {

            db  .upsert(packet.collection, packet.body)
                .then(pingback => {

                    if(pingback.department) {

                        // this sends the pingback to all users in this department, including the poster
                        io.in(pingback.department).emit('api-posted', pingback);
                    }
                });
        });

        socket.on('process-job', packet => {

            var dept = packet.body.department;

            if(dept) {

                var jobSequence = [
                        {"sales":"creative"},
                        {"creative":"production"},
                        {"production":"logistics"}
                    ],
                    nextDept = jobSequence.filter(x => x[dept])[0];

                if(nextDept) {

                    packet.body.department = nextDept[dept];
                }
            }

            db  .upsert(packet.collection, packet.body, packet._id)
                .then(pingback => {

                    if(pingback.department) {

                        // Sending the pingback to all subscribers of 'job-processed' at the client-side
                        // Subscribers will process/disseminate the pingback themselves at their end
                        io.emit('job-processed', pingback);
                    }
                });
        });

        socket.on('disconnect', () => {

            console.log(`${socket.id} is disconnected`);
        });
    });
}