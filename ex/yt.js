const request = require("request");

function YouTube() {
    let ytApiAuth = function (url) {
        return "https://www.googleapis.com/youtube/v3/" + url + "&key=AIzaSyDxSTHlWgH6zEHOq2Ctz38aIxA54YikNK0";
    }

    this.search = function (query, maxResults = 1, type = 'channel', part = 'snippet') {
        return new Promise((resolve, reject) => {
            request(ytApiAuth("search?maxResults=" + maxResults + "&part=" + part + "&q=" + query + "&type=" + type), function (error, response, body) {
                let parsed_body = JSON.parse(body);
                if (parsed_body.pageInfo.totalResults > 0) resolve(parsed_body);
                else reject("Error: no results from the search.");
            });
        });
    }

    this.getIdFromNickname = function (nickname) {
        return new Promise((resolve, reject) => {
            this.search(nickname, 1, 'channel', 'snippet').then(parsed_body => {
                let nickname_found = parsed_body.items[0].snippet.title;
                if (parsed_body.items[0].snippet.channelId != null) {
                    resolve(parsed_body.items[0].snippet.channelId);
                } else {
                    reject("Error: not matching nicknames.");
                }
            }).catch(err => reject(err));
        });
    }

    this.fetchChannelUploads = function (channel_id, number_results = 5) {
        return new Promise((resolve, reject) => {
            request(ytApiAuth("channels?part=contentDetails&id=" + channel_id), function (error, response, body) {
                if (error) reject("ERROR: " + error);
                else {
                    let parsed_body = JSON.parse(body);
                    if (parsed_body.pageInfo.totalResults > 0) {
                        var upload_id = JSON.parse(body).items[0].contentDetails.relatedPlaylists.uploads;
                        request(ytApiAuth("playlistItems?part=snippet&playlistId=" + upload_id + "&maxResults=" + number_results), function (error, response, body) {
                            if (error) reject("ERROR: " + error);
                            else resolve(JSON.parse(body));
                        });
                    } else reject("ERROR: no such channel.");
                }
            });
        });
    }

    this.parseListVideos = function (data) {
        return new Promise((resolve, reject) => {
            let list_videos = data.items;
            let list_videos_parsed = [];
            for (let k in list_videos) {
                let video_info = list_videos[k].snippet;
                list_videos_parsed[k] = {
                    title: video_info.title,
                    description: video_info.description,
                    url: 'https://youtube.com/watch?v=' + video_info.resourceId.videoId,
                    thumb: video_info.thumbnails.medium.url
                }
            }
            if (list_videos_parsed.length > 0) resolve(list_videos_parsed);
            else reject('Error: no videos found');
        });
    }
}

module.exports = new YouTube();