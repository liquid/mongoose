var sys = require('sys'),
    inspect = function(item){ sys.puts(sys.inspect(item)); },
    Mongoose = require('../../mongoose/').Mongoose, db, User;
    
  //  Mongoose.load(__dirname+'/../lib/model/plugins/behaviors.js');
    Mongoose.load(__dirname+'/models/');
    db = Mongoose.connect('mongodb://localhost/test');
    
    User = db.static('User');
    
    User.drop();
    
    var objs = [],
      usernames = ['Nathan','Guillermo','Damian','Thianh','Rafael','Matt','Keeto'],
      lastnames = ['Corrales','Lu','Rauch','Walker','White','Suarez'],
      ages = [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];
    
    Array.prototype.random = function(){
      return this[Math.floor(Math.random()*this.length)];
    }
    
    
    for(i=0,l=1000; i < l; i++){
      objs.push({
        username : usernames.random(),
        first : usernames.random(),
        last : lastnames.random(),
        bio : {
          age : ages.random()
        }
      });
    }
    
    User.insert(objs).exec(function(docs){
      // do something with docs that were inserted
    });
    
    hydrate = true;
    
    promise = 
      User.find({})
      .gt({'bio.age' : 20})
      .lt({'bio.age' : 25})
      .limit(20)
      .each(function(doc){
        
        sys.puts(doc.first_last+' legal drinking age?: '+ doc.legalDrinkingAge);
        this.partial(doc.bio.age);
        
      },hydrate);
      
  promise.then(function(ages){
    inspect(ages);
    Mongoose.close();
  },function(errs){
    inspect(errs);
    Mongoose.close();
  });
    
  //  promise = User.insert(objs)