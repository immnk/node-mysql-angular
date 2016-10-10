var bcrypt = require('bcrypt');

var appRouter = function(app) {
    app.post("/checkLogin", function(req, res) {
        var username, password, json_responses;
        username = req.body.username;
        pass = req.body.password;
        if (username !== '' && pass !== '') {
            var getUser = "select password from registered_users where email='" + username + "'";
            console.log("Query is:" + getUser);
            fetchData(function(err, result) {
                if (err) {
                    throw err;
                } else {
                    console.log(result);
                    bcrypt.compare(pass,result.toString(),function(err){
                        if (!err) {
                            req.session.username = username;
                            console.log("Session initialized");
                            json_responses = { "statusCode": 200};
                            res.send(json_responses);
                        } else {
                            json_responses = { "statusCode": 401 };
                            res.send(json_responses);
                        }
                    })
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
        var userpass = req.body.password;

        //Check if user already register.
        if (req.body.email && req.body.password && req.body.firstname && req.body.lastname) {
            var checkUser = "SELECT * FROM registered_users where email='" + req.body.email + "'";
            fetchData(function (err, result) {
                if (err) {
                    throw err;
                } else {
                    console.log(result);
                    if (result.length > 0) {
                        console.log("User already registered!");
                        json_responses = {statusCode: 401};
                        res.send(json_responses);
                    } else {
                        //Insert new user info into table.
                        bcrypt.genSalt(11, function (err, salt) {
                            console.log('inside gensalt');
                            if (err) {
                                return console.log(err);
                            }
                            else {
                                bcrypt.hash(userpass, salt, function (err, hashedPassword) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                    else {
                                        console.log("Registering user into db");
                                        var regUser = "INSERT INTO registered_users(firstname,lastname,email,password) VALUES('" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.email + "','"+hashedPassword+"')";
                                        fetchData(function (err, result) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                console.log(result);
                                                if (result.affectedRows == 1) {
                                                    req.session.username = req.body.email;
                                                    console.log(req.session.username);
                                                    console.log('session initialized inside of register');
                                                    console.log('Registration Successful');
                                                    json_responses = {"statusCode": 200};
                                                    res.send(json_responses);
                                                } else {
                                                    console.log('Unsuccessful Registration');
                                                    json_responses = {"statusCode": 402};
                                                    res.send(json_responses);
                                                }
                                            }
                                        }, regUser);
                                    }
                                })
                            }
                        })
                    }
                }
            }, checkUser);
        }
    });

    app.post('/logout', function(req, res) {
        var json_responses;
        console.log("before if");
        if (req.session.username) {
            console.log("inside if")
            req.session.destroy();
            console.log("Session Destroyed");
            json_responses = { "statusCode": 200 };
        } else {
            json_responses = { "statusCode": 401 };
        }
        res.send(json_responses);
    });

    app.post("/addItemToDB",function(req,res){
        var json_responses;
        if(req.session.username){
            var pushAd = "INSERT INTO ads(itemName,itemPrice,itemDesc,posted_by) VALUES('"+ req.body.itemName +"','"+ req.body.itemPrice +"','"+ req.body.itemDesc +"','"+ req.session.username +"')";
            console.log("Query is:"+ pushAd);
            fetchData(function(err,result){
                if(err){
                    throw err;
                }
                else{
                    console.log(result);
                    if(result.affectedRows == 1){
                        console.log('Added Ad');
                        json_responses = {"statusCode":200};
                        res.send(json_responses);
                    }
                    else{
                        json_responses = {"statusCode":401};
                        res.send(json_responses);
                    }
                }
            },pushAd);
        }
    });

    app.get('/getItemsForSale',function (req,res) {
        var json_responses;
        var getItemsForSale = "SELECT * from ads where posted_by != '"+req.session.username+"'";
        console.log(getItemsForSale);

        fetchData(function(err,result){
            if(err){
                throw err
            }
            else{
                if(result.length > 0)
                {
                    res.send(result);
                }
                else{
                    json_responses = {"statusCode":401};
                    res.send(json_responses);
                }
            }
        },getItemsForSale)
    })

    app.post("/addItemToCartDB",function(req,res){
        var json_responses;
        var itemName = req.body.itemName;
        var itemPostedBy = req.body.itemPostedBy;
        var getItemDetails = "SELECT * FROM ads where itemName = '"+itemName+"' && posted_by='"+itemPostedBy+"'";
        fetchData(function (err,result) {
            if(err){
                throw err;
            }
            else{
                if(result.length > 0)
                {
                    console.log('inside cartIt');
                    if(req.session.username){
                        console.log('inside session check');
                        if(!req.session.cart){
                            req.session.cart = [];
                        }
                            req.session.cart.push({
                                itemName: result[0].itemName,
                                itemPrice: result[0].itemPrice,
                                itemDesc: result[0].itemDesc,
                                itemPostedBy : result[0].posted_by
                            });
                            json_responses = {"statusCode":200};
                        }
                    console.log("User Cart:",req.session.cart);
                    res.send(json_responses);
                    }
                }
        },getItemDetails)
    });

    app.get("/displayItemsFromCart",function (req,res) {
        
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
