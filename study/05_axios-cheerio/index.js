// 자바스크립트 이용시 이크마스크립트를 준수!
"use strict";

// 모듈 불러오기  
// 1. xlsx 모듈 불러오기 
const xlsx = require("xlsx");
// 2. axios 모듈 불러오기 
const axios = require("axios");
// 3. cheerio 모듈 불러오기 
const cheerio = require("cheerio");
// 4. js로 만든 add_to_sheet 모듈 불러오기 
const add_to_sheet = require("./add_to_sheet");

// 엑셀파일 불러오기 
const workbook = xlsx.readFile("xlsx/data.xlsx"); 
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

// 크롤링 코드 
const crawler = async () => {
    add_to_sheet(ws, "C1", "s", "평점");
    await Promise.all(records.map(async (r, i) => {
        const response = await axios.get(r.링크);
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            const text = $(".score.score_left .star_score").text();
            console.log(r.제목, "평점", text.trim());
            const newCell = "C" + (i + 2);
            add_to_sheet(ws, newCell, "n", text.trim());
        }
    }));
    xlsx.writeFile(workbook, "xlsx/result.xlsx");
};

crawler();