// utils/api.js - DeepSeek API 调用封装
var constants = require('./constants')
var util = require('./util')

// 调用DeepSeek进行故障分析
function analyzeFault(imagePaths, description) {
  return new Promise(function(resolve, reject) {
    // 先将所有图片转为base64
    var base64Promises = imagePaths.map(function(path) {
      return util.imageToBase64(path)
    })

    Promise.all(base64Promises)
      .then(function(base64Images) {
        var messages = buildMessages(base64Images, description)

        wx.request({
          url: constants.DEEPSEEK_CONFIG.BASE_URL + '/chat/completions',
          method: 'POST',
          timeout: 15000,
          header: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + constants.DEEPSEEK_CONFIG.API_KEY
          },
          data: {
            model: constants.DEEPSEEK_CONFIG.MODEL,
            messages: messages,
            temperature: 0.3,
            max_tokens: 1000
          },
          success: function(res) {
            if (res.statusCode === 200) {
              try {
                var content = res.data.choices[0].message.content
                // 尝试从返回中提取JSON
                var jsonStr = content
                  .replace(/```json\n?/g, '')
                  .replace(/```\n?/g, '')
                  .trim()
                var result = JSON.parse(jsonStr)
                resolve(result)
              } catch (e) {
                reject(new Error('AI返回结果解析失败'))
              }
            } else {
              reject(new Error('API请求失败: ' + res.statusCode))
            }
          },
          fail: function(err) {
            reject(new Error('网络请求失败: ' + err.errMsg))
          }
        })
      })
      .catch(reject)
  })
}

// 构造Prompt消息
function buildMessages(base64Images, description) {
  var imageContents = base64Images.map(function(base64) {
    return {
      type: 'image_url',
      image_url: {
        url: 'data:image/jpeg;base64,' + base64
      }
    }
  })

  var userContent = imageContents.concat([
    {
      type: 'text',
      text: '请分析以下设备故障：\n' + description
    }
  ])

  return [
    {
      role: 'system',
      content: '你是一位经验丰富的工厂设备维修专家。请根据提供的设备故障图片和工人的描述，进行专业分析。请严格按照JSON格式返回。JSON格式：{"faultType":"故障类型","urgency":"紧急程度","suggestion":"建议","confidence":置信度}。紧急程度可选：低、中、高、紧急。'
    },
    {
      role: 'user',
      content: userContent
    }
  ]
}

module.exports = {
  analyzeFault: analyzeFault
}
