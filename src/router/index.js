import Vue from 'vue'
import Router from 'vue-router'

const Login = resolve => require(['../pages/Login.vue'], resolve)
const Home = resolve => require(['../pages/Home.vue'], resolve)
const CheckManagement = resolve => require(['../pages/menu/CheckManagement.vue'], resolve)
const UserStatistics = resolve => require(['../pages/menu/UserStatistics.vue'], resolve)
const DataStatistics = resolve => require(['../pages/menu/DataStatistics.vue'], resolve)
const OrderStatistics = resolve => require(['../pages/menu/OrderStatistics.vue'], resolve)
const EmailPush = resolve => require(['../pages/menu/EmailPush.vue'], resolve)
const CouponManagement = resolve => require(['../pages/menu/CouponManagement.vue'], resolve)
const ServicePriceManagement = resolve => require(['../pages/menu/ServicePriceManagement.vue'], resolve)
const DocumentManagement = resolve => require(['../pages/menu/DocumentManagement.vue'], resolve)
const AccountManagement = resolve => require(['../pages/menu/AccountManagement.vue'], resolve)
const IssueManagement = resolve => require(['../pages/menu/IssueManagement.vue'], resolve)
const OperationLog = resolve => require(['../pages/menu/OperationLog.vue'], resolve)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    {
      name: 'Home',
      path: '/',
      component: Home,
      redirect: '/login',
      children: [
        {
          name: '审核管理',
          path: '/checkmanagement',
          role: '1,2',
          component: CheckManagement
        },
        {
          name: '用户统计',
          path: '/userstatistics',
          role: '1',
          component: UserStatistics
        },
        {
          name: '数据统计',
          path: '/datastatistics',
          role: '1',
          component: DataStatistics
        },
        {
          name: '订单统计',
          path: '/orderstatistics',
          role: '1',
          component: OrderStatistics
        },
        {
          name: '邮件推送',
          path: '/emailpush',
          role: '1,2',
          component: EmailPush
        },
        {
          name: '优惠券管理',
          path: '/couponmanagement',
          role: '1',
          component: CouponManagement
        },
        {
          name: '服务价格管理',
          path: '/servicepricemanagement',
          role: '1',
          component: ServicePriceManagement
        },
        {
          name: '文档管理',
          path: '/documentmanagement',
          role: '1',
          component: DocumentManagement
        },
        {
          name: '账号管理',
          path: '/accountManagement',
          role: '1',
          component: AccountManagement
        },
        {
          name: '问题管理',
          path: '/issuemanagement',
          role: '1,2',
          component: IssueManagement
        },
        {
          name: '操作日志',
          path: '/operationlog',
          role: '1',
          component: OperationLog
        }
      ]
    }
  ]
})
