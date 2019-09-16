const request = require('request')
const Crawler = require('crawler')
const mangguo_TV_movie = 'https://www.mgtv.com/movie/' // 芒果TV电影页
const iqiyi_movie = 'https://www.iqiyi.com/dianying/'
const videos = require('../models/movie')

const Movie = videos.Movie,
  Teleplay = videos.Teleplay

// var c = new Crawler({
//   maxConnections: 10,
//   // 这个回调每个爬取到的页面都会触发
//   callback: function(error, res, done) {
//     if (error) {
//       console.log(error);
//     } else {
//       var $ = res.$;
//       // $默认使用Cheerio
//       // 这是为服务端设计的轻量级jQuery核心实现
//       console.log($("title").text());
//     }
//     done();
//   }
// })
async function getIqiyiTeleplay (pageNum = 0) {
  let movies = await new Promise((resolve, reject) => {
    request('https://pcw-api.iqiyi.com/search/video/videolists?access_play_control_platform=14&channel_id=2&data_type=1&from=pcw_list&is_album_finished=&is_purchase=&key=&market_release_date_level=&mode=4&pageNum=' + pageNum + '&pageSize=48&site=iqiyi&source_type=&', function(err, res, body) {
      return resolve(body)
    })
  })
  return movies
}
async function getIqiyiMovies (pageNum = 0) {
  // 爬芒果TV电影页地址
  let movies = await new Promise((resolve, reject) => {
    request('https://pcw-api.iqiyi.com/search/video/videolists?access_play_control_platform=14&channel_id=1&data_type=1&from=pcw_list&is_album_finished=&is_purchase=&key=&market_release_date_level=&mode=11&pageNum=' + pageNum + '&pageSize=50&site=iqiyi&source_type=&three_category_id=&without_qipu=1', function(err, res, body) {
      // console.log(body)
      return resolve(body)
    })
  })
  // console.log(movies)
  return movies
}

/* -------------------------------- 爬取所有爱奇艺电影 ------------------------------- */

getIqiyiMovies().then(res => {
  let page_total = JSON.parse(res).data.pageTotal
  for (var i = 1; i <= page_total; i++) {
    ((i) => {
      setTimeout(() => {
        getIqiyiMovies(i).then(m => {
          Movie.insertMany(JSON.parse(m).data.list, function(err, doc) {
            // console.log(`++++++++++++++${doc}+++++++++++`)
            if (err) {
            } else {
              console.log('插入成功，插入条数为==>', doc.length)
            }
          })
        })
      }, 5000);
    })(i)
  }
})

/* ------------------------------- 爬取爱奇艺所有电视剧 ------------------------------- */

getIqiyiTeleplay().then(res => {
  let page_total = JSON.parse(res).data.pageTotal
  for (var i = 1; i <= page_total; i++) {
    ((i) => {
      setTimeout(() => {
        getIqiyiTeleplay(i).then(m => {
          Teleplay.insertMany(JSON.parse(m).data.list, function(err, doc) {
            // console.log(`++++++++++++++${doc}+++++++++++`)
            if (err) {
            } else {
              console.log('插入成功，插入条数为==>', doc.length)
            }
          })
        })
      }, 5000);
    })(i)
  }
})





// function crawlerPage (url, callback) {
//   // 爬取页面，自定义callback和参数
//   c.queue([{
//     uri: url,
//     jQuery: true,

//     // 覆盖全局的callback
//     callback: callback
//   }]);
// }





















// getHtml(url0).then(res => {
//   let $ = cheerio.load(res)
//   let list_url = $('.m-channel-title').attr('class')
//   console.log(list_url)
// })


// /* --------------------------------- 爬取网页源代码 -------------------------------- */

// async function getHtml(url){
//   return await new Promise((resolve, reject) => {
//     request(url, (error, response, body) => {
//       if (!error && response.statusCode == 200) {
//         return resolve(body)
//       }
//     })
//   })
//   // return html
// }



