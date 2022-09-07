// 자바스크립트 이용시 이크마스크립트를 준수!
"use strict";

// 모듈 뷸러오기
// puppeteer 모듈 불러오기
const puppeteer = require("puppeteer");

// 크롤링 코드 
const crawler = async () => {
    try {
        // 브라우저 열기 
        const browser = await puppeteer.launch({ headless: false });
        // 페이지 열기 
        const page = await browser.newPage();
        // 페이지에 해당 url로 접속 
        await page.goto("https://unsplash.com");
        // 크롤링 결과 담기 
        let result = [];
        // 배열이 result 값이 30개가 넘어가게되면 가져오는 것을 종료 
        while (result.length <= 30) {
            const srcs = await page.evaluate(() => {
                // 스크롤시 필요한 페이지 절대 좌표
                window.scrollTo(0, 0);
                let imgs = [];
                const imgEls = document.querySelectorAll(".zmDAx");  // 사이트 바뀌었을 때 클래스 적절히 바꾸기
                if (imgEls.length) {
                    // document.querySelctorAll은 배열이 아니므로 forEach만 사용가능
                    imgEls.forEach((v) => {
                        let img = v.querySelector('img.YVj9w');   // 사이트 바뀌었을 때 클래스 적절히 바꾸기
                        if (img && img.src) {
                            imgs.push(img.src);
                        }
                        v.parentElement.removeChild(v);
                    });
                }
                // 30번했는데 벌써 크롤러가 바닥으로 갔기때문에 상단에서 최상단으로 한번 스크롤을 해주고 진행한다.
                // scrollBy(상대좌표)
                window.scrollBy(0, 100);
                setTimeout(() => {
                    window.scrollBy(0, 200);
                }, 500);
                return imgs;
            });
            result = result.concat(srcs);
            // 선택자를 가디라릴 수 있다.
            await page.waitForSelector('figure');
        }
        console.log(result);    // 결과 출력 
        console.log(result.length);   // 출력한 url 개수 
        await page.close();     // 페이지 닫기 
        await browser.close();  // 브라우져 닫기  
    } catch (e) {
        console.error(e);
    }
};

crawler();
