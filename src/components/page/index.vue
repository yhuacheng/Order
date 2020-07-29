<template>
  <div>
    <div v-show="!indexShow">
      <div class="loginBox">
        <div class="navCon">
          <div class="navHead">
            <div class="navImg login">
              <div class="imgBox" @click='checkIndex'>
                <img src="../../assets/image/logo.png" class="img-log" />
              </div>
            </div>
          </div>
        </div>
        <div class="loginMain">
          <div>
            <el-row :gurre='20'>
              <el-col :span='12' :xs='24'>
                <div>
                  <img src="../../assets/image/log-in.png" alt="" style="width: 80%;" />
                </div>
              </el-col>
              <el-col :span='12' :xs='24' style='margin-top: 50px;'>
                <el-tabs v-model="forgetType" class='ml50' v-show='LoginShow==1' @tab-click="forgetClick">
                  <el-tab-pane label="登录" name="first">

                  </el-tab-pane>
                  <el-tab-pane label="找回密码" name="second">
                    <div>
                      <!-- <el-button :class="active === 1?'activeThis':''" size='small' @click="useEmail">通过邮箱找回</el-button> -->
                      <el-button size='small' class="activeThis">通过手机找回</el-button>
                    </div>
                    <el-form :model="forgetPhone" ref="forgetPhone" :rules='rules' status-icon v-show='switchTab ==1'
                      class="mt20">
                      <el-form-item class="disInline wid100" label='手机号' prop='PhoneNumber'>
                        <el-input placeholder="请输入手机号" v-model="forgetPhone.PhoneNumber">
                        </el-input>
                      </el-form-item>
                      <el-form-item label='验证码' prop='VerificationCode'>
                        <el-input placeholder="请输入验证码" v-model="forgetPhone.VerificationCode">
                        </el-input>
                        <el-button v-if="!forgetPhone.PhoneNumber" type='primary' class='mt10' size='medium' disabled>
                          <span v-show="show">获取验证码</span>
                        </el-button>
                        <el-button v-else type='primary' class='mt10' size='medium' :disabled='getPhonePwd' @click='getPhoneCodeForget'>
                          <span v-show="show">获取验证码</span>
                          <span v-show='!show'>{{count}}秒</span>
                        </el-button>
                      </el-form-item>
                      <el-form-item>
                        <el-button type='primary' class='confirmLogin' @click="RetrievePwdPhone('forgetPhone')">确定</el-button>
                      </el-form-item>
                    </el-form>
                    <el-form :model='resetPwdForm' ref='resetPwdForm' :rules="rules" status-icon v-show='switchTab==2'>
                      <el-form-item prop="newPwd" label='新密码'>
                        <el-input v-model="resetPwdForm.newPwd" maxlength='16' type="password" autocomplete="off"
                          placeholder='请输入新密码'>

                        </el-input>
                        <span class="tipTxt">6-16位英文字母和数字组成</span>
                      </el-form-item>
                      <el-form-item prop="comfirPwd" label='确认密码'>
                        <el-input v-model="resetPwdForm.comfirPwd" maxlength='16' type="password" autocomplete="off"
                          placeholder='请再次输入新密码'>
                        </el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type='primary' class='confirmLogin' @click="comfirPwdBtn('resetPwdForm')">确定</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
                <el-form :model="formLogin" ref="formLogin" :rules='rules' class="demo-ruleForm" status-icon v-show='LoginShow==2'>
                  <div class="txtCenter fz30">登录</div>
                  <el-form-item prop='' label='手机'>
                    <el-input placeholder="请输入手机号" v-model="formLogin.PhoneNumber">
                    </el-input>
                  </el-form-item>
                  <el-form-item prop='' label='密码'>
                    <el-input type='password' v-model="formLogin.passwords" placeholder='请输入密码'></el-input>
                  </el-form-item>
                  <el-form-item class="mt20">
                    <el-button type="primary" v-loading.fullscreen.lock="fullscreenLoading" @click="loginIn" class='confirmLogin'>立即登录</el-button>
                    <div class="flexBox">
                      <span class="forgetTxt" @click="register">立即注册</span>
                      <span class="forgetTxt2" @click="forgetPwd">忘记密码</span>
                    </div>
                  </el-form-item>
                </el-form>
                <el-form :model="formReg" ref="formReg" :rules="rules" class="demo-ruleForm demo-dynamic" status-icon
                  v-show='LoginShow==3'>
                  <div class="txtCenter fz30">注册</div>
                  <el-form-item prop="PhoneNumber" label='手机号'>
                    <el-input v-model="formReg.PhoneNumber" placeholder='请输入手机号'>
                    </el-input>
                  </el-form-item>
                  <el-form-item label='验证码'>
                    <el-input v-model="formReg.VerificationCode" placeholder='请输入验证码'>

                    </el-input>
                    <el-button v-if="!formReg.PhoneNumber" type="primary" size="medium" class='mt10' @click='getPhoneCode'
                      disabled>
                      <span v-show="show">获取验证码</span>
                      <!-- <span v-show='!show'>{{count}}秒</span> -->
                    </el-button>
                    <el-button v-else type="primary" size="medium" class='mt10' @click='getPhoneCode' :disabled='codedisabled'>
                      <span v-show="show">获取验证码</span>
                      <span v-show='!show'>{{count}}秒</span>
                    </el-button>
                  </el-form-item>
                  <el-form-item prop="passwords" label='密码'>
                    <el-input v-model="formReg.passwords" type='password' placeholder='请输入密码'>

                    </el-input>
                    <span class="tipTxt">6-16位英文字母和数字组成</span>
                  </el-form-item>
                  <el-form-item prop="confirmPassWord" label='确认密码'>
                    <el-input v-model="formReg.confirmPassWord" type='password' placeholder='请确认密码'>

                    </el-input>
                  </el-form-item>
                  <el-form-item label='推荐码'>
                    <el-input v-model="formReg.RecommendCode" placeholder='请输入推荐码'>

                    </el-input>
                  </el-form-item>
                  <!-- 			<el-form-item>
										<el-checkbox-group v-model="formReg.agreeService">
											<el-checkbox label="同意服务条款" class='col9' name="type"></el-checkbox>
										</el-checkbox-group>
									</el-form-item> -->
                  <el-form-item>
                    <el-button type="primary" @click="submitRegister('formReg')" class='confirmLogin'>立即注册</el-button>
                  </el-form-item>
                  <p>已有账号 <span class="forgetTxt" @click='loginBtn'>登录</span></p>
                </el-form>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="footer">
          <div>2020 © 版权所有</div>
        </div>
      </div>
    </div>
    <div class="index" v-show='indexShow'>
      <a name='index'></a>
      <div class="bannerBox">
        <div class="banner" ref='box'>
          <div class="headNav" :class="{'bgCol':1 == headBg}">
            <div class="navHeads">
              <div class="navImg login">
                <div class="imgBox">
                  <img src="../../assets/image/logo.png" class="img-log" />
                </div>
              </div>
              <div class="navRightBox loginRi">
                <ul class="navBox">
                  <li>
                    <a href="#index" :class="{'bgCol':1 == headBg}">首页</a>
                  </li>
                  <li>
                    <a href="#Solution" :class="{'bgCol':1 == headBg}">解决方案</a>
                  </li>
                  <li>
                    <a href="#about" :class="{'bgCol':1 == headBg}">关于我们</a>
                  </li>
                  <li>
                    <a class="loginBtn" @click="loginBtn" :class="{'bgCol':1 == headBg}">登录</a><span class="col">|</span>
                    <a class="registerBtn" @click="register" :class="{'bgCol':1 == headBg}">注册</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="bannerTxt">
            <p class="col p1">用Amzbuy 提升亚马逊销量</p>
            <p class="col p2">诚信，安全，简单，让电商更有价值</p>
            <el-button class='mt20 joinBtn' type='primary' @click='register'>立即加入</el-button>
          </div>
        </div>
      </div>
      <div class="itemBg">
        <a name='Solution'></a>
        <div class="proType">
          <p class="txtCenter fz30"><span class="fzTxtCol">解决方案</span></p>
          <p class="txtCenter fz16 txtCol mt20">诚信，安全，简单，让电商更有价值</p>
          <div class="mt50">
            <el-row>
              <el-col :span='8' :xs='24'>
                <div class="flexItem">
                  <div class="mr30 ml30">
                    <p><i class="el-icon-trophy iconFZ"></i></p>
                  </div>
                  <div>
                    <p class="typeItem">提升销售流量</p>
                    <p class="col9 mt20">amzBuy助力您的销售更上一层楼</p>
                  </div>
                </div>
              </el-col>
              <el-col :span='8' :xs='24'>
                <div class="flexItem nthTwo">
                  <div class="mr30 ml30">
                    <p><i class="el-icon-lock iconFZ"></i></p>
                  </div>
                  <div>
                    <p class="typeItem">一对一服务</p>
                    <p class="col9 mt20">尊享一对一专业运营指导服务，包教包会</p>
                  </div>
                </div>
              </el-col>
              <el-col :span='8' :xs='24'>
                <div class="flexItem nthThree">
                  <div class="mr30 ml30">
                    <p><i class="el-icon-aim iconFZ"></i></p>
                  </div>
                  <div>
                    <p class="typeItem">云端软件，无需部署</p>
                    <p class="col9 mt20 TypeDes">云端服务，无需复杂的安装和部署过程，注册即用</p>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <!--关于我们-->
      <div class="aboutUs">
        <a name='about'></a>
        <div class="aboutCon">
          <p class="txtCenter fz30 aboutTit"><span class="fzTxtCol">关于我们</span></p>
          <el-row class='aboutBox'>
            <el-col :span='12' :xs='24'>
              <img src="../../assets/image/about1.jpg" alt="" class="aboutLeftImg" />
            </el-col>
            <el-col :span='12' :xs='24' style='height: 100%;'>
              <div class="aboutUsDes" style='height: 50%;'>
                <p class="aboutDes">amzBuy研发团队，拥有精湛、深厚的技术功底，具有多年电商系统开发经验，专注于数据挖掘和跨境电商云服务开发。
                  管理团队，是一群资深外贸老炮，拥有超过10年的跨境电商实战与传统行业运营经验，充分了解跨境电商卖家的需求和行业发展方向，为您的跨境之路保驾护航。</p>
              </div>
              <div style="height: 50%;">
                <img src="../../assets/image/about2.jpg" style="height: 100%;width: 100%;" alt="" />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <!--联系我们-->
      <footer class="mt30">
        <div class='footerTit txtCenter '>
          <p class="fz20 col mb20">加入我们，为您节省99%的研发投入</p>
          <el-button type='warning' class='contactBtn' @click='register'>立即加入</el-button>
        </div>
        <!--<p class="footerTit fz20 col">加入我们，为您节省99%的研发投入</p>-->
        <p class="txtCenter footerTxt">Copyright ©2020 Buy System</p>
      </footer>
    </div>
  </div>
</template>

<script>
  import vali from '../common/validate'
  import {
    login,
    register,
    getCode,
    getPwdCode,
    retrievePassWord,
    resetPassWord
  } from '@/request/api'
  export default {
    data() {
      // 邮箱
      let validateEmail = (rule, value, callback) => {
        let reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        if (reg.test(value)) {
          callback()
          this.getEmailPwd = false
          this.phoneNumber = value
        } else {
          callback(new Error('请输入正确的邮箱'))
        }
      };
      // 手机号
      let validatePhone = (rule, value, callback) => {
        let _this = this
        const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
        if (value == '') {
          _this.codedisabled = true
          _this.getPhonePwd = true
          callback(new Error('请输入手机号'))
        } else if (reg.test(value)) {
          callback()
          _this.codedisabled = false
          _this.getPhonePwd = false
          console.log(_this.getPhonePwd)
        } else {
          _this.codedisabled = true
          _this.getPhonePwd = true
          callback(new Error('请输入正确的手机号'))
        }
      }
      //注册密码
      let validatePass = (rule, value, callback) => {
        let _this = this
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (_this.formReg.confirmPassWord !== '') {
          _this.$refs.formReg.validateField('confirmPassWord')
        } else if (value.length >= 6) {
          callback()
        } else {
          callback(new Error('密码必须由6-16个英文字母和数字的字符串组成'))
        }
      };
      //重新设置密码
      let validatePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else if (this.resetPwdForm.comfirPwd !== '') {
          this.$refs.resetPwdForm.validateField('comfirPwd')
        } else if (value.length >= 6) {
          callback()
        } else {
          return callback(new Error('密码必须由6-16个英文字母和数字的字符串组成'))
        }
      };
      //重新设置确认密码
      let validatePwd2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'))
        } else if (value !== this.resetPwdForm.newPwd) {
          return callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      };
      // <!--注册二次验证密码-->
      let validatePass2 = (rule, value, callback) => {
        let _this = this
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== _this.formReg.passwords) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      };
      //图形码
      let validateVerifycode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'))
        } else {
          callback()
        }
      };
      return {
        fullscreenLoading: false, //登录加载
        errorMsg: '', //图形码是否正确
        phoneMsg: '', //手机验证码是否正确
        getEmailPwd: true, // 通过邮箱找回密码验证
        getPhonePwd: true, //通过手机找回密码验证
        codedisabled: true, //获取验证码按钮
        codeModal: false, //图形码弹窗
        codeImg: '',
        indexShow: true,
        forgetType: 'second',
        typeShow: false,
        switchTab: 1,
        imgcodeTxt: '', //返回的验证码
        formReg: {
          PhoneNumber: '',
          passwords: '',
          confirmPassWord: '',
          imgsCode: '',
          VerificationCode: '',
          RecommendCode: null,
        },
        formLogin: {
          PhoneNumber: '',
          passwords: '',
          imgsCode: ''
        },
        forgetEmail: {
          email: null,
          imgsCode: '',
          VerificationCode: ''
        },
        forgetPhone: {
          PhoneNumber: null,
          imgsCode: '',
          VerificationCode: ''
        },
        //设置新密码
        resetPwdForm: {
          newPwd: '',
          comfirPwd: ''
        },
        rules: {
          email: [{
              required: true,
              message: '请输入邮箱地址',
              trigger: 'blur'
            },
            {
              validator: validateEmail,
              trigger: ['blur', 'change']
            }
          ],
          PhoneNumber: [
            //       {
            // 	required: true,
            // 	message: '请输入手机号',
            // 	trigger: 'blur'
            // },
            {
              validator: validatePhone,
              trigger: 'blur'
            }
          ],
          name: [{
            required: true,
            message: '请输入昵称',
            trigger: 'change'
          }],
          passwords: [{
              required: true,
              message: '请输入密码',
              trigger: 'change'
            },
            {
              pattern: /^[A-Za-z]+[0-9]+[A-Za-z0-9]*|[0-9]+[A-Za-z]+[A-Za-z0-9]*$/,
              message: '密码必须由6-16个英文字母和数字的字符串组成',
              trigger: 'change'
            }
          ],
          confirmPassWord: [{
              required: true,
              message: '请确认密码',
              trigger: 'change'
            },
            {
              validator: validatePass2,
              trigger: 'change'
            }
          ],
          verification2: [{
            required: true,
            trigger: 'blur',
            validator: validateVerifycode
          }],
          imgsCode: [{
            required: true,
            trigger: 'blur',
            validator: validateVerifycode
          }],
          VerificationCode: [{
            required: true,
            message: '请输入手机验证码',
            trigger: 'change'
          }]
        },
        setPwdRule: {
          newPwd: [{
              required: true,
              trigger: "change",
              message: '请输入新密码'
            },
            {
              pattern: '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$',
              message: '密码必须由6-16个英文字母和数字的字符串组成',
              trigger: 'change'
            }
          ],
          comfirPwd: [{
            validator: validatePwd2,
            trigger: 'blur'
          }]
        },
        timer: null,
        count: '',
        show: true,
        imgCode: 0,
        headBg: -1,
        LoginShow: 2
      }
    },
    created() {
      let _this = this
      let indexShow = this.$route.params.indexShow
      if (indexShow === undefined) {
        _this.indexShow = true
      } else {
        _this.indexShow = false
      }
    },
    mounted() {
      window.addEventListener("scroll", this.showIcon, true);
    },
    methods: {
      showIcon(e) {
        let _this = this
        let scrollTop = e.target.scrollTop
        if (
          scrollTop > 200
        ) {
          _this.headBg = 1
        } else {
          _this.headBg = -1
        }
      },
      //手机验证码验证
      phoneCodeVali(phonenumber, phoneCode) {
        let _this = this
        _this.phoneMsg = ''
        let sessionid = sessionStorage.getItem('sessionid')
        let param = {
          SessionId: sessionid,
          phonenumber: phonenumber,
          PhoneCode: phoneCode
        }
        _this.axios.post(this.GLOBAL.BASE_URL + '/api/phoneCodeValidation', param).then((res) => {
          if (res.data.status == 500) {
            _this.phoneMsg = res.data.message
          }
        })
      },
      // 忘记密码获取验证码
      getPhoneCodeForget() {
        let _this = this
        let param = {
          Phone: _this.forgetPhone.PhoneNumber
        }
        const TIME_COUNT = 60
        getPwdCode(param).then(res => {
          if (res.data.Code == 'ok') {
            _this.$message({
              type: 'success',
              message: res.data.Data
            })
            if (!_this.timer) {
              _this.count = TIME_COUNT;
              _this.show = false;
              _this.getPhonePwd = true
              _this.timer = setInterval(() => {
                if (_this.count > 0 && _this.count <= TIME_COUNT) {
                  _this.count--;
                } else {
                  _this.show = true;
                  _this.getPhonePwd = false
                  clearInterval(_this.timer); // 清除定时器
                  _this.timer = null;
                }
              }, 1000)
            }
          } else {
            _this.$message({
              type: 'error',
              message: res.data.Msg
            })
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // //获取手机验证码
      getPhoneCode() {
        let _this = this
        let param = {
          Phone: _this.formReg.PhoneNumber
        }
        const TIME_COUNT = 60
        getCode(param).then(res => {
          if (res.data.Code == 'ok') {
            _this.$message({
              type: 'success',
              message: res.data.Data
            })
            if (!_this.timer) {
              _this.count = TIME_COUNT;
              _this.show = false;
              _this.codedisabled = true
              _this.timer = setInterval(() => {
                if (_this.count > 0 && _this.count <= TIME_COUNT) {
                  _this.count--;
                } else {
                  _this.show = true;
                  _this.codedisabled = false
                  clearInterval(_this.timer); // 清除定时器
                  _this.timer = null;
                }
              }, 1000)
            }
          } else {
            _this.$message({
              type: 'error',
              message: res.data.Msg
            })
          }
        }).catch(error => {
          console.log(error)
        })
      },
      //手机设置新密码
      RetrievePwdPhone(formName) {
        let _this = this
        let param = {
          Phone: _this.forgetPhone.PhoneNumber,
          Code: _this.forgetPhone.VerificationCode
        }
        _this.$refs[formName].validate((vali) => {
          if (vali) {
            retrievePassWord(param).then(res => {
              if (res.data.Code == 'ok') {
                // _this.active = 4
                _this.switchTab = 2
              } else {
                _this.$message({
                  type: 'error',
                  message: res.data.Msg
                })
              }

            }).catch(err => {
              console.log(err)
            })

          } else {
            return false
          }
        })

      },
      //切换首页
      checkIndex() {
        let _this = this
        _this.indexShow = true
      },
      //登录
      loginBtn() {
        let _this = this
        _this.indexShow = false
        _this.LoginShow = 2
      },
      //注册
      register() {
        let _this = this
        _this.indexShow = false
        _this.LoginShow = 3
      },
      //忘记密码
      forgetPwd() {
        let _this = this
        _this.forgetType = 'second'
        _this.LoginShow = 1
        _this.switchTab = 1
      },
      //重新设置密码确定
      comfirPwdBtn(formName) {
        let _this = this
        let param = {
          Phone: _this.forgetPhone.PhoneNumber,
          Password: _this.resetPwdForm.newPwd,
          NewPassword: _this.resetPwdForm.comfirPwd
        }
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            resetPassWord(param).then(res => {
              if (res.data.Code == 'ok') {
                _this.$message({
                  type: 'success',
                  message: res.data.Msg
                })
                _this.LoginShow = 2
                // _this.typeShow = false
                // _this.active = 1
                _this.switchTab = 1
              } else {
                _this.$message({
                  type: 'error',
                  message: res.data.Msg
                })
              }
            }).catch(error => {
              console.log(error)
            })
          } else {
            return false
          }
        })
      },
      // 登录
      loginIn() {
        let _this = this
        _this.fullscreenLoading = true
        _this.$refs.formLogin.validate((valid) => {
          if (valid) {
            let param = {
              Phone: _this.formLogin.PhoneNumber,
              Password: _this.formLogin.passwords,
            }
            login(param).then((res) => {
              _this.fullscreenLoading = false
              if (res.data.Code == 'ok') {
                _this.$message({
                  message: res.data.Msg,
                  type: 'success'
                })
                let types = res.data.Data
                let datas = types.split(',')
                sessionStorage.setItem('userName', datas[1])
                sessionStorage.setItem('userId', datas[0])
                _this.$router.push('/')
              } else {
                _this.$message({
                  message: res.data.Msg,
                  type: 'error'
                })
              }
            }).catch((err) => {
              _this.fullscreenLoading = false
              console.log(error)
            })
          } else {
            _this.fullscreenLoading = false
            return false
          }
        })
      },
      //注册
      submitRegister(formName) {
        let _this = this
        let param = {
          Phone: _this.formReg.PhoneNumber,
          Password: _this.formReg.passwords,
          PhoneCode: _this.formReg.VerificationCode,
          Code: _this.formReg.RecommendCode
        }
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            register(param).then((res) => {
              if (res.data.Code === 'ok') {
                _this.$message({
                  message: res.data.Msg,
                  type: 'success'
                })
                _this.indexShow = false
                _this.LoginShow = 2

              } else {
                _this.$message({
                  message: res.data.Msg,
                  type: 'error'
                })
              }
            }).catch((error) => {
              console.log(error)
            })
          } else {
            return false
          }
        })
      },
      //忘记密码tab切换
      forgetClick(tab, event) {
        let _this = this
        if (tab.index == '0') {
          _this.switchTab = 1
          _this.LoginShow = 2
        } else {
          _this.typeShow = true
        }
      }
    }
  }
</script>

<style scoped>
  body {
    min-width: 1200px;
  }

  .confirmLogin {
    width: 100%;
    padding: 17px 20px;
    background: #26d9b3;
    border-color: #26d9b3;
  }

  .aboutUsDes {
    height: 50%;
    background: #4f4e4c;
    color: #fff;
  }

  .joinBtn {
    padding: 15px 50px;
    font-size: 16px;
  }

  .bannerLeft {
    position: relative;
    top: 0;
    left: 0;
    transform: rotate(-30deg) skew(25deg) scale(.8);
  }

  .bannerItem {
    position: absolute;
    display: inline-block;
    width: 360px;
    height: 640px;
    background-color: rgba(255, 255, 255, .8);
    /*transform: rotate(-160deg);*/
    transform: translate(120px, -120px)
  }

  .bannerLeft .item2 {
    top: 15px;
    left: 15px;
    background-color: rgba(255, 255, 255, .7);
  }

  .bannerLeft .item3 {
    top: 30px;
    left: 30px;
    background-color: rgba(255, 255, 255, .6);
  }

  .bannerLeft .item4 {
    top: 45px;
    left: 45px;
    background-color: rgba(255, 255, 255, .5);
  }

  .bannerLeft .item5 {
    top: 60px;
    left: 60px;
    background-color: rgba(255, 255, 255, .4);
  }

  .flexItem {
    display: flex;
    align-items: center;
    /*justify-content: center;*/
    background: #f2f2f2;
    /*padding: 50px 0;*/
    height: 192px;
    padding: 0 15px
  }

  .nthTwo {
    background: #ededed;
  }

  .nthThree {
    background: #e8e8e8;
  }

  .itemBg {
    width: 100%;
    background: #f8f9fa;
  }

  .fzTxtCol {
    color: #4f4e4c;
    position: relative;
    display: inline-block;
  }

  .fzTxtCol:before {
    content: '';
    position: absolute;
    top: 50%;
    left: -110px;
    width: 90px;
    height: 1px;
    background: #4f4e4c;
  }

  .fzTxtCol:after {
    content: '';
    position: absolute;
    top: 50%;
    right: -110px;
    width: 90px;
    height: 1px;
    background: #4f4e4c;
  }

  .identifybox {
    display: flex;
    justify-content: space-between;
    width: 120px;
    margin-top: 30px;
  }

  .iconstyle {
    color: #409EFF;
  }

  .headNav {
    width: 100%;
    height: 60px;
    background: transparent;
    position: fixed;
    top: 0;
    left: -17px;
    z-index: 9999;
    min-width: 1200px;
  }

  .nav li {
    display: inline-block;
    width: 100px;
    height: 60px;
    line-height: 60px;
  }

  .navHeads .navBox li {
    display: inline-block;
  }

  .navHeads .navBox li a {
    display: inline-block;
    color: #fff;
    width: 120px;
    font-size: 16px;
    height: 60px;
    line-height: 60px;
    cursor: pointer;
    text-align: center;
  }

  .navHeads .navBox a:hover {
    color: rgb(254, 203, 69);
  }

  .navHeads .navRightBox {
    width: 100%;
  }

  .navHeads .navBox .loginBtn,
  .navHeads .navBox .registerBtn {
    display: inline-block;
    width: 60px;
    text-align: center;
  }

  .loginBox {
    width: 100%;
    height: 100%;
    background: #f2f2f2;
  }

  .loginMain {
    background: #fff;
    padding: 30px;
    margin: 60px auto;
  }

  .footer {
    margin-top: 50px;
    padding: 80px 0;
    border-top: #e2e2e2 solid 1px;
    text-align: center;
  }

  .forgetTxt,
  .forgetTxt2 {
    cursor: pointer;
    color: #26D9B3;
  }

  .forgetTxt2 {
    color: #666;
  }

  .forgetTxt:hover,
  .forgetTxt2:hover {
    color: #0099F0;
  }

  .activeThis {
    color: #FFF;
    background-color: #26d9b3;
    border-color: #26d9b3;
  }

  .bgCol {
    background: #4f4e4c;
  }

  footer {
    width: 100%;
  }
</style>
