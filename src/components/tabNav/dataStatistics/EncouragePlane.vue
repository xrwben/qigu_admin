<template>
  <div id="EncouragePlane">
    <div v-show="!showPopup">
      <!-- toolbar -->
      <el-row>
        <el-form :model="form">
          <el-col :span="5">
            <el-form-item label="持股主体：">
              <el-select v-model="form.type" @change="optionChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="个人持股" value="1"></el-option>
                <el-option label="持股平台" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态：">
              <el-select v-model="form.state" @change="optionChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="未完成" value="1"></el-option>
                <el-option label="已完成" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.startTime" @change="optionChange"></el-date-picker>
              —
              <el-date-picker type="date" placeholder="选择日期" v-model="form.endTime" @change="optionChange"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-input class="search" placeholder="所属企业、计划名称" v-model="form.searchVaule">
              <el-button slot="append" icon="search" @click="optionChange"></el-button>
            </el-input>
          </el-col>
        </el-form>
      </el-row>

      <!-- table -->
      <el-table :data="tableDatas" resizable>
        <el-table-column label="创建日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属企业" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.company.companyName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.planName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="持股主体" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.positionsMain | positionsMainType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | state }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="viewDetails(scope.row.stimulateId)">详细</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-row class="pagination">
        <el-col :span="24">
          <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalSize">
          </el-pagination>
        </el-col>
      </el-row>
    </div>

    <!-- 详情层 -->
    <div v-if="showPopup">
      <el-row class="popup">
        <p class="close"><i class="iconfont icon-guanbi" @click="colse()"></i></p>
        <el-col :span="12">
          <div class="wrapper left">
            <div class="info">
              <p><span>计划名称：</span><span>{{ detailsInfo.planName }}</span></p>
              <p><span>所属企业：</span><span v-if="detailsInfo.company">{{ detailsInfo.company.companyName }}</span></p>
              <p><span>持股主体：</span><span>{{ detailsInfo.positionsMain | positionsMainType }}</span></p>
              <p><span>计划有效期：</span><span>{{ detailsInfo.indate }} 年</span></p>
              <p><span>状态：</span><span>{{ detailsInfo.status | state }}</span></p>
              <p><span>创建日期：</span><span>{{ detailsInfo.createTime | dateFormat }}</span></p>
              <div>
                <p><b>上传文档</b></p>
                <a href="javascript:void(0)" @click="downLoad($event, item)" v-for="item in stimulateDocuments">{{ item .name | sliceHTML }}</a>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12" v-if="detailsInfo.status === 2">
          <div class="wrapper right">
            <div class="pie">
              <div class="wrapper" v-for="(item, index) in data">
                <div :id="'pie' + index" class="pieSize"></div>
                <p class="pieType">{{ index === 0 ? '分红股' : '受限股' }}</p>
                <p class="pieData"><span>总股数：{{ item.pieSum }}股</span></p>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    data () {
      return {
        form: {
          type: '',
          state: '',
          startTime: '',
          endTime: '',
          searchVaule: ''
        },
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        tableDatas: [],
        showPopup: false,
        detailsInfo: {},
        stimulateDocuments: [],
        data: []
      }
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取列表数据
      getDatas () {
        this.axios({
          method: 'get',
          url: '/keygood/admin/stimulate/findbylike',
          params: {
            positionsMain: this.form.type,
            status: this.form.state,
            startTime: this.form.startTime,
            endTime: this.form.endTime,
            keyword: this.form.searchVaule.trim(),
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.tableDatas = result.data.page.list
            this.totalSize = result.data.page.totalCount
          } else {
            this.$message({
              message: result.data.msg,
              type: 'error'
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      // 改变每页条数
      sizeChange (val) {
        this.pageSize = val
        this.getDatas()
      },
      currentChange (val) {
        this.currentPage = val
        this.getDatas()
      },
      optionChange () {
        this.getDatas()
      },
      // 点击编号跳转
      viewDetails (id) {
        this.showPopup = true
        this.axios({
          method: 'get',
          url: '/keygood/admin/stimulate/findOne',
          params: {
            stimulateId: id
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.detailsInfo = result.data.stimulate
            this.stimulateDocuments = result.data.stimulateDocuments
            this.data = result.data.planPie.pieList
            this.addDatas()
          } else {
            this.$message({
              message: result.data.msg,
              type: 'error'
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      // 画图
      drawPie (id, data) {
        this.charts = echarts.init(document.getElementById(id))
        this.charts.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{b} ({d}%)'
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: '85%',
              center: ['50%', '50%'],
              data: data,
              label: {
                normal: {
                  show: true,
                  position: 'inside',
                  formatter: '{d}%'
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 5,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.2)'
                }
              }
            }
          ],
          color: ['rgba(80,144,211,1)', 'rgba(98,174,255,1)'],
          animationDuration: 1000
        })
      },
      // 添加数据
      addDatas () {
        this.$nextTick(() => {
          this.drawPie('pie0', this.data[0].pieValue)
          this.drawPie('pie1', this.data[1].pieValue)
        })
      },
      // 下载
      downLoad (ev, info) {
        ev.target.setAttribute('href', `/keygood/admin/oss/download?fileName=${info.name}&path=${info.path}`)
      },
      // 关闭详情
      colse () {
        this.showPopup = false
      }
    },
    filters: {
      sliceHTML (value) {
        return value.slice(0, value.length - 5)
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  .el-select{
    max-width: 120px;
  }
  .el-input{
    max-width: 120px
  }
  .search{
    max-width: 300px
  }
  .pagination{
    margin-top: 15px;
  }

  /* 详情弹窗*/
  .popup{
    background: #eef1f6;
    padding: 20px;
    margin-bottom: 5px;
    .close{
      text-align: right;
      i{
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
  .wrapper{
    .info{
      border-top: 1px solid #ccc;
      margin-top: 10px;
      p{
        height: 35px;
        line-height: 35px;
        span:first-of-type{
          float: left;
        }
        span:last-of-type{
          float: right;
        }
      }
      >div{
        a{
          color: #5090D3;
          margin: 0 20px;
        }
      }
    }
    .pie{
      text-align: center;
      border-top: 1px solid #ccc;
      margin-top: 10px;
      padding-bottom: 10px;
      /* 饼图 */
      .wrapper{
        display: inline-block;
        .pieSize{
          width: 200px;
          height: 200px;
          display: inline-block;
        }
        .pieType{
          font-size: 16px;
          line-height: 35px;
        }
      }
      .wrapper:first-of-type{
        margin-right: 20px;
      }
    }
  }
  .left{
    padding-right: 10px;
  }
  .right{
    border-left: 5px solid #fff;
    padding-left: 10px;
  }

</style>
