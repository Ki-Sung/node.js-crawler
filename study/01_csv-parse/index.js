// 자바스크립트 이용시 이크마스크립트를 준수
"use strict";

// 모듈 불러오기 
// 1. csv-parse - node_modules에 해당 패키지의 path에 있는 sync안 function만 가져오기 위함.
const parse = require("csv-parse/lib/sync");  
// 2. 파일 시스템 - csv 파일을 읽어들이기 위함
const fs = require("fs");

// 파일 읽기 및 인코딩 
const csv = fs.readFileSync("csv/data.csv");  // csv 파일을 읽음 
const records = parse(csv.toString("utf-8"));  // 버퍼를 utf-8로 encoding, csv-parse의 parse가 문자열을 2차원 배열로 바꿔줌

// forEach 메셔드를 이용하여 2차원 배열인 index와 실제 데이터 내용을 읽음 
records.forEach((r, i) => {
    console.log(i, r);     // r[0]이 영화제목, r[1]이 영화 링크 
}); 