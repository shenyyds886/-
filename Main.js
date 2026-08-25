"ui";
importClass(android.graphics.drawable.GradientDrawable);
importClass(android.graphics.Color);
importClass(android.view.WindowManager);
importClass(android.graphics.Point);

function getRealScreenSize() {
    try {
        var wm = context.getSystemService(context.WINDOW_SERVICE);
        var pt = new Point();
        wm.getDefaultDisplay().getRealSize(pt);
        return { w: pt.x, h: pt.y };
    } catch (e) {
        return { w: device.width, h: device.height };
    }
}

var storage = storages.create("dou_config_v1");

var colorOptions = ["#ff0000", "#ff9800", "#ffeb3b", "#4caf50", "#00bcd4", "#2196f3", "#9c27b0", "#ffffff", "#000000"];

var config = {
    zuoColor: storage.get("zuoColor", "#ff0000"),
    youColor: storage.get("youColor", "#00ff00"),
    zuoSize: parseInt(storage.get("zuoSize", 40)),
    youSize: parseInt(storage.get("youSize", 40)),
    displayMode: storage.get("displayMode", "single")
};

function showSettingsScreen() {
    ui.layout(
        <vertical bg="#F5F6FA">
            <card w="*" h="*" margin="16" cardCornerRadius="20" cardElevation="6" cardBackgroundColor="#FFFFFF">
                <scroll>
                    <vertical padding="24">

                        <text text="悬浮窗设置" textSize="20sp" textStyle="bold" textColor="#2D3436" gravity="center" marginBottom="16"/>

                        <text text="显示模式" textSize="14sp" textColor="#636E72" marginBottom="8"/>
                        <horizontal id="modeRow" marginBottom="20"/>

                        <text text="预览效果" textSize="14sp" textColor="#636E72" marginBottom="8"/>
                        <vertical bg="#1e272e" cardCornerRadius="14" padding="20" gravity="center" marginBottom="24">
                            <horizontal gravity="center">
                                <text id="zuoPreview" text="3.62" textStyle="bold" marginRight="30"/>
                                <text id="youPreview" text="2.22" textStyle="bold"/>
                            </horizontal>
                        </vertical>

                        <text text="左侧颜色" textSize="14sp" textColor="#636E72" marginBottom="8"/>
                        <horizontal id="zuoColorRow" marginBottom="20"/>

                        <text text="右侧颜色" textSize="14sp" textColor="#636E72" marginBottom="8"/>
                        <horizontal id="youColorRow" marginBottom="24"/>

                        <text text="左侧字号" textSize="14sp" textColor="#636E72" marginBottom="4"/>
                        <horizontal gravity="center_vertical" marginBottom="20">
                            <button id="zuoMinus" text="－" w="40" h="40" padding="0" textSize="16sp" bg="#F1F2F6" textColor="#2D3436"/>
                            <seekbar id="zuoSizeBar" max="80" w="0" weight="1" marginLeft="8" marginRight="8"/>
                            <button id="zuoPlus" text="＋" w="40" h="40" padding="0" textSize="16sp" bg="#F1F2F6" textColor="#2D3436" marginRight="8"/>
                            <text id="zuoSizeLabel" text="40" textSize="14sp" textColor="#2D3436" w="40" gravity="center"/>
                        </horizontal>

                        <text text="右侧字号" textSize="14sp" textColor="#636E72" marginBottom="4"/>
                        <horizontal gravity="center_vertical" marginBottom="28">
                            <button id="youMinus" text="－" w="40" h="40" padding="0" textSize="16sp" bg="#F1F2F6" textColor="#2D3436"/>
                            <seekbar id="youSizeBar" max="80" w="0" weight="1" marginLeft="8" marginRight="8"/>
                            <button id="youPlus" text="＋" w="40" h="40" padding="0" textSize="16sp" bg="#F1F2F6" textColor="#2D3436" marginRight="8"/>
                            <text id="youSizeLabel" text="40" textSize="14sp" textColor="#2D3436" w="40" gravity="center"/>
                        </horizontal>

                        <button id="saveBtn" text="保存设置" bg="#6C5CE7" textColor="#ffffff" marginBottom="10"/>
                        <button id="startBtn" text="开始执行" bg="#00B894" textColor="#ffffff"/>

                    </vertical>
                </scroll>
            </card>
        </vertical>
    );

    ui.statusBarColor("#F5F6FA");

    var displayModeOptions = [
        { key: "single", label: "单个显示(可切换)" },
        { key: "dual", label: "同时显示两个" }
    ];

    function buildModeRow() {
        ui.modeRow.removeAllViews();
        displayModeOptions.forEach(function (opt) {
            var v = ui.inflate(<text text="" textSize="13sp" padding="14 10 14 10" margin="4"/>, ui.modeRow, true);
            v.setText(opt.label);
            var selected = (config.displayMode === opt.key);
            var gd = new GradientDrawable();
            gd.setColor(colors.parseColor(selected ? "#6C5CE7" : "#F1F2F6"));
            gd.setCornerRadius(10);
            v.setBackground(gd);
            v.setTextColor(colors.parseColor(selected ? "#ffffff" : "#2D3436"));
            v.click(function () {
                config.displayMode = opt.key;
                buildModeRow();
            });
        });
    }
    buildModeRow();

    function updatePreview() {
        ui.zuoPreview.setTextColor(colors.parseColor(config.zuoColor));
        ui.zuoPreview.setTextSize(config.zuoSize);
        ui.youPreview.setTextColor(colors.parseColor(config.youColor));
        ui.youPreview.setTextSize(config.youSize);
    }

    function paintSwatch(v, hex, selected) {
        var gd = new GradientDrawable();
        gd.setColor(colors.parseColor(hex));
        gd.setCornerRadius(8);
        if (selected) {
            gd.setStroke(5, colors.parseColor("#2D3436"));
        }
        v.setBackground(gd);
    }

    function buildSwatches() {
        ui.zuoColorRow.removeAllViews();
        ui.youColorRow.removeAllViews();

        colorOptions.forEach(function (hex) {
            var vz = ui.inflate(<View w="36" h="36" margin="4"/>, ui.zuoColorRow, true);
            paintSwatch(vz, hex, config.zuoColor === hex);
            vz.click(function () {
                config.zuoColor = hex;
                buildSwatches();
                updatePreview();
            });

            var vy = ui.inflate(<View w="36" h="36" margin="4"/>, ui.youColorRow, true);
            paintSwatch(vy, hex, config.youColor === hex);
            vy.click(function () {
                config.youColor = hex;
                buildSwatches();
                updatePreview();
            });
        });
    }
    buildSwatches();
    updatePreview();

    function setZuoSize(size) {
        size = Math.max(20, Math.min(100, size));
        config.zuoSize = size;
        ui.zuoSizeBar.setProgress(size - 20);
        ui.zuoSizeLabel.setText(String(size));
        updatePreview();
    }
    function setYouSize(size) {
        size = Math.max(20, Math.min(100, size));
        config.youSize = size;
        ui.youSizeBar.setProgress(size - 20);
        ui.youSizeLabel.setText(String(size));
        updatePreview();
    }

    setZuoSize(config.zuoSize);
    setYouSize(config.youSize);

    ui.zuoSizeBar.on("progress_changed", function (progress) {
        setZuoSize(progress + 20);
    });
    ui.youSizeBar.on("progress_changed", function (progress) {
        setYouSize(progress + 20);
    });

    ui.zuoMinus.click(function () { setZuoSize(config.zuoSize - 1); });
    ui.zuoPlus.click(function () { setZuoSize(config.zuoSize + 1); });
    ui.youMinus.click(function () { setYouSize(config.youSize - 1); });
    ui.youPlus.click(function () { setYouSize(config.youSize + 1); });

    function saveConfig() {
        storage.put("zuoColor", config.zuoColor);
        storage.put("youColor", config.youColor);
        storage.put("zuoSize", config.zuoSize);
        storage.put("youSize", config.youSize);
        storage.put("displayMode", config.displayMode);
    }

    ui.saveBtn.click(function () {
        saveConfig();
        toast("已保存");
    });

    ui.startBtn.click(function () {
        saveConfig();
        toast("开始执行");
        activity.moveTaskToBack(true);
        threads.start(function () {
            main(config);
        });
    });
}

showSettingsScreen();

main = (cfg) => {
    cfg = cfg || {}
    zuoColorHex = cfg.zuoColor || "#ff0000"
    youColorHex = cfg.youColor || "#00ff00"

    zuox = 800
    youx = 1200
    zuoy = 200
    youy = 200

    ylbz = [0, 0, 0, 0]
    ylby = [0, 0, 0, 0]

    tsizez = cfg.zuoSize || 40
    tsizey = cfg.youSize || 40

    kuangbianju = 20

    xshuz = 2
    xshuy = 2

    window = {}
    window.hintText = "替身\n好了"

    function createTransparentFrame(x, y) {
        var frame = floaty.window(<frame id="root" />);
        ui.run(function () {
            frame.setPosition(x, y);
            frame.setSize(200, 100);
            var drawable = new GradientDrawable();
            drawable.setColor(Color.TRANSPARENT);
            frame.root.setBackground(drawable);
        });
        return frame;
    }

    function startAutoFit(fn, firstDelay, interval) {
        setTimeout(() => { ui.run(fn) }, firstDelay)
        setInterval(() => { ui.run(fn) }, interval)
    }

    function initScreenCapture(h) {
        try {
            data = captureScreen()
            n = data.getWidth() < data.getHeight()
            if (n) {
                initScreenCapture(!h)
            }
        } catch (e) {
            if (!requestScreenCapture(h)) {
                toast("请求截图失败");
            }
            sleep(2000);
            initScreenCapture(h)
        }
    }

    initScreenCapture(true)
    toast("开始")
    t = Date.now()
    window.numz = [t, 0]
    window.numy = [t, 0]
    window.dynamicText = (num, zy) => {
        data = num[0] - Date.now()
        if (data < -300) {
            return "" + num[1]
        } else if (data > 300) {
            return ((data / 1000)).toFixed(zy ? xshuy : xshuz)
        } else if (data > -300) {
            return window.hintText
        }
    }
    window.createSingleDisplay = function () {
        raw = "window"
        currentSide = "zuo"

        kuang = createTransparentFrame(zuox, zuoy);

        disp = floaty[raw](
            <frame gravity="center">
                <text id="text" textSize="{{tsizez}}" textColor="#ffffff" textStyle="bold" />
            </frame>
        );

        function applyDispStyle() {
            ui.run(function () {
                if (currentSide === "zuo") {
                    disp.text.setTextColor(colors.parseColor(zuoColorHex));
                    disp.text.setTextSize(tsizez);
                } else {
                    disp.text.setTextColor(colors.parseColor(youColorHex));
                    disp.text.setTextSize(tsizey);
                }
            });
        }

        ui.run(function () {
            var size = getRealScreenSize();
            disp.setPosition(size.w / 2 - 100, zuoy);
        });
        applyDispStyle();

        window.centerDisp = () => {
            try {
                var size = getRealScreenSize();
                var w = disp.getWidth() || 200;
                disp.setPosition(size.w / 2 - w / 2, zuoy);
            } catch (e) {}
        }
        setTimeout(() => {
            ui.run(window.centerDisp)
        }, 300)

        window.tiekuang = () => {
            try {
                var left = disp.getX() - kuangbianju
                var top = disp.getY() - kuangbianju
                var right = disp.getX() + disp.getWidth() + kuangbianju
                var bottom = disp.getY() + disp.getHeight() + kuangbianju
                kuang.setPosition(left, top)
                kuang.setSize(right - left, bottom - top)
            } catch (e) {}
        }
        startAutoFit(window.tiekuang, 500, 1000)

        disp.exitOnClose();
        kuang.exitOnClose();
        disp.text.click(() => {
            disp.setAdjustEnabled(!disp.isAdjustEnabled());
        });

        switchBar = floaty[raw](
            <horizontal>
                <text id="leftBtn" text=" 左 " textSize="16sp" textStyle="bold" padding="16 10 16 10" margin="4"/>
                <text id="rightBtn" text=" 右 " textSize="16sp" textStyle="bold" padding="16 10 16 10" margin="4"/>
            </horizontal>
        );

        function paintSwitchBtn(v, active) {
            var gd = new GradientDrawable();
            gd.setColor(colors.parseColor(active ? "#6C5CE7" : "#33000000"));
            gd.setCornerRadius(10);
            v.setBackground(gd);
            v.setTextColor(colors.parseColor(active ? "#ffffff" : "#cccccc"));
        }

        function refreshSwitchBar() {
            ui.run(function () {
                paintSwitchBtn(switchBar.leftBtn, currentSide === "zuo");
                paintSwitchBtn(switchBar.rightBtn, currentSide === "you");
            });
        }

        window.fixSwitchBarPos = () => {
            try {
                var size = getRealScreenSize();
                var w = switchBar.getWidth() || 200;
                var h = switchBar.getHeight() || 80;
                var bottomMargin = -6;
                var leftShift = 450;
                switchBar.setPosition(size.w / 2 - w / 2 - leftShift, size.h - h - bottomMargin);
            } catch (e) {}
        }

        ui.run(function () {
            var size = getRealScreenSize();
            switchBar.setPosition(size.w / 2 - 100 - 150, size.h - 86);
        });
        refreshSwitchBar();
        switchBar.exitOnClose();

        startAutoFit(window.fixSwitchBarPos, 500, 500)

        switchBar.leftBtn.click(function () {
            currentSide = "zuo";
            applyDispStyle();
            refreshSwitchBar();
        });
        switchBar.rightBtn.click(function () {
            currentSide = "you";
            applyDispStyle();
            refreshSwitchBar();
        });

        setInterval(() => {
            ui.run(function () {
                try {
                    if (currentSide === "zuo") {
                        disp.text.setText(window.dynamicText(window.numz, false));
                    } else {
                        disp.text.setText(window.dynamicText(window.numy, true));
                    }
                } catch (e) {}
            });
        }, 50);
    }

    window.createDualDisplay = function () {
        raw = "window"

        kuang = createTransparentFrame(zuox, zuoy);

        zuo = floaty[raw](
            <frame gravity="center">
                <text id="text" textSize="{{tsizez}}" textColor="#ffffff" textStyle="bold" />
            </frame>
        );
        you = floaty[raw](
            <frame gravity="center">
                <text id="text" textSize="{{tsizey}}" textColor="#ffffff" textStyle="bold" />
            </frame>
        );
        ui.run(function () {
            zuo.setPosition(zuox, zuoy);
            zuo.text.setTextColor(colors.parseColor(zuoColorHex))
            you.setPosition(youx, youy);
            you.text.setTextColor(colors.parseColor(youColorHex))
        });

        window.tiekuang = () => {
            try {
                var left = Math.min(zuo.getX(), you.getX()) - kuangbianju
                var top = Math.min(zuo.getY(), you.getY()) - kuangbianju
                var right = Math.max(zuo.getX() + zuo.getWidth(), you.getX() + you.getWidth()) + kuangbianju
                var bottom = Math.max(zuo.getY() + zuo.getHeight(), you.getY() + you.getHeight()) + kuangbianju
                kuang.setPosition(left, top)
                kuang.setSize(right - left, bottom - top)
            } catch (e) {}
        }
        startAutoFit(window.tiekuang, 500, 1000)

        zuo.exitOnClose();
        you.exitOnClose();
        kuang.exitOnClose();
        zuo.text.click(() => {
            zuo.setAdjustEnabled(!zuo.isAdjustEnabled());
        });
        you.text.click(() => {
            you.setAdjustEnabled(!you.isAdjustEnabled())
        });

        setInterval(() => {
            ui.run(function () {
                try {
                    you.text.setText(window.dynamicText(window.numy, true));
                } catch (e) {}
            });
        }, 50);
        setInterval(() => {
            ui.run(function () {
                try {
                    zuo.text.setText(window.dynamicText(window.numz, false));
                } catch (e) {}
            });
        }, 50);
    }

    if (cfg.displayMode === "dual") {
        window.createDualDisplay()
    } else {
        window.createSingleDisplay()
    }

    window.zbjs = () => {
        var h = device.height
        var w = device.width
        if (w < h) {
            var h0 = w
            var w = h
            var h = h0
        }

        var range1 = (a, b, c) => {
            var body = []
            for (let i = a; i < b; i = i + c) {
                body.push(i)
            }
            return body
        }

        if ((w * 1080 / h) < 1942) {
            var beanX = range1(212, 212 + (30 * 6), 30)
            var zb = beanX.map(i => w * i / 1920)
            var zb1 = zb.map(i => w - (1 * w / 1920) - i)
            var y = 124 * w / 1920
        } else {
            var beanX = range1(314, 314 + (30 * 6), 30)
            var zb = beanX.map(i => h * i / 1080)
            var zb1 = zb.map(i => w - (1 * h / 1080) - i)
            var y = 124 * h / 1080
        }
        return [[zb, zb1], y]
    }

    window.grayScale = a => {
        r = colors.red(a)
        g = colors.green(a)
        b = colors.blue(a)
        if (r > g) {
            if (r > b) {
                return [r, "r"]
            } else {
                return [b, "b"]
            }
        } else {
            if (g > b) {
                return [g, "g"]
            } else {
                return [b, "b"]
            }
        }
    }

    window.color = (x, y, data) => {
        c = images.pixel(data, x, y)
        a = window.grayScale(c)
        switch (a[1]) {
            case "r":
                return a[0] > 205
            case "g":
                return a[0] > 200
            case "b":
                return a[0] > 200
        }
    }

    window.colors = (x, y, data) => {
        for (let i = 0; i < 6; i++) {
            x1 = window.color(x[i], y, data)
            if (!x1) {
                return i
            }
        }
        return 6
    }

    window.readBeans = (x, y) => {
        data = captureScreen()
        if (!(window.grayScale(images.pixel(data, x[0][1], y))[0])) {
            return [-2, -2]
        }
        n0 = window.colors(x[0], y, data)
        n1 = window.colors(x[1], y, data)
        return [n0, n1]
    }

    window.pd = (a, b) => {
        t = Date.now()
        if (b[1].length < 10) {
            b[1].push([a, t + 15000])
            return b
        } else {
            for (let i = 0; i < b[1].length - 1; i++) {
                b[1][i] = b[1][i + 1]
            }
            b[1][b[1].length - 1] = [a, t + 15000]
        }
        for (let i = 1; i < b[1].length; i++) {
            if (b[1][i][0] != b[1][0][0]) {
                return b
            }
        }
        if (b[0][0] > 3) {
            b[3] = t + 800
        }
        if (b[0][0] == b[1][0][0] + 1 && b[2] <= t + 1000 && (b[3] <= t || b[0][0] > 0)) {
            b[2] = b[1][0][1]
        }
        b[0] = b[1][0]
        return b
    }

    window.pds = (a, b) => {
        return [window.pd(a[0], a[1]), window.pd(b[0], b[1])]
    }

    threads.start(() => {
        t = Date.now()
        jg = t + 35
        var [x, y] = window.zbjs();
        var [d0, d1] = window.readBeans(x, y)
        var [n0, n1] = window.pds([d0, [[0, 0], [[d0, 0]], 0, 0]], [d1, [[0, 0], [[d1, 0]], 0, 0]])
        while (true) {
            try {
                t = Date.now()
                if (jg > t) {
                    continue
                }
                jg = t + 35
                var [d0, d1] = window.readBeans(x, y)
                if (d0 == -2 || d1 == -2) {
                    [n0, n1] = window.pds([0, [[0, 0], [[0, 0]], 0, 0]], [0, [[0, 0], [[0, 0]], 0, 0]])
                    continue
                }
                [n0, n1] = window.pds([d0, n0], [d1, n1])
                window.numz = [n0[2], n0[0][0]]
                window.numy = [n1[2], n1[0][0]]
            } catch (e) {
                log(e)
            }
        }
    })
}