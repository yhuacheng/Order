import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
	// mode: 'history',
	routes: [{
			path: '/',
			redirect: '/loginHome'
		},
		{
			path: '/',
			component: resolve => require(['../components/common/home.vue'], resolve),
			meta: {
				title: '自述文件'
			},
			children: [{
					path: '/loginHome',
					name: 'loginHome',
					component: resolve => require(['../components/page/loginHome.vue'], resolve),
					meta: {
						title: '首页'
					}
				},
				{
					path: '/taskManage',
					name: 'taskManage',
					component: resolve => require(['../components/page/taskManage.vue'], resolve),
					meta: {
						title: '订单管理'
					}
				},
				{
					path: '/orderManage',
					name: 'orderManage',
					component: resolve => require(['../components/page/orderManage.vue'], resolve),
					meta: {
						title: '任务管理'
					}
				},
        {
        	path: '/accountManage',
        	name: 'accountManage',
        	component: resolve => require(['../components/page/accountManage.vue'], resolve),
        	meta: {
        		title: '资金管理'
        	}
        },
				{
					path: '/userInfo',
					name: 'userInfo',
					component: resolve => require(['../components/page/userInfo.vue'], resolve),
					meta: {
						title: '基本信息'
					}
				},
				{
					path: '/updatePwd',
					name: 'updatePwd',
					component: resolve => require(['../components/page/updatePwd.vue'], resolve),
					meta: {
						title: '修改密码'
					}
				},
				{
					path: '/securitySet',
					name: 'securitySet',
					component: resolve => require(['../components/page/securitySet.vue'], resolve),
					meta: {
						title: '安全设置'
					}
				},
				{
					path: '/CashWithdrawal',
					name: 'CashWithdrawal',
					component: resolve => require(['../components/page/CashWithdrawal.vue'], resolve),
					meta: {
						title: '提现'
					}
				}
			]
		},
		{
			path: '/forgetPassword',
			name: 'forgetPassword',
			component: resolve => require(['../components/page/forgetPassword'], resolve)
		},
		{
			path: '/index',
			name: 'index',
			component: resolve => require(['../components/page/index'], resolve)
		}
	]
})