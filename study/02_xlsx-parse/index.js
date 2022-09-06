// 자바스크립트 이용시 이크마스크립트를 준수!
"use strict";

// 모듈 불러오기 
const xlsx = require("xlsx");

// 엑셀 파일 불러오기 
const workbook = xlsx.readFile("xlsx/data.xlsx");
// 콘솔에 엑셀 시트 호출 - must ToDo: workbook.Sheets
console.log(Object.keys(workbook.Sheets));
// 엑셀 시트 지정 
const ws = workbook.Sheets.영화목록;
// 엑셀파일을 json 형식으로 변환 - must ToDo: header 옵션 보여주기
const records = xlsx.utils.sheet_to_json(ws);
// for of 문을 사용하여 인덱스와 실제 데이터 배열 - entries()로 사용하면 객체가 [인덱스, 값]형태 이터레이터로 변환됨.
for (const [i ,r] of records.entries()) {
    console.log(i, r);
}