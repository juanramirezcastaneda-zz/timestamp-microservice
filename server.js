var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors({ optionSuccessStatus: 200 }));

const port = process.env.PORT || "8000";


app.get("/api/timestamp/:date_string([0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{2}-[0-9]{2}-[0-9]{4}|[0-9]{13})?", (req, res, next) => {
    const { date, month } = parseDateFromRegex(req.params.date_string);

    console.info(date);
    console.info(month);
    if (month && month > 12 || month < 1) { next(); }
    if (month && date.getMonth() !== month) { next(); }

    res.json({ "unix": date.getTime(), "utc": date.toUTCString() });
});

app.get('*', (req, res) => res.json({ "error": "Invalid Date" }));

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});

function parseDateFromRegex(dateString) {
    const regexForDate = /^(\d{1,2})-(\d{1,2})-(\d{4})$|^(\d{1,4})-(\d{1,2})-(\d{2})$|^(\d{13})$/;
    const result = regexForDate.exec(dateString);
    let day, month, year, unixDate;

    if (result[0] && result[7].length === 13) {
        unixDate = Number(result[7]);
        return { date: new Date(unixDate * 1000), month: month };
    }

    if (result[0] && result[1].length === 4) {
        year = Number(result[1]);
        // To ensure index for month
        month = Number(result[2]);
        day = Number(result[3]);
        return { date: new Date(year, month - 1, day), month: month };
    }

    if (result[4] && result[4].length === 4) {
        year = Number(result[6]);
        // To ensure index for month
        month = Number(result[5]);
        day = Number(result[4]);
        return { date: new Date(year, month - 1, day), month: month };
    }

    return { date: new Date(), month: month };
}