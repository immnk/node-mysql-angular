var bcrypt = require('bcrypt');

var appRouter = function(app) {
    app.post("/checkLogin", function(req, res) {
        var username, password, json_responses;
        username = req.body.username;
        pass = req.body.password;
        var time = Date();
        console.log(time);
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
                            var updateTime = "UPDATE registered_users SET last_login='"+time+"' where email='"+username+"'";
                            fetchData(function (err,result) {
                                if(err){
                                    throw err;
                                }
                                else{
                                    if(result.affectedRows > 0)
                                    {
                                        console.log("time updated");
                                    }
                                }
                            },updateTime);
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
                                                    json_responses = {"statusCode": 200,"last_login":time};
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
        var itemQuantity = req.body.itemQuantity;
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
                                itemPostedBy : result[0].posted_by,
                                itemQuantity : itemQuantity
                            });
                        }
                    var ItemsToBeCarted = "INSERT INTO cart(username,itemName,itemPrice,itemDesc,itemPostedBy,itemQuantity) values('"+req.session.username+"','"+itemName+"','"+result[0].itemPrice+"','"+result[0].itemDesc+"','"+result[0].posted_by+"','"+itemQuantity+"')";
                    console.log("items to be carted"+ItemsToBeCarted);
                    fetchData(function (err,result) {
                        if(err){
                            throw err;
                        }
                        else{
                            if(result.affectedRows > 0)
                            {
                                console.log("cart database successfully updated");
                                json_responses = {"statusCode":200}
                            }
                            else
                            {
                                console.log("problem while inserting cart data");
                                json_responses={"statusCode":401};
                            }
                        }
                    },ItemsToBeCarted);
                    }
                }
        },getItemDetails)
    });

    app.get("/displayItemsFromCart",function (req,res) {
        var json_responses;
        if(req.session.username)
        {
            var GetUserCartItems = "SELECT * FROM cart where username ='"+req.session.username+"' AND isCheckedOut LIKE '0' AND isDeleted LIKE '0'";
            fetchData(function(err,result){
                if(err){
                    throw err;
                }
                else{
                    if(result.length > 0){
                        console.log(result);
                        json_responses = result;
                        res.send(json_responses);
                    }
                    else{
                        json_responses = {"statusCode":401};
                        res.send(json_responses);
                    }
                }

            },GetUserCartItems)
        }
    });

    app.get('/getLastLoggedInTime',function (req,res) {
       var json_responses;
        if(req.session.username){
            var getTime = "SELECT last_login from registered_users where email = '"+req.session.username+"'";
            fetchData(function (err,result) {
                if(err)
                {
                    throw err;
                }
                else{
                    if(result.length > 0)
                    {
                        console.log("time"+result);
                        json_responses = result[0].last_login;
                        res.send(json_responses);
                    }
                    else {
                        json_responses = {"statusCode":401};
                        res.send(json_responses);
                    }
                }
            },getTime);
        }
    });
    
    app.post('/removeItemFromCartDB',function (req,res) {
        var json_responses;
        var itemName = req.body.itemName;
        var itemPostedBy = req.body.itemPostedBy;

        var isDeleted = "UPDATE cart set isDeleted = '"+1+"' where itemName='"+itemName+"' AND itemPostedBy='"+itemPostedBy+"' AND username='"+req.session.username +"'";

        fetchData(function (err,result) {
            if(err)
            {
                throw err;
            }
            else{
                console.log(result);
                if(result.affectedRows > 0)
                {
                    console.log("deleted item from cart");
                    json_responses = {"statusCode":200};
                    res.send(json_responses)
                }
                else{
                    console.log("error while deleting item from cart");
                    json_responses = {"statusCode":401};
                    res.send(json_responses);
                }
            }
        },isDeleted)
    });

    app.get('/updateCheckoutInfo',function (req,res) {

        //update cart items with isCheckedOut option.
        var json_responses;
        var isChecked = "UPDATE cart set isCheckedOut = '"+1+"',isSold='"+1+"' where username = '"+req.session.username+"'";
        console.log("checkout query"+isChecked);
        fetchData(function (err,result) {
            if(err)
            {
                throw err;
            }
            else{
                if(result.affectedRows>0)
                {
                    json_responses = {"statusCode":200};
                    res.send(json_responses);
                }
                else {
                    json_responses = {"statusCode":401};
                    res.send(json_responses);
                }
            }
        },isChecked);
    });

    app.get('/getCheckoutInfo',function(req,res){
        var json_responses;
        var getCheckout = "SELECT * from cart where username='"+req.session.username+"' AND isCheckedOut='"+1+"'";
        fetchData(function(err,result){
            if(err){
                throw err;
            }
            else{
                if(result.length>0){
                    json_responses = result;
                    res.send(json_responses);
                }
                else {
                    json_responses = {"statusCode":401};
                    res.send(json_responses);
                }
            }
        },getCheckout);
    });

    app.get('/getSoldInfo',function(req,res){
        var json_responses;
        var getSoldout = "SELECT * from cart where itemPostedBy='"+req.session.username+"' AND isSold='"+1+"'";
        fetchData(function(err,result){
            if(err){
                throw err;
            }
            else{
                if(result.length>0){
                    json_responses = result;
                    res.send(json_responses);
                }
                else {
                    json_responses = {"statusCode":401};
                    res.send(json_responses);
                }
            }
        },getSoldout);
    });

    app.post("/checkCardValidity",function (req,res) {
        var credit = req.body.card_num;
        var date= req.body.exp_date;
        var cvv = req.body.cvv;


        console.log(credit);
        console.log(date);
        console.log(cvv);

        var json_responses;

        var regex = /^[0-9]{3,4}$/ ;
        var match = regex.exec(cvv);
        var regex1=/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
        var match1= regex1.exec(credit);
        var regex2=/^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        var match2 = regex2.exec(date);
        console.log(match);
        console.log(match1);
        console.log(match2);

        if(match!="" && match!=null && match1!="" && match1!=null && match2!="" && match2 !=null)
        {
            json_responses = {"statusCode":200};
            console.log(json_responses);
            res.send(json_responses);
        }
        else {
            json_responses = {"statusCode":401};
            console.log(json_responses);
            res.send(json_responses);
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
