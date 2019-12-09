import { Loading } from 'element-ui'
// 专供客户端ajax请求使用
import axios from 'axios'

let loadingCount = 0
let loadingInstance = null

let lockCount = 0
let lockInstance = null

export function ajaxMixin(Vue, options = {}) {
  const {
    mockServerUrl = 'http://mock.fe-dev.wanyol.com:8020',
    mockServerId
  } = options
  axios.defaults.validateStatus = function(status) {
    return status >= 200 && status <= 204 // default
  }

  /**
   * 请求模块
   * @param {string} url 请求路径
   * @param {Object} data 请求参数对象
   * @param {Object} ext ext的其他参数，提供给axios的配置参数 https://github.com/axios/axios
   * @param {boolean} ext._ignoreMsg 是否忽略错误弹窗，改为自行捕获
   * @param {boolean} ext._loading 是否在请求时使用loading
   * @param {number} ext._mockServerId mock功能的id
   * @param {number} ext._mockServerUrl 哥伦布mock功能的服务id
   * @param {boolean} ext._mock 是否使用mock功能，默认不使用
   * @param {string} ext._type 把post put patch请求的数据包装成什么格式，默认json
   */
  const request = function(type) {
    return async function(url, data = {}, ext = { timeout: 20000 }) {
      const {
        _ignoreMsg = false,
        _type = 'json',
        _mockServerId,
        _mockServerUrl,
        _mock,
        _confirm,
        ...axiosOptions
      } = ext
      if (_confirm) {
        await this.$confirm(_confirm, '提示', {
          type: 'warning'
        })
      }
      const config = {}
      Object.assign(config, axiosOptions)
      // 当设置_mock时当条请求使用mock数据
      config.url = _mock
        ? `${_mockServerUrl || mockServerUrl}/mock/${(_mockServerId ||
            mockServerId) + url}`
        : url
      config.method = type
      config.headers = config.headers || {}
      config.headers['Ajax-Return'] = 1
      if (['put', 'post', 'patch'].includes(type)) {
        if (_type === 'form' && !(data instanceof FormData)) {
          const formData = new FormData()
          for (const [k, v] of Object.entries(data)) {
            formData.append(k, v)
          }
          config.data = formData
        } else {
          config.data = data
        }
      } else {
        config.params = data
      }

      try {
        requestLiftCycle(this, type, 'start', ext, options)
        const res = await axios(config)

        const { status, data, code } = res.data
        // 登录规则
        // ?service=location.origin/redirect?url={base64加密的回调地址} 跳转到sso时携带这串参数即可
        if (code === 302 && data && data.target) {
          location.href = `${
            data.target.split('?')[0]
          }?service=${encodeURIComponent(location.href)}&locale=zh_CN`
          return
        }

        if (status === 401 && data.authorizationUrl) {
          location.href = `${
            data.authorizationUrl
          }?service=${encodeURIComponent(
            location.origin +
              '/redirect?url=' +
              btoa(location.pathname + location.search).replace(/=*$/, '')
          )}&locale=zh_CN`
          return
        }
        if (status !== '0000' && status !== 200) {
          throw res.data
        }
        return res.data.data
      } catch (error) {
        if (error.code === 'ECONNABORTED') error.msg = '请求超时'
        if (!_ignoreMsg) {
          this.$message.error(error.msg || '系统错误')
        }
        return Promise.reject(error)
      } finally {
        requestLiftCycle(this, type, 'end', ext, options)
      }
    }
  }

  function requestLiftCycle(
    vm,
    type,
    name,
    { _loading, _lock } = {},
    { ajaxLoading = '正在加载...', ajaxLock = '正在处理请求...' } = {}
  ) {
    const combineLoading = _loading || ajaxLoading
    const canLock = ['post', 'put', 'patch', 'delete'].includes(type)
    const combineLock = _lock || (canLock ? ajaxLock : false)
    if (name === 'start') {
      if (combineLock) {
        lockCount++
        if (!lockInstance) {
          lockInstance = Loading.service({
            lock: true,
            text: combineLock,
            spinner: 'el-icon-lock',
            background: 'rgba(0, 0, 0, 0.3)'
          })
        }
      }
      if (combineLoading) {
        loadingCount++
        if (!loadingInstance) {
          loadingInstance = vm.$loading(combineLoading)
        }
      }
    } else {
      if (combineLock) {
        lockCount--
        if (lockInstance && lockCount <= 0) {
          lockInstance.close()
          lockCount = 0
          lockInstance = null
        }
      }
      if (combineLoading) {
        loadingCount--
        if (loadingInstance && loadingCount <= 0) {
          loadingInstance.close()
          loadingCount = 0
          loadingInstance = null
        }
      }
    }
  }

  const prototype = Vue.prototype
  prototype.$ajax = {}
  ;['get', 'post', 'put', 'patch', 'delete'].forEach(v => {
    prototype.$ajax[v] = request(v).bind(prototype)
  })
}
