<template>
  <div>
    <div class="mt20 tabsTxt">
      <span>首页</span>
      <span class="fg">/</span>
      <span>详情</span>
    </div>
    <div class="helpMain">
      <h4 class="helpTitle mb20">{{helpDetails.Subject}}</h4>
      <ul class="articleDetail">
        <li>{{helpDetails.Details}}</li>
      </ul>
      <div class="mt20">
        <span class="art-time">{{helpDetails.CreateTime}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'helpDetails',
  data(){
  	return{
  		helpId:this.$route.param.data,
  		helpDetails:[]
  	}
  },
  created(){
  	this.getData()
  },
  methods:{
  	//获取详情信息
  	getData(){
  		let _this = this
  		let param ={
  			SessionId:sessionStorage.getItem('sessionid'),
  			HelpId:_this.helpId
  		}
  		_this.axios.post(_this.GLOBAL.BASE_URL+'/api/doViewHelp',param).then(res=>{
  			if(res.data.status==200){
  				_this.helpDetails = res.data.data.Help
  			}if(res.data.status==400){
  				_this.$message({
  					type:'error',
  					message:'登录过期，请重新登录！'
  				})
  				_this.$router.push({name:'index',params:{indexShow: false}})
  				sessionStorage.clear()
  			}
  		})
  	}
  }
}
</script>

<style scoped>

</style>
