<template>
  <div>
    <div class="mt20 mb20">
        <span>首页</span>
        <span class="fg">/</span>
        <a>账户设置</a>
        <span class="fg">/</span>
        <span>基本信息</span>
    </div>
    <el-form class="userInfo">
      <el-form-item label="名称" class="userList">
        <el-form-item>
          <span>{{userNames}}</span>
          <span class="tips">设置名称后能给您提供更好的服务哦~</span>
          <span class="editBtn edit1" @click="editHandel"><i class="el-icon-edit"></i>修改</span>
        </el-form-item>
      </el-form-item>
      <el-form-item label="QQ" class="userList">
        <el-form-item>
          <span>{{userQQ}}</span>
          <span class="editBtn edit2" @click="editQqHandel"><i class="el-icon-edit"></i>修改</span>
        </el-form-item>
      </el-form-item>
      <el-form-item label="微信" class="userList">
        <el-form-item>
          <span>{{WeChat}}</span>
          <span class="editBtn edit3" @click="editWeChatHandel"><i class="el-icon-edit"></i>修改</span>
        </el-form-item>
      </el-form-item>
    </el-form>
<!--  修改QQ-->
    <el-dialog title="修改信息" :visible.sync="editQqModel" width="40%" center :close-on-click-modal="false">
      <el-form :model="formQq" ref="formQq" label-width='80px' :rules='rules' class="demo-ruleForm">
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="formQq.qq" placeholder='请输入新QQ'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editQQ('formQq')">确定</el-button>
          <el-button @click="editQqModel=false">取消</el-button>
        </span>
    </el-dialog>
    <!--修改微信-->
    <el-dialog title="修改信息" :visible.sync="editWeChatModel" width="40%" center :close-on-click-modal="false">
      <el-form :model="formWeChat" ref="formWeChat" :rules='rules' class="demo-ruleForm" label-width='80px'>
        <el-form-item prop="WeChat" label='微信'>
          <el-input v-model="formWeChat.WeChat" placeholder='请输入新微信'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editWeChat('formWeChat')">确定</el-button>
          <el-button @click="editWeChatModel=false">取消</el-button>
        </span>
    </el-dialog>
    <!-- 修改名称 -->
    <el-dialog title="修改信息" :visible.sync="editNameModel" width="40%" center :close-on-click-modal="false">
      <el-form :model="formName" ref="formName" :rules='rules' class="demo-ruleForm" label-width='80px'>
        <el-form-item prop="userName" label='姓名'>
          <el-input v-model="formName.userName" placeholder='请输入姓名'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editName('formName')">确定</el-button>
          <el-button @click="editNameModel=false">取消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import {updateName,updateQQ,updateWeCatch,getIndex} from '@/request/api'
export default {
  name: 'userInfo',
  data () {
    return {
      editQqModel: false,
      editWeChatModel: false,
      editNameModel:false,
      userNames: 'kyumin',
      pwds: '123434',
      userQQ:'未填写',
      WeChat:'未填写',
      formQq: {
        qq: ''
      },
      formWeChat: {
        WeChat: ''
      },
      formName:{
        userName:''
      },
      userInfo:[],
      rules:{
      	qq:[{
      		required: true,
					message: '请输入QQ',
					trigger: 'blur'
      	}],
      	WeChat:[{
      		required: true,
					message: '请输入微信',
					trigger: 'blur'}],
      	userName:[{
      		required: true,
					message: '请输入姓名',
					trigger: 'blur'}],
}
}
},
created() {
		this.getHome()
	},
	methods: {
		//初次加载
		getHome() {
			let _this = this
			let param = {
				Id: sessionStorage.getItem('userId')
			}
      getIndex(param).then((res)=>{
        _this.userNames = res.data[0].name
        _this.userQQ = res.data[0].qq
        _this.WeChat = res.data[0].wecate
        _this.formWeChat.WeChat = res.data[0].wecate
        _this.formQq.qq = res.data[0].qq
        _this.formName.userName = res.data[0].name
      })
		},
    //  修改QQ弹窗
    editQqHandel () {
      let _this = this
      _this.editQqModel = true
    },
    //  修改微信
    editWeChatHandel () {
      let _this = this
      _this.editWeChatModel = true
    },
    // 修改名称弹窗
    editHandel(){
      let _this = this
      _this.editNameModel = true
    },
    //修改QQ确定
    editQQ(formName){
    	let _this = this
    	let param = {
    		Id:sessionStorage.getItem('userId'),
    		QQ:_this.formQq.qq
    	}
    	_this.$refs[formName].validate((valid)=>{
    		if(valid){
          updateQQ(param).then(res=>{
            if(res.data.Code === 'ok'){
            	_this.userQQ = res.data.Data
            	_this.$message({
            		type:'success',
            		message:res.data.Msg
            	})
            	_this.editQqModel = false
            }else{
              _this.$message({
                type:'error',
                message:res.data.Msg
              })
            }
          }).catch(err=>{
            console.log(err)
          })
    		}
    	})
    },
    //修改微信
      editWeChat(formName){
    	let _this = this
    	let param = {
    		Id:sessionStorage.getItem('userId'),
    		WeChat:_this.formWeChat.WeChat
    	}
    	_this.$refs[formName].validate((valid)=>{
    		if(valid){
          updateWeCatch(param).then((res)=>{
            if(res.data.Code==='ok'){
            	_this.WeChat=res.data.Data
            	_this.$message({
            		type:'success',
            		message:res.data.Msg
            	})
            	_this.editWeChatModel = false
            }else{
              _this.$message({
                type:'error',
                message:res.data.Msg
              })
            }
          }).catch(err=>{
            console.log(err)
          })
    		}
    	})
    },
    // 修改名称
    editName(formName){
      let _this = this
      let param = {
        Id:sessionStorage.getItem('userId'),
        Name:_this.formName.userName
      }
      _this.$refs[formName].validate((valid)=>{
        if(valid){
          updateName(param).then((res)=>{
            if(res.data.Code === 'ok'){
              _this.userNames = res.data.Data
              _this.$message({
                type:'success',
                message:res.data.Msg
              })
              _this.editNameModel = false
            }else{
              _this.$message({
                type:'error',
                message:res.data.Msg
              })
            }
          }).catch(err=>{
            console.log(err)
          })
        }
      })
    },
  }
}
</script>

<style scoped>
  .demo-ruleForm{
  	margin: 20px 50px 50px;
  }
  @media screen  and (max-width: 768px){
    .infoItem .names{
      font-size: 12px;
      margin-right: 10px;
    }
  }
</style>
