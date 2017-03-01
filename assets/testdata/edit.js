var data = require('data')
cc.Class({
    extends: cc.Component,

    properties: {
        theName: cc.EditBox,
        birthday: cc.EditBox,
        avatarId: cc.EditBox,
        arrayIndex: cc.EditBox
    },

    // use this for initialization
    onLoad: function () {

    },
    set: function(){

        var avatars = require('imgload')
        var index = parseInt(this.arrayIndex.string)
        if(index < 0 || index > data.length - 1){
            return
        } 
        data[index].name = this.theName.string
        data[index].birthday = this.birthday.string

        var avatarId = parseInt(this.avatarId.string)
        if(avatarId >=1 && avatarId <= 9){
            data[index].avatar = avatars[avatarId]
        }

    },
    push: function(){
        var avatars = require('imgload')
        var avatarId = parseInt(this.avatarId.string)
        data.push({
            name: this.theName.string,
            birthday: this.birthday.string,
            avatar: (avatarId >=1 && avatarId <= 9) ? avatars[avatarId] : new cc.SpriteFrame()
        })
    },
    pop: function(){
        data.pop()
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
