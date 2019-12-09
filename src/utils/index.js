// 公共函数
/**
 * 防抖函数
 */
export const debounce = (fn, ms = 0) => {
  let timeoutId
  return function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

/**
 * 节流函数
 */
export const throttle = (fn, wait) => {
  let updateTime = Date.now()
  return (...args) => {
    const now = Date.now()
    if (now - updateTime > wait) {
      fn.apply(this, args)
      updateTime = now
    }
  }
}

/**
 * 根据给定的条件找到集合元素
 */
export const findBy = (collectin = [], key, value) => {
  return collectin.find(v => v[key] === value)
}
