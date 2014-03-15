var db = require("./../../db"),
    User = db.getModel("user", {
        social : [{id: String, socialType : Number}],
        first_name : String,
        last_name : String,
        email : String,
        karma : {type : Number, default : 0},
        location : String,
        gender : Boolean,
        timezone : Number,
        photo : String,
        points : [{
            alias : String,
            point:{type : db.Types.ObjectId, ref : 'point'}
        }],
        routes : [{
            alias : String,
            route : {type : db.Types.ObjectId, ref : 'route'}
        }],
        driverStatus : {type : Number, default: 0},  //0 - not drive, 1 - busy, 2 - free
        online : {type : Boolean, default : true},
        currentLatlng : {
            latlng : [{type : Number}],
            dateUpdate : {type: String, default: (new Date()).getTime()}
        }
    }, {
        findOrSave : function(profileObj, callback){
            this.findOne({"social.id" : profileObj.social[0].id}, function(err, data){
                if(err) {
                    callback(err);
                    return
                }
                if(data) {
                    data.online = true;
                    data.save();
                    callback(null, data);
                }
                else{
                    var profile = new User(profileObj);
                    profile.save(callback);
                }
            });
        },
        logout : function(id, callback){
            this.update({_id: id}, {online : false}, callback);
        }
    });
module.exports = User;