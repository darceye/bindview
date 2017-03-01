var data = require('data')
var imgs
cc.Class({
    extends: cc.Component,
    onLoad: function(){
        var that = this
        cc.loader.loadRes("headsatlas", function(err, res){
            
            imgs =  res._spriteFrames
            that.loadAvatar()
            module.exports = imgs

        })
    },
    loadAvatar: function(){
        for(var i =0;i < data.length;i++){
            data[i].avatar = imgs[i+1]
        }
    }

})
