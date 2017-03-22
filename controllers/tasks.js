var User = require('../models/User');
var Task = require('../models/Task');

/**
 * GET /backpanel
 */
exports.newTask = function(req, res) {

    var task_data = req.body;

    // Data Validation  
    req.assert('SCALE_API_KEY', 'SCALE_API_KEY not provided').notEmpty();
    req.assert('attachment', 'attachment not provided').notEmpty();
    req.assert('attachment_type', 'attachment_type not provided').notEmpty();
    req.assert('objects_to_annotate', 'objects_to_annotate not provided').notEmpty();
    req.assert('with_labels', 'with_labels not provided').notEmpty();
    req.assert('callback_url', 'callback_url not provided').notEmpty();
    req.assert('with_labels', 'with_labels is not a boolean value').isBoolean();
    req.assert("callback_url", "callback_url is not a valid URL").isURL();

    var errors = req.validationErrors();
    if (errors) {
        res.json({
            errors: errors
        });
    }

    User.findOne({
        api_token: req.body.SCALE_API_KEY
    }, function(err, user) {
        if (!user) return res.json({
            errors: "Invalid SCALE_API_KEY"
        });

        task_data.completed = false;
        task_data.user_id = user._id;
        var task = new Task(task_data);
        task.save(function(err, obj) {
            if (err) res.json({
                errors: "Unable to create task. Please try again."
            })
            obj["task_id"] = obj._id;
            console.log(obj);
            delete obj["__v"];
            delete obj.user_id;
            delete obj.completed;
            res.send(obj);
        });
    });
};
