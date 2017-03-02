# bindview
Bindview uses javascript arrays and objects to bind with nodes, prefabs, labels and sprites of Cocos Creator. 

## Try Demo

1. Clone this project, use Cocos Creator to open and run it!

    ```
    git clone https://github.com/darceye/bindview.git
    ```

2. Demo project assets structure

    ```
    assets
    |-Scene
      |-bindview.fire  // Demo Scene.
    |-js // Main files of bindview.
      |-bindview.js // Core functions.
      |-view.js // Cocos Creator JS component. Drag it to a node which you want to bind with.
    |-prefab
      |-child.prefab // Prefab for demo.
    |-resources
      |-headsatlas.plist // Used for demostrating sprite binding.
      |-heads.png
    |-testdata  // Js files for demo. 
      |-data.js  // Data bound with labels and sprites. Any changing of data will be shown on labels and sprites.
      |-edit.js  // For editing on Demo scene.
      |-imgload.js // Load images from resources, and set SpriteFrame data. 
    ```
    
3. Run bindview scene in browser. Change name, birthday, avatar ID or array index. Then click "Set". The labels and sprites will changed immidiately. Try "Push()" or "Pop()" to insert new element or delete an element of the array. You can also try it in console.

4. Now we look at the "Node Tree" panel, there are 3 nodes under Canvas. All of them have a view component:

  - objectAndNode. In view component, the bind type is OBJECT_AND_THIS_NODE, and it was bound with data[0].
  - arrayAndFirstChild. In view component, the bind type is ARRAY_AND_FIRST_CHILD, and it was bound with data and its first child node "child".
  - arrayAndPrefab. In view component, the bind type is is ARRAY_AND_PREFAB. The prefab was set to "child", which is under "assets/prefab". It bound data and prefab together.


## Intro

1. Copy bindview.js and view.js to assets folder.

2. Drag view.js to the node you want to bind. Now we call it father node.

3. Set bind type, data file name, and data key. 

4. For binding array with:

  - Prefab: Create a prefab if you want to bind it. the prefab should only have one root node. Labels and sprites under root node will be bound. Then Drag it into "father node -> view component -> prefab".

  - First Child: Create a child node under father node. Labels and sprites under child node will be bound. This child should be the first one.

5. For binding object with the father node, Labels and sprites under father node will be bound.

6. Create a data file. "data.js" for example. It's name should be same as you filled in "view->Data file".

7. For array binding, the data file should export an array, which elements will be bound with children of father node. The key names of the array elements should be same as labels or sprites name of the children.

8. For object binding, the data file should export an object, which key names should be same as labels or sprites name of the father node.

9. To bind a label, the property value should be a string. To bind a sprite, the property value should be an empty cc.SpriteFrame. For example:
  ```
  module.exports = {
      name: "Jacques Yang",
      birthday: "1984-6-4",
      avatar: new cc.SpriteFrame()
  }
  ```
  An array should be like this:
  ```
  module.exports = [{
          name: "Jacques Yang",
          birthday: "1984-6-4",
          avatar: new cc.SpriteFrame()
      }, {
          name: "企鹅",
          birthday: "1999-3-1",
          avatar: new cc.SpriteFrame()
      }
  ]
  ```
10. It's done! Then if you want to change labels or sprites, just change the data!