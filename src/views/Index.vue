<template>
  <div>
    <el-row :gutter="20" class="overview">
      <el-col :span="8">
        <el-card class="block">
          <div class="left" style="background-color: #19be6b">
            <i class="el-icon-star-off"></i>
          </div>
          <div class="right">
            <p class="num">{{ subscribeNum }}</p>
            <p>订阅实例</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="block">
          <div class="left" style="background-color: #f90">
            <i class="el-icon-refresh-right"></i>
          </div>
          <div class="right">
            <p class="num">{{ syncNum }}</p>
            <p>同步实例</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="block">
          <div class="left" style="background-color: #2b85e4">
            <i class="el-icon-warning-outline"></i>
          </div>
          <div class="right">
            <p class="num">{{ errorNum }}</p>
            <p>异常数</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card>
      <o-page-table
        url="http://mock.fe-dev.wanyol.com:8020/mock/5d9300aa42b05f407a939f7e/base/getHomeData"
        :has-page="false"
        :columns="tabelColumns"
        :data="data"
        @update:data="handleSyncData"
      ></o-page-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      subscribeNum: '--',
      syncNum: '--',
      errorNum: '--',
      data: [],
      tabelColumns: [
        {
          title: '机房',
          key: 'idcName'
        },
        {
          title: '订阅实例',
          key: 'subscribeNum'
        },
        {
          title: '订阅异常数',
          key: 'subscribeErrorNum'
        },
        {
          title: '同步实例',
          key: 'syncNum'
        },
        {
          title: '同步异常数',
          key: 'syncErrorNum'
        }
      ]
    }
  },
  methods: {
    handleSyncData(data) {
      this.data = data.idcTaskStats
      this.subscribeNum = data.subscribeNum
      this.syncNum = data.syncNum
      this.errorNum = data.errorNum
    }
  }
}
</script>
<style lang="scss" scoped>
.overview {
  .item {
    display: flex;
  }
  .left {
    flex: 0 0 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: white;
  }
  .right {
    flex-grow: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100px;
  }
  .num {
    font-size: 40px;
    margin-bottom: 10px;
  }
  /deep/ .el-card__body {
    padding: 0;
    display: flex;
  }
}
</style>
