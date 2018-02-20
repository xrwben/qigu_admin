<template>
  <div id="RestrictedStockDetails">
    <div class="wrapper">
      <div class="title">受限股详情<i class="iconfont icon-guanbi"  @click="close()"></i></div>
      <div class="con">
        <div>
          <label>持有人信息</label>
          <ul>
            <li>持有人：{{ companyUser.realName }}</li>
          </ul>
        </div>
        <div>
          <label>股权信息</label>
          <ul>
            <li>总股数：{{ limitation.subscribeNum }}</li>
            <li>已解限(股)：{{ limitation.notLimit }}</li>
            <li>认购价(元/股)：{{ limitation.subscribePrice }}</li>
            <li>所属计划：{{ stimulate.planName }}</li>
            <li>认购日期：{{ limitation.createTime | dateFormat }}</li>
          </ul>
        </div>
        <div>
          <label>解限计划详情</label>
          <ul>
            <li>解限计划名称：{{ unfreeze.unfreezeName }}</li>
            <li>本次解限计划：{{ unfreeze.lockLong }}{{ unfreeze.lockUnit | timeUnit }}</li>
            <li>绩效考核合格率(大于等于)：{{ performance.yield }}%</li>
          </ul>
        </div>
        <div>
          <table>
            <thead>
            <tr>
              <th>绩效考核合格率(大于等于)</th>
              <th>年度最大可分红股数</th>
              <th>年度最大可认购股数</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{ performance.yield }}</td>
              <td>{{ bonusShares.stockNum }}</td>
              <td>{{ (bonusShares.stockNum * performance.subrate).toFixed(0) }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>本次完成业绩指标</th>
                <th>本次可分红股数</th>
                <th>本次可认购股数</th>
                <th>本次认购价(元/股)</th>
                <th>本次完成的比例</th>
                <th>本次已失效的股权</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ limitation.content }}</td>
                <td>{{ limitation.bonusNum }}</td>
                <td>{{ limitation.subscribeNum }}</td>
                <td>{{ limitation.subscribePrice }}</td>
                <td>{{ limitation.completePercent }}</td>
                <td>{{ limitation.failureEquity }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        bonusShares: {},
        company: {},
        companyUser: {},
        limitation: {},
        performance: {},
        platform: {},
        stimulate: {},
        unfreeze: {}
      }
    },
    props: ['id'],
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/admin/limitation/findOne',
          params: {
            limitationId: this.id
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.bonusShares = result.data.bonusShares
            this.company = result.data.company
            this.companyUser = result.data.companyUser
            this.limitation = result.data.limitation
            this.performance = result.data.performance
            this.platform = result.data.platform
            this.stimulate = result.data.stimulate
            this.unfreeze = result.data.unfreeze
          }
        })
      },
      // 关闭
      close () {
        this.$emit('isShow', false)
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #RestrictedStockDetails{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 940px;
      max-height: 728px;
      background: #fff;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      .title{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background: #62AEFF;
        text-align: center;
        color: #fff;
        font-size: 24px;
        i{
          float: right;
          margin-right: 15px;
          font-size: 26px;
          cursor: pointer;
        }
      }
      .con{
        max-height: 695px;
        padding: 0 30px;
        overflow-y: auto;
        color: #666;
        div{
          label{
            font-size: 18px;
            padding: 10px 15px;
            background: #EFF3F8;
            display: inline-block;
          }
          ul{
            padding: 10px 10px;
            li{
              line-height: 25px;
            }
          }
          table{
            width: 100%;
            text-align: center;
            table-layout: fixed;
            border: 1px solid #EFF3F8;
            thead{
              tr{
                height: 47px;
                background: #EFF3F6;
                border-bottom: 1px solid #EFF3F6;
                color: #666;
                th{
                  font-weight: 400;
                }
              }
            }
            tbody{
              tr{
                height: 47px;
                border-bottom: 1px solid #EFF3F6;
                color: #333;
              }
              tr:last-of-type{
                border-bottom: 0;
              }
            }
          }
        }
        div:first-of-type{
          margin-top: 25px;
        }
        div:last-of-type{
          margin-top: 5px;
        }
      }
    }
  }

  @media screen and (max-width: 1366px){
    #RestrictedStockDetails{
      .wrapper{
        width: 750px;
        max-height: 520px;
        .title{
          height: 45px;
          line-height: 45px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .con{
          max-height: 500px;
          font-size: 14px;
          div{
            label{
              font-size: 16px;
              padding: 5px 10px;
            }
            ul{
              padding: 5px 10px;
              li{
                line-height: 20px;
              }
            }
            table{
              thead{
                tr{
                  height: 35px;
                }
              }
              tbody{
                tr{
                  height: 35px;
                }
                tr:last-of-type{
                  border-bottom: 0;
                }
              }
            }
          }
          div:first-of-type{
            margin-top: 10px;
          }
        }
      }
    }
  }
</style>
