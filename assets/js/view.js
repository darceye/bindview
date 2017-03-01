/*!
 * view.js
 * (c) 2017 Jacques Yang
 * Released under the MIT License.
 */


var Bindview = require("bindview")
var BindType = new cc.Enum({"ARRAY_AND_PREFAB":0, "ARRAY_AND_FIRST_CHILD":1, "OBJECT_AND_THIS_NODE": 2})

cc.Class({
    extends: cc.Component,
    // editor: {
    //     requireComponent: cc.Layout
    // },

    properties: {
        bindType: {
            default: 0,
            type:BindType
        },
        prefab: cc.Prefab,
        dataFile: "",
        dataKey:""

    },

    onLoad: function () {
        try{
            if(this.data == ""){
                return
            }
            var dataFile = require(this.dataFile)
            if(typeof(dataFile) == 'undefined'){
                cc.log("[Bind Failed] cannot find data file ", this.dataFile)
                return
            }
            var data
            if(this.dataKey == ""){
                data = dataFile
            }else{
                data = dataFile[this.dataKey]
                if(typeof(data) == 'undefined'){
                    return
                }
            }
            switch(this.bindType){
                case BindType.ARRAY_AND_PREFAB:
                    this.bindArrayAndPrefab(data)
                    break;
                case BindType.ARRAY_AND_FIRST_CHILD:
                    this.bindArrayAndFirstChild(data)
                    break;    
                case BindType.OBJECT_AND_THIS_NODE:
                    this.bindObjectAndThisNode(data)
                    break;
                default:
                    cc.log("Unkown Bind Type: ", this.bindType)
            }
        }catch(e){
            cc.log("[Bind Error]",e)
        }
    },
    bindArrayAndPrefab: function(data){
        if(!(data instanceof Array)){
            cc.log("[Bind Prefab Failed]", data,"is not an Array")
            return
        }
        Bindview.bindArray(data, this.prefab, this.node)
    },
    bindArrayAndFirstChild: function(data){
        if(!(data instanceof Array)){
            cc.log("[Bind First Child Failed]", data,"is not an Array")
            return
        }
        var prefab = this.node.children[0]
        this.node.removeChild(prefab)
        Bindview.bindArray(data, prefab, this.node) 
    },
    bindObjectAndThisNode: function(data){
        if(!(data instanceof Object)){
            cc.log("[Bind Object Failed]", data,"is not an Object")
            return
        }
        if(data instanceof Array){
            cc.log("[Bind Object Failed]", data,"is an Array")
            return
        }
        Bindview.bindObjAndNode(data, this.node)
    }
});
