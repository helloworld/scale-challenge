var render = require('../lib/utils').render;

/**
 * GET /
 */
exports.index = function(req, res) {
    if (req.user) {
        if (req.user.admin) return res.redirect("/backpanel");
        return res.redirect("dashboard");
    }
    res.render('home', {
        title: 'Home'
    });
};

exports.documentation = function(req, res) {
    res.render('documentation', {
        title: "Documentation"
    })
}
