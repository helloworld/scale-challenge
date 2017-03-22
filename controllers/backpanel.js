var User = require('../models/User');
var Task = require('../models/Task');
var request = require('request');
/**
 * GET /backpanel
 */
exports.index = function(req, res) {
    Task.find({ completed: false }, function(err, tasks) {
        res.render("backpanel", {
            title: "Backpanel",
            completed: false,
            tasks: tasks
        });
    })
};

exports.indexCompleted = function(req, res) {
    Task.find({ completed: true }, function(err, tasks) {
        res.render("backpanel", {
            completed: true,
            tasks: tasks
        });
    })
}

exports.annotate = function(req, res) {
    var id = req.params.id;

    Task.findOne({ _id: id }, function(err, task) {
        res.expose(task, "task");
        res.render("annotate", task);
    });
}

exports.complete = function(req, res) {
    var id = req.params.id;
    var annotations = JSON.parse(req.body.annotation);

    Task.findOneAndUpdate({ _id: id }, { completed: true }, { new: true },
        function(err, task) {
            if (err) return;

            delete task.__v;
            var response = {
                "response": {
                    "annotations": annotations
                },
                "task_id": id,
                "task": task
            }

            request.post(task.callback_url, { json: response });
            res.send("success");
        });
}
