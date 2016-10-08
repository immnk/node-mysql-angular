var appRouter = function(app) {
    app.post("/checkLogin", function(req, res) {
        var username, password, json_responses;
        username = req.param("username");
        password = req.param("password");
        if (username !== '' && password !== '') {
            var getUser = "select * from registered_users where email='" + username + "' and password='" + password + "'";
            console.log("Query is:" + getUser);
            fetchData(function(err, result) {
                if (err) {
                    throw err;
                } else {
                    if (result.length > 0) {
                        req.session.username = username;
                        console.log("Session initialized");
                        json_responses = { "statusCode": 200 };
                        res.send(json_responses);
                    } else {
                        json_responses = { "statusCode": 401 };
                        res.send(json_responses);
                    }
                }
            }, getUser);
        } else {
            console.log('empty params passed');
            json_responses = { "statusCode": 300 };
            res.send(json_responses);
        }
    });

    app.post("/registerUser", function(req, res) {
        console.log('request for registering');
        console.log(req.body);
        var json_responses;
        /*var userpass = req.param("password");
        var hashedPass = hashPassword(userpass);
        console.log(hashedPass);*/

        //Check if user already register.
        if (req.body.email && req.body.password && req.body.firstname && req.body.lastname) {
            var checkUser = "SELECT * FROM registered_users where email='" + req.body.email + "'";
            fetchData(function(err, result) {
                if (err) {
                    throw err;
                } else {
                    console.log(result);
                    if (result.length > 0) {
                        console.log("User already registered!");
                        json_responses = { statusCode: 401 };
                        res.send(json_responses);
                    } else {
                        //Insert new user info into table.
                        console.log("Registering user into db");
                        var regUser = "INSERT INTO registered_users(firstname,lastname,email,password) VALUES('" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.email + "','" + req.body.password + "')";
                        fetchData(function(err, result) {
                            if (err) {
                                throw err;
                            } else {
                                console.log(result);
                                if (result.affectedRows == 1) {
                                    console.log('Registration Successful');
                                    json_responses = { "statusCode": 200 };
                                    res.send(json_responses);
                                } else {
                                    console.log('Unsuccessful Registration');
                                    json_responses = { "statusCode": 402 };
                                    res.send(json_responses);
                                }
                            }
                        }, regUser);
                    }
                }
            }, checkUser);
        } else {
            console.log('Insufficient body params');
            json_responses = {
                "statusCode": 400
            }
            res.send(json_responses);
        }
    });

    app.post('/logout', function(req, res) {
        var json_responses;
        console.log("before if");
        if (req.session.username) {
            console.log("inside if")
            req.session.destroy();
            console.log("Session Destroyed");
           // res.redirect('/');
            json_responses = { "statusCode": 200 };
        } else {
            json_responses = { "statusCode": 401 };
        }
        res.send(json_responses);
    });

    function fetchData(callback, sqlQuery) {
        console.log("\nSql Query" + sqlQuery);

        app.connection.query(sqlQuery, function(err, rows, fields) {
            if (err) {
                console.log("Error Message:" + err);
            } else {
                console.log("DB results" + rows);
                callback(err, rows);
            }
        });
    }
    /*function hashPassword(userPassword){
        bcrypt.genSalt(11,function (err,salt) {
            if(err)
            {
                return console.log(err);
            }
            else {
                bcrypt.hash(userPassword,salt,function (err,hashedPassword) {
                    if(err)
                    {
                        return console.log(err);
                    }
                    else{
                        console.log(hashedPassword);
                    }
                })
            }
        })
    }*/
}



module.exports = appRouter;
