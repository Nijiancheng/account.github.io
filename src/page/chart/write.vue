<template>
  <div class="write">
    <div class="write-top">
      <m-header :title="title" :is_goBack="is_goBack"></m-header>
      <div class="write-top-info">
        <span>{{budgetType==1?'收入':'支出'}}账簿</span>
        <span>{{budgetType==1?'收款':'付款'}}类型 : {{budgetCateName}}</span>
      </div>
    </div>
    <div class="write-info">
      <div class="write-info-list">
        <span class="write-info-list-text">账面{{budgetType==1?'收入':'支出'}}</span>
        <div class="write-info-list-input">
          <input type="text" placeholder="0.00" v-model="total_money" />
        </div>
      </div>
      <div class="write-info-list">
        <span class="write-info-list-text">交易对象</span>
        <div class="write-info-list-input">
          <input type="text" placeholder="输入交易对象" v-model="objectName" />
        </div>
      </div>
      <div class="write-info-list">
        <span class="write-info-list-text">{{budgetType==1?'收款':'付款'}}方式</span>
        <div class="write-info-list-input">
          <span class="write-select" @click="showPopup1">{{mode}}</span>
          <span class="iconfont write-icon">&#xe8f2;</span>
        </div>
      </div>
      <div class="write-info-list" v-if="mode=='分期'">
        <span class="write-info-list-text">首笔{{budgetType==1?'收款':'付款'}}</span>
        <div class="write-info-list-input">
          <input type="text" placeholder="0.00" v-model="first_money" />
        </div>
      </div>
      <div class="write-info-list">
        <span class="write-info-list-text">{{budgetType==1?'收款':'付款'}}账户</span>
        <div class="write-info-list-input">
          <span class="write-select" @click="showPopup2">{{account}}</span>
          <span class="iconfont write-icon">&#xe8f2;</span>
        </div>
      </div>
      <div class="write-info-list" @click="showPopup">
        <span class="write-info-list-text">{{budgetType==1?'收款':'付款'}}日期</span>
        <div class="write-info-list-input">
          <span class="dateTime">{{dateTime}}</span>
          <span class="iconfont write-icon">&#xe8f2;</span>
        </div>
      </div>
      <div class="write-info-list">
        <span class="write-info-list-text">{{budgetType==1?'收入':'支出'}}凭证</span>
        <div class="write-info-list-input">
          <van-uploader
            v-model="fileList"
            multiple
            :after-read="afterRead"
            :before-delete="deleteImg"
          />
          <span class="iconfont write-icon">&#xe8f2;</span>
        </div>
      </div>
      <div class="write-info-list">
        <textarea name id cols="30" rows="3" placeholder="请输入备注..." v-model="remark"></textarea>
      </div>
      <div class="write-info-button">
        <button @click="save">保存</button>
      </div>
    </div>
    <!-- 日期 -->
    <van-popup v-model="show" position="bottom" :style="{height:'30%'}">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        @confirm="getDateTime"
        @cancel="closeShow"
      />
    </van-popup>
    <!-- 单选 -->
    <van-popup v-model="show1" :style="{ width: '90%' }">
      <van-radio-group v-model="radio" @change="typeChange">
        <van-cell-group>
          <van-cell title="全额" clickable @click="radio = '1'">
            <van-radio slot="right-icon" name="1" />
          </van-cell>
          <van-cell title="分期" clickable @click="radio = '2'">
            <van-radio slot="right-icon" name="2" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>
    <!-- 单选账户 -->
    <van-popup v-model="show2" :style="{ width: '90%' }">
      <van-radio-group v-model="radios" @change="accountChange">
        <van-cell-group>
          <van-cell title="请选择" clickable @click=" radios = '-1'">
            <van-radio slot="right-icon" name="-1" />
          </van-cell>
          <van-cell
            :title="items.name"
            clickable
            @click="radios = index"
            v-for="(items,index) in accountInfo"
            :key="index"
          >
            <van-radio slot="right-icon" :name="index" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>
  </div>
</template>

<script>
import mHeader from "../../components/header";
import {
  Popup,
  DatetimePicker,
  RadioGroup,
  Radio,
  Cell,
  CellGroup,
  Uploader,
  Toast
} from "vant";
import qs from "qs";
import api from "../../api";
export default {
  data() {
    return {
      // budgetCate:this.$route.params.budgetCate,
      currentDate: new Date(),
      show: false,
      show1: false,
      show2: false,
      is_goBack: true,
      title: "记一笔",
      remark: "",
      dateTime: "",
      objectName: "",
      total_money: "",
      first_money: "",
      image_keys: [],
      money: "",
      account: "请选择",
      account_id: "",
      mode: "全额",
      radio: "1",
      radios: "-1",
      accountInfo: [],
      fileList: [],
      budgetType: "",
      budgetCateId: "",
      budgetCateName: "",
      token: ""
    };
  },
  methods: {
    constructor() {
      // 时间
      let yy = this.currentDate.getFullYear();
      let mm = this.currentDate.getMonth() + 1;
      mm = mm < 10 ? "0" + mm : mm;
      let dd = this.currentDate.getDate();
      dd = dd < 10 ? "0" + dd : dd;

      this.dateTime = yy + "-" + mm + "-" + dd;
      this.budgetType = localStorage.getItem("budgetType");
      this.budgetCateId = localStorage.getItem("budgetCateId");
      this.budgetCateName = localStorage.getItem("budgetCateName");
      this.token = localStorage.getItem("token");
    },
    getAccount() {
      // 账单明细
      Toast.loading({
        mask: true,
        message: "加载中..."
      });
      this.axios
        .get(api.Account + localStorage.getItem("token"))
        .then(res => {
          if (res.data.status) {
            this.accountInfo = res.data.data;
            Toast.clear();
          }else{
            Toast(res.data.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    showPopup() {
      this.show = true;
    },
    showPopup1() {
      this.show1 = true;
    },
    showPopup2() {
      this.show2 = true;
    },
    getDateTime(value) {
      // console.log(value);
      let yy = this.currentDate.getFullYear();
      let mm = this.currentDate.getMonth() + 1;
      mm = mm < 10 ? "0" + mm : mm;
      let dd = this.currentDate.getDate();
      dd = dd < 10 ? "0" + dd : dd;
      this.dateTime = yy + "-" + mm + "-" + dd;
      this.show = false;
    },
    closeShow() {
      this.show = false;
    },
    typeChange(name) {
      console.log(name);
      if (name == 1) {
        this.mode = "全额";
      } else {
        this.mode = "分期";
      }
      this.show1 = false;
    },
    accountChange(names) {
      if (names == -1) {
        this.account = "请选择";
      } else {
        this.account = this.accountInfo[names].name;
        this.account_id = this.accountInfo[names].id;
      }
      this.show2 = false;
    },
    save() {
      Toast.loading({
        mask: true,
        message: "加载中..."
      });
      // console.log(this.image_keys, "图片key");
      for (let i in this.image_keys) {
        if (i == 0) {
          var imgKey = this.image_keys[i];
        } else {
          imgKey += "," + this.image_keys[i];
        }
      }

      let data = {
        total_money: this.total_money,
        money: this.first_money == "" ? this.total_money : this.first_money,
        account_id: this.account_id,
        category_id: this.budgetCateId,
        date: this.dateTime,
        company_name: this.objectName,
        remark: this.remark,
        image_keys: imgKey
      };
      //提交订单
      this.axios
        .post(api.SubAcc + this.token, qs.stringify(data))
        .then(res => {
          // console.log(res);
          if (res.data.status) {
            Toast("记账成功");
            this.$router.go(-1);
          } else {
            Toast(res.data.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      // console.log(file);
      let formData = new FormData();
      formData.append("file", file.file);
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      }; //添加请求头
      // 上传图片
      this.axios
        .post(api.UploadImg + this.token, formData, config)
        .then(res => {
          if (res.data.status) {
            this.image_keys.push(res.data.data.file.fileKey);
          } else {
            Toast(res.data.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteImg(file) {
      for (let i in this.fileList) {
        if (file == this.fileList[i]) {
          this.image_keys.splice(i, 1);
          Toast("图片删除成功");
          return true;
        }
      }
    }
  },
  created() {
    this.constructor();
    this.getAccount();
  },
  components: {
    mHeader,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Uploader.name]: Uploader,
    [Toast.name]: Toast
  }
};
</script>

<style scoped lang='less'>
.write {
  position: absolute;
  width: 100%;
  min-height: 100%;
  background-color: #fff;
  z-index: 999;
  .write-top {
    position: fixed;
    width: 100%;
    background-color: #78d666;
    .m-topbar {
      background-color: #78d666;
    }
  }
  .write-top-info {
    height: 50px;
    display: flex;
    justify-content: space-around;
    font-size: 18px;
    align-items: center;
    background-color: #78d666;
    color: #ffe;
  }
  .goBack {
    font-size: 25px;
  }
  .write-header {
    width: 100%;
    height: 50px;
    display: flex;
    a {
      flex: 1;
      color: #999;
      padding: 5px 40px;
      border-bottom: 2px solid rgba(200, 200, 200, 0.5);
      position: relative;
      line-height: 40px;
    }
  }
  .write-info {
    padding: 0 15px;
    font-size: 16px;
    margin-top: 105px;
  }
  .write-info-list {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    line-height: 50px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
  .write-info-list-input {
    float: right;
    text-align: right;
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    input {
      text-align: right;
      outline: none;
      border: none;
      background-color: rgba(255, 255, 255, 0);
    }
    .write-select {
      display: inline-block;
      width: 200px;
      height: 45px;
    }
  }

  textarea {
    width: 98%;
    border: none;
    outline: red;
    line-height: 1.5em;
    font-size: 16px;
    margin: 10px auto;
  }
  .write-info-button {
    margin: 20px 0;
    text-align: center;
    button {
      width: 95%;
      height: 50px;
      background-color: #78d666;
      outline: none;
      border: none;
      border-radius: 5px;
      color: #ffe;
    }
  }
  .van-radio-group {
    border-radius: 10px;
    overflow: hidden;
  }
}
</style>
<style >
.write .van-uploader__upload,
.van-uploader__preview {
  margin: 3px;
  border-radius: 3px;
}
</style>