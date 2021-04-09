(function (window, document) {
    function isWeixinBrowser() {
        var ua = navigator.userAgent.toLowerCase();
        var match = ua.match(/MicroMessenger/i)
        return match && match.toString() === "micromessenger";
    };

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function loadWechatSDK() {
        return new Promise(function(resolve, reject) {
            if (!isWeixinBrowser()) {
                return reject();
            }
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = false;
            document.head.appendChild(script);
            script.src = window.location.protocol + '//res.wx.qq.com/open/js/jweixin-1.6.0.js';
            script.onload = resolve;
        });
    }

    function fetchSignature() {
        const nonceStr = uuidv4();
        const timestamp = new Date().getTime().toString().substr(0, 10);

        return axios.post("https://hipacloud.com/api/wechat/signature", {
            noncestr: nonceStr,
            timestamp,
            url: window.location.href,
        }).then(function(res) {
            return {
                signature: res.data.signature,
                nonceStr,
                timestamp,
            }
        });
    };

    function configWechat(signatureConfig) {
        wx.config({
            signature: signatureConfig.signature,
            nonceStr: signatureConfig.nonceStr,
            timestamp: signatureConfig.timestamp,
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: "wxef71f3953be63b2e", // 必填，公众号的唯一标识
            jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"], // 必填，需要使用的JS接口列表
        });
    };

    function setWechatShare(config) {
        if (wx && typeof wx.ready === "function") {
            wx.ready(function() {   //需在用户可能点击分享按钮前就先调用
                config = config || {};
                var title = config.title || document.title || "黑帕云";
                var Metas = Array.from(document.head.querySelectorAll("meta[name='og:description']"));
                var desc = config.desc || "黑帕云(hipacloud.com)是一款更加简单、高效、安全的数据协作平台。在这里，您可以使用已经熟悉的技能如电子表格、看板、图表等创建符合自己业务的软件，满足各行业多场景业务需求。";
                if (Metas && Metas[0] && typeof Metas[0].getAttribute === "function") {
                    desc = Metas[0].getAttribute("content") || desc;
                }
                var link = config.link || window.location.href;
                var imgUrl = config.imgUrl || 'https://hipacloud.com/favicons/android-chrome-512x512.png';
                wx.updateAppMessageShareData({
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: imgUrl, // 分享图标
                });

                wx.updateTimelineShareData({
                    title: title, // 分享标题
                    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: imgUrl, // 分享图标
                });
            });
        }
    };

    const handleError = (err) => {
        if (err) {
            console.log('wechat load failed', err);
        }
    }

    loadWechatSDK()
        .then(fetchSignature)
        .then(configWechat)
        .then(setWechatShare)
        .catch(handleError);
})(window, document);

// init qr tooltip
var qrElement = document.createElement('div');
new QRCode(qrElement, {
    text: window.location.href,
    width: 128,
    height: 128,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
})
tippy('#wechatShare', {
    content: qrElement,
    theme: 'light-border',
});