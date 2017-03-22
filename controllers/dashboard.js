var User = require('../models/User');
var Task = require('../models/Task');
var hat = require("hat");

/**
 * GET /dashboard
 */
exports.index = function(req, res) {
    console.log(req.user);
    Task.find({ completed: false, user_id: req.user._id }, function(err, tasks) {
        Task.find({ completed: true, user_id: req.user._id }, function(err, complete) {
            res.render('dashboard', {
                title: 'Dashboard',
                tasks: tasks,
                complete: complete
            });
        });
    })

};


/**
 * POST /newToken
 */
exports.newToken = function(req, res) {
    User.findById(req.user.id, function(err, user) {
        var token = hat();
        user.api_token = token;
        user.save(function(err) {
            req.flash('success', {
                msg: 'New API Token has been generated'
            });
            res.redirect('/dashboard');
        });
    });
}

// /**
//  * POST /contact
//  */
// exports.contactPost = function(req, res) {
//   req.assert('name', 'Name cannot be blank').notEmpty();
//   req.assert('email', 'Email is not valid').isEmail();
//   req.assert('email', 'Email cannot be blank').notEmpty();
//   req.assert('message', 'Message cannot be blank').notEmpty();
//   req.sanitize('email').normalizeEmail({ remove_dots: false });

//   var errors = req.validationErrors();

//   if (errors) {
//     req.flash('error', errors);
//     return res.redirect('/contact');
//   }

//   var mailOptions = {
//     from: req.body.name + ' ' + '<'+ req.body.email + '>',
//     to: 'your@email.com',
//     subject: '✔ Contact Form | Mega Boilerplate',
//     text: req.body.message
//   };

//   transporter.sendMail(mailOptions, function(err) {
//     req.flash('success', { msg: 'Thank you! Your feedback has been submitted.' });
//     res.redirect('/contact');
//   });
// };
