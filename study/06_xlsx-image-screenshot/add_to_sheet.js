// 자바스크립트 이용시 이크마스크립트를 준수!
"use strict";

// 모듈 불러오기 - xlsx
const xlsx = require("xlsx");

function range_add_cell(range, cell) {
    const rng = xlsx.utils.decode_range(range);
    const c = typeof cell === "string" ? xlsx.utils.decode_cell(cell) : cell;
    if (rng.s.r > c.r) rng.s.r = c.r;
    if (rng.s.c > c.c) rng.s.c = c.c;

    if (rng.e.r < c.r) rng.e.r = c.r;
    if (rng.e.c < c.c) rng.e.c = c.c;
    return xlsx.utils.encode_range(rng);
}

// index.js에서도 사용할 수 있게 모듈을 바깥으로 빼주기
module.exports = function add_to_sheet(sheet, cell, type, raw) {
    sheet["!ref"] = range_add_cell(sheet["!ref"], cell);
    sheet[cell] = { t: type, v: raw }; 
};