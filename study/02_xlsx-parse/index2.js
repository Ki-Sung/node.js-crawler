// 자바스크립트 이용시 이크마스크립트를 준수!
"use strict";

// 모듀 불러오기 
const xlsx = require("xlsx");

// 엑셀 파일 불러오기 
const workbook = xlsx.readFile("xlsx/data.xlsx");

// 콘솔에 엑셀 시트 호출 - must ToDo: workbook.Sheets[해당 시트 지정]
const ws = workbook.Sheets[workbook.SheetNames[0]];
// !ref 값 출력 - 살펴보니 A1:B11 -> 시트에 있는 파싱할 전체 데이터 범위를 말하는 것 같음 
// console.log(ws["!ref"]);

// array 객체의 메서드인 map을 이용해서 array의 각 요소를 순회하며 callback 함수 실행 
ws["!ref"] = ws["!ref"].split(":").map((v, i) => {
    if (i === 0) { return "A2"; }  // 만약 인덱스가 0과 같다면 A2로 리턴하기 
    return v;
}).join(":");

// 데이터에 컬럼명의 속성을 가지게 함 - 예) { A : 타이타닉, B : 링크 }
const records = xlsx.utils.sheet_to_json(ws, { header: "A"});
// console.log(records);

// for of 문을 사용하여 인덱스와 실제 데이터 배열 - entries()로 사용하면 객체가 [인덱스, 값]형태 이터레이터로 변환됨.
for (const [i ,r] of records.entries()) {
    console.log(i, r);
}