/*var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  port:"8889",
  user: "root",
  database : 'analytics',
  password: "root"/*
});

console.log("Connection Initiated")

con.connect(function(err) {
      if (err)
        console.log(err)
      else{
          console.log("Connected!");
      }
});*/

var express = require('express');
var app = express();
var myParser = require('body-parser');
var mysql = require('mysql')
var shortid = require('shortid')
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient();
var MongoURL = "mongodb://localhost:27017/HMIS";

//CORS used for the cross site access origin
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Timestamp based uuid
const sessionToken = require('uuid/v1')
//Random uuid
const randomToken = require('uuid/v4')


//Setting up the app parsers
app.use(myParser.urlencoded({extended:true}));
app.use(myParser.json());
app.use(express.static(__dirname + "/web"));

var connection = mysql.createConnection({
 host: "127.0.0.1",
  port:"8889",
  user: "root",
  database : 'users',
  password: "root"

});

MongoClient.connect(MongoURL,function(err,db){
    if(err) throw err;
    console.log("Connection to MongoDB successfull !!!");
});

var connectState = mysql.createConnection({
  host: "127.0.0.1",
  port:"8889",
  user: "root",
  database : 'analytics',
  password: "root"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connection with user database successfull !!");
});

connectState.connect(function(err) {
  if (err) throw err;
  console.log("Connection with state database successfull !!");
});

app.post('/login',function(request,response){

        var email = request.body.user_email;
        var password = request.body.password;

        var query = "SELECT * FROM login WHERE email='"+email+"'";
        connection.query(query,function(error,result,rows){
                if(result[0] == undefined){
                        //If user not detected
                        console.log("Unauthorized Access")
                        response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                        response.write(JSON.stringify({'status' : 'failure','message':'NO_USER'}));
                        response.end();
                }else{
                        //If email is credible, check for password
                        console.log(result[0])
                        if(result[0].pass_token == password){
                                var token = sessionToken();
                                console.log('USER AUTHENTICATED')
                                console.log(token)

                                //Adding the token to database for future APIs
                                connection.query("UPDATE login SET api_token='"+token+"' WHERE email='"+email+"'",function(error,result,rows){if(error) console.log(error)});

                                response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                                response.write(JSON.stringify({'status' : 'success','token':token,'uid':result[0].userID}));
                                response.end();
                        }else{
                                console.log('Wrong Password')
                                response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                                response.write(JSON.stringify({'status' : 'failure','message':'WRONG_PASSWORD'}));
                                response.end();
                        }
                }
        })

});

app.post('/signup',function(request,response){

var email = request.body.email;

var query = "SELECT * FROM login WHERE email='"+email+"'";
    connection.query(query,function(error,result,rows){
        console.log(result)
        if(result[0] == undefined){

                console.log(result)
                //If user not detected, then add 
                var contact  = request.body.contact;
                var name = request.body.name;
                var org = request.body.org;
                var purpose = request.body.purpose;
                var password = request.body.password;
                var org = request.body.org;
                var token = sessionToken();
                var userID = shortid.generate()

                query = "INSERT INTO login (userID ,userName , email, pass_token , login_type , api_token , contact , purpose , org) VALUES ('" + userID + "','" + name + "','"+ email+"','"+password+"','"+'EMAIL'+"','"+token+"','"+contact+"','"+purpose+"','"+org+"')"
                connection.query(query,function(error,result,rows){
                    if(error){
                        console.log(error)
                        console.log("Could not registered")
                        response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                        response.write(JSON.stringify({'status' : 'failure','message':'MYSQL_ERROR'}));
                        response.end();
                    }else{
                        console.log(result)
                        console.log("User registered !!")
                        response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                        response.write(JSON.stringify({'status' : 'success','message':'USER_REGISTERED'}));
                        response.end();
                    }
                })

        }else{

                console.log('Email Already registered')
                response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                response.write(JSON.stringify({'status' : 'failure','message':'USER_EXISTS'}));
                response.end();
        }
    })
});


app.post('/stateVar2',function(request,response){
    console.log("Request for the new variables received !!! ");
    var StateCode = request.body.state_code;
    var varList = JSON.parse(request.body.var_data);
    var query;
    if(StateCode == '*'){
        query = {};
    }else{
        query = { state_code : StateCode};
    }
    console.log(varList);
    
    //Setting up the selection variable
    var varSelect = {_id : 0 , censuscode : 1, state_code : 1 , district : 1};
    varList.forEach(function(d){
        varSelect[d.data_var] = 1;
    });
    MongoClient.connect(MongoURL,function(err,db){
        if(err) throw err;
        console.log("Connection successfull!!");
        db.collection('district').find(query,varSelect).toArray(function(error, result){
            if(error){
                response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                response.write(JSON.stringify({'status':'failure','message':error}));
                response.end();
            }else{
                response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                response.write(JSON.stringify({'status':'success',message:result}));
                response.end();
            }
        });
    });
});


//API call to get the state of variables for a particular user using the user id
app.post('/variableSet',function(request,response){

    var user_id = request.body.user_id;
    var sessionToken = request.body.token;

    var query = "SELECT variables FROM var_list WHERE user_id ='"+user_id+"'";
    console.log("Variables list for "+user_id+" : ");

    connection.query(query,function(error,result,rows){
        if(error){
                response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                response.write(JSON.stringify({'status' : 'failure','message':error}));
                response.end();
        }else{
                //console.log(result[0])
                response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                response.write(JSON.stringify({'status' : 'success','message':result}));
                response.end();
        }
    })
});


//API call to update  variables list for a particular user using the user id
app.post('/updateVar',function(request,response){

    var user_id = request.body.user_id;
    var sessionToken = request.body.token;
    var var_list = request.body.var_list;

    var query = "UPDATE var_list SET variables = '"+var_list + "' WHERE user_id ='"+user_id+"'";

    console.log(query)
    connection.query(query,function(error,result,rows){
        if(error){
                response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                response.write(JSON.stringify({'status' : 'failure','message':error}));
                response.end();
        }else{
                console.log(result)
                response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                response.write(JSON.stringify({'status' : 'success','message':'updated'}));
                response.end();
        }
    })
})

//API call to get the state data for given number of variables
app.post('/stateVaiablesData',function(request,response){

    var StateCode = request.body.state_code;
    var varList = JSON.parse(request.body.var_data);

    varList.forEach(function(d){
        console.log(d.data_var)
    })
    var query = "SELECT DISTRICT ";

    varList.forEach(function(d){
        query += " , " + d.data_var;
    })
    if(StateCode == '*'){
        query += " FROM datafile";
    }else if(StateCode == 37){
        query += " FROM datafile WHERE state_code IN (36,37)";
    }
    else{
        query += " FROM datafile WHERE state_code ='"+StateCode+"'";
    }
    //query += " FROM datafile WHERE state_code ='"+StateCode+"'";
    //console.log("Variables requested for "+StateCode + " : " + varList);
    console.log(query)
    connectState.query(query,function(error,result,rows){
        if(error){
            console.log(error)
                response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                response.write(JSON.stringify({'status' : 'failure','message':error}));
                response.end();
        }else{
                //console.log(result)
                response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                response.write(JSON.stringify({'status' : 'success','message':result}));
                response.end();
        }
    })
});

//API call to get the state wise data for given number of variables
app.post('/stateWiseData',function(request,response){

    var varList = JSON.parse(request.body.var_data);
    var statecode = JSON.parse(request.body.ST_CD);

    varList.forEach(function(d){
        console.log(d.data_var)
    })
    var query = "SELECT ST_NM ";

    varList.forEach(function(d){
        query += " , " + d.data_var;
    })

    query += " FROM stateWiseData";

    if(statecode != -1){
     query += " WHERE state_code="+statecode;
    }

    //query += " FROM datafile WHERE state_code ='"+StateCode+"'";
    //console.log("Variables requested for "+StateCode + " : " + varList);
    console.log(query)
    connectState.query(query,function(error,result,rows){
        if(error){
            console.log(error)
                response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                response.write(JSON.stringify({'status' : 'failure','message':error}));
                response.end();
        }else{
                //console.log(result)
                response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                response.write(JSON.stringify({'status' : 'success','message':result}));
                response.end();
        }
    })
});

//API call to get the state wise data for given number of variables
app.post('/qualityData',function(request,response){

    var varList = JSON.parse(request.body.var_data);
    var statecode = JSON.parse(request.body.ST_CD);

    varList.forEach(function(d){
        console.log(d.data_var)
    })
    var query = "SELECT ST_NM ";

    varList.forEach(function(d){
        query += " , " + d.data_var;
    })

    query += " FROM quality";

    if(statecode != -1){
     query += " WHERE ST_CD="+statecode;
    }

    //query += " FROM datafile WHERE state_code ='"+StateCode+"'";
    //console.log("Variables requested for "+StateCode + " : " + varList);
    console.log(query)
    connectState.query(query,function(error,result,rows){
        console.log(result)
        if(error){
            console.log(error)
                response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                response.write(JSON.stringify({'status' : 'failure','message':error}));
                response.end();
        }else{
                //console.log(result)
                response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                response.write(JSON.stringify({'status' : 'success','message':result}));
                response.end();
        }
    })
});

//API call to get the state wise Indexes for Quality and Quantity
app.post('/index',function(request,response){
    
    var query = "SELECT * FROM HMIS ORDER BY RANKING ASC";
   
    console.log(query)
    connectState.query(query,function(error,result,rows){
        console.log(result)
        if(error){
            console.log(error)
                response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                response.write(JSON.stringify({'status' : 'failure','message':error}));
                response.end();
        }else{
                //console.log(result)
                response.writeHead(200,{'Content-Type':'text/json','Access-Control-Allow-Origin':'*'});
                response.write(JSON.stringify({'status' : 'success','message':result}));
                response.end();
        }
    })
});

var server = app.listen(8080,function(){
        var host = server.address().address;
        var port = server.address().port;
        console.log('app started at http://%s:%s',host,port);
});

