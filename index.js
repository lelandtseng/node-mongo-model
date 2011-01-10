
var ObjectID = exports.ObjectID = require('mongodb').BSONPure.ObjectID;

if(typeof jfdkslfjksdfjoejfodsieofjdjsiopjafjeipajdjaiieiiiifidsi348889348f8s9fj84j === "undefined"){

var Db = require('mongodb').Db, Connection = require('mongodb').Connection, Server = require('mongodb').Server, BSON = require('mongodb').BSONNative;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

var db = jfdkslfjksdfjoejfodsieofjdjsiopjafjeipajdjaiieiiiifidsi348889348f8s9fj84j = exports.DB = new Db('mydb', new Server(host, port, {}), {
    native_parser: false
});

db.open(function(err, db){
    console.log(err)
});

}
else{
    var db = jfdkslfjksdfjoejfodsieofjdjsiopjafjeipajdjaiieiiiifidsi348889348f8s9fj84j;
}

var Model = exports.Model = function Model(name){
    this.name = name;
}


Model.prototype.count = function count(conditions, callback){
    db.collection(this.name, function(err, con){
        con.count(conditions, function(err, num){
            callback(data, num);
        });
    });
}

Model.prototype.find = function find(conditions, config, callback){
    
    var rsnum = config.rsnum;
    var pagenum = config.pagenum;
    var pagebool = false;
    
    if(!config.pagenum && config.rsnum){
        config.pagenum = 1;
    }
    if(config.pagenum){
        if(config.rsnum){config.limit=config.rsnum;}
        else{config.rsnum = config.limit = 10;}
        config.skip = (config.pagenum-1) * config.rsnum;
        pagebool = true;
    }
    
    delete config.pagenum;
    delete config.rsnum;
    
    db.collection(this.name, function(err, con){
        con.count(conditions, function(err, num){
            con.find(conditions, config, function(err, data){
                data.toArray(function(err, data){
                    var pageinfo = null;
                    if(pagebool){
                    
                        pageinfo = {}
                        pageinfo.allpage = Math.ceil(num / 5);
                        pageinfo.currentpage = pagenum;
                        pageinfo.prevpage = (parseInt(pagenum)-1 <= 1) ? 1 : parseInt(pagenum)-1;
                        pageinfo.nextpage = (parseInt(pagenum) + 1) > pageinfo.allpage ? pageinfo.allpage : parseInt(pagenum)+1;
                        pageinfo.pages = [];
                        for(var i =1 ; i<(pageinfo.allpage+1) ; i++){
                            pageinfo.pages.push(i);  
                           
                        }
                        pageinfo.pagetotal = num;
                    }
                    
                    callback(data, pageinfo);
                });
            });
        });
    });
}

Model.prototype.remove = function remove(id, callback){
    db.collection(this.name, function(err, con){
        con.remove({
            _id: id
        }, function(err, type){
            callback();
        });
    });
}

Model.prototype.get = function get(id, callback){
    db.collection(this.name, function(err, con){
        con.find({
            _id: id
        }, function(err, data){
            data.toArray(function(err, data){
                callback(data[0]);
            });
        });
    });
}

Model.prototype.update = function update(id, data, callback){
    db.collection(this.name, function(err, con){
        con.update({
            _id: id
        }, data, function(err, data){
            callback();
        });
    });
}

Model.prototype.save = function save(data, callback){
    db.collection(this.name, function(err, con){
        con.insert(data, function(err, data){
            callback(data);
        });
    });
}
