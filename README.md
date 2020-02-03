# BITSWALL

## Deployment

- Get CI token `firebase login:ci`

### Hosting

- firebase deploy --only hosting --token $CI_TOKEN

### Function

- firebase deploy --only functions --token $CI_TOKEN



### Data Structure

```
class Brick
{
    type: "named-image"
    version: "3.4.0"
    originX: "left"
    originY: "top"
    left: 0
    top: 0
    width: 240
    height: 140
    fill: "rgb(0,0,0)"
    stroke: null
    strokeWidth: 0
    strokeDashArray: null
    strokeLineCap: "butt"
    strokeDashOffset: 0
    strokeLineJoin: "miter"
    strokeMiterLimit: 4
    scaleX: 0.5
    scaleY: 0.5
    angle: 0
    flipX: false
    flipY: false
    opacity: 1
    shadow: null
    visible: true
    clipTo: null
    backgroundColor: ""
    fillRule: "nonzero"
    paintFirst: "fill"
    globalCompositeOperation: "source-over"
    transformMatrix: null
    skewX: 0
    skewY: 0
    crossOrigin: ""
    cropX: 0
    cropY: 0
    src: "45641313/abc.png" // information for get picture in firestore or cloud function API
    filters: []
    active: false
    price: 50
}

```


### Firebase Data Structure

```
bitsWalls
    - { channelID }
      - pictures
        - { picture ID (uuid) } : { firestore url}
      - tamplates
        - { uuid }: { Map<brickID ,Brick> }
        - { uuid }: { Map<brickID ,Brick> }
        - { uuid }: { Map<brickID ,Brick> }
      - bricks: Map<brickID ,Brick> 
```

### Firestore Data Structure

```
    - Public // Save Public Picture
      - brick1.png
      - brick2.png
    - { channelID1 }
      - pic1.png
      - pic2.png
      - pig.png
    - { channelID2 }
      - pic1.png
      - ......
```