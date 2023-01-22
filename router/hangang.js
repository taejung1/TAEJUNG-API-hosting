const { Router } = require('express')
const fetch = require('node-fetch')

module.exports = function (app) {
    const router = Router();

    router.get('/', async function (req, res) {
        const fetchs = await fetch("http://openapi.seoul.go.kr:8088/" + await app.get('HANGANG-KEY') + "/json/WPOSInformationTime/1/5/");
        const result = await fetchs.json()
        if (result.WPOSInformationTime.RESULT.CODE == "INFO-000") {
            return res.status(200).json({ "code": 200, "message": "Successfully returned data.", "temp": result.WPOSInformationTime.row[1].W_TEMP, "date": result.WPOSInformationTime.row[1].MSR_DATE, "time": result.WPOSInformationTime.row[1].MSR_TIME, "site": result.WPOSInformationTime.row[1].SITE_ID })
        } else {
            return res.status(500).json({ "code": 500, "message": "An unknown error has occurred." })
        }
    });
    return router;
}