// 자바스크립트 이용시 이크마스크립트를 준수!
"use strict";

// 모듈 불러오기  
// 1. xlsx 모듈 불러오기 
const xlsx = require("xlsx");
// 2. puppeteer 모듈 불러오기
const puppeteer = require("puppeteer");
// 3. 파일시스템 모듈 불러오기 
const fs = require("fs");
// 4. axios 모듈 불러오기 
const axios = require("axios");
// 5. js로 만든 add_to_sheet 모듈 불러오기 
const add_to_sheet = require("./add_to_sheet");

// 엑셀파일 불러오기 
const workbook = xlsx.readFile("xlsx/data.xlsx"); 
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

// 폴더 관리 
// screenshot 폴더 읽기 - 만약 폴더가 없으면 screenshot 생성하기!
fs.readdir("screenshot", (err) => {
    if (err) {
        console.error("screenshot 폴더가 없어 screenshot 폴더를 생성합니다.");
        fs.mkdirSync("screenshot");
    }
});
// poster 폴더 읽기 - 만약 폴더가 없으면 poster 생성하기!
fs.readdir("poster", (err) => {
    if (err) {
        console.error("poster 폴더가 없어 poster 폴더를 생성합니다.");
        fs.mkdirSync("poster");
    }
});

// 크롤링 코드
const crawler = async () => {
    try {
        // 브라우저 열기 - 창 크기 1920 X 1080 사이즈
        const browser = await puppeteer.launch({ headless: false, args: ['--window-size=1920,1080'] }); 
        // 새 페이지 열기 
        const page = await browser.newPage();
        // 페이지 사이즈 - 페이지 크기 1920 X 1080 사이즈
        await page.setViewport({
            width: 1920,
            height: 1080,
        });
        // C1 cell에 평점 컬럼 생성 
        add_to_sheet(ws, 'C1', 's', '평점');
        // for of 문을 사용하여 인덱스와 실제 데이터 배열 - entries()로 사용하면 객체가 [인덱스, 값]형태 이터레이터로 변환됨.
        for (const [i, r] of records.entries()) {
            // data.xlsx 링크 컬ㅓㅁ에 있는 url로 접속 
            await page.goto(r.링크);
            // 결과 담기 
            const result = await page.evaluate(() => {
                // 영화 평점 
                let score;
                const scoreEl = document.querySelector('.score.score_left .star_score');
                if (scoreEl) {
                    let score = scoreEl.textContent
                }
                // 네이버 영화 포스터 이미지 
                let img;
                const imgEl = document.querySelector('.poster img');
                if (imgEl) {
                    img = imgEl.src;
                }
                return { score, img };
            });
            // 만약 영화 평점일 경우 엑셀 시트에 저장 
            if (result.score) {
                const newCell = 'C' + (i + 2);
                console.log(r.제목, '평점', result.score.trim(), newCell);
                add_to_sheet(ws, newCell, 'n', result.score.trim());
            }
            // 만약 이미지 중 스크린샷 이미지일 경우 screenshot 폴더에 자정 
            if (result.img) {
                await page.screenshot({ path: `screenshot/${r.제목}.png`, fullPage: true }); 
                const imgResult = await axios.get(result.img.replace(/\?.*$/, ''), {
                    responseType: 'arraybuffer',
            });
            // 포스터 이미지일 경우 poster 폴더에 저장 
            fs.writeFileSync(`poster/${r.제목}.jpg`, imgResult.data);
        }
        // 크롤링 완료 후 3초 뒤 
        await page.waitForTimeout(3000);
    }
    // 페이지 닫기 
    await page.close();
    // 브라우져 닫기 
    await browser.close();
    // 엑셀로 저장 (비동기식)
    xlsx.writeFile(workbook, 'xlsx/result.xlsx');
    } catch (e) {
        console.error(e);
    }
};

crawler();
