<template>
  <div id="CurrentRestrictedStock">
    <h2>当前受限股：{{ ownSubscribeNumSum }}股</h2>
    <!-- 列表 -->
    <div class="list">
      <table>
        <thead>
        <tr>
          <th>持有人</th>
          <th>总股数</th>
          <th>已解限</th>
          <th>认购价(元/股)</th>
          <th>所属计划</th>
          <th>认购日期</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in tableDatas">
          <td>{{ item.realName }}</td>
          <td>{{ item.subscribeNum }}</td>
          <td>{{ item.notLimit }}</td>
          <td>{{ item.subscribePrice }}</td>
          <td>{{ item.matureName }}</td>
          <td>{{ item.createTime | dateFormat }}</td>
          <td>
            <a href="javascript:void(0)" @click="downLoad($event, item)">认购确认书</a>
            <a href="javascript:void(0)" @click="viewDetails(item.limitationId)">详情</a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 受限股详情 -->
    <restricted-stock-details v-if="isShow" :id="id" v-on:isShow="closePopup"></restricted-stock-details>

  </div>
</template>

<script>
  import RestrictedStockDetails from './RestrictedStockDetails.vue'
  export default {
    data () {
      return {
        isShow: false,
        ownSubscribeNumSum: 0, // 总股数
        tableDatas: [],
        id: ''
      }
    },
    components: {
      RestrictedStockDetails
    },
    props: ['companyUserId'],
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/admin/limitation/findOwn',
          params: {
            companyUserId: this.companyUserId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.ownSubscribeNumSum = result.data.ownSubscribeNumSum
            this.tableDatas = result.data.page.list
          }
        })
      },
      // 下载
      downLoad (ev, info) {
        ev.target.setAttribute('href', `/keygood/web/oss/download?fileName=${info.fileName}&path=${info.subscribeInform}`)
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
  #CurrentRestrictedStock{
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
    #CurrentRestrictedStock{
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
