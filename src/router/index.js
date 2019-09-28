import Vue from 'vue'
import Router from 'vue-router'
import Index from '../page/Index'
import Account from '../page/Account'
import Me from '../page/Me'
import Statistics from '../page/Statistics'
import Assets from '../page/chart/assets'
import Menu from '../page/chart/menu'
import Budget from '../page/chart/budget'
import Out from '../page/chart/out'
import Write from '../page/chart/write'
import PieChart from '../page/chart/pie-chart'
import Reg from '../components/reg'
import Login from '../components/login'
import SetInfo from '../page/meChild/set-info'
import EditPwd from '../page/meChild/edit-pwd'
import EditTel from '../page/meChild/edit-tel'
import EditInfo from '../page/meChild/edit-info'
import AccountMGT from '../page/meChild/account-mgt'
import TypeMGT from '../page/meChild/type-mgt'
import Feedback from '../page/meChild/feedback'
import Invite from '../page/meChild/invite'
import TypeIncome from '../page/meChild/type-income'
import TypeOut from '../page/meChild/type-out'
import AccountDetail from '../page/meChild/account-detail'
import Detailed from '../page/meChild/detailed'
import WaitIncome from '../page/meChild/wait-income'
import WaitOut from '../page/meChild/wait-out'
import SetAcc from '../page/meChild/set-acc'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'index',
      component: Index,
      children: [{
          path: '/reg',
          name: 'reg',
          component: Reg
        },
        {
          path: '/login',
          name: 'login',
          component: Login
        }
      ]
    },
    {
      path: '/account',
      name: 'account',
      component: Account,
      redirect: '/budget',
      children: [{
          path: '/budget',
          name: 'budget',
          component: Budget,
        },
        {
          path: '/out',
          name: 'out',
          component: Out,
        }
      ]
    },
    {
      path: '/me',
      name: 'me',
      component: Me,
      // children:[]
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: Statistics,
      redirect: '/menu',
      children: [
        
        {
          path: '/pie-chart',
          name: 'pie-chart',
          component: PieChart
        },
        {
          path: '/menu',
          name: 'menu',
          component: Menu
        }
      ]
    },
    {
      path: '/set-info',
      // name:'set-info',
      component: SetInfo
    },
    {
      path: '/edit-pwd',
      component: EditPwd
    },
    {
      path: '/edit-tel',
      component: EditTel
    },
    {
      path: '/edit-info',
      component: EditInfo
    },
    {
      path: '/feedback',
      component: Feedback
    },
    {
      path: '/write',
      name: "/write",
      component: Write
    },
    {
      path: '/invite',
      name: "/invite",
      component: Invite
    },
    {
      path: '/account-mgt',
      name: "account-mgt",
      component: AccountMGT
    },
    {
      path: '/account-detail',
      name: "account-detail",
      component: AccountDetail
    },
    {
      path: '/detailed',
      name: "detailed",
      component: Detailed
    },
    {
      path: '/wait-income',
      name: "wait-income",
      component: WaitIncome
    },
    {
      path: '/wait-out',
      name: "wait-out",
      component: WaitOut
    },
    {
      path: '/setAcc',
      name: "setAcc",
      component: SetAcc
    },
    {
      path: '/assets',
      name: 'assets',
      component: Assets
    },
    {
      path: '/type-mgt',
      name: "type-mgt",
      component: TypeMGT,
      redirect: '/type_income',
      children: [{
          path: '/type_income',
          name: 'type_income',
          component: TypeIncome,
        },
        {
          path: '/type_out',
          name: 'type_out',
          component: TypeOut,
        }
      ]
    },
    {
      path: '/index',
      name: 'index2',
      component: Index
    },
  ]
})
