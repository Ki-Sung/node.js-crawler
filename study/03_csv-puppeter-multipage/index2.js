// 자바스크립트 이용시 이크마스크립트를 준수!
"use strict";

// 모듈 불러오기  
// 1. csv-parse - node_modules에 해당 패키지의 path에 있는 sync안 function만 가져오기 위함.
const parse = require("csv-parse/lib/sync");
// 2. csv-stringify(레코드를 csv 텍스트로 변환) -node_modules에 해당 패키지의 path에 있는 sync안 function만 가져오기 위함.
const stringify = require("csv-stringify/lib/sync");
const { ADDRGETNETWORKPARAMS } = require("dns");
// 3. 파일 시스템 
const fs = require("fs");
// 4. puppeteer - headless chrome 혹은 chromium을 제어하도록 도와주는 모듈 
const puppeteer = require("puppeteer");

// csv 불러오기 
const csv = fs.readFileSync("csv/data.csv");
// 불러온 csv 출력
const records = parse(csv.toString("utf-8"));

// 크롤러 코드
const crawler = async () => {
    const result = [];
    const browser = await puppeteer.launch();  // 크롤링시 크롬브라우져를 열리지 않게함.
    // Promise.all로 await문(반복문)을 돌리면 순서는 보장하지 않지만 한번에 여러개를 돌리므로 속도가 빠름 
    await Promise.all(records.map(async (r, i) =>{
        result[i] = r;
        const page = await browser.newPage();  // 브라우저 실행
        await page.goto(r[1]);                 // 지정한 페이지로 이동 
        const text = await page.evaluate(() => {
            const score = document.querySelector(".score.score_left .star_score"); // jquery 형식없이 elements를 찾아주는 함수 사용
            return score.textContent;
        });
        if (text) {
            console.log(r[0], "평점", text.trim());  //  csv의 첫 번째 컬럼의 로우 값(영화명), 평점, 평점 숫자(공백제거) 출력 
            result[i][2] = text.trim();  // 영화명, 평점 형식으로 텍스트 추출
        }
        await page.waitForTimeout(3000);   // 타임아웃 30초 설정 
        await page.close();      // 페이지 닫기 
    }));
    await browser.close();      // 브라우저 닫기 
    const str = stringify(result);   // 자바스크립트 값을 json 문자열로 변환 
    fs.writeFileSync("csv/result2.csv", str);   // 지정된 폴더에 저장한 이름으로 문자열 형식으로 저장 (동기식 방식)
};
crawler();