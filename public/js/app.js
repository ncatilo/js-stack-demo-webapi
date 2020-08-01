$(function () {

    window.app = (function () {

        function bindProcessButtonClick(html) {

            var dept = $("#department").val();

            html.find(".process-btn").on('click', function () {

                var btn = $(this),
                    id = btn.closest("li").data("id");

                socketIO.send("process-job", {
                    collection: "jobs",
                    body: { department: dept },
                    _id: id
                });
            });
        }

        var jobsTpl = $("#jobs-tpl").html();

        return {

            showMessage: function (message) {

                $("#message").fadeIn().text(message).delay(3000).fadeOut();
            },

            prependToJobsInbox: function (data) {

                if (!$.isArray(data)) {
                    data = [data];
                }

                var html = $(Handlebars.compile(jobsTpl)(data));

                $("#jobs ol").prepend(html);

                bindProcessButtonClick(html)
            },

            clearJobsInbox: function (then) {

                $("#jobs ol li").remove();

                if (then) then();
            },

            removeFromJobsInbox: function (id) {

                $("#jobs ol").find("li[data-id='" + id + "']").remove();
            }
        }

    })();

    $("#department").on('change', function () {

        var department = $(this).val(),
            content = $("#content");

        content.toggle(department === 'sales');

        app.clearJobsInbox();

        socketIO.send('join-dept', { department: department });
    });

    $("form").on('submit', function (e) {

        e.preventDefault();

        function toJson(formArray) {

            var result = {};

            for (var i = 0; i < formArray.length; i++) {

                result[formArray[i]['name']] = formArray[i]['value'];
            }

            return result;
        }

        var data = toJson($(this).serializeArray());

        socketIO.send('api-post', { collection: 'jobs', body: data });
    });
});