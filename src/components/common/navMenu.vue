<template>
  <div class="navCon">
    <div class="navHead">
      <div class="line"></div>
      <div class="navImg">
        <div class="imgBox">
          <img src="../../assets/image/logo.png" class="img-log"/>
        </div>
      </div>
      <div style="width: 80%;" class="navs">
        <el-menu :default-active="onRoutes" background-color="#4f4e4c" text-color="#fff"
                 active-text-color="#5FB878" class="el-menu-demo navBox" mode="horizontal" @select="handleSelect"
                 unique-opened router>
          <el-menu-item index="loginHome"><i class="el-icon-collection"></i>首页</el-menu-item>
          <el-menu-item index="orderManage"><i class="el-icon-wallet"></i>订单管理</el-menu-item>
          <el-menu-item index="taskManage"><i class="el-icon-suitcase"></i>任务管理</el-menu-item>
          <el-submenu index="5" class="userInfoBox">
            <template slot="title"><i class="el-icon-s-custom"></i>{{name}}</template>
            <el-menu-item index="userInfo">基本信息</el-menu-item>
            <el-menu-item index="updatePwd">修改密码</el-menu-item>
            <el-menu-item index="securitySet">安全设置</el-menu-item>
          </el-submenu>
          <el-menu-item index="7" class="loginOut" @click="loginOut"><i class="el-icon-setting"></i>退出
          </el-menu-item>
        </el-menu>
      </div>
      <div class="disNone">
        <div>
          <el-menu :default-active="onRoutes" background-color="#2F4056" text-color="#fff"
                   active-text-color="#5FB878" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                   unique-opened router>
            <el-submenu index="5" class="sysItem">
              <template slot="title">菜单</template>
              <el-menu-item index="index">首页</el-menu-item>
              <el-menu-item index="orderManage">订单管理</el-menu-item>
              <el-menu-item index="taskManage">任务管理</el-menu-item>
              <el-menu-item index="userInfo">基本信息</el-menu-item>
              <el-menu-item index="updatePwd">修改密码</el-menu-item>
              <el-menu-item index="securitySet">安全设置</el-menu-item>
            </el-submenu>
            <el-menu-item index="7" class="loginOut" @click="loginOut"><i class="el-icon-s-custom"></i>退出
            </el-menu-item>
          </el-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from './bus'

export default {
  name: 'navMenu',
  data () {
    return {
    	name:'',
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  created () {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
    this.getName()
    
  },
  computed: {
    onRoutes () {
      return this.$route.path.replace('/', '')
    }
  },
  methods: {
    handleSelect (key, keyPath) {
//    console.log(key, keyPath)
    },
    getName(){
    	let _this = this
    	_this.name = sessionStorage.getItem('userName')
    },
    loginOut () {
      this.$router.push({name:'index',params:{indexShow: false}})
      sessionStorage.clear()
    }
  }
}
</script>

<style scoped>
  .imgBox {
    width: 225px;
    display: inline-block;
  }

  .navBox {
    position: relative;
    right:0;
    height: 60px;
  }
.loginIn{
  position: absolute;
  right: 100px;
}
  /*.navImg{*/
  /*  width: 30%;*/
  /*}*/
</style>
