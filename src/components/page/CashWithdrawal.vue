<template>
	<div>
		<div class="mb20 mt20 tabsTxt">
			<span>首页</span>
			<span class="fg">/</span>
			<span>提现</span>
		</div>
		<div class="balanceBox mb20">
			<div class="ml30 mr30">账户余额</div>
			<div>￥<span class="money">{{balance}}</span></div>
			<div class="ml30">
				<div v-if="balance<=0">
					<el-tooltip placement="top" effect="light" popper-class="tipBox">
						<div slot="content" class="fz14">不可提现原因<br/><span class="col9 reason">可提现金额不足</span></div>
						<el-button type="info" size="medium">立即提现</el-button>
					</el-tooltip>
				</div>
				<div v-else>
					<el-button type="primary" size="medium" @click="cashWith">立即提现</el-button>
				</div>
			</div>
		</div>
		<div class="searchBox">
			<el-form :model="cashSearchForm" :inline="true" label-width="80px" class="form-item">
				<div>
					<el-form-item label="提现状态">
						<el-radio-group v-model="cashSearchForm.status">
							<el-radio label="0">全部</el-radio>
							<el-radio label="1">已申请</el-radio>
							<el-radio label="2">已完成</el-radio>
							<el-radio label="3">失败</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="交易时间">
						<el-date-picker class="mb10" v-model="cashSearchForm.startTime" type="date" placeholder="选择开始时间" value-format="yyyy-MM-dd" :picker-options="pickerStartDate"></el-date-picker>
						<el-date-picker v-model="cashSearchForm.endTime" type="date" placeholder="选择结束时间" value-format="yyyy-MM-dd" :picker-options="pickerEndDate"></el-date-picker>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="业务编码" class="labelNum">
						<el-input v-model="cashSearchForm.DealId" style="width: 220px" placeholder="请输入业务编码"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="medium" class="ml30" @click='searchData'>搜索</el-button>
						<el-button size="medium" @click="resetForm">重置</el-button>
					</el-form-item>
				</div>
			</el-form>
		</div>
		<el-table :data="allCashData" border style="width: 100%" :header-cell-style="{background:'#eef1f6'}">
			<el-table-column prop="RemoveMoenyNumber" label="业务编码" align="center"></el-table-column>
			<el-table-column prop="Bank" label="开户银行" align="center"></el-table-column>
			<el-table-column prop="BankName" label="开户名" align="center"></el-table-column>
			<el-table-column prop="BankAccount" label="开户银行账号" align="center"></el-table-column>
			<el-table-column prop="RemoveMoeny" label="提现金额(￥)" align="center"></el-table-column>
			<el-table-column prop="RemoveMoenyTime" label="提现时间" align="center"></el-table-column>
			<el-table-column prop="RemoveMoenyStae" label="提现状态" align="center" :formatter="statusTxt"></el-table-column>
			<el-table-column label="操作" align="center" width="100">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top" v-if='scope.row.Status=="拒绝"'>
								<p style="width: 300px;">{{ scope.row.BankName }}</p>
								<div slot="reference" class="name-wrapper">
									<el-tag size="medium">查看原因</el-tag>
								</div>
							</el-popover>
						</template>
					</el-table-column>
		</el-table>
    <div class="mt30 txtRight">
    	<el-pagination background @size-change='handleSizeChange' @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    	</el-pagination>
    </div>
		<!--提现-->
		<el-dialog title='提现' :visible.sync='CashWithdrawalModal' :close-on-click-modal="false" :before-close="closeModel">
			<el-form :model="cashForm" ref="cashForm" label-width='120px' :rules="rules" status-icon>
				<el-form-item label='开户名' prop="BankName">
					<el-input v-model='cashForm.BankName' placeholder="请输入开户名"></el-input>
				</el-form-item>
				<el-form-item label='开户银行' prop="Bank">
					<el-input v-model='cashForm.Bank' placeholder="请输入开户银行"></el-input>
				</el-form-item>
				<el-form-item label='开户银行账号' prop="BankAccount">
					<el-input v-model='cashForm.BankAccount' placeholder="请输入开户银行账号"></el-input>
				</el-form-item>
				<el-form-item label='提现金额' prop='removeMoney'>
					<el-input v-model='cashForm.removeMoney' placeholder="请输入提现金额"></el-input>
				</el-form-item>
			</el-form>
			<span slot='footer' class="dialog-footer">
    		<el-button type='primary' @click="comfirCash('cashForm')">确定</el-button>
    		<el-button @click="closeModel">取消</el-button>
    	</span>
		</el-dialog>
	</div>
</template>

<script>
	import vali from '../common/validate'
  import {cashWith,cashWithList} from '@/request/api'
	export default {
		name: 'CashWithdrawal',
		data() {
			var checkMoney = (rule, value, callback) => {
				const reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
				if(!value) {
					return callback(new Error('提现金额不能为空'));
				} else if(!reg.test(value)) {
					callback(new Error('提现金额格式不正确'));
				} else if(parseFloat(value) > parseFloat(this.balance)) {
					callback(new Error('提现金额不能大于余额'));
				} else {
					callback();
				}
			};
			return {
        total:0,
        currentPage:1,
        pageSize:10,
				balance: 0,
				pickerEndDate: this.pickerOptionsEnd(),
				pickerStartDate: this.searchStartDate(),
				allCashData: [],
				CashWithdrawalModal: false,
				cashSearchForm: {
					status: '0',
					startTime: '',
					endTime: '',
					DealId: ''
				},
				cashForm: {
					BankName: '',
					BankAccount: '',
					Bank: '',
					removeMoney: ''
				},
				rules: {
          BankName:[{
            required: true,
            message:'请输入开户名',
            trigger:'blur'
          }],
					Bank: [{
						required: true,
						message: '请输入开户银行',
						trigger: 'change'
					}],
					BankAccount: [{
						required: true,
						message: '请输入开户银行账号',
						trigger: 'change'
					}],
					removeMoney: [{
							required: true,
							message: '请输入提现金额',
							trigger: 'change'
						},
						{
							validator: checkMoney,
							trigger: 'change'
						}
					]
				}
			}
		},
		created() {
			this.cashList()
			this.getName()
		},
		methods: {
      // 分页导航
      handleCurrentChange(val) {
      	let _this = this
      	_this.currentPage = val
      },
      //每页条数
      handleSizeChange(val) {
      	let _this = this
      	_this.pageSize = val
      	_this.offset = val
      	// _this.handleCurrentChange(_this.currentPage)
      },
			//状态转文字
			statusTxt(val){
				if(val.RemoveMoenyStae == 1) {
					return '已申请'
				} else if(val.RemoveMoenyStae == 2) {
					return '已完成'
				}else if(val.RemoveMoenyStae == 3){
          return '失败'
        }
			},
			//获取用户名
			getName() {
				let _this = this
				_this.cashForm.AccountName = sessionStorage.getItem('userName')
				_this.balance = sessionStorage.getItem('balance')
			},
			//提现明细列表
			cashList() {
				let _this = this
				let param = {
					userId: sessionStorage.getItem('userId'),
					statetime:_this.cashSearchForm.startTime,
					endtime:_this.cashSearchForm.endTime,
					kWord:_this.cashSearchForm.DealId,
          state:_this.cashSearchForm.status,
          pageNum:_this.currentPage,
          pagesize:_this.pageSize
				}
        cashWithList(param).then((res)=>{
          _this.allCashData = res.data.list
          _this.total = parseInt(res.data.total)
        })
			},
			//立即提现
			cashWith() {
				let _this = this
				_this.CashWithdrawalModal = true
			},
			//提现确定
			comfirCash(formName) {
				let _this = this
				let param = {
					Id: sessionStorage.getItem('userId'),
					BankName: _this.cashForm.BankName,
					Bank: _this.cashForm.Bank,
					BankAccount: _this.cashForm.BankAccount,
					removeMoney: _this.cashForm.removeMoney,
				}
				_this.$refs[formName].validate((valid) => {
					if(valid) {
            cashWith(param).then((res)=>{
              _this.$message({
              	type: 'success',
              	message: res.data.Msg
              })
              _this.$refs['cashForm'].resetFields()
              _this.CashWithdrawalModal = false
              _this.cashList()
            })
					}
				})
			},
			//关闭提现弹窗
			closeModel() {
				let _this = this
				_this.CashWithdrawalModal = false
				_this.cashForm = {
					AccountName: '',
					accountBank: '',
					accountBankNumber: '',
					CashWithdrawal: ''
				}
			},
			// 搜索开始时间
			searchStartDate() {
				return {
					disabledDate: time => {
						let endDateVal = this.cashForm.endTime
						if(endDateVal) {
							return time.getTime() > new Date(endDateVal).getTime()
						}
					}
				}
			},
			// 搜索下单结束时间
			pickerOptionsEnd() {
				return {
					disabledDate: time => {
						let beginDateVal = this.cashForm.startTime
						if(beginDateVal) {
							return(
								time.getTime() <
								new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
							)
						}
					}
				}
			},
			//搜索
			searchData(){
				let _this = this
				// let StartData = _this.cashSearchForm.startTime
				// let EndDate = _this.cashSearchForm.endTime
				// let DealId = _this.cashSearchForm.DealId
				_this.cashList()
			},
			//重置
			resetForm(){
				let _this = this
				_this.cashSearchForm ={
					startTime:'',
					endTime:'',
					DealId:'',
          status:'0'
				}
				_this.cashList()
			}
		}
	}
</script>

<style scoped>
	@import '../../assets/css/mystyle.css';
</style>
