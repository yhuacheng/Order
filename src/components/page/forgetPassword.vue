<template>
	<div class="loginBox">
		<div class="navCon">
			<div class="navHead">
				<div class="navImg login">
					<div class="imgBox">
						<img src="/src/assets/image/logo.png" class="img-log" />
					</div>
				</div>
				<div class="navRightBox loginRi">
					<el-menu :default-active="onRoutes" background-color="#2F4056" text-color="#fff" active-text-color="#5FB878" class="el-menu-demo navBox" mode="horizontal" unique-opened router>
						<el-menu-item index="/login" class="loginIn"><i class="el-icon-user"></i>登录
						</el-menu-item>
						<el-menu-item index="/register" class="loginOut"><i class="el-icon-s-custom"></i>注册
						</el-menu-item>
					</el-menu>
				</div>
			</div>
		</div>
		<div class="loginMain">
			<el-tabs v-model="activeName">
				<el-tab-pane label="登录" name="first">
					
				</el-tab-pane>
				<el-tab-pane label="找回密码" name="second">
					<div>
						<el-button type='primary' size='small'>通过邮箱找回</el-button>
						<el-button type='primary' size='small'>通过手机找回</el-button>
					</div>
					<!--      <img :src="imgCode" alt="" class="avatar">-->
					<el-form :model="forgetEmail" ref="forgetEmail" label-width="80px" class="demo-ruleForm" status-icon>
						<el-input placeholder="请输入邮箱" v-model="forgetEmail.email">
							<template slot="prepend">邮箱</template>
						</el-input>
						<el-input placeholder="请输入图形码" v-model="forgetEmail.imgCode">
							<template slot="prepend">图形码</template>
						</el-input>
					</el-form>
				</el-tab-pane>
			</el-tabs>
		</div>
		<div class="footer">
			<div>2019 © 版权所有</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				activeName: 'second',
				forgetEmail:{
					email:'',
					imgCode:''
				}
			}
		}
	}
</script>

<style scoped>
	.loginBox {
		width: 100%;
		height: 100%;
		background: #f2f2f2;
	}
	
	.loginMain {
		background: #fff;
		padding: 30px;
	}
	
	.footer {
		margin-top: 50px;
		padding-top: 80px;
		border-top: #e2e2e2 solid 1px;
		text-align: center;
	}
</style>