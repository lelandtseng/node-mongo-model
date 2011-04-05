var fs = require('fs');


Model.prototype.count = function count(conditions, callback){
    db.collection(this.name, function(err, con){
        if(err) callback(err);
        else
        con.count(conditions, function(err, num){
            callback(err, num);
        });
    });
}

Model.prototype.find = function find(conditions, config, callback){

    

    var rsnum = config.rsnum;  // 每页最多的记录数量
    var pagenum = config.pagenum;  // 第几页
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
        if(err) callback(err);
        else 
        con.count(conditions, function(err, num){
            if(err) callback(err);
            else
            con.find(conditions, config, function(err, data){
                if(err) callback(err);
                else   
                data.toArray(function(err, data){
                if(err) callback(err);
                else{
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
                    
                    callback(null, data, pageinfo);
                }});
            });
        });
    });
}

Model.prototype.remove = function remove(id, callback){

    var mypath = this.path;    
    if(err) callback(err);
    else
    db.collection(this.name, function(err, con){
        if(err) callback(err);
        else
        con.find({
            _id: id
        }, function(err, data){
            if(err) callback(err);
            else
            data.toArray(function(err, data){
                if(err) callback(err);
                else
                con.remove({
                    _id: id
                }, function(err, type){
                    if(err) callback(err);
                    else{             
                    for(var k in data[0]){
                    var obj = data[0][k];
                    if(obj && obj.name && obj.path){
                       var myobj = obj;
                       fs.unlink(mypath+'/'+myobj.path,function(err){});
                    }
                    }
                    callback(null);
                    }
                });

            });
        });

    });
    
}

Model.prototype.get = function get(id, callback){
    if(err) callback(err);
    else
    db.collection(this.name, function(err, con){
        if(err) callback(err);
        else
        con.find({
            _id: id
        }, function(err, data){
            if(err) callback(err);
            else
            data.toArray(function(err, data){
                if(err) callback(err);
                else
                callback(null,data[0]);
            });
        });
    });
}

Model.prototype.update = function update(id, data, callback){

    var mydata = data;
    var mypath = this.path;
    var oldobj = {};
    function rw(obj,key){
        var myobj = obj;
        fs.readFile("/tmp/"+obj.path, function (err, data) {
                           
        if (err){}else{    
           fs.writeFile(mypath+'/'+oldobj[key].path, data, function (err) {
           });                              
        }
        });
    }
    db.collection(this.name, function(err, con){
        if(err) callback(err);
        else
        con.find({
            _id: id
        }, function(err, data){
            if(err) callback(err);
            else
            data.toArray(function(err, data){
        if(err) callback(err);
        else{
        for(var k in data[0]){          
            oldobj[k] = data[0][k];
        }
        
        for(var k in mydata){
            if(mydata[k]){
               var obj = mydata[k];
               if(obj && obj.name && obj.path){}
               else{data[0][k] = mydata[k];}
            }
        }
        
        con.update({
            _id: id
        }, data[0], function(err, data){
            if(err){
            callback(err);}else{
                for(var key in mydata){
                    
                    var obj = mydata[key];
                    
                    if(obj && obj.name && obj.path){
                        rw(obj,key);

                    }
                }
                callback(null,data);
            }
            
        });                
                
            }});
        });
    });

}

Model.prototypesave = function save(data, callback){

    var mydata = data;
    var mypath = this.path;
    function rw(obj){
        var myobj = obj;
        fs.readFile("/tmp/"+obj.path, function (err, data) {
        if (err){}else{fs.writeFile(mypath+'/'+obj.path, data, function (err) {});}});   
    }
    db.collection(this.name, function(err, con){
        if(err) callback(err);
        else{
                for(var key in mydata){
                    
                    var obj = mydata[key];
                    if(obj && obj.name && obj.path){
                        rw(obj);
                    }
                }         
                con.insert(mydata,callback)
            }

    });
}
