// 자바스크립트 이용시 이크마스크립트를 준수!
"use strict";

// 모둘 선언 
const axios = require("axios");  // 특정 url을 넣으면 url에 해당하는 페이지 html을 가져오는 모듈 
const cheerio = require("cheerio");  // 가지고 온 html을 파싱할 때 jquery로 사용하는 것처럼 해주는 모듈

// html을 가져오는 함수 
const getHTML = async(keyword) => {
    try {
        return await axios.get("https://www.inflearn.com/courses?s=" + encodeURI(keyword));
    } catch(err) {
        console.log(err);
    };
};

// 가져온 html을 파싱하는 함수 
const parsing = async (keyword) => {
    const html = await getHTML(keyword);
    const $ = cheerio.load(html.data);
    const $courseList = $(".course_card_item");

    let courses = [];
    $courseList.each((idx, node) => {
        const title = $(node).find(".course_title").text();
        // console.log($(node).find(".course_title"));
        courses.push({
            title: $(node).find(".course_title:eq(0)").text(),  // 첫 번째 노드만 가져오겠다
            instructor: $(node).find(".instructor").text(),
            price: $(node).find(".price").text(),
            rating: $(node).find(".star_solid").css("width"),
            img:   $(node).find(".card-image > figure > img").attr("src")
        });
    });

    console.log(courses);
};

parsing("자바스크립트");