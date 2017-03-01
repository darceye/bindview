/*!
 * bindview.js
 * (c) 2017 Jacques Yang
 * Released under the MIT License.
 */

/**
* Bind an array with a prefab, then add prefabs to a father node.
* Elements of the array should be an object.
* Array methods pop, push, shift, unshift is supported by now.
*/
function bindArray(array, prefab, father){
    if(!(array instanceof Array)){
        cc.log("bindArray: ", array, "is not Array" )
        return
    }

    var nodes = []
    for(var i = 0; i < array.length; i++){
        let a = array[i]
        var pf = bindObj(a, prefab, father)
        nodes.push(pf)
    }

    if(typeof(array.__binds) == 'undefined'){
        array.__push = array.push
        array.__pop = array.pop
        array.__unshift = array.unshift
        array.__shift = array.shift
        array.__splice = array.splice

        array.__binds = [{
            prefab: prefab,
            father: father,
            nodes: nodes
        }]
    }else{
        array.__binds.push({
            prefab: prefab,
            father: father,
            nodes: nodes
        })
    }

    array.push = function(o){
        for(var i = 0; i < this.__binds.length; i++){
            var pf = bindObj(o, this.__binds[i].prefab, this.__binds[i].father)
            this.__binds[i].nodes.push(pf)
        }
        return this.__push(o)
    }
    array.pop = function(o){
        for(var i = 0; i < this.__binds.length; i++){
            var pf = this.__binds[i].nodes.pop()
            pf.destroy()
        }
        return this.__pop()
    }
    array.unshift = function(o){
        for(var i = 0; i < this.__binds.length; i++){
            var pf = bindObj(o, this.__binds[i].prefab, this.__binds[i].father)
            this.__binds[i].nodes.unshift(pf)
            pf.setSiblingIndex(0)
        }
        return this.__unshift(o)
    }
    array.shift = function(o){        
        for(var i = 0; i < this.__binds.length; i++){
            var pf = this.__binds[i].nodes.shift()
            pf.destroy()
        }
        return this.__shift()
    }

    array.clear = function(){
        var l = this.length
        for(var i = 0; i< l; i++){
            this.pop()
        }
    }

    return nodes
}

function unbindArray(array){
    if(typeof(array.__binds) == "undefined"){
        return
    } 
    array.__binds = []
}

/**
* Instantiate a prefab, and bind it with an object, then put it under a father node.
*/
function bindObj(obj, prefab, father){
    var pf = cc.instantiate(prefab)
    bindObjAndNode(obj, pf)
    father.addChild(pf)
    return pf
}

/**
* Bind an object and a node.
* The properties of the object which type is string, 
* will bind with the child node which is a label with same name.
* The properties of the object which type is cc.SpriteFrame, 
* will bind with the child node which is a sprite with same name.
*/
function bindObjAndNode(obj, node){
    for(let k in obj){

        if(typeof(obj[k]) == 'string' || typeof(obj[k]) == 'number'){
            let child = node.getChildByName(k)
            if(!child){
                continue
            }
            let childLabel = child.getComponent(cc.Label)
            if(!childLabel){
                continue
            }
            bindLabel(obj, k, childLabel)
            continue;
        }

        if(obj[k] instanceof cc.SpriteFrame){
            let child = node.getChildByName(k)
            if(!child){
                continue
            }
            let childSprite = child.getComponent(cc.Sprite)
            if(!childSprite){
                continue
            }
            bindSprite(obj, k, childSprite)
            continue;
        }

    }
}
/** 
* Bind object properties with functions. 
* The functions will be called when properties changed.
* More than one function could be bound with one property.
*/
function bindFunc(obj, key, callback){
    // Use __shadow to store real values. Use __shadowFunc to store callback functions.
    if(typeof (obj.__shadow) == 'undefined') {
        // Create __shadow and __shadowFunc for all properties.
        obj.__shadow = {}
        obj.__shadowFunc = {}
    }
    if(typeof(obj.__shadow[key]) == 'undefined'){
        // Create __shadow and __shadowFunc property, which key name is same to object's property.
        obj.__shadow[key] = obj[key]
        obj.__shadowFunc[key] = []
        obj.__shadowFunc[key].push(callback)

     // Define binding relationship.
        var igs = {}
        igs[key] = {
            get: ()=>{return obj.__shadow[key]},
            set: (nv)=>{
                obj.__shadow[key] = nv
                for(var i = 0; i < obj.__shadowFunc[key].length; i++  ){
                    var func = obj.__shadowFunc[key][i]
                    if(!func(nv)){
                        obj.__shadowFunc[key].splice(i, 1) // Delete invalid functions. 
                        i-- // Array index should be reduced when the array length is reduced.
                    }
                }
            }
        }
        Object.defineProperties(obj, igs)    
    } else{
        // If it's not the first binding function, Just add it.
        obj.__shadowFunc[key].push(callback)
    }

    // Run the functions by assigning its value.
    obj[key] = obj[key]
}

/** 
* Bind Object property and label.
* New Value Callback Return: 
* false - something wrong happened to the label. 
*         The caller should delete this function. Sometime it was caused by loadSence().
* true -  New value set successfully.
*/
function bindLabel(obj, key, label, template){

    bindFunc(obj, key, function(nv){
        if(!label || !label.node){
            return false
        }

        if(typeof(template) != 'function'){
            label.string = nv
        }else{
            label.string = template(nv)
        }
        return true
    })
}

/** 
* Bind Object property and sprite.
* New Value Callback Return: 
* false - something wrong happened to the sprite. 
*         The caller should delete this function. Sometime it was caused by loadSence().
* true -  New value set successfully.
*/
function bindSprite(obj, key, sprite){
    bindFunc(obj, key, function(nv){
        if(!sprite || !sprite.node){
            return false
        }
        sprite.spriteFrame = nv 
        return true
    })
}

function unbindAll(obj, key){
    if(typeof (obj.__shadow) == 'undefined') {
        return
    }
    if(typeof (obj.__shadow[key]) == 'undefined') {
        return
    } else {

        delete obj[key]
        obj[key] = obj.__shadow[key]
        obj.__shadow[key] = undefined
        obj.__shadowFunc[key] = undefined
    }
}


var ex = module.exports;

// ex.bindLabel = bindLabel
// ex.bindFunc = bindFunc
// ex.unbindAll = unbindAll
ex.bindArray = bindArray
// ex.bindObj = bindObj
ex.bindObjAndNode = bindObjAndNode
// ex.bindSprite = bindSprite
// ex.unbindArray = unbindArray
