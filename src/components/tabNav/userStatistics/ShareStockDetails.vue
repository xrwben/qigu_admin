<template>
  <div id="ShareStockDetails">
    <div class="wrapper">
      <div class="title">分红股详情<i class="iconfont icon-guanbi"  @click="close()"></i></div>
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
            <li>年度最大可分红股数：{{ bonusShares.stockNum }}</li>
            <li>所属计划：{{ stimulate.planName }}</li>
            <li>授予日期：{{ bonusShares.awardedDate | dateFormat }}</li>
          </ul>
        </div>
        <div>
          <label>成熟计划详情</label>
          <ul>
            <li>成熟计划名称：{{ mature.matureName }}</li>
            <li>授予股数：{{ bonusShares.stockNum }}</li>
            <li>计划长度：{{ mature.matureLong }}年</li>
            <li>成熟周期：每年成熟一次</li>
          </ul>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>成熟日期</th>
                <th>绩效考核合格率</th>
                <th>年度最大可分红股数</th>
                <th>年度最大可认购股数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in performances">
                <td>{{ bonusShares.awardedDate | dateAddYear(index+1) }}</td>
                <td>{{ item.yield }}</td>
                <td>{{ bonusShares.stockNum }}</td>
                <td>{{ (item.subrate * bonusShares.stockNum).toFixed(0) }}</td>
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
        companyUser: {},
        bonusShares: {},
        mature: {},
        performances: {},
        stimulate: {},
        company: {}
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
          url: '/keygood/admin/bonusshares/findOne',
          params: {
            bonusSharesId: this.id
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.companyUser = result.data.companyUser
            this.bonusShares = result.data.bonusShares
            this.mature = result.data.mature
            this.performances = result.data.performances
            this.stimulate = result.data.stimulate
            this.company = result.data.company
          }
        })
      },
      // 关闭弹窗
      close () {
        this.$emit('isShow', false)
      }
    },
    filters: {
      dateAddYear (value, i) {
        let year = new Date(value).getFullYear() || 0
        let month = (new Date(value).getMonth() + 1 || 0) < 10 ? '0' + (new Date(value).getMonth() + 1 || 0) : (new Date(value).getMonth() + 1 || 0)
        let date = (new Date(value).getDate() || 0) < 10 ? '0' + (new Date(value).getDate() || 0) : (new Date(value).getDate() || 0)
        return parseInt(year) + i + '-' + month + '-' + date
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #ShareStockDetails{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 940px;
      max-height: 670px;
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
        max-height: 570px;
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
      }
    }
  }

  @media screen and (max-width: 1366px){
    #ShareStockDetails{
      .wrapper{
        width: 650px;
        max-height: 470px;
        .title{
          height: 45px;
          line-height: 45px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .con{
          max-height: 400px;
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
