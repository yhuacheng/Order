<template>
  <div class="contentView">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单信息</span>
      </div>
      <el-form :model='viewOrderData' ref='viewOrderData' label-width='150px'>
        <el-row>
          <el-col :span="12">
            <el-form-item label='订单编码：' prop="OrderNumbers">
              <span>{{viewOrderData.OrderNumber}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='下单类型：' prop="ServiceType">
              <span>{{viewOrderData.ServiceType}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='国家：' prop="CountryName">
              <span>{{viewOrderData.CountryName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='订单状态：' prop="OrderState">
              <span>{{viewOrderData.OrderState}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='店铺名称：' prop="ShopName">
              <span>{{viewOrderData.ShopName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='产品ASIN：' prop="Asin">
              <span>{{viewOrderData.Asin}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='产品名称：' prop="ProductName">
              <span>{{viewOrderData.ProductName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='产品单价：' prop="ProductPrice">
              <span>{{viewOrderData.Currency}}{{viewOrderData.ProductPrice}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='产品链接：' prop="ProductLink">
              <a :href="viewOrderData.ProductLink">{{viewOrderData.ProductLink}}</a>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='产品评分：' prop="ProductScore">
              <el-rate style="margin-top: 10px;" v-model="viewOrderData.ProductScore" disabled show-score text-color="#ff9900"></el-rate>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='产品图片：' prop="ProductPictures">
              <img v-show="viewOrderData.ProductPictures" :src="'/'+viewOrderData.ProductPictures" class="eval_img">
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card mt20">
      <div slot="header" class="clearfix">
        <span>购买信息</span>
      </div>
      <el-form :model='viewOrderData' ref='viewOrderData' label-width='150px'>
        <el-row>
          <el-col :span="12">
            <el-form-item label='关键词类型：' prop="KeywordType">
              <span>{{viewOrderData.KeywordType}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='关键词：' prop="ProductKeyword">
              <span>{{viewOrderData.ProductKeyword}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='任务数量：' prop="Number">
              <span>{{viewOrderData.Number}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='留评率：' prop="ProductPosition">
              <span>{{viewOrderData.ProductPosition}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='任务开始时间：' prop="StartTimes">
              <span>{{viewOrderData.StartTimes}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='任务结束时间：' prop="EndTimes">
              <span>{{viewOrderData.EndTimes}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='汇率：' prop="ExchangeRate">
              <span>{{viewOrderData.ExchangeRate}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='产品总价：' prop="TotalProductPrice">
              <span>{{viewOrderData.TotalProductPrice}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='服务费单价：' prop="UnitPriceSerCharge">
              <span>{{viewOrderData.UnitPriceSerCharge}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='增值费单价：' prop="AddedFee">
              <span>{{viewOrderData.AddedFee}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label='合计：' prop="Total">
              <span style="color: red;">{{viewOrderData.Total}}</span>
              <span style="margin-left: 15px;"> {{viewOrderData.TotalProductPrice}} (产品总价) +
                {{viewOrderData.UnitPriceSerCharge}}
                (服务费单价) * {{viewOrderData.Number}} (任务数量) + {{viewOrderData.AddedFee}} (增值费单价) * {{viewOrderData.Number}}
                (任务数量)</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label='备注：' prop="Remarks">
              <span>{{viewOrderData.Remarks}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'viewOrderDetails',
    props: ["viewOrderData"],
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

  .detailbox1 li {
    width: 48%;
    float: left;
    list-style: none;
    line-height: 36px;
    margin-bottom: 8px;
    overflow: hidden;
  }

  .detailbox1 li p {
    margin: 0;
    display: inline-block;
    color: #666;
  }

  .detailbox1 li p img {
    display: inline-block;
  }

  .detailbox {
    overflow: hidden;
    margin-top: 20px;
    font-size: 14px;
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

  .detailbox1 {
    padding: 0;
    margin: 0 0 0 10px;
    text-align: left;
  }

  @media screen and (max-width: 970px) {
    .detailbox1 li {
      width: 100%;
    }
  }
</style>
