<template>
  <div>
    <div class="mt20 mb20">
      <span>首页</span>
      <span class="fg">/</span>
      <a>账户设置</a>
      <span class="fg">/</span>
      <span>安全设置</span>
    </div>
    <el-form class="userInfo">
      <!--<el-form-item label="邮箱" class="userList">
				<el-form-item>
					<span>79434334@qq.com</span>
					<span class="tips">绑定密保邮箱后可用于找回密码~</span>
					<span class="editBtn edit1" @click="editEmailHandel"><i class="el-icon-edit"></i>修改</span>
				</el-form-item>
			</el-form-item>-->
      <el-form-item label="手机" class="userList">
        <el-form-item>
          <span>{{userPhone}}</span>
          <span class="tips">手机可用于登录系统，找回密码，请勿泄露手机信息~</span>
          <span class="editBtn edit1" @click="editPhoneHandel"><i class="el-icon-edit"></i>修改</span>
        </el-form-item>
      </el-form-item>
    </el-form>
    <!--  修改邮箱-->
    <!-- <el-dialog title="修改邮箱" :visible.sync="editEmailModel" width="30%" center :close-on-click-modal="false">
			<el-form :model="formEmail" ref="formEmail" class="demo-ruleForm">
				<el-form-item>
					<span class="col9">为了保障您的帐号安全，变更信息前需验证身份</span>
				</el-form-item>
				<el-form-item>
					<span>794088**4@qq.com</span>
				</el-form-item>
				<el-form-item>
					<el-row>
						<el-col :span="12">
							<el-input v-model="formEmail.code" placeholder='请输入验证码'></el-input>
						</el-col>
						<el-col :span="12">
							<el-button type='primary'>获取验证码</el-button>
						</el-col>
					</el-row>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
          <el-button type="primary" @click='newEmail'>下一步</el-button>
          <el-button @click="editEmailModel=false">取消</el-button>
        </span>
		</el-dialog> -->
    <!--验证新邮箱-->
    <!-- <el-dialog title="修改邮箱" :visible.sync="editNewEmailModel" width="30%" center :close-on-click-modal="false">
			<el-form :model="formNewEmail" ref="formNewEmail" class="demo-ruleForm">
				<el-form-item>
					<span class="col9">为了保障您的帐号安全，请完成邮箱验证</span>
				</el-form-item>
				<el-form-item prop="email">
					<el-input v-model="formNewEmail.email" placeholder='请输入新邮箱'></el-input>
				</el-form-item>
				<el-form-item>
					<el-row>
						<el-col :span="14">
							<el-input v-model="formNewEmail.code" placeholder='请输入验证码'></el-input>
						</el-col>
						<el-col :span="10">
							<el-button type='primary'>获取验证码</el-button>
						</el-col>
					</el-row>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
          <el-button type="primary">确定</el-button>
          <el-button @click="editNewEmailModel=false">取消</el-button>
        </span>
		</el-dialog> -->
    <!--修改手机号-->
    <el-dialog title="修改手机号" :visible.sync="editPhoneModel" width="40%" center :close-on-click-modal="false">
      <el-form :model="formPhone" ref="formPhone" class="demo-ruleForm">
        <el-form-item>
          <span class="col9">为了保障您的帐号安全，变更信息前需验证身份</span>
        </el-form-item>
        <el-form-item label="手机号">
          <span>{{userPhone}}</span>
        </el-form-item>
        <el-form-item prop='code' :error="errorMsg">
          <el-row>
            <el-col :span="12">
              <el-input v-model="formPhone.code" placeholder='请输入验证码' @change="phoneCode"></el-input>
            </el-col>
            <el-col :span="12">
              <el-button type='primary' @click='getPhoneCode' :disabled='codedisabled'>
                <span v-show="show">获取验证码</span>
                <span v-show='!show'>{{count}}秒</span>
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click='newPhone' :disabled='disabled'>下一步</el-button>
        <el-button @click="editPhoneModel=false">取消</el-button>
      </span>
    </el-dialog>
    <!--验证新手机-->
    <el-dialog title="修改手机" :visible.sync="editNewPhoneModel" width="35%" center :close-on-click-modal="false">
      <el-form :model="formNewPhone" ref="formNewPhone" :rules='rules' class="demo-ruleForm" status-icon>
        <el-form-item>
          <span class="col9">为了保障您的帐号安全，请完成手机验证</span>
        </el-form-item>
        <el-form-item prop="phone" label="新手机号">
          <el-input v-model="formNewPhone.phone" placeholder='请输入新手机号'></el-input>
        </el-form-item>
        <el-form-item prop='code' :error='errorMsg'>
          <el-row class="mt10">
            <el-col :span="12">
              <el-input v-model="formNewPhone.code" placeholder='请输入验证码'></el-input>
            </el-col>
            <el-col :span="12">
              <el-button type='primary' v-if="!formNewPhone.phone && codeIs== '1'" disabled>
                <span>获取验证码</span>
                <!-- <span v-show='!show'>{{count2}}秒</span> -->
              </el-button>
              <el-button type='primary' v-if="formNewPhone.phone && codeIs== '1'" @click='getNewPhoneCode'>
                <span>获取验证码</span>
                <!-- <span v-show='!show'>{{count2}}秒</span> -->
              </el-button>
              <el-button v-if="codeIs == '2'" type='primary' disabled>
                <!-- <span v-show="show">获取验证码</span> -->
                <span v-show='!show'>{{count2}}秒</span>
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="!formNewPhone.code" type="primary" disabled>确定</el-button>
        <el-button v-else type="primary" @click='newPhoneComfir'>确定</el-button>
        <el-button @click="editNewPhoneModel=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    updatePhoneCode,
    updateNewPhoneCode,
    updatePhone,
    getIndex,
    oldPhoneCode
  } from '@/request/api'
  export default {
    name: 'securitySet',
    data() {
      // 手机号
      let validatePhone = (rule, value, callback) => {
        const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
        if (reg.test(value)) {
          callback()
          this.codedisabled = false
        } else {
          this.codedisabled = true
          callback(new Error('请输入正确的手机号'))
        }
      }
      return {
        codeIs: 1,
        disabled: true,
        codedisabled: false,
        count: '',
        count2: '',
        show: true,
        errorMsg: '',
        editEmailModel: false,
        editPhoneModel: false,
        editNewEmailModel: false,
        editNewPhoneModel: false,
        userNames: 'kyumin',
        userPhone: '',
        userEmail: '未填写',
        phone: '',
        formName: {
          names: ''
        },
        formPhone: {
          code: ''
        },
        formNewPhone: {
          phone: '',
          code: ''
        },
        rules: {
          phone: [{
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              validator: validatePhone,
              trigger: 'change'
            }
          ],
          code: [{
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.getInit()
    },
    methods: {
      //初次加载
      getInit() {
        let _this = this
        let param = {
          Id: sessionStorage.getItem('userId')
        }
        getIndex(param).then((res) => {
          let phone = res.data[0].phone
          _this.phone = res.data[0].phone
          _this.userPhone = phone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")
        })
      },
      // 下一步按钮显示
      phoneCode() {
        let _this = this
        let code = _this.formPhone.code
        if (code != '') {
          _this.disabled = false
        } else {
          _this.disabled = true
        }
      },
      //旧手机号获取手机验证码
      getPhoneCode() {
        let _this = this
        const TIME_COUNT = 60
        let param = {
          Phone: _this.phone
        }
        updatePhoneCode(param).then(res => {
          if (res.data.Code == 'ok') {
            _this.$message({
              message: res.data.Data,
              type: 'success'
            })
            _this.codeModal = false
            if (!_this.timer) {
              _this.count = TIME_COUNT;
              _this.show = false;
              _this.timer = setInterval(() => {
                if (_this.count > 0 && _this.count <= TIME_COUNT) {
                  _this.count--;
                  _this.codedisabled = true
                } else {
                  _this.show = true;
                  _this.codedisabled = false
                  clearInterval(_this.timer); // 清除定时器
                  _this.timer = null;
                }
              }, 1000)
            }
          }
        })
      },
      //新手机号获取手机验证码
      getNewPhoneCode() {
        let _this = this
        const TIME_COUNTS = 60
        let param = {
          Phone: _this.formNewPhone.phone
        }

        updateNewPhoneCode(param).then(res => {
          if (res.data.Code == 'ok') {
            _this.$message({
              message: res.data.Data,
              type: 'success'
            })
            _this.codeIs = 2
            _this.codeModal = false
            _this.show = false
            if (!_this.timers) {
              _this.count2 = TIME_COUNTS;
              _this.show = false;
              _this.timers = setInterval(() => {
                if (_this.count2 > 0 && _this.count2 <= TIME_COUNTS) {
                  // _this.codedisabled = true
                  _this.count2--;
                } else {
                  _this.codeIs = 1
                  _this.show = true;
                  // _this.codedisabled = false
                  clearInterval(_this.timers); // 清除定时器
                  _this.timers = null;
                }
              }, 1000)
            }
          } else {
            _this.$message({
              message: res.data.Msg,
              type: 'error'
            })
          }
        })
      },
      //新手机验证提交
      newPhoneComfir() {
        let _this = this
        let param = {
          Id: parseInt(sessionStorage.getItem('userId')),
          Phone: _this.formNewPhone.phone,
          Code: _this.formNewPhone.code
        }
        clearInterval(_this.timers)
        updatePhone(param).then(res => {
          if (res.data.Code === 'ok') {
            let newPhone = res.data.Data
            _this.userPhone  = newPhone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")
            _this.$message({
              type: 'success',
              message: res.data.Msg
            })
            _this.editNewPhoneModel = false
          } else {
            _this.$message({
              type: 'error',
              message: res.data.Msg
            })
          }
        })
      },
      //  修改邮箱弹窗
      editEmailHandel() {
        let _this = this
        _this.editEmailModel = true
      },
      //  修改手机号
      editPhoneHandel() {
        let _this = this
        _this.editPhoneModel = true
      },
      //验证新邮箱
      newEmail() {
        let _this = this
        _this.editEmailModel = false
        _this.editNewEmailModel = true
      },
      //旧手机验证码验证是否正确下一步按钮
      newPhone() {
        let _this = this
        let param = {
          Code: _this.formPhone.code
        }
        clearInterval(_this.timer);
        oldPhoneCode(param).then(res => {
          if (res.data.Code == 'ok') {
            _this.editPhoneModel = false
            _this.editNewPhoneModel = true
            _this.disabled = true
            _this.show = true
          } else {
            _this.$message({
              type: 'error',
              message: res.data.Msg
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .demo-ruleForm {
    margin: 20px 50px 50px;
  }
</style>
