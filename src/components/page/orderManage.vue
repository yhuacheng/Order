<template>
  <div>
    <div class="mb20 mt20">
      <span><span>首页</span><span class="fg">/</span><a>订单管理</a></span>
    </div>
    <div class="searchBox">
      <el-form :model="searchForm" ref="searchForm" class="form-item" label-width="80px" :inline="true">
        <el-form-item label="国家">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="searchForm.checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(item,index) in cities" :label="item.Id" :key="index">{{item.CountryName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <div class="form-item">
          <el-form-item label="下单时间">
            <el-date-picker v-model="searchForm.orderStartTime" type="date" placeholder="选择开始时间" :picker-options="pickerStartDate"
              value-format="yyyy-MM-dd" class="mb10"></el-date-picker>
            <el-date-picker v-model="searchForm.orderEndTime" type="date" placeholder="选择结束时间" :picker-options="pickerEndDate"
              value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="搜索内容" class="labelNum">
            <el-input v-model="searchForm.Keyword" style="width: 220px" placeholder="单号,产品名称,ASIN,关键词"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click='searchOrder' size="medium">搜索</el-button>
            <el-button @click="resetTask" size="medium">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="tabBox">
      <div class="tabList">
        <ul class="tabBlock" v-for="(item,index) in allState" :key=index>
          <li :class="active === '' ? 'active':''" data-index="0" @click="getAllStatus">全部<span>({{item.TotalCount}})</span></li>
          <li :class="active === 1 ? 'active':''" data-index="1" @click="daiConfirm">待确认<span>({{item.TotalToBeParker}})</span></li>
          <li :class="active === 2 ? 'active':''" data-index="2" @click="daifp">待分配<span>({{item.TotalToBeAllocated}})</span></li>
          <li :class="active === 3 ? 'active':''" data-index="3" @click="yfp">已分配<span>({{item.TotalAlreadyAllocated}})</span></li>
          <li :class="active === 4 ? 'active':''" data-index="4" @click="ywc">已完成<span>({{item.TotalCompleted}})</span></li>
          <li :class="active === 5 ? 'active':''" data-index="5" @click="daiCancel">已取消<span>({{item.TotalCancel}})</span></li>
        </ul>
      </div>
      <div class="tabRight">
        <el-button type="primary" @click="createOrder">创建订单</el-button>
        <el-button type="warning" @click="exportExcel">导出订单</el-button>
      </div>
    </div>
    <div class="mt10 tableBg" style="overflow-x: auto">
      <el-table :data="allOrderData" id="exportTable" v-loading="loading" element-loading-text="拼命加载中" border style="width: 100%;font-size: 15px;"
        :header-cell-style="{background:'#eef1f6'}">
        <el-table-column prop="Id" label="订单编码" align="center" width="170">
          <template slot-scope="scope">
            <el-button type="text" @click="viewDetails(scope.$index,scope.row)">{{scope.row.OrderNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="CountryName" label="国家" align="center"></el-table-column>
        <el-table-column prop="ServiceType" label="订单类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.ServiceType==1">见单返</span>
            <span v-if="scope.row.ServiceType==2">评后返</span>
          </template>
        </el-table-column>
        <el-table-column prop="Number" label="任务数量" align="center"></el-table-column>
        <el-table-column prop="ShopName" label="店铺名称" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="ProductName" label="产品名称" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Asin" label="产品ASIN" align="center"></el-table-column>
        <el-table-column prop="ProductKeyword" label="关键词" align="center"></el-table-column>
        <el-table-column prop="Total" label="总价(¥)" align="center"></el-table-column>
        <el-table-column prop="OrderTime" label="下单时间" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" align="center" :formatter="txtOrderStatus"></el-table-column>
        <el-table-column label="操作" align="center" width="185">
          <template slot-scope="scope">
            <el-button size="small" @click="cancelHandel(scope.$index,scope.row)" type="danger" v-show="scope.row.state=='1'">取消</el-button>
            <el-button size="small" @click="createOrderAgain(scope.$index,scope.row)" type="primary">再来一单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt30 txtRight" v-if="total>0">
        <el-pagination background @size-change='handleSizeChange' @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50,100]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 创建订单 -->
    <el-dialog title="创建订单" :visible.sync="addTaskModal" width="90%" custom-class="fixed-dialog" :close-on-click-modal="false"
      :before-close="closeModel">
      <el-row>
        <el-col :span="16" :xs="24" :sm="24" :md="24" :lg="16">
          <el-form :model="taskForm" ref="taskForm" :rules="taskRule" class="demo-ruleForm" status-icon>
            <div class="mb20 fz16" style="border-bottom: 1px dashed #EEF1F6;padding-bottom: 15px;width: 90%;">产品信息</div>
            <el-col :span="12" :xs="24">
              <el-form-item label="下单类型" class="disInline minWid" prop="ServiceType">
                <el-select v-model="taskForm.ServiceType" placeholder="请选择" class="disInline wid100" @change="checkOrderType">
                  <el-option v-for="(item,index) in orderTypes" :key='index' :value="item.value" :label="item.label"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="国家" class="disInline minWid" prop="CountryId">
                <el-select v-model="taskForm.CountryId" placeholder="请选择" class="disInline wid100" @change='checkCountry'>
                  <el-option v-for="(item,index) in countryData" :key="index" :value="item.Id" :label="item.CountryName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="店铺名称" class="disInline minWid" prop="ShopName">
                <el-input type="text" v-model="taskForm.ShopName" placeholder="请输入店铺名称">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="产品ASIN" class="disInline minWid" prop="Asin">
                <el-input v-model="taskForm.Asin" maxlength="10" show-word-limit placeholder="长度为10的数字和字母组合"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="产品名称" class="disInline minWid" prop="ProductName">
                <el-input v-model="taskForm.ProductName" type='textarea' placeholder="请输入产品名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="产品链接" class="wid">
                <el-input type="textarea" v-model="taskForm.ProductLink" placeholder="请以http://或者https://开头"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <p class="lh40">产品评分</p>
              <el-form-item>
                <el-rate v-model="taskForm.ProductScore"></el-rate>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="产品价格" class="disInline minWid" prop="ProductPrice">
                <el-input type="text" v-model="taskForm.ProductPrice" @blur="getAddFee" placeholder="请输入产品价格">
                  <template slot="append">{{Currency}}</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :xs="24">
              <el-form-item label='产品图片' prop='ProductPictures' class="mt20 p-img">
                <el-upload class="avatar-uploader" name="image" :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess"
                  :on-error="handleError" :before-upload="beforeAvatarUpload" accept="image/jpeg,image/png,image/gif,image/bmp">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-input v-show="false" v-model='taskForm.ProductPictures'></el-input>
              </el-form-item>
            </el-col>
            <p style="clear: both;"></p>
            <div class="mb20 fz16 mt20" style="border-bottom: 1px dashed #EEF1F6;padding-bottom: 15px;width: 90%;">下单信息</div>
            <el-col :span="12" :xs="24">
              <el-form-item label="关键词类型" class="disInline minWid" prop='KeywordType'>
                <el-radio-group v-model="taskForm.KeywordType">
                  <el-radio label="1" value="2">产品关键词</el-radio>
                  <el-radio label="2" value="2">CPC关键词</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="关键词" class="disInline minWid" prop="ProductKeyword">
                <el-input v-model="taskForm.ProductKeyword" placeholder='请输入关键词'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="留评类型" class="disInline minWid" prop="ProductPosition">
                <el-select v-model="taskForm.ProductPosition" class="disInline wid100" placeholder="请选择" @change="lpType">
                  <el-option v-for="(item,index) in commentTypeData" :key="index" :value="item.Probability" :label="item.Probability"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="订单数量" class="disInline minWid" prop="Number">
                <el-input v-model="taskForm.Number" placeholder="请输入正整数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="任务开始时间" class="disInline minWid" prop="StartTime">
                <el-date-picker v-model="taskForm.StartTime" value-format="yyyy-MM-dd" style="display: inline-block;width: 100%;"
                  type="date" placeholder="选择日期" :picker-options="pickerOptions0">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span='12' :xs="24">
              <el-form-item label="任务结束时间" class="disInline minWid" prop="EndTime">
                <el-date-picker v-model="taskForm.EndTime" value-format="yyyy-MM-dd" style="display: inline-block;width: 100%;"
                  type="date" placeholder="选择日期" :picker-options="taskEndDate">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span='24' :xs="24">
              <el-form-item label='备注' prop='Remarks' style="width: 90%;">
                <el-input type='textarea' :autosize="{ minRows: 3, maxRows: 6}" v-model='taskForm.Remarks'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :xs="24" class="mt30">
              <div v-show="priceShow">
                <span class="spanTxt">产品总价：</span>
                <span class="colTxt labels fz20">￥{{productTotal}}</span>
                <span class="labels col9">(产品总价) = {{taskForm.ProductPrice}} (产品价格) * {{taskForm.Number}} (数量) *</span>
                <span class='col9'>{{ExRate}} (汇率)</span>
              </div>
              <div>
                <span class="spanTxt">服务费：</span>
                <span class="colTxt labels fz20">￥{{serviceFeeTotal}}</span>
                <span class="labels col9">(服务费) = {{serviceUnit}} (服务费单价) * {{taskForm.Number}} (数量) + {{addService}}
                  (增值费单价) * {{taskForm.Number}} (数量)</span>
              </div>
              <div>
                <span class="spanTxt">合计：</span>
                <span class="colTxt labels fz20">￥{{allTotal}}</span>
                <span class="labels col9">(合计) = <span v-show="priceShow">{{productTotal}} (产品总价) +</span>
                  {{serviceFeeTotal}}(服务费)</span>
              </div>
            </el-col>
          </el-form>
        </el-col>
        <el-col :span="8" :xs="24" :sm="24" :md="24" :lg="8" class="minRight">
          <div class="tabTitle fl mt20 mb20" @click="toggleRate" style="cursor: pointer;"><i class="el-icon-dish mr10"></i>汇率</div>
          <el-table :data="rateData" border style="width: 100%" v-show="rateTab">
            <el-table-column prop="CurrencyName" label="币种" align="center"></el-table-column>
            <el-table-column prop="CurrencySymbol" label="单位" align="center"></el-table-column>
            <el-table-column prop="ExchangeRate" label="汇率" align="center"></el-table-column>
          </el-table>
          <div class="tabTitle zengTit mt20 mb20" @click="toggleAddFree" style="cursor: pointer;"><i class="el-icon-coin mr10"></i>增值费</div>
          <el-table :data="addFreeData" border style="width: 100%" v-show="addFreeTab">
            <el-table-column prop="productPrice" label="产品价格区间" align="center"></el-table-column>
            <el-table-column prop="UnitPrice" label="增值费价格" align="center"></el-table-column>
          </el-table>
          <div class="tabTitle serviceTit mt20 mb20" @click="toggleService" style="cursor: pointer;"><i class="el-icon-guide mr10"></i>服务费</div>
          <el-table :data="serviceData" border style="width: 100%" v-show="serviceTab">
            <el-table-column prop="CountryName" label="国家" align="center"></el-table-column>
            <el-table-column prop="Probability" label="留评率" align="center" width='100'></el-table-column>
            <el-table-column prop="FeePrice" label="服务费单价" align="center" width='150'></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPay('taskForm')">确定</el-button>
        <el-button @click="closeModel">返回</el-button>
      </span>
    </el-dialog>

    <!--取消订单-->
    <el-dialog title="取消订单" :visible.sync="cancelModal" :close-on-click-modal="false" center="" width="30%">
      <div class="del-dialog-cnt">是否确定取消该订单？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click='cancelSubmit'>确定</el-button>
        <el-button @click="cancelModal=false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 付款-->
    <el-dialog title="付款" :visible.sync="paymentModel" :close-on-click-modal="false" width="40%" center=""
      :before-close="paymentClose">
      <el-row class="mb20 center">
        <el-col :span="12" :xs="24">
          <p>
            <span>当前余额：</span>
            <span class="colred fz20">￥{{paymentForm.balance}}</span>
          </p>
        </el-col>
        <el-col :span="12" :xs="24">
          <p>
            <span>待付款金额：</span>
            <span class="colred fz20 disInline">￥{{paymentForm.payMoney}}</span>
          </p>
        </el-col>
      </el-row>
      <div class="center mb20 fz18 mt20">请选择以下方式充值</div>
      <div v-for="(item,index) in paymentCode" :key='index' class="center">
        <div class="fz18 colred mb10">{{item.PaymentState}}</div>
        <img :src="item.Image" alt="">
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="paymentClose">关闭</el-button>
      </div>
    </el-dialog>

    <!--订单详情-->
    <el-dialog title='订单详情' :visible.sync="viewDetailModal" width='70%'>
      <view-task :viewOrderData="viewOrderData"></view-task>
      <span slot='footer' class="dialog-footer">
        <el-button type='primary' @click='closeViewModel'>关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  import vali from '../common/validate'
  import viewTask from '../common/viewOrderDetails'

  import {
    addOrder,
    orderList,
    getCountry,
    Rate,
    getServiceFee,
    getService,
    getProbalibi,
    uploadImg,
    GetOrderState,
    orderState,
    getPayment
  } from '@/request/api'
  export default {
    name: 'orderManage',
    data() {
      return {
        viewData: [],
        loading: true, //列表加载
        hideUpload: false,
        limitCount: 1,
        paymentCode: [], //充值二维码
        total: 0, //列表总条数
        file: 'file',
        proImg: false, //图片上传状态
        priceShow: true, //总价显示
        checkAll: false,
        cities: [],
        isIndeterminate: true,
        brushRadio: '',
        serviceUnit: 0, //服务费单价
        addService: 0, //增值费
        ExRate: 0, //汇率
        payList: false, //列表付款按钮显示
        OrderId: '', //任务ID
        Amount: 0,
        uploadUrl: this.axios.defaults.baseURL + '/api/Order/GetProductPictures',
        viewOrderData: [],
        allOrderData: [],
        hasBalance: 0,
        commentTypeData: [], //留评类型
        status: this.$route.params.taskTypeModel,
        errorStatus: this.$route.params.active,
        pageSize: 5, //每页条数
        currentPage: 1, //页数
        cancelModal: false,
        paymentModel: false,
        refundModal: false, //申请退款
        cancelRefundModal: false, //取消退款
        viewDetailModal: false, //FBA查看详情
        activities: [],
        active: '',
        allNum: 0, //总条数
        addTaskModal: false,
        errorMes: false,
        startTime: '',
        pickerOptions0: this.startDate(),
        taskEndDate: this.endDate(),
        pickerEndDate: this.pickerOptionsEnd(),
        pickerStartDate: this.searchStartDate(),
        rateData: [], // 费率
        addFreeData: [], // 增值费
        serviceData: [], // 服务费
        serviceTab: false, // 服务费显示隐藏
        addFreeTab: false, // 服务费显示隐藏
        rateTab: true, // 服务费显示隐藏
        Currency: '',
        paymentForm: {
          balance: 0,
          payMoney: 0,
        },
        countryData: [],
        searchForm: {
          Keyword: '',
          orderStartTime: '',
          orderEndTime: '',
          checkedCities: []
        },
        taskData: [{
          startTime: '',
          pickTime: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)],
          numbers: ''
        }],
        taskType: 'all',
        orderTypes: [{
          value: '1',
          label: '见单返本'
        }, {
          value: '2',
          label: '评后返'
        }],
        taskForm: {
          CountryId: '',
          ServiceType: '', //订单类型
          Asin: '', //产品ASIN
          ShopName: '', //店铺名称
          ProductName: '', //产品名称
          ProductPrice: '', //价格
          ProductScore: 0, //评分
          ProductLink: '', //产品链接
          ProductPictures: '', //产品图片
          KeywordType: '1', //关键词类型
          ProductKeyword: '', //搜索关键词
          ProductPosition: '', //留评比例,
          Number: '', //订单数量
          StartTime: '', //任务开始时间
          EndTime: '', //任务结束时间
          Remarks: '' //备注
        },
        taskRule: {
          Asin: [{
              required: true,
              message: '请输入产品ASIN',
              trigger: 'change'
            },
            {
              validator: vali.flagNum,
              trigger: 'change'
            }
          ],
          CountryId: [{
            required: true,
            message: '请选择国家',
            trigger: 'change'
          }],
          ServiceType: [{
            required: true,
            message: '请选择下单类型',
            trigger: 'change'
          }],
          ShopName: [{
            required: true,
            message: '请输入店铺名称',
            trigger: 'change'
          }],
          ProductPictures: [{
            required: true,
            message: '请选择产品图片',
            trigger: 'change'
          }],
          StartTime: [{
            required: true,
            message: '请选择任务开始时间',
            trigger: 'change'
          }],
          EndTime: [{
            required: true,
            message: '请选择任务结束时间',
            trigger: 'change'
          }],
          ProductName: [{
            required: true,
            message: '请输入产品名称',
            trigger: 'change'
          }],
          ProductPrice: [{
              required: true,
              message: '请输入产品价格',
              trigger: 'change'
            },
            {
              validator: vali.proPrice,
              trigger: 'change'
            }
          ],
          Number: [{
              required: true,
              message: '请输入购买数量',
              trigger: 'change'
            },
            {
              validator: vali.checkNum,
              trigger: 'change'
            }
          ],
          VideoNum: [{
            validator: vali.checkNum,
            trigger: 'change'
          }],
          PicNum: [{
            validator: vali.checkNum,
            trigger: 'change'
          }],
          tradingFlow: [{
            required: true,
            message: '请输入交易流水',
            trigger: 'change'
          }],
          PayAccount: [{
            required: true,
            message: '请输入付款账号',
            trigger: 'change'
          }],
          ProductPosition: [{
            required: true,
            message: '请选择留评比例',
            trigger: 'change'
          }]
        },
        obj: [],
        allState: [], //全部状态管理
        imageUrl: ''
      }
    },
    components: {
      viewTask
    },
    created() {
      this.allOrderList()
      this.allOrderStatus()

      this.getAllCountry() //获取国家数据
      this.getRateData() //获取汇率数据
      this.getFeeData() //获取服务费数据
      this.getAddFeeData() //获取增值费数据
    },
    computed: {
      //产品总价
      productTotal: function() {
        let type = this.taskForm.ServiceType
        if (type == '1') {
          return (Number(this.taskForm.ProductPrice) * Number(this.taskForm.Number) * Number(this.ExRate)).toFixed(2)
        } else {
          return Number(0).toFixed(2)
        }
      },
      //服务费
      serviceFeeTotal: function() {
        return (Number(this.addService) * Number(this.taskForm.Number) + Number(this.serviceUnit) * Number(this.taskForm
            .Number))
          .toFixed(2)
      },
      //合计
      allTotal: function() {
        return (Number(this.productTotal) + Number(this.serviceFeeTotal)).toFixed(2)
      }
    },
    methods: {
      //初始化订单列表
      allOrderList() {
        let _this = this
        let param = {
          userId: sessionStorage.getItem('userId'),
          countryIdx: _this.searchForm.checkedCities,
          state: _this.active,
          statetime: _this.searchForm.orderStartTime,
          endtime: _this.searchForm.orderEndTime,
          kWord: _this.searchForm.Keyword,
          pageNum: _this.currentPage,
          pagesize: _this.pageSize
        }
        orderList(param).then((res) => {
          _this.loading = false
          _this.allOrderData = res.data.list
          _this.total = parseInt(res.data.total)
          let list = res.data.list
          for (let i = 0; i < list.length; i++) {
            let proKey = list[i].ProductKeyword
            if (proKey == null) {
              proKey = ''
            }
            _this.allOrderData[i].ProductKeyword = proKey
            _this.allOrderData[i].state = _this.allOrderData[i].OrderState
          }
        }).catch((e) => {})
      },

      // 格式化订单状态
      txtOrderStatus(val) {
        if (val.state == 1) {
          return '待确认'
        } else if (val.state == 2) {
          return '待分配'
        } else if (val.state == 3) {
          return '已分配'
        } else if (val.state == 4) {
          return '已完成'
        } else if (val.state == 5) {
          return '已取消'
        }
      },

      // 获取订单状态数量
      allOrderStatus() {
        let _this = this
        let param = {
          Id: sessionStorage.getItem('userId')
        }
        GetOrderState(param).then(res => {
          _this.allState = res.data
        }).catch((e) => {})
      },

      //每页条数
      handleSizeChange(size) {
        let _this = this
        _this.pageSize = size
        _this.allOrderList()
      },
      // 分页导航
      handleCurrentChange(currentPage) {
        let _this = this
        _this.currentPage = currentPage
        _this.allOrderList()
      },

      // 图片上传
      handleAvatarSuccess(res, file) {
        if (res.Data != '') {
          this.taskForm.ProductPictures = res.Data
        }
        this.imageUrl = URL.createObjectURL(file.raw);
        this.$message.success('产品图片上传成功！')
      },
      handleError(res) {
        this.$message.error('产品图片上传失败！')
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isGIF = file.type === 'image/gif';
        const isBMP = file.type === 'image/bmp';
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isJPG && !isPNG && !isGIF && !isBMP) {
          this.$message.error('上传图片必须是JPG/PNG/GIF/BMP 格式!');
        } else if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!');
        }
        return (isJPG || isPNG || isGIF || isBMP) && isLt5M;
      },

      // 全选
      handleCheckAllChange(val) {
        let _this = this
        let cities = _this.cities
        _this.searchForm.checkedCities = val ? cities : [];
        _this.isIndeterminate = false;
      },
      // 选择国家
      handleCheckedCitiesChange(value) {
        let _this = this
        let checkedCount = value.length;
        _this.checkAll = checkedCount === _this.cities.length;
        _this.isIndeterminate = checkedCount > 0 && checkedCount < _this.cities.length;
      },

      // 初始化国家数据
      getAllCountry() {
        let _this = this
        let param = {
          Id: sessionStorage.getItem('userId')
        }
        getCountry(param).then((res) => {
          _this.cities = res.data.list
          _this.countryData = res.data.list
        }).catch(err => {
          console.log(err)
        })
      },

      // 汇率数据
      getRateData() {
        let _this = this
        Rate().then((res) => {
          _this.rateData = res.data.list
        }).catch(err => {
          console.log(err)
        })
      },

      // 增值费数据
      getAddFeeData() {
        let _this = this
        getServiceFee().then((res) => {
          _this.addFreeData = res.data.list
          let fee = res.data.list
          for (let i = 0; i < fee.length; i++) {
            let min = fee[i].Start
            let max = fee[i].Ent
            let UnitPrice = fee[i].IServiceFee
            let productPrice = '$ ' + min + ' - ' + '$ ' + max
            _this.addFreeData[i].productPrice = productPrice
            _this.addFreeData[i].UnitPrice = '￥' + UnitPrice
            _this.addFreeData[i].price = UnitPrice
          }
        }).catch(err => {
          console.log(err)
        })
      },

      // 服务费数据
      getFeeData() {
        let _this = this
        getService().then((res) => {
          _this.serviceData = res.data.list
        }).catch(err => {
          console.log(err)
        })
      },

      //根据产品价格获取增值费
      getAddFee() {
        let _this = this
        let obj = _this.addFreeData
        let price = Number(_this.taskForm.ProductPrice)
        _this.addService = _this.getAddService(obj, price)
      },

      // 获取服务费单价
      getFee(obj, param1, param2) {
        for (let i = 0; i < obj.length; i++) {
          if ((obj[i].CountryId === param1 && obj[i].Probability === param2) ||
            (obj[i].Probability === param1 && obj[i].CountryId === param2)) {
            return obj[i].FeePrice;
          }
        }
      },
      //取增值费
      getAddService(obj, param) {
        let _this = this
        for (let i = 0; i < obj.length; i++) {
          if (param >= obj[i].Start && param <= obj[i].Ent) {
            return obj[i].IServiceFee
          } else if (param < obj[i].Start) {
            return 0
          }
        }
      },
      //取汇率
      getRate(obj, param) {
        let _this = this
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].CountryId == param) {
            return obj[i].ExchangeRate
          }
        }
      },
      // 取货币符号
      getSymbol(obj, param) {
        let _this = this
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].CountryId == param) {
            return obj[i].CurrencySymbol
          }
        }
      },
      //取留评比例
      getCommentBL(countryId) {
        let _this = this
        let param = {
          cid: countryId
        }
        getProbalibi(param).then(res => {
          _this.commentTypeData = res.data
        })
      },

      //根据国家取货币符号汇率留评比例
      checkCountry() {
        let _this = this
        let obj = _this.rateData
        let Id = _this.taskForm.CountryId
        _this.taskForm.ProductPosition = ''
        _this.ExRate = _this.getRate(obj, Id)
        _this.Currency = _this.getSymbol(obj, Id)
        let param = {
          cid: _this.taskForm.CountryId
        }
        getProbalibi(param).then(res => {
          _this.commentTypeData = res.data
        })
      },

      // 创建订单
      createOrder() {
        let _this = this
        _this.addTaskModal = true
      },

      // 再来一单(再次创建订单)
      createOrderAgain(index, row) {
        let _this = this
        _this.addTaskModal = true

        //获取订单数据回显
        _this.taskForm.ServiceType = row.ServiceType.toString()
        _this.taskForm.CountryId = row.CountryId
        _this.taskForm.ShopName = row.ShopName
        _this.taskForm.Asin = row.Asin
        _this.taskForm.ProductName = row.ProductName
        _this.taskForm.ProductPrice = row.ProductPrice
        _this.taskForm.ProductLink = row.ProductLink
        _this.taskForm.ProductScore = row.ProductScore
        _this.taskForm.ProductPictures = row.ProductPictures
        _this.taskForm.KeywordType = row.KeywordType.toString()
        _this.taskForm.ProductKeyword = row.ProductKeyword
        _this.taskForm.ProductPosition = row.ProductPosition
        _this.taskForm.Number = row.Number
        _this.taskForm.StartTime = row.StartTimes
        _this.taskForm.EndTime = row.EndTimes
        _this.taskForm.Remarks = row.Remarks

        _this.imageUrl = row.ProductPictures

        //汇率
        _this.ExRate = _this.getRate(_this.rateData, row.CountryId)

        //货币符号
        _this.Currency = _this.getSymbol(_this.rateData, row.CountryId)

        // 增值费
        _this.addService = _this.getAddService(_this.addFreeData, row.ProductPrice)

        // 服务费
        _this.serviceUnit = _this.getFee(_this.serviceData, row.CountryId, row.ProductPosition)

        //留评比例
        _this.getCommentBL(row.CountryId)
      },

      // 下单类型选择
      checkOrderType: function() {
        let _this = this
        let types = _this.taskForm.ServiceType
        let nums = _this.taskForm.Number
        if (types == '2') {
          _this.priceShow = false
        } else if (types == '1') {
          _this.priceShow = true
        }
      },

      // 留评比例
      lpType() {
        let _this = this
        let countryId = _this.taskForm.CountryId
        let types = _this.taskForm.ProductPosition
        let obj = _this.serviceData
        _this.serviceUnit = _this.getFee(obj, countryId, types)
      },

      //列表确认付款弹窗
      payMent() {
        let _this = this
        _this.paymentModel = true
        _this.hasBalance = 1
        _this.paymentForm.balance = sessionStorage.getItem('balance')
        getPayment().then(res => {
          let list = res.data.list
          _this.paymentCode = res.data.list
          for (let i = 0; i < list.length; i++) {
            _this.paymentCode[i].Image = this.GLOBAL.IMG_URL + _this.paymentCode[i].Image
            let state = list[i].PaymentState
            if (state == 1) {
              _this.paymentCode[i].PaymentState = '支付宝'
            } else if (state == 2) {
              _this.paymentCode[i].PaymentState = '微信'
            }
          }
        }).catch(err => {
          console.log(err)
        })
      },

      // 时间范围
      timePicker() {
        let _this = this
        let pickTimes = _this.taskForm.OrderSchedule[0].StartDate
        let len = _this.taskForm.OrderSchedule.length
        for (let i = 0; i < len; i++) {
          _this.taskForm.OrderSchedule[i].StartDate = pickTimes
        }
      },

      // 付款关闭页面
      paymentClose() {
        let _this = this
        _this.paymentModel = false
        _this.payList = false
        _this.hasBalance = 0
      },

      // 创建任务提交订单到支付
      submitPay(formName) {
        let _this = this
        let errorMes = _this.errorMes
        _this.$refs[formName].validate((valid) => {
          if (valid && !errorMes) {
            let param = Object.assign({}, _this.taskForm)
            param.UserId = sessionStorage.getItem('userId')

            param.TotalProductPrice = _this.productTotal //产品总价
            param.ServiceCharge = _this.serviceFeeTotal //服务费
            param.Total = _this.allTotal //合计

            param.AddedFee = _this.addService //增值费
            param.UnitPriceSerCharge = _this.serviceUnit //服务费单价
            param.ExchangeRate = _this.ExRate //汇率

            if (_this.taskForm.ServiceType == '2') {
              param.TotalProductPrice = 0 //产品总价
              param.ExchangeRate = 0 //汇率
            }

            addOrder(param).then((res) => {
              if (res.data.Code == 'ok') {
                _this.OrderId = res.data.OrderId
                _this.paymentModel = true
                _this.paymentForm.payMoney = _this.allTotal
                _this.$refs['taskForm'].resetFields()
                _this.closeModel()
                _this.taskForm.ProductKeyword = ''
                _this.payMent()
                _this.allOrderList()
                _this.allOrderStatus()
              } else {
                _this.$message({
                  message: res.data.Msg,
                  type: 'error'
                })
              }
            }).catch((err) => {})
          }
        })
      },
      // 打开取消弹窗
      cancelHandel(index, row) {
        let _this = this
        _this.cancelModal = true
        _this.OrderId = row.Id
      },
      //取消确定
      cancelSubmit() {
        let _this = this
        let orderId = _this.OrderId
        let param = {
          UserId: parseInt(sessionStorage.getItem('userId')),
          Id: parseInt(orderId)
        }
        orderState(param).then(res => {
          if (res.data.Code === 'ok') {
            _this.cancelModal = false
            _this.$message({
              type: 'success',
              message: '操作成功'
            })
            _this.allOrderList()
            _this.allOrderStatus()
          }
        })
      },
      //全部
      getAllStatus() {
        let _this = this
        _this.active = ''
        _this.allOrderList()
      },
      // 待确认
      daiConfirm() {
        let _this = this
        _this.active = 1
        _this.currentPage = 1
        _this.allOrderList()
      },
      // 待分配
      daifp() {
        let _this = this
        _this.active = 2
        _this.currentPage = 1
        _this.allOrderList()
      },
      // 已分配
      yfp() {
        let _this = this
        _this.active = 3
        _this.currentPage = 1
        _this.allOrderList()
      },
      // 已完成
      ywc() {
        let _this = this
        _this.active = 4
        _this.currentPage = 1
        _this.allOrderList()
      },
      // 已取消
      daiCancel() {
        let _this = this
        _this.active = 5
        _this.currentPage = 1
        _this.allOrderList()
      },

      //搜索下单开始时间
      searchStartDate() {
        let _this = this
        return {
          disabledDate: time => {
            let endDateVal = _this.searchForm.orderEndTime
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime()
            }
          }
        }
      },
      // 搜索下单结束时间
      pickerOptionsEnd() {
        let _this = this
        return {
          disabledDate: time => {
            let beginDateVal = _this.searchForm.orderStartTime
            if (beginDateVal) {
              return (
                time.getTime() <
                new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
              )
            }
          }
        }
      },
      // 任务结束时间
      endDate() {
        let _this = this
        return {
          disabledDate: time => {
            let beginDateVal = _this.taskForm.StartTime
            if (beginDateVal) {
              return (
                time.getTime() <
                new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
              )
            }
          }
        }
      },
      endTimeStatus: function(value) {
        this.orderEndTime = value
      },
      // 创建订单关闭
      closeModel() {
        let _this = this
        _this.addTaskModal = false
        _this.$refs['taskForm'].resetFields()
        _this.taskForm.ServiceFee = 0
        _this.taskForm.OrderTotal = 0
        _this.taskForm.ProductTotal = 0
        _this.addService = 0
        _this.serviceUnit = 0
        _this.ExRate = 0
        _this.Currency = ''
        _this.taskForm = {
          CountryId: '',
          ServiceType: '', //订单类型
          Asin: '', //产品ASIN
          ShopName: '', //店铺名称
          ProductName: '', //产品名称
          ProductPrice: '', //价格
          ProductScore: 0, //评分
          ProductLink: '', //产品链接
          ProductPictures: '', //产品图片
          KeywordType: '1', //关键词类型
          ProductKeyword: '', //搜索关键词
          ProductPosition: '', //留评比例,
          Number: '', //订单数量
          StartTime: '', //任务开始时间
          EndTime: '', //任务结束时间
          Remarks: '' //备注
        }
        _this.imageUrl = ''
        _this.commentTypeData = ''
      },

      // 查看详情
      viewDetails(index, row) {
        let _this = this
        let obj = _this.obj
        _this.viewDetailModal = true
        _this.viewOrderData = row
        let val = row
        if (val.OrderState == 1) {
          _this.viewOrderData.OrderState = '待确认'
        } else if (val.OrderState == 2) {
          _this.viewOrderData.OrderState = '待分配'
        } else if (val.OrderState == 3) {
          _this.viewOrderData.OrderState = '已分配'
        } else if (val.OrderState == 4) {
          _this.viewOrderData.OrderState = '已完成'
        } else if (val.OrderState == 5) {
          _this.viewOrderData.OrderState = '已取消'
        }
        if (val.ServiceType == 1) {
          _this.viewOrderData.ServiceType = '见单返本'
        } else if (val.ServiceType == 2) {
          _this.viewOrderData.ServiceType = '评后返'
        }
        if (val.KeywordType == 1) {
          _this.viewOrderData.KeywordType = '产品关键词'
        } else if (val.KeywordType == 2) {
          _this.viewOrderData.KeywordType = 'CPC关键词'
        } else {
          return false
        }
      },
      // 详情关闭
      closeViewModel() {
        let _this = this
        _this.viewDetailModal = false
      },
      // 服务费显示与隐藏
      toggleService() {
        let _this = this
        let tabs = _this.serviceTab
        if (tabs) {
          _this.serviceTab = false
        } else {
          _this.serviceTab = true
        }
      },
      // 增值费显示与隐藏
      toggleAddFree() {
        let _this = this
        let tabs = _this.addFreeTab
        if (tabs) {
          _this.addFreeTab = false
        } else {
          _this.addFreeTab = true
        }
      },
      // 汇率显示与隐藏
      toggleRate() {
        let _this = this
        let tabs = _this.rateTab
        if (tabs) {
          _this.rateTab = false
        } else {
          _this.rateTab = true
        }
      },
      startDate() {
        return {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        }
      },

      //查询
      searchOrder() {
        let _this = this
        _this.currentPage = 1
        _this.allOrderList()
      },

      // 重置
      resetTask() {
        let _this = this
        _this.currentPage = 1
        _this.searchForm = {
          Keyword: '',
          orderStartTime: '',
          orderEndTime: '',
          checkedCities: []
        }
        _this.allOrderList()
      },

      // 导出
      exportExcel() {
        var xlsxParam = {
          raw: true
        }
        var wb = XLSX.utils.table_to_book(document.querySelector('#exportTable'), xlsxParam)
        var wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array'
        })
        try {
          FileSaver.saveAs(new Blob([wbout], {
            type: 'application/octet-stream'
          }), '订单数据.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') {
            console.log(e, wbout)
          }
        }
        return wbout
      }

    }
  }
</script>

<style>
  /* 上传组件相关样式 */
  .p-img .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .p-img .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .p-img .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px !important;
    text-align: center;
  }

  .p-img .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }

  .p-img .el-upload--text {
    width: 150px;
    height: 150px;
  }
</style>
