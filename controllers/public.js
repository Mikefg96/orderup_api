const User = require('../models/user');

exports.registerUser = (req, res) => {
    const newUser = new User(req.body);

    console.log(newUser);
    if(newUser.password != newUser.confirmPassword) return res.status(400).json({ success: false, msg: "passwords doesn't match" });

    User.findOne({ email : newUser.email }, (err, user) => {
        if(user) return res.status(400).json({ success: false, msg: "email exits" });

        newUser.save((err, doc) => {
            console.log(err);
            if(err) return res.status(400).json({ success: false, msg: err });

            res.status(200).json({
                success: true,
                user: doc
            });
        });
    });
}

exports.loginUser = (req, res) => {
    let token = req.cookies.auth;

    User.findByToken(token,(err, user) => {
        if(err) return res(err);
        if(user) return res.status(400).json({ success: false, msg: "user already logged in" });

        else {
            User.findOne({ 'email' : req.body.email }, function(err, user) {
                if(!user) return res.json({ success: false, msg :"auth failed, email not found" });

                user.comparepassword(req.body.password,(err, isMatch) => {
                    if(!isMatch) return res.json({ success: false, message: "passwords doesn't match" });

                    user.generateToken((err, user) => {
                        if(err) return res.status(400).send(err);

                        res.cookie('auth', user.token).json({
                            success: true,
                            id: user._id,
                            email: user.email
                        });
                    });
                });
            });
        }
    });
}

exports.logoutUser = (req, res) =>  {
    req.user.deleteToken(req.token,(err, user) => {
        if(err) return res.status(400).send(err);
        res.sendStatus(200);
    });
}

exports.getLoggedUser = (req, res) => {
    res.json({
        isAuth: true,
        id: req.user._id,
        email: req.user.email,
        name: req.user.name + req.user.lastname
    });
}



