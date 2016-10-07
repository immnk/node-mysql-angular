var appRouter = function(app) {

    app.get("/", function(req, res) {
        res.send({ 'response': 'Hello World!' });
    });

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
        }
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
