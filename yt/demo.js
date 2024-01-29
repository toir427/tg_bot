const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const regex = /(?:https?:)?(?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/;
/*
const urls = [
    "http://www.youtube.com/watch?v=vpiMAaPTze8",
    "http://youtu.be/l_la5XiQJdk",
    "http://youtu.be/NLqAF9hrVbY",
    "https://youtu.be/qT47KF5pvfw",
    "https://youtu.be/zImHyTyYhM8?t=4s",
    "http://www.youtube.com/v/NLqAF9hrVbY?fs=1&hl=en_US",
    "http://www.youtube.com/v/NLqAF9hrVbY?fs=1&hl=en_US",
    "http://www.youtube.com/watch?v=NLqAF9hrVbY",
    "http://www.youtube.com/user/Scobleizer#p/u/1/1p3vcRhsYGo",
    "http://www.youtube.com/ytscreeningroom?v=NRHVzbJVx8I",
    "http://www.youtube.com/sandalsResorts#p/c/54B8C800269D7C1B/2/PPS-8DMrAn4",
    "http://gdata.youtube.com/feeds/api/videos/NLqAF9hrVbY",
    "http://www.youtube.com/watch?v=spDj54kf-vY&feature=g-vrec",
    "http://www.youtube.com/watch?v=spDj54kf-vY&feature=youtu.be",
    "http://www.youtube-nocookie.com/watch?v=NLqAF9hrVbY",
    "http://www.youtube.com/embed/NLqAF9hrVbY",
    "https://www.youtube.com/embed/NLqAF9hrVbY",
    "https://www.youtube.com/watch?v=MRl7cxSOXdU&feature=youtu.be",
    "https://www.youtube.com/watch?v=q07SQFmL4rM",
    "https://www.youtube.com/watch?v=q07SQFmL4yM",
    "https://www.youtube.com/watch?time_continue=4&v=zImHyTyYhM8",
    "http://www.youtube.com/embed/dQw4w9WgXcQ",
    "http://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "http://www.youtube.com/?v=dQw4w9WgXcQ",
    "http://www.youtube.com/v/dQw4w9WgXcQ",
    "http://www.youtube.com/e/dQw4w9WgXcQ",
    "http://www.youtube.com/user/username#p/u/11/dQw4w9WgXcQ",
    "http://www.youtube.com/sandalsResorts#p/c/54B8C800269D7C1B/0/dQw4w9WgXcQ",
    "http://www.youtube.com/watch?feature=player_embedded&v=dQw4w9WgXcQ",
    "http://www.youtube.com/?feature=player_embedded&v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=DFYRQ_zQ-gk&feature=featured",
    "https://www.youtube.com/watch?v=DFYRQ_zQ-gk",
    "http://www.youtube.com/watch?v=DFYRQ_zQ-gk",
    "//www.youtube.com/watch?v=DFYRQ_zQ-gk",
    "www.youtube.com/watch?v=DFYRQ_zQ-gk",
    "https://youtube.com/watch?v=DFYRQ_zQ-gk",
    "http://youtube.com/watch?v=DFYRQ_zQ-gk",
    "//youtube.com/watch?v=DFYRQ_zQ-gk",
    "youtube.com/watch?v=DFYRQ_zQ-gk",
    "https://m.youtube.com/watch?v=DFYRQ_zQ-gk",
    "http://m.youtube.com/watch?v=DFYRQ_zQ-gk",
    "//m.youtube.com/watch?v=DFYRQ_zQ-gk",
    "m.youtube.com/watch?v=DFYRQ_zQ-gk",
    "https://www.youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US",
    "http://www.youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US",
    "//www.youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US",
    "www.youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US",
    "youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US",
    "https://www.youtube.com/embed/DFYRQ_zQ-gk?autoplay=1",
    "https://www.youtube.com/embed/DFYRQ_zQ-gk",
    "http://www.youtube.com/embed/DFYRQ_zQ-gk",
    "//www.youtube.com/embed/DFYRQ_zQ-gk",
    "www.youtube.com/embed/DFYRQ_zQ-gk",
    "https://youtube.com/embed/DFYRQ_zQ-gk",
    "http://youtube.com/embed/DFYRQ_zQ-gk",
    "//youtube.com/embed/DFYRQ_zQ-gk",
    "youtube.com/embed/DFYRQ_zQ-gk",
    "https://youtu.be/DFYRQ_zQ-gk?t=120",
    "https://youtu.be/DFYRQ_zQ-gk",
    "http://youtu.be/DFYRQ_zQ-gk",
    "//youtu.be/DFYRQ_zQ-gk",
    "youtu.be/DFYRQ_zQ-gk",
    "https://www.youtube.com/watch?v=DFYRQ_zQ-gk&feature=featured",
    "https://www.youtube.com/watch?v=DFYRQ_zQ-gk",
    "http://www.youtube.com/watch?v=DFYRQ_zQ-gk",
    "//www.youtube.com/watch?v=DFYRQ_zQ-gk",
    "www.youtube.com/watch?v=DFYRQ_zQ-gk",
    "https://youtube.com/watch?v=DFYRQ_zQ-gk",
    "http://youtube.com/watch?v=DFYRQ_zQ-gk",
    "//youtube.com/watch?v=DFYRQ_zQ-gk",
    "youtube.com/watch?v=DFYRQ_zQ-gk",
    "https://m.youtube.com/watch?v=DFYRQ_zQ-gk",
    "http://m.youtube.com/watch?v=DFYRQ_zQ-gk",
    "//m.youtube.com/watch?v=DFYRQ_zQ-gk",
    "m.youtube.com/watch?v=DFYRQ_zQ-gk",
    "https://www.youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US",
    "http://www.youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US",
    "//www.youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US",
    "www.youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US",
    "youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US",
    "https://www.youtube.com/embed/DFYRQ_zQ-gk?autoplay=1",
    "https://www.youtube.com/embed/DFYRQ_zQ-gk",
    "http://www.youtube.com/embed/DFYRQ_zQ-gk",
    "//www.youtube.com/embed/DFYRQ_zQ-gk",
    "www.youtube.com/embed/DFYRQ_zQ-gk",
    "https://youtube.com/embed/DFYRQ_zQ-gk",
    "http://youtube.com/embed/DFYRQ_zQ-gk",
    "//youtube.com/embed/DFYRQ_zQ-gk",
    "youtube.com/embed/DFYRQ_zQ-gk",
    "https://youtu.be/DFYRQ_zQ-gk?t=120",
    "https://youtu.be/DFYRQ_zQ-gk",
    "http://youtu.be/DFYRQ_zQ-gk",
    "//youtu.be/DFYRQ_zQ-gk",
    "youtu.be/DFYRQ_zQ-gk",
    "https://www.youtube.com/HamdiKickProduction?v=DFYRQ_zQ-gk",
];

const ll = urls.reduce((m, c) => Math.max(m, c.length), 0);
urls.forEach((url) => {
    const match = regex.exec(url);
    if (match) {
        const id = match[1];
        const l = (ll - (url.length - id.length)) - 2;
        const d = " ".repeat(l);
        console.log(`${url} ${d} ${id}`);
    } else {
        console.log(`No match found for ${url}`);
    }
});*/

async function getUrl(url) {
    fetch(url)
        .then(resp => resp.text())
        .then(html => {

            const dom = new JSDOM(html);

            console.log('ytplayer: ',dom.window)

            /*const startStr = 'ytplayer.config={';
            const start = html.indexOf(startStr) + startStr.length - 1;
            const end = html.indexOf('};', start) + 1;
            const playerObj = JSON.parse(html.slice(start, end));

            console.log(playerObj);*/

        });

    /*const dom = new JSDOM(``, {
        url: url,
        referrer: url,
        contentType: "text/html",
        includeNodeLocations: true,
        storageQuota: 10000000
    });

    console.log('dom: ', dom.window.ytplayer)*/

    // let html = dom.window.document.body.innerHTML;
    // console.log('dom: ', dom)

    /*let urls = html.match(/"url_encoded_fmt_stream_map": "url=([^"]+)/)

    console.log('urls: '+urls);

    urls = decodeURIComponent(urls).replace(/\\u0026/g,'&')
    urls = urls.replace(/&quality.+?(?=,url)/g,'');;
    return urls.split(',url=')*/

    /*const startStr = 'ytplayer.config = {';
    const start = html.indexOf(startStr) + startStr.length - 1;
    const end = html.indexOf('};', start) + 1;
    const playerObj = JSON.parse(html.slice(start, end));
    playerObj.args.player_response = JSON.parse(playerObj.args.player_response);
    const videoUrls = playerObj.args.player_response.streamingData.formats[1].url;
    return videoUrls.replace('"', 'r');*/
}

getUrl("https://www.youtube.com/watch?v=9bZkp7q19f0")
    .then(r => console.log('!!', r))
