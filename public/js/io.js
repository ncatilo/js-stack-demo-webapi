window.socketIO = (function() {

    var api     = "http://localhost:3000/",
        socket  = io(api);

    [{
        label: "connect",
        func : function(api) {

            console.log('Connected to ' + api);
        }
    }, {

        label: "message-from-server",
        func: function(msg) {

            app.showMessage(msg);
        }
    }, {

        label: "joined-dept",
        func: function(response) {
    
            app.prependToJobsInbox(response);
        }
    }, {

        label: "api-posted",
        func: function(response) {

            app.prependToJobsInbox(response);
        }
    }, {

        label: "job-processed",
        func: function(response) {

            var id          = response._id,
                department  = $("#department").val();

            if(response.department === department) {

                return app.prependToJobsInbox(response);
            }

            app.removeFromJobsInbox(id);
        }
    }, {
        label: "error",
        func: function(msg) {

            alert(msg);
            console.log(msg);
        }
    }]
    .forEach(function(item) {

        socket.on(item.label, item.func);
    });

    return  {

        send: function(label, data) {

            socket.emit(label, data);
        }
    };

})();