<template>
  <div id="CurrentShareStock">
    <h2>当前分红股：{{ ownStockNumSum }}股</h2>
    <!-- 列表 -->
    <div class="list">
      <table>
        <thead>
        <tr>
          <th>持有人</th>
          <th>年度分红股数</th>
          <th>所属计划</th>
          <th>授予日期</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in tableDatas">
          <td>{{ item.realName }}</td>
          <td>{{ item.stockNum }}</td>
          <td>{{ item.matureName }}</td>
          <td>{{ item.awardedDate | dateFormat }}</td>
          <td>
            <a href="javascript:void(0)" @click="downLoad($event, item)">授予协议</a>
            <a href="javascript:void(0)" @click="viewDetails(item.bonusSharesId)">详情</a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 分红股详情 -->
    <share-stock-details v-if="isShow" :id="id" v-on:isShow="closePopup"></share-stock-details>
  </div>
</template>

<script>
  import ShareStockDetails from './ShareStockDetails.vue'
  export default {
    data () {
      return {
        isShow: false,
        ownStockNumSum: 0, // 总股数
        tableDatas: [],
        id: ''
      }
    },
    components: {
      ShareStockDetails
    },
    props: ['companyUserId'],
    mounted () {
      console.log(this.companyUserId)
      this.getDatas()
    },
    methods: {
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/admin/bonusshares/findOwn',
          params: {
            companyUserId: this.companyUserId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.ownStockNumSum = result.data.ownStockNumSum
            this.tableDatas = result.data.page.list
          }
        })
      },
      // 下载文件
      downLoad (ev, info) {
        ev.target.setAttribute('href', `/keygood/web/oss/download?fileName=${info.fileName}&path=${info.awardedAgreement}`)
      },
      // 查看详情
      viewDetails (id) {
        this.isShow = true
        this.id = id
      },
      // 关闭弹窗
      closePopup () {
        this.isShow = false
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #CurrentShareStock{
    h2{
      width: 396px;
      height: 66px;
      line-height: 66px;
      background: #62AEFF;
      color: #fff;
      font-size: 24px;
      font-weight: 400;
      border-radius: 4px;
      text-align: center;
    }
    .list{
      border: 1px solid #EFF3F8;
      margin-top: 10px;
      table{
        width: 100%;
        text-align: center;
        table-layout: fixed;
        border: 1px solid #EFEFEE;
        thead{
          tr{
            height: 47px;
            background: #EFF3F6;
            border-bottom: 1px solid #EFF3F6;
            color: #666;
          }
        }
        tbody{
          tr{
            height: 47px;
            border-bottom: 1px solid #EFF3F6;
            color: #333;
            background: #fff;
            td:last-of-type{
              a{
                color: #62AEFF;
                margin: 0 10px;
              }
            }
          }
          tr:last-of-type{
            border-bottom: 0;
          }
        }
      }
    }
  }

  @media screen and (max-width: 1366px){
    #CurrentShareStock{
      h2{
        width: 320px;
        height: 50px;
        line-height: 50px;
        font-size: 18px;
      }
      .list{
        margin-top: 20px;
        table{
          font-size: 14px;
          thead{
            tr{
              height: 40px;
            }
          }
          tbody{
            tr{
              height: 40px;
            }
          }
        }
      }
    }
  }
</style>
