const { Captcha, CaptchaGenerator } = require('captcha-canvas')
const { writeFileSync , unlink } = require('fs')
const { Router } = require('express');

module.exports = function (app) {
    const router = Router()
    
    router.get('/', async function (req, res) { res.status(400).json({ "code": 400, "message": "A required request variable is missing." }) })

    router.get('/:type', function (req, res) {
        const code  = [...Array(7)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        try {
            if (req.params.type == "basic") {
                const captcha = new Captcha();
                captcha.async = false;
                captcha.addDecoy();
                captcha.drawTrace();
                captcha.drawCaptcha();

                writeFileSync(`./data/${code}.png`, captcha.png);
                res.status(200).json({ "code": 200, url: `${app.get('DOMAIN')}/data/${code}.png`, "key": captcha.text, "message": "URL is deleted after 10 minute." , "request_value": [req.params.type]})
                return setTimeout(() => {
                    return unlink(`./data/${code}.png`, function (err) {
                        if (err) { return }
                    })
                }, 600000);
            } else if (req.params.type == "pink") {
                const captcha = new CaptchaGenerator()
                captcha.setDimension(150, 450)
                captcha.setCaptcha({ size: 60, color: "deeppink" })
                captcha.setDecoy({ opacity: 0.5 })
                captcha.setTrace({ color: "deeppink" });

                writeFileSync(`./data/${code}.png`, captcha.generateSync());
                res.status(200).json({ "code": 200, url: `${app.get('DOMAIN')}/data/${code}.png`, "key": captcha.text, "message": "URL is deleted after 10 minute." , "request_value": [req.params.type] })
                return setTimeout(() => {
                    return unlink(`./data/${code}.png`, function (err) {
                        if (err) { return }
                    })
                }, 600000);
            } else {
                return res.status(400).json({ "code": 400, "message": "Invalid request variable name." })
            }
        } catch (error) {
            return res.status(500).json({ "code": 500, "message": "An unknown error has occurred." })
        }
    });

    return router;
}

