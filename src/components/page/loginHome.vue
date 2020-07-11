<template>
  <div>
    <div class="userBox mb20">
      <div class="panLeft">
        <img src="../../assets/image/headImg.jpg" class="headImg" />
      </div>
      <div class="bg-purple panRight">
        <div class="userMsg">
          <span>您好，</span>
          <span class="fz18">{{name}}</span>
        </div>
        <div>
          <span>账户余额:￥<span class="money">{{balance}}</span></span>
          <el-button class="el-button ml30" type="primary" @click='viewAccount'>查看明细</el-button>
          <el-button class="el-button cashWish" type="success" @click="cashMoney">提现</el-button>
        </div>
      </div>
    </div>
    <div class="boxBorder mb20">
      <el-row class='bgTask' v-for="(item,index) in taskNum" :key='index'>
        <el-col :span="6" :xs="24" class='txtCenter'>
          <div class="grid-content bg-purple taskBox" @click="goTask">
            <div class="items items1">
              <span class="count">{{Number(item.TotalCount)}}</span>
            </div>
            <div class="txtCenter col fz20 mt20">总任务</div>
          </div>
        </el-col>
        <el-col :span="6" :xs="24">
          <div class="grid-content bg-purple taskBox" @click="goTask">
            <div class="items items2">
              <span class="count">{{Number(item.HaveInHandByTask)}}</span>
            </div>
            <div class="txtCenter col fz20 mt20">进行中的任务</div>
          </div>
        </el-col>
        <el-col :span="6" :xs="24">
          <div class="grid-content bg-purple taskBox" @click="goTask">
            <div class="items items3">
              <span class="count">{{Number(item.CompleteTask)}}</span>
            </div>
            <div class="txtCenter col fz20 mt20">已完成的任务</div>
          </div>
        </el-col>
        <el-col :span="6" :xs="24">
          <div class="grid-content bg-purple taskBox" @click="goTask">
            <div class="items items4">
              <span class="count">{{Number(item.CancelTask)}}</span>
            </div>
            <div class="txtCenter col fz20 mt20">已取消任务</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>公告</span>
      </div>
      <div class="text item" v-html='Notice'>
        <p>{{Notice}}</p>
      </div>
    </el-card>
    <!--提示-->
    <div class="errTip">
      <el-dialog title="提示" :visible.sync="errorModel" width="30%" center>
        <span>您有<span class="fz16 redRequired">{{userSmmary.weirdTasks}}</span>条异常信息，请前往处理！</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="toErrorList">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!--支付宝付款-->
    <el-dialog title="支付宝" :visible.sync="AlipayPaymentModal">
      <div class="txtCenter">
        <img class="alipayImg" src="../../assets/image/alipay.jpg" />
        <div class="mt20 colred fz20">充值到账，请联系客服</div>
      </div>
    </el-dialog>
    <!--银行卡付款-->
    <el-dialog title="银行卡" :visible.sync="bankPayModal" :close-on-click-modal="false" :before-close="closeModel">
      <p>请打款至以下指定账户</p>
      <div class="accountCon">
        <p>
          <span>户名：</span><span>{{bankPayForm.accountName}}</span>
        </p>
        <p>
          <span>银行名称：</span>
          <span>{{bankPayForm.openBank}}</span>
        </p>
        <p>
          <span>银行账号：</span>
          <span>{{bankPayForm.accountNumber}}</span>
        </p>
        <p>
          <span>识别码：</span>
          <span>{{bankPayForm.IdentificationCode}}</span>
          <span class="colred fz18">(请将识别码填写在转账备注信息内)</span>
        </p>
      </div>
      <div>到账时间一般为1-5个工作日,请留意账户余额变化.如有疑问请向客服咨询.</div>
      <span slot='footer' class="dialog-footer">
        <el-button @click="closeModel">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import bus from '../common/bus'
  import vali from '../common/validate'
  import {
    getIndex,
    orderSum,
    getNotice
  } from '@/request/api'
  export default {
    name: 'loginHome',
    data() {
      return {
        Notice: '', //公告内容
        platformId: 0,
        item: '1',
        errorModel: false,
        collapse: false,
        AlipayPaymentModal: false, //支付宝支付
        bankPayModal: false, //银行卡支付
        errorNum: '0',
        // hashBd: false,
        name: sessionStorage.getItem('userName'),
        times: sessionStorage.getItem('times'),
        balance: 0,
        homeData: [],
        userSmmary: [],
        tasksItems: [],
        //银行卡信息
        bankPayForm: {
          accountName: '',
          openBank: '',
          accountNumber: '',
          IdentificationCode: ''
        },
        postJson: {},
        taskNum: []
      }
    },
    created() {
      bus.$on('collapse', msg => {
        this.collapse = msg
      })
      // this.getSrc()
      this.isError()
      this.getNoticeData()
      this.getHome()
      this.getAllTaskNum()
    },
    computed: {
      role() {
        return this.name === 'admin' ? '超级管理员' : '普通用户'
      }

    },
    methods: {
      // 公告内容
      getNoticeData() {
        let _this = this
        getNotice().then(res => {
          _this.Notice = res.data[0].Notice
        }).catch(error => {
          console.log(error)
        })
      },

      //前往任务页面
      goTask() {
        this.$router.push('/taskManage')
      },

      //首页数据加载
      getHome() {
        let _this = this
        let param = {
          Id: sessionStorage.getItem('userId')
        }
        getIndex(param).then((res => {
          _this.homeData = res.data
          if (res.data[0].accountbalance == null) {
            res.data[0].accountbalance = 0
          } else {
            _this.balance = res.data[0].accountbalance
          }
          sessionStorage.setItem('userName', _this.homeData[0].name)
          sessionStorage.setItem('balance', _this.homeData[0].accountbalance)
        }));
      },
      // 首页任务总览
      getAllTaskNum() {
        let _this = this
        let param = {
          uid: sessionStorage.getItem('userId')
        }
        orderSum(param).then(res => {
          _this.taskNum = res.data.list
        }).catch(error => {
          console.log(error)
        })
      },
      //充值
      viewAccount() {
        let _this = this
        _this.$router.push('/accountManage')
      },
      isError() {
        let _this = this
        let err = _this.userSmmary.weirdTasks
        if (err > 0) {
          _this.errorModel = true
        }
      },

      //关闭银行卡充值弹窗
      closeModel() {
        let _this = this
        _this.bankPayModal = false
      },
      // 前往异常订单
      toErrorList() {
        this.$router.push({
          name: 'taskManage',
          params: {
            active: 7
          }
        })
      },
      // 更多任务
      moreTask() {
        let _this = this
        let status = true
        _this.$router.push({
          name: "taskManage",
          params: {
            taskTypeModel: true
          }
        })
      },
      // 提现
      cashMoney() {
        this.$router.push('/CashWithdrawal')
      },
      getSrc() {
        let _this = this
        if (_this.name === 'admin') {
          _this.hashBd = true
        } else {
          _this.hashBd = false
        }
      }
    }
  }
</script>

<style scoped>
  .accountCon {
    width: 85%;
    margin: 20px auto;
    padding: 20px;
    box-sizing: border-box;
    background: #eee;
  }

  .accountCon p {
    line-height: 40px;
  }

  .alipayImg {
    width: 350px;
  }

  .colred {
    color: #f00;
  }

  .el-row {
    margin-bottom: 20px;
  }

  .todo-item {
    font-size: 14px;
  }

  .todo-item-del {
    text-decoration: line-through;
    color: #999;
  }

  .isRed {
    display: inline-block;
    height: 100px;
    width: 100%;
    color: red;
  }

  .carItem {
    border-right: #ebedf2 solid 1px;
  }

  .carItem:nth-child(4),
  .carItem:nth-child(5) {
    border-right: none;
  }
</style>
