class Action {
    constructor(state, global, api, twitch) {
        this.state = state
        this.global = global
        this.api = api
        this.twitch = twitch

        this.handleSetBackgroundImage = this.handleSetBackgroundImage.bind(this)
        this.handleUploadImage = this.handleUploadImage.bind(this)
    }


    addBit = (type) => {
        let fObj = new fabric.BitWallsImage(this.global.brick_info[type].image, {
            left: 0,
            top: 0,
            scaleX: .5,
            scaleY: .5,
            active: false,
            price: 50
        })

        this.state.fcanvas.add(fObj)
    }

    loadFromSouce = (sources) => {
        fcanvas.clear()
        for (let i in sources) {
            let b = sources[i]
            let fObj = new fabric.Image(BRICK_INFO[b.type].image, {
                left: b.x,
                top: b.y,
                scaleX: b.sx,
                scaleY: b.sy,
                angle: b.angle
            })

            fcanvas.add(fObj)
        }
    }

    convert2BrickData = () => {
        let sources = fcanvas.toJSON().objects
        let result = []
        for (let i in sources) {
            let source = sources[i]
            let type = IMGSOURCE_MAPPING[hashFunction(source.src)]
            let brick = new Brick(
                i,
                source.left,
                source.top,
                source.scaleX,
                source.scaleY,
                source.angle,
                type, true, null
            )

            result.push(brick)
        }
        console.log(result)
        console.log(JSON.stringify(result))
        return result
    }



    launchBrickSetting = () => {
        const bitsWall = convert2BrickData()
        let requestData = { "channelId": channelId, "bitsWall": bitsWall }
        twitch.rig.log('requestData')
        twitch.rig.log(requestData)
        $.ajax({
            type: 'POST',
            url: 'https://twi.eztable.com/createWall',
            data: JSON.stringify(requestData),
            success: function (data) {
                console.log('ssuio');
                console.log(data);
            },
            contentType: "application/json",
            dataType: 'json'
        });
    }

    saveBrickSetting = () => {
        let setting = {
            channelId: channelId
        }
        const bitsWall = convert2BrickData()
        if (!bitsWall) {
            setting.bitsWall = []
        }
        else {
            setting.bitsWall = bitsWall
        }
        twitch.rig.log('setting')
        twitch.rig.log(setting)
        console.log('setting', typeof (setting), setting)
        setChannelConfig(setting)
    }

    setChannelConfig = (content) => {
        twitch.rig.log('content', content)
        const version = (config.version ? parseFloat(config.version) + 1 : 1.0).toString()
        twitch.rig.log('version', version)
        twitch.configuration.set(
            "broadcaster",
            version,
            content
        );

        config = content
        twitch.rig.log('config', config)
    }

    handleSetBackgroundImage = (e) => {
        this.state.backgroundImage = e.target.result

        let image = new Image()
        image.src = this.state.backgroundImage
        image.onload = () => {
            // console.log(image.height)
            // console.log(image.width)

            // fcanvas.setHeight(image.height)
            // fcanvas.setWidth(image.width)
            this.state.fcanvas.setBackgroundImage(this.state.backgroundImage, this.state.fcanvas.renderAll.bind(this.state.fcanvas), {
                backgroundImageOpacity: 0.5,
                backgroundImageStretch: false,
            })
        }
    }

    handleUploadImage = () => {
        let e = document.getElementById('file');
        var file = e.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = this.handleSetBackgroundImage
        reader.readAsDataURL(file);
        e.value = '';
    }

    handleTwitchContext = (context) => {
        if (twitch.configuration) {
            twitch.rig.log(twitch.configuration);
            twitch.rig.log('yes');

        }
        else {
            twitch.rig.log('nonono');
        }

        if (!config || config === '' || JSON.stringify(config) === '{}') {
            setChannelConfig(JSON.stringify({}))
        }
        twitch.rig.log('start');

        twitch.rig.log(context);
        twitch.rig.log(token);
        twitch.rig.log(userId);
        twitch.rig.log(channelId);
        twitch.rig.log(config);

        twitch.rig.log('end');
    }

    handleTwitchAuthorized = (auth) => {
        token = auth.token;
        userId = auth.userId;
        channelId = auth.channelId;
    }

    handleTwitchConfigChange = () => {
        let json;
        if (twitch.configuration.broadcaster && 'content' in twitch.configuration.broadcaster) {
            json = JSON.parse(twitch.configuration.broadcaster.content)
        }
        else {
            console.log('twitch.configuration', twitch.configuration)
            twitch.rig.log(twitch.configuration)

            json = {}
        }
        twitch.rig.log('json')
        twitch.rig.log(json)
        config = json
    }

    _reflashCanvs = () => {
        fcanvas.clear()
    }
}