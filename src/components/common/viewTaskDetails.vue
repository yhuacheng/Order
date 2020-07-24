<template>
  <div class="contentView">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>任务信息</span>
      </div>
      <el-form :model='viewTaskData' ref='viewTaskData' label-width='150px'>
        <el-row>
          <el-col :span="12">
            <el-form-item label='任务编码：' prop="OrderNumbers">
              <span>{{viewTaskData.OrderNumbers}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='任务类型：' prop="ServiceType">
              <span>{{viewTaskData.ServiceType}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='国家：' prop="countryName">
              <p>{{viewTaskData.countryName}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='任务状态：' prop="TaskState">
              <span class="success" v-if="viewTaskData.TaskState == '已完成'">{{viewTaskData.TaskState}}</span>
              <span v-else>{{viewTaskData.TaskState}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='产品ASIN：' prop="Asin">
              <span>{{viewTaskData.Asin}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='产品名称：' prop="ProductName">
              <span>{{viewTaskData.ProductName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='产品评分：' prop="OrderProductScore">
              <el-rate style="margin-top: 10px;" v-model="viewTaskData.OrderProductScore" disabled show-score
                text-color="#ff9900"></el-rate>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="viewTaskData.ServiceType === '评后返'">
            <el-form-item label='预计价格：' prop="ProductPrice">
              <span v-show="viewTaskData.ProductPrice!=null"><span>{{viewTaskData.symbol}}</span>{{viewTaskData.ProductPrice}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='任务执行时间：' prop="ExecutionTime">
              <span>{{viewTaskData.ExecutionTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label='备注：' prop="Remarks">
              <span>{{viewTaskData.Remarks}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card mt20">
      <div slot="header" class="clearfix">
        <span>购买信息</span>
      </div>
      <el-form :model='viewTaskData' ref='viewTaskData' label-width='150px'>
        <el-row>
          <el-col :span="12">
            <el-form-item label='购买时间：' prop="BuyTime">
              <span>{{viewTaskData.BuyTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='Amazon购买单号：' prop="AmazonNumber">
              <span>{{viewTaskData.AmazonNumber}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="viewTaskData.ServiceType === '见单返本'">
            <el-form-item label='产品金额：' prop="AmazonProductPrice">
              <span v-show="viewTaskData.AmazonProductPrice!=null"><span>{{viewTaskData.symbol}}</span>{{viewTaskData.AmazonProductPrice}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='产品运费：' prop="Freight">
              <span v-show="viewTaskData.Freight!=null"><span>{{viewTaskData.symbol}}</span> {{viewTaskData.Freight}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='产品税费：' prop="Taxation">
              <span v-show="viewTaskData.Taxation!=null"><span>{{viewTaskData.symbol}}</span> {{viewTaskData.Taxation}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='其他费用：' prop="Other">
              <span v-show="viewTaskData.Other!=null">{{viewTaskData.symbol}}</span> {{viewTaskData.Other}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='增值费：' prop="OrderAddedFee">
              <span>{{viewTaskData.OrderAddedFee}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='服务费：' prop="OrderUnitPriceSerCharge">
              <span>{{viewTaskData.OrderUnitPriceSerCharge}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='汇率：' prop="OrderExchangeRate">
              <span>{{viewTaskData.OrderExchangeRate}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='总额：' prop="Total">
              <span style="color: red;" v-show="viewTaskData.Total!=null"><span>￥</span> {{viewTaskData.Total}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label='购买截图：' prop="BuyImage">
              <img :src="GLOBAL.IMG_URL+viewTaskData.BuyImage" v-if="viewTaskData.BuyImage" style="max-width: 80%;" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card mt20">
      <div slot="header" class="clearfix">
        <span>评价信息</span>
      </div>
      <el-form :model='viewTaskData' ref='viewTaskData' label-width='150px'>
        <el-row>
          <el-col :span="12">
            <el-form-item label='评价链接：' prop="ProductLink">
              <a :href="viewTaskData.ProductLink">{{viewTaskData.ProductLink}}</a>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label='评价截图：' prop="Remarks">
              <img :src="GLOBAL.IMG_URL+viewTaskData.ProductImage" v-if="viewTaskData.ProductImage" style="max-width: 80%;" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card mt20">
      <div slot="header" class="clearfix">
        <span>交易信息</span>
      </div>
      <el-form :model='viewTaskData' ref='viewTaskData' label-width='150px'>
        <el-row>
          <el-col :span="24">
            <el-form-item label='交易截图：' prop="Remarks">
              <img :src="viewTaskData.DealIamge" v-if="viewTaskData.DealIamge" style="max-width: 80%;" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'viewTaskDetails',
    props: ["viewTaskData"],
    data() {
      return {
        form: {}
      }
    },
    methods: {
      //获取类型
      getInfo(obj, param1, param2) {
        for (let i = 0; i < obj.length; i++) {
          if ((obj[i].TypeName == param1 && obj[i].Value == param2) ||
            (obj[i].Value == param1 && obj[i].TypeName == param2)) {
            return obj[i].Display;
          }
        }
      },
      backBtn() {
        this.$router.push('/taskManage')
      }
    }
  }
</script>

<style scoped>
  .mt30 {
    margin-top: 30px;
  }

  .mt20 {
    margin-top: 20px;
  }

  .mb20 {
    margin-bottom: 20px;
    font-size: 14px;
  }

  .contentView {
    text-align: left;
    margin: 0 auto 50px;
    position: relative;
  }

  .eval_img {
    width: 150px;
    height: 150px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #ccc;
    margin-right: 10px;
    background-size: cover;
  }
</style>
