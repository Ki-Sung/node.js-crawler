// 자바스크립트 이용시 이크마스크립트를 준수!
"use strict";

// 모듈 불러오기  
// 1. xlsx 모듈 불러오기 
const xlsx = require("xlsx");
// 2. puppeteer 모듈 불러오기 
const puppeteer = require("puppeteer");
// 3. js로 만든 add_to_sheet 모듈 불러오기 
const add_to_sheet = require("./add_to_sheet");

// 엑셀파일 불러오기 
const workbook = xlsx.readFile("xlsx/data.xlsx"); 
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

// 크롤링 코드 
const crawler = async () => {
    const browser = await puppeteer.launch({ headless: false });  // 브라우저 오픈
    const page = await browser.newPage();  // 새페이지 생성 
    add_to_sheet(ws, "C1", "s", "평점"); // 엑셀에 C1 Cell에 평점 컬럼 생성
    // for of 문을 사용하여 인덱스와 실제 데이터 배열 - entries()로 사용하면 객체가 [인덱스, 값]형태 이터레이터로 변환됨.
    for (const [i, r] of records.entries()) {
        // 링크 컬럼에 있는 url로 접속 
        await page.goto(r.링크);
        // 네이버 영화 평점 text로 변환 
        const text = await page.evaluate(() => {
            const score = document.querySelector(".score.score_left .star_score");
            return score.textContent;
        });
        // 변환 된 text를 생성된 평점 컬럼에 넣기  
        if (text) {
            const newCell = "C" + (i + 2);  // 들어갈 cell 넘버 
            console.log(r.제목, "평점", text.trim(), newCell);  // 콘솔(터미널)에 출력 (제복, 평점, 평점숫자, 들어갈 cell 번호)
            add_to_sheet(ws, newCell, "n", text.trim());  // add_to_sheet 모듈을 사용해서 엑셀에 데이터 넣기
        }
        await page.waitForTimeout(3000); // 크롤링 완료 후 3초 뒤 
    }
    await page.close();  // page 닫기
    await browser.close();  // 브라우져 닫기 
    xlsx.writeFile(workbook, "xlsx/result.xlsx");  // 엑셀로 저장 (비동기식)
};

crawler();