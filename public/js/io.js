window.socketIO = (function () {

    var api = "http://localhost:3000/";
    var socket = io(api);

    [{
        "connect": function (api) {

            console.log('Connected to ' + api);
        }
    }, {

        "message-from-server": function (msg) {

            app.showMessage(msg);
        }
    }, {

        "joined-dept": function (response) {

            app.prependToJobsInbox(response);
        }
    }, {

        "api-posted": function (response) {

            app.prependToJobsInbox(response);
        }
    }, {

        "job-processed": function (response) {

            var id = response._id;
            var department = $("#department").val();

            if (response.department === department) {

                return app.prependToJobsInbox(response);
            }

            app.removeFromJobsInbox(id);
        }
    }, {
        "error": function (msg) {

            alert(msg);
            console.log(msg);
        }

    }].forEach(function (item) {

        item = Object.entries(item)[0]

        socket.on(item[0], item[1]);
    });

    return {

        send: function (label, data) {

            socket.emit(label, data);
        }
    };

})();