const htmlToText = require('html-to-text');
const { Router } = require('express');
const encoding = require('encoding');
const fetch = require('node-fetch');

const delim= ['</div></div></div></div><div class="hwc"><div class="BNeawe tAd8D AP7Wnd"><div><div class="BNeawe tAd8D AP7Wnd">', '</div></div></div></div></div><div><span class="hwc"><div class="BNeawe uEec3 AP7Wnd">'];

module.exports = function (app) {
    const router = Router()
    async function fetchers(artist, title, type) {
        let result;
        result = await fetch('https://www.google.com/search?q=' + encodeURIComponent(artist + " " + title + type));
        result = await result.textConverted();
        [, result] = result.split(delim[0]);
        [result] = result.split(delim[1]);
        return result;
    }

    router.get('/', async function (req, res) { res.status(400).json({ "code": 400, "message": "A required request variable is missing." }) })

    router.get('/:artist/:title', async function (req, res) {
        try {
            let result ;
            try {
                result = await fetchers(req.params.artist, req.params.title, '+lyrics');
            } catch (error0) {
                try {
                    result = await fetchers(req.params.artist, req.params.title, '+song+lyrics');
                } catch (error1) {
                    try {
                        result = await fetchers(req.params.artist, req.params.title, '+song');
                    } catch (error2) {
                        try {
                            result = await fetchers(req.params.artist, req.params.title, '');
                        } catch (error3) {
                            result = '';
                        }
                    }
                }
            }
            let lyrics = '';
            for (let i = 0; i < result.split('\n').length; i++) {
                lyrics = lyrics + htmlToText.fromString(result.split('\n')[i]) + '\n';
            }
            lyrics = String(encoding.convert(lyrics)).trim()

            if (lyrics == ' ' || lyrics == "" || lyrics == '') {
                return res.status(400).json({ "code": 400, "message": "No results were found for your search." })
            } else {
                return res.status(200).json({ "code": 200, "message": "Found lyrics search results.", "lyrics": lyrics, "request_value": [req.params.artist, req.params.title] })
            }
        } catch (error) {
            return res.status(500).json({ "code": 500, "message": "An unknown error has occurred." })
        }
    })

    return router;
}

