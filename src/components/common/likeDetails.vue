<template>
	<div>
		<el-card>
			<ul>
				<li>
					<span>终端类型：</span>
					<span>{{viewTaskData.Device}}</span>
				</li>
				<li>
					<el-row>
						<el-col :span="5" :xs="5" class="mb20">
							<span>订单号</span>
						</el-col>
						<el-col :span="5" :xs="5" class="mb20">
							<span>链接地址</span>
						</el-col>
						<el-col :span="3" :xs="4">
							<span>选项操作</span>
						</el-col>
						<el-col :span="3" :xs="3">
							<span>数量</span>
						</el-col>
						<el-col :span="3" :xs="3">
							<span>服务费</span>
						</el-col>
						<el-col :span="5" :xs="4">
							<span>开始时间</span>
						</el-col>
					</el-row>
				</li>
				<li>
					<el-row v-for="(item,index) in viewTaskData.LikeTasks" :key='index'>
						<el-col :span="5" :xs="6" class="mb20">
							<span>{{item.OrderId}}</span>
						</el-col>
						<el-col :span="5" :xs="6" class="mb20">
							<span>{{item.LinkURL}}</span>
						</el-col>
						<el-col :span="3" :xs="7">
							<span>{{item.Action}}</span>
						</el-col>
						<el-col :span="3" :xs="6">
							<span>{{item.Amount}}</span>
						</el-col>
						<el-col :span="3" :xs="5">
							<span>{{item.Fee}}</span>
						</el-col>
						<el-col :span="5" :xs="5">
							<span>{{item.StartTime}}</span>
						</el-col>
					</el-row>
				</li>
				<li>合计：￥<span class="colred fz20">{{viewTaskData.TotalPrice}}</span></li>
			</ul>
		</el-card>
	</div>
</template>

<script>
	export default{
		props: ["viewTaskData"]
	}
</script>

<style scope>
	li{
		list-style: none;
		line-height: 36px;
		margin-bottom: 8px;
	}

</style>