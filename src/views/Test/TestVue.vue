<template>
  <div class="app-container">
    <el-table :data="tableData" style="width: 100%;">
      <el-table-column prop="cusCompanyName" label="对方公司" width="180"/>
      <el-table-column prop="ourCompanyName" label="我方公司" width="180"/>
      <el-table-column prop="timeShowStr" label="时间"/>
      <el-table-column prop="reason" label="备注"/>
    </el-table>
  </div>
</template>

<script>
  import data from './data.json'

  export default {
    data() {
      return {
        tableData: [],
      }
    },
    mounted() {
      // 临时收集结果对象
      const resultObj = {}
      // 时间年月收集key
      // const timeKey = 'timeObjArr'
      data.list.forEach((item) => {
        // 两个id 联合起来作为唯一key, 保证不会重复
        const key = `${item.cusCompanyId}_${item.ourCompanyId}`
        const date = new Date(item.settlementPeriod)
        const timeArr = [date.getFullYear(), date.getMonth() + 1]
        if (resultObj[key]) {
          if (
            resultObj[key]['timeObjArr'] &&
            resultObj[key]['timeObjArr'][`${timeArr[0]}`]
          ) {
            // 追加值 { timeObjArr: { 2020: ['02', '03'] } }
            resultObj[key]['timeObjArr'][`${timeArr[0]}`].push(timeArr[1])
            // 这里可能会有重复的月份加进来，去重
            resultObj[key]['timeObjArr'][`${timeArr[0]}`] = [
              ...new Set(resultObj[key]['timeObjArr'][`${timeArr[0]}`]),
            ]
          } else {
            // 追加新属性2021 { timeObjArr: { 2021: ['02'] } }
            resultObj[key]['timeObjArr'][`${timeArr[0]}`] = [timeArr[1]]
          }
          resultObj[key].amount += item.amount
          resultObj[key].idList.push({ id: item.id })
        } else {
          // 这里 resultObj[key] 为空， 所以不能和上面的else一样直接访问属性timeKey，会报错，
          // 所以分两步 { timeObj: { 2020: ['02'] } }
          // item[timeKey] = { [`${timeArr[0]}`]: [timeArr[1]] }
          resultObj[key] = {
            ...item,
            timeObjArr: { [`${timeArr[0]}`]: [timeArr[1]] },
            reason: '分成款',
            idList: [{ id: item.id }],
          }
        }
      })
      // console.log(resultObj)
      // 收集的对象转成集合， 去掉属性保留value
      const newList = Object.keys(resultObj).map(key => this.formatTime(resultObj, key))
      console.log(newList)
      this.tableData = newList
    },
    methods: {
      formatTime(resultObj, key) {
        // 排序年
        const timeObjArr = resultObj[key]['timeObjArr']
        const sortYearArr = Object.keys(timeObjArr).sort((a, b) => a - b)
        sortYearArr.forEach((yearItem, yearIndex) => {
          // 排序月
          const sortMonthArr = timeObjArr[yearItem].sort((a, b) => a - b)
          let startM // 记录开始位置
          let lastM // 记录循环上次数据
          let timeStr = `;${yearItem}年` // 拼接前端显示, 每次年循环会把这里重新赋值
          sortMonthArr.forEach((monthItem, monthIndex) => {
            // 第一项
            if (monthIndex === 0) {
              startM = monthItem
              lastM = monthItem
            }
            // 不连续
            if (monthItem - lastM > 1) {
              if (startM === lastM) {
                // 单个独立月
                timeStr += `${startM}月、`
              } else {
                // 到此，之前连续月
                timeStr += `${startM}-${lastM}月、`
              }
              startM = monthItem
            }
            lastM = monthItem
            // 最后一项
            if (monthIndex === sortMonthArr.length - 1) {
              if (startM === lastM) {
                // 单个独立月
                timeStr += `${startM}月、`
              } else {
                // 到此，之前连续月
                timeStr += `${startM}-${lastM}月、`
              }
            }
          })
          // 将时间拼接字符串写入对象
          // 判断已经写入别的年没有
          if (resultObj[key]['timeShowStr']) {
            resultObj[key]['timeShowStr'] += timeStr
          } else {
            resultObj[key]['timeShowStr'] = timeStr
          }
          if (yearIndex === sortYearArr.length - 1) {
            // 最后一次 修改字符
            // ;2020年9月、11-12月、;2021年11月、
            // 去掉前后字符， 将中间 、;改成，
            let timeShowStr = resultObj[key]['timeShowStr']
            timeShowStr = timeShowStr.substring(1, timeShowStr.length - 1)
            timeShowStr = timeShowStr.replace('、;', '，')
            resultObj[key]['timeShowStr'] = timeShowStr
          }
        })
        return resultObj[key]
      }
    },
  }
</script>

<style scoped>
</style>
