const _PATH = "../assets/js/"

var rewire = require('rewire')

var normal = rewire(_PATH + "bindview")
var common = normal
var expect = require("chai").expect


describe("bind labels", function() {
    it("bind label & func", function() {
        var label = {
            string: "abc"
        }
        var data = {
            labelstr: "xyz"
        }
        normal.bindLabel(data, "labelstr", label)
        expect(label.string).to.be.equal("xyz")
        data.labelstr = "qwer"
        expect(label.string).to.be.equal("qwer")

        var label2 = {
            string: "999"
        }
        normal.bindLabel(data, "labelstr", label2)
        expect(label2.string).to.be.equal("qwer")
        data.labelstr = "uip"
        expect(label.string).to.be.equal("uip")
        expect(label2.string).to.be.equal("uip")
        data.labelstr = "u3ip"
        expect(label.string).to.be.equal("u3ip")
        expect(label2.string).to.be.equal("u3ip")

        var temp = "i am temp ,got :"
        normal.bindFunc(data, "labelstr", function(nv) {
            temp = temp + nv
        })
        expect(temp).to.be.equal("i am temp ,got :" + "u3ip")
        data.labelstr = "mzd,"
        expect(temp).to.be.equal("i am temp ,got :" + "u3ip" + "mzd,")

        normal.unbindAll(data, "labelstr")
        expect(data.labelstr).to.be.equal("mzd,")
        data.labelstr = "new day"
        expect(label.string).to.be.equal("mzd,")
        expect(label2.string).to.be.equal("mzd,")
        expect(temp).to.be.equal("i am temp ,got :" + "u3ip" + "mzd,")
        expect(data.labelstr).to.be.equal("new day")

    })
})

// stabs
global.cc = {}
cc.Node = function(pf) {
    for (k in pf) {
        this[k] = pf[k]
    }

}
cc.Node.prototype.addChild = function() {}
cc.Node.prototype.getChildByName = function(name) {
    return this[name]
}
cc.Node.prototype.getComponent = function(type) {
    return this[type]
}

cc.instantiate = function(pf) {
    return new cc.Node(pf)
}
cc.SpriteFrame = function(nv) {
    this.nv = nv
}
cc.Label = function(nv) {
    this.nv = nv
}
cc.Sprite = function(nv) {
    this.nv = nv
}
cc.Prefab = function() {}


describe("bind sprites", function() {
    it("bind sprites & func", function() {
        var sprite = {
            spriteFrame: "abc"
        }
        var data = {
            sp: new cc.SpriteFrame(1)
        }
        normal.bindSprite(data, "sp", sprite)
        expect(sprite.spriteFrame).to.be.equal(data.sp)
        var oldsp = data.sp
        data.sp = new cc.SpriteFrame(2)
        expect(sprite.spriteFrame).to.be.equal(data.sp)
        expect(sprite.spriteFrame).to.be.not.equal(oldsp)
    })
})


describe('bind obj and node', function() {
    it("bind obj and node", function() {
        var obj = {
            text: "label",
            num: 123,
            sp: new cc.SpriteFrame
        }
        var node = new cc.Node()
        common.bindObjAndNode(obj, node)
        obj.text = "changed"
        obj.num = 456
        var newsp = new cc.SpriteFrame
        obj.sp = newsp
        var node2 = new cc.Node()
        common.bindObjAndNode(obj, node2)

    })
})

/*
describe("bind array", function(){
    it("bind array", function(){
        var array = [{
            label1: "abc",
            label2: "def",
            sp1: cc.SpriteFrame(3),
            sp2: cc.SpriteFrame(4),
        },{
            label1: "xxx",
            label2: "yyy",
            sp1: cc.SpriteFrame(613),
            sp2: cc.SpriteFrame(777),

        }]
        var prefab = new cc.Prefab()
        prefab.label1 = cc.Label(1)
        prefab.label2 = cc.Label(2)
        prefab.sp1 = new cc.Sprite(1)
        prefab.sp2 = new cc.Sprite(2)

        var father = new cc.Node()

        var nodes = normal.bindArray(array, prefab, father)
        
    })
})
*/