var axios = require('axios')
var _ = require('lodash')
var fs = require('fs')

function fetchTrending() {
  /*  async.eachOfLimit(Array(10).fill(1), 2, (i, idx, cb)=>{

    const now = new Date()
    let _d = new Date(now.setDate(now.getDate() - idx -1))
    console.log(_d)
    return axios({
      timeout: 10000, // short time for timeout
      url: 'http://app.gitlogs.com/trending',
      params: {
        date: _d.toISOString().slice(0,10)
      },
      validateStatus: function (status) {
        return status < 600; // hack to ignore error...
      }
    }).then((i)=>(i), (e)=>{e}).catch((e)=>{
      console.log(e)
    }); // igore error for timeout pass down


  }, ()=>{

  })*/

  Promise.all(
    _.map(Array(30).fill(1), (i, idx) => {
      const now = new Date()
      let _d = new Date(now.setDate(now.getDate() - idx - 1))
      console.log(_d)
      return axios({
        timeout: 10000, // short time for timeout
        url: 'http://app.gitlogs.com/trending',
        params: {
          date: _d.toISOString().slice(0, 10),
        },
        validateStatus: function(status) {
          return status < 600 // hack to ignore error...
        },
      }).then(
        i => i,
        e => {
          e
        }
      ) // igore error for timeout pass down
    })
  )
    .then(values => {
      console.log(values)
      // Todo: 添补日期
      let idx = 0
      const menus = _.map(
        _.filter(values, i => i && i.status == 200),
        ({ data }) => {
          let anchor = data[0].date.slice(0, 10)
          ++idx
          return {
            name: anchor,
            key: idx === 1 ? 'trending_first' : anchor, // hack
            list: _.map(data.slice(0, 40), i => {
              return {
                name: i.repo_name.split('/')[1] + ' ' + i.count,
                key: i.repo_name.replace('/', '___'),
                description: i.repo ? i.repo.description : '',
              }
            }),
          }
        }
      )

      fs.writeFileSync('./gitlogs_trending.json', JSON.stringify(menus), 'utf8')
      console.log('done with trending days github')
    })
    .catch(e => {
      console.log(e)
    })
}

function fetchGitlogsTopics() {
  axios({
    url: 'http://www.gitlogs.com/data/github_topics.json',
    responseType: 'stream',
  }).then(function(resp) {
    resp.data.pipe(fs.createWriteStream('./gitlogs_topics.json'))
    console.log('done with topics github')
  })
}

function main() {
  fetchTrending()
  fetchGitlogsTopics()
}
main()
