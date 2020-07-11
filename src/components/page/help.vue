<template>
	<div class="mb20 mt20 tabsTxt">
		<span>首页</span>
		<span class="fg">/</span>
		<span>帮助中心</span>
		<div>
			<ul class="article-list">
				<li class="articleItem" @click="viewDetail" v-for="(item,index) in helpList" :key='index'>
					<h4>{{item.Subject}}</h4>
					<p>{{item.Details}}</p>
					<div class="art-time">
						<span>{{item.CreateTime}}</span>
						<el-button size="small">查看全文</el-button>
					</div>
				</li>
			</ul>
			<div class="mt30">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'help',
		data() {
			return {
				pageSize:0,
				total:0,
				addVisible: false,
				currentPage4: 4,
				helpList: []
			}
		},
		created() {
			this.getData()
		},
		methods: {
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`)
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`)
			},
			viewDetail(index) {
				let _this = this
				let helpId = _this.helpList[index].Id
				_this.$router.push({name:'/helpDetails',param:{helpId:helpId}})
			},
			//初始化数据
			getData() {
				let _this = this
				let param = {
					SessionId: sessionStorage.getItem('sessionid')
				}
				_this.axios.post(_this.GLOBAL.BASE_URL + '/api/doHelpCenter', param).then(res => {
					if(res.data.status == 200) {
						_this.helpList = res.data.data.Helps
						_this.total=res.data.TotalPage
						_this.pageSize = res.data.ToPage
					}
					if(res.data.status == 400) {
						_this.$message({
							type: 'error',
							message: '登录过期，请重新登录'
						})
						_this.$router.push({name:'index',params:{indexShow: false}})
						sessionStorage.clear()
					} else if(res.data.status == 500) {
						_this.$message({
							type: 'error',
							message: '系统异常'
						})
					}
				})
			}
		}
	}
</script>

<style scoped>

</style>