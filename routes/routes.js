var appRouter = function(app) {

    app.get("/checkLogin", function(req, res) {
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
                        // req.session.username = username;
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

    app.post("/registerUser", function(req, res, next) {
        console.log('request for registering');
        var json_responses;

        //Check if user already register.
        var checkUser = "SELECT * FROM registered_users where email='" + req.param("email") + "'";
        fetchData(function (err, result) {
            if (err) {
                throw err;
            }
            else {
                console.log(result);
                if (result.length > 0) {
                    console.log("User already registered!");
                    json_responses = {statusCode: 401};
                    res.send(json_responses);
                }
                else {
                    //Insert new user info into table.

                    console.log("Registering user into db");
                    var regUser = "INSERT INTO registered_users(firstname,lastname,email,password) VALUES('" + req.param("firstname") + "','" + req.param("lastname") + "','" + req.param("email") + "','" + req.param("password") + "')";
                    fetchData(function (err, result) {
                        if (err) {
                            throw err;
                        }
                        else {
                            console.log(result);
                            if (result.affectedRows == 1) {
                                console.log('Registration Successful');
                                json_responses = {"statusCode": 200};
                                res.send(json_responses);
                            }
                            else {
                                console.log('Unsuccessful Registration');
                                json_responses = {"statusCode": 402};
                                res.send(json_responses);
                            }
                        }
                    }, regUser);
                }
            }
        }, checkUser);
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
}

module.exports = appRouter;
