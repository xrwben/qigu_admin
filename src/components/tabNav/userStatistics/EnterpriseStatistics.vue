<template>
  <div id="EnterpriseStatistics">
    <div v-show="!showPopup">
      <!-- toolbar -->
      <el-row>
        <el-form :model="form">
          <el-col :span="5">
            <el-form-item label="证件类型：">
              <el-select v-model="form.type" @change="optionChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="有限责任公司" value="1"></el-option>
                <el-option label="股份有限公司" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态：">
              <el-select v-model="form.state" @change="optionChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="未认证" value="1"></el-option>
                <el-option label="认证中" value="2"></el-option>
                <el-option label="已通过" value="3"></el-option>
                <el-option label="已驳回" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.startTime" @change="optionChange"></el-date-picker>
              —
              <el-date-picker type="date" placeholder="选择日期" v-model="form.endTime" @change="optionChange"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-input class="search" placeholder="企业全称" v-model="form.searchVaule">
              <el-button slot="append" icon="search" @click="optionChange"></el-button>
            </el-input>
          </el-col>
        </el-form>
      </el-row>

      <!-- table -->
      <el-table :data="tableDatas" resizable>
        <el-table-column label="注册日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="认证日期" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.approveTime">--</span>
            <span v-if="scope.row.approveTime">{{ scope.row.approveTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.type | companyType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资本币种" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.currency || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.approveStatus | authenticationState }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="viewDetails(scope.row.companyId)">详细</el-button>
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
              <p><span>企业全称：</span><span>{{ detailsInfo.companyName }}</span></p>
              <p><span>企业类型：</span><span>{{ detailsInfo.type | companyType }}</span></p>
              <p><span>企业简称：</span><span>{{ detailsInfo.companyAbbreviation || '--' }}</span></p>
              <p><span>资本币种：</span><span>{{ detailsInfo.currency || '--' }}</span></p>
              <p><span>净资产：</span><span>{{ detailsInfo.netEstate || '--' }}</span></p>
              <p><span>公司轮次：</span><span>{{ detailsInfo.financing || '--' }}</span></p>
              <p><span>公司对公账户：</span><span>{{ detailsInfo.account || '--' }}</span></p>
              <p><span>状态：</span><span>{{ detailsInfo.approveStatus | authenticationState }}</span></p>
              <p><span>注册日期：</span><span>{{ detailsInfo.createTime | dateFormat }}</span></p>
              <p>
                <span>认证日期：</span>
                <span v-if="detailsInfo.approveTime">{{ detailsInfo.approveTime | dateFormat }}</span>
                <span v-if="!detailsInfo.approveTime">--</span>
              </p>
            </div>
          </div>
        </el-col>
        <el-col :span="12" v-if="detailsInfo.approveStatus === 3">
          <div class="wrapper right">
            <div class="idCard">
              <h3>营业执照</h3>
              <img :src="detailsInfo.license"/>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="popup" v-if="isShowPies">
        <el-col :span="24">
          <div class="wrapper">
            <div>
              <h3>股权概况</h3>
              <div id="PieEchart">
                <div class="total">
                  <p class="title">公司总股数</p>
                  <div class="pie">
                    <div class="wrapper" v-for="(item, index) in data">
                      <div :id="'pie' + index" class="pieSize"></div>
                      <p class="pieTips">{{ index === 0 ? '分红股' : '受限股' }}<span>总股数：{{ item.pieSum }}股</span></p>
                    </div>
                  </div>
                </div>
                <div class="total planItems" v-for="(item, index) in datas">
                  <p class="title">{{ item.pieName }}</p>
                  <div class="pie">
                    <div class="wrapper" v-for="(subItem, subIndex) in datas[index].pieList">
                      <div :id="'pie' + index + subIndex" class="pieMiniSize"></div>
                      <p class="pieTips">{{ subIndex === 0 ? '分红股' : '受限股' }}<span>总股数：{{ subItem.pieSum }}股</span></p>
                    </div>
                  </div>
                </div>
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
        data: [],
        datas: [],
        isShowPies: false
      }
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取列表数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/admin/company/findbylike',
          params: {
            type: this.form.type,
            approveStatus: this.form.state,
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
      // 查看详情
      viewDetails (id) {
        this.showPopup = true
        this.axios({
          method: 'get',
          url: '/keygood/admin/company/findOne',
          params: {
            companyId: id
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.detailsInfo = result.data.company
            this.data = result.data.sumPies
            this.datas = result.data.planPies
            if (result.data.planPies.length) {
              this.addDatas()
              this.isShowPies = true
            } else {
              this.isShowPies = false
            }
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
          for (let i = 0; i < this.datas.length; i++) {
            this.datas[i].pieList.forEach((item, index) => {
              this.drawPie('pie' + i + index, item.pieValue)
            })
          }
        })
      },
      // 关闭详情弹窗
      colse () {
        this.showPopup = false
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
    }
    .idCard{
      text-align: center;
      border-top: 1px solid #ccc;
      margin-top: 10px;
      padding-bottom: 40px;
      h3{
        font-weight: 400;
        line-height: 60px;
      }
      img{
        width: 100%;
        max-width: 400px;
        height: 240px;
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

  #PieEchart{
    padding-bottom: 30px;
    .total{
      .title{
        margin-top: 10px;
        padding: 10px 15px;
        background: #EFF3F8;
        display: inline-block;
      }
      .pie{
        text-align: center;
        margin-top: 20px;
        .wrapper{
          display: inline-block;
          .pieSize{
            width: 200px;
            height: 200px;
            display: inline-block;
          }
        }
        .wrapper:first-of-type{
          margin-right: 200px;
        }
      }
    }
    .planItems{
      margin-top: 30px;
      .pieMiniSize{
        width: 170px;
        height: 170px;
        display: inline-block;
      }
    }
    .pieTips{
      color: #333;
      span{
        color: #5090D3;
        font-size: 14px;
        margin-left: 20px;
      }
    }
  }
</style>
