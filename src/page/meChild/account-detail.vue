<template>
  <div class="detail">
    <div class="detail-top">
      <mHeader :title="title" :is_goBack="is_goBack"></mHeader>
    </div>
    <div class="detail-main detail-main-top">
      <div class="detail-main-info" @click="openShow('账面')">
        <span class="detail-main-info-title">账面{{detail_type}}</span>
        <span class="detail-main-info-right">
          <span
            class="detail-main-info-content"
            :class="detail_type=='收入'?'green':'red'"
          >{{detail_info.total_money}}</span>
          <span class="detail-main-info-icon iconfont">&#xe8f2;</span>
        </span>
      </div>
      <div class="detail-main-info" @click="openShow('对象')">
        <span class="detail-main-info-title">交易对象</span>
        <span class="detail-main-info-right">
          <span class="detail-main-info-content">{{detail_info.company_name}}</span>
          <span class="detail-main-info-icon iconfont">&#xe8f2;</span>
        </span>
      </div>
      <div class="detail-main-info">
        <span class="detail-main-info-title">{{transaction_type}}方式</span>
        <span class="detail-main-info-right">
          <span
            class="detail-main-info-content"
          >{{detail_info.total_money==detail_info.paid_money?'全额':'分期'}}付款</span>
        </span>
      </div>
      <div class="detail-main-info">
        <span class="detail-main-info-title">支出类别</span>
        <span class="detail-main-info-right">
          <span class="detail-main-info-content">{{detail_info.category_name}}</span>
        </span>
      </div>
      <div class="detail-main-info">
        <span class="detail-main-info-title">结清状态</span>
        <span
          class="detail-main-info-right"
          :class="detail_type=='收入'?'green':'red'"
        >{{detail_info.total_money-detail_info.paid_money==0?'已结清':"未结清("+(detail_info.total_money-detail_info.paid_money)+")"}}</span>
      </div>
      <div
        class="detail-main-info"
        v-if="detail_info.total_money==detail_info.paid_money?true:false"
        @click="openEdit(0,2)"
      >
        <span class="detail-main-info-title">{{transaction_type}}凭证</span>
        <div class="detail-main-info-right detail-main-imgs">
          <span v-for="(img,index) in (detail_images.images)" :key="index">
            <van-image width="80" height="80" :src="img.thumbnail" />
          </span>
        </div>
        <span class="iconfont write-icon">&#xe8f2;</span>
      </div>
    </div>
    <!--  -->
    <div class="detail-center" v-if="detail_info.total_money==detail_info.paid_money?false:true">
      <div class="detail-record" v-for="(items,index) in detail_info.items" :key="index">
        <div class="detail-transition">第{{index+1}}笔{{transaction_type}}</div>
        <div class="detail-main-info" @click="openShow(index)">
          <span class="detail-main-info-title">{{transaction_type}}金额</span>
          <span
            class="detail-main-info-right"
            :class="detail_type=='收入'?'green':'red'"
          >{{items.money}}</span>
        </div>
        <div class="detail-main-info" @click="openEdit(index,1)">
          <span class="detail-main-info-title">{{transaction_type}}账户</span>
          <span class="detail-main-info-right">{{items.account_name}}</span>
        </div>
        <div class="detail-main-info" @click="openEdit(index,2)">
          <span class="detail-main-info-title">{{transaction_type}}凭证</span>
          <div class="detail-main-info-right detail-main-imgs">
            <span v-for="(img,indexs) in detail_info.items[index].images" :key="indexs">
              <van-image width="80" height="80" :src="img.thumbnail" />
            </span>
          </div>
          <span class="iconfont write-icon">&#xe8f2;</span>
        </div>
        <div class="detail-main-info" @click="openEdit(index,3)">
          <span class="detail-main-info-title">{{transaction_type}}日期</span>
          <span class="detail-main-info-right">{{items.date}}</span>
        </div>
      </div>
    </div>

    <div class="detail-main detail-bottom">
      <div class="detail-transition">备注</div>
      <div class="detail-main-info remarks" @click="openShow('备注')">
        <span class="remarks-info">{{detail_info.remark?detail_info.remark:'暂无备注'}}</span>
        <span></span>
      </div>
      <div class="detail-transition"></div>
      <div class="detail-main-info">
        <span class="detail-main-info-title">记账人</span>
        <span class="detail-main-info-right">{{detail_info.user_nickname}}</span>
      </div>
      <div class="detail-main-info">
        <span class="detail-main-info-title">记账日期</span>
        <span class="detail-main-info-right">{{detail_info.created_at}}</span>
      </div>
      <div class="detail-main-info">
        <span class="detail-main-info-title">更新日期</span>
        <span class="detail-main-info-right">{{detail_info.updated_at}}</span>
      </div>
    </div>

    <div class="detail-button" v-if="detail_info.total_money==detail_info.paid_money?false:true">
      <button @click="openFollowUp">后续付款</button>
    </div>
    <!-- 弹出修改框 -->
    <van-dialog v-model="show" :title="other_title" show-cancel-button @confirm="editAccount">
      <div class="detail_edit">
        <span>{{other_title}}</span>
        <span>
          <input type="text" placeholder="请输入" v-model="other_info" />
        </span>
      </div>
    </van-dialog>
    <!-- 新的小页面 -->
    <div class="detailed-edit" v-if="other_page">
      <div class="detailed-edit-top">
        <span class="iconfont" @click="close_other_page">&#xe641;</span>
        <div>{{other_title}}</div>
      </div>
      <div class="detailed-edit-center">
        <div class="detailed-edit-center-list" v-if="other_type !=4?true:false">
          <span class="detailed-edit-center-title">{{other_title}}</span>
          <div
            class="detailed-edit-center-info"
            v-if="(other_type==1||other_type==3)?true:false"
            @click="openSelect"
          >{{other_info}}</div>
          <div class="detailed-edit-center-info" v-if="other_type==2?true:false">
            <span>
              <van-uploader v-model="fileList" multiple :after-read="upload" />
            </span>
          </div>
        </div>
        <!-- 后续金额 -->
        <div class="detailed-edit-center-list" v-if="other_type ==4?true:false">
          <span class="detailed-edit-center-title">金额</span>
          <div class="detailed-edit-center-info">
            <input type="text" v-model="other_money" placeholder="0.00" />
          </div>
        </div>
        <!-- 后续账户 -->
        <div class="detailed-edit-center-list" v-if="other_type ==4?true:false">
          <span class="detailed-edit-center-title">账户</span>
          <div class="detailed-edit-center-info" @click="openSelect">{{other_info}}</div>
        </div>
        <!-- 后续凭证 -->
        <div class="detailed-edit-center-list" v-if="other_type ==4?true:false">
          <span class="detailed-edit-center-title">凭证</span>
          <div class="detailed-edit-center-info">
            <span>
              <van-uploader v-model="fileList" multiple :after-read="upload" />
            </span>
          </div>
        </div>
        <!-- 后续日期 -->
        <div class="detailed-edit-center-list" v-if="other_type ==4?true:false">
          <span class="detailed-edit-center-title">日期</span>
          <div class="detailed-edit-center-info" @click="openDate">{{other_date}}</div>
        </div>
      </div>
      <div class="detailed-edit-button" v-if="other_type!=2">
        <button @click="editDetail">保存</button>
      </div>
      <!-- 日期 -->
      <van-popup v-model="other_calendar" position="bottom" :style="{height:'30%'}">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          @confirm="getDateTime"
          @cancel="close_other_calendar"
        />
      </van-popup>
      <!-- 单选账户 -->
      <van-popup v-model="other_select" :style="{ width: '90%' }">
        <van-radio-group v-model="radios" @change="accountChange">
          <van-cell-group>
            <van-cell
              :title="acc.name"
              clickable
              @click="radios = num"
              v-for="(acc,num) in accountInfo"
              :key="num"
            >
              <van-radio slot="right-icon" :name="num" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </van-popup>
    </div>
  </div>
</template>

<script>
import mHeader from "../../components/header";
import {
  Dialog,
  Toast,
  Image,
  Uploader,
  DatetimePicker,
  RadioGroup,
  Radio,
  Cell,
  CellGroup,
  Popup
} from "vant";
import qs from "qs";
import api from "../../api";
export default {
  data() {
    return {
      currentDate: new Date(),
      detail_type: "",
      transaction_type: "",
      title: "",
      is_goBack: true,
      token: "",
      id: "",
      detail_info: {},
      detail_images: "",
      show: false,
      other_page: false,
      other_select: false,
      other_calendar: false,
      other_title: "",
      other_info: "",
      other_list: "",
      other_type: "",
      other_money: "",
      other_date: "",
      fileList: [],
      accountInfo: [],
      account_id: "",
      image_keys: "",

      radios: 0
    };
  },
  components: {
    mHeader,
    [Dialog.Component.name]: Dialog.Component,
    [Toast.name]: Toast,
    [Image.name]: Image,
    [Uploader.name]: Uploader,
    [DatetimePicker.name]: DatetimePicker,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Popup.name]: Popup
  },
  methods: {
    constructor() {
      this.token = localStorage.getItem("token");
      this.detail_type =
        localStorage.getItem("detail_type") == 1 ? "收入" : "支出";
      this.transaction_type =
        localStorage.getItem("detail_type") == 1 ? "收款" : "付款";
      this.title = this.detail_type + "详情";
      this.id = localStorage.getItem("detail_id");
      // 时间
      let yy = this.currentDate.getFullYear();
      let mm = this.currentDate.getMonth() + 1;
      mm = mm < 10 ? "0" + mm : mm;
      let dd = this.currentDate.getDate();
      dd = dd < 10 ? "0" + dd : dd;
      this.other_date = yy + "-" + mm + "-" + dd;
      // console.log(this.other_date);
      // console.log(this.title);
      this.getDetail();
    },
    getDetail() {
      //记录详情
      this.axios
        .get(api.RecDetail.Url1 + this.id + api.RecDetail.Url2 + this.token)
        .then(res => {
          // console.log(res);
          this.detail_info = res.data.data;
          this.detail_images = this.detail_info.items[0];
          // console.log("====");
          // console.log(this.detail_info.items);
        });
    },
    getAccount() {
      //账单明细
      this.axios
        .get(api.Account + localStorage.getItem("token"))
        .then(res => {
          // console.log(res, "账户信息");
          this.accountInfo = res.data.data;
          // console.log(this.accountInfo, "账户信息");
        })
        .catch(err => {
          console.log(err);
        });
    },
    openShow(val) {
      if (val == "账面") {
        this.other_title = val + this.detail_type;
        this.other_info = this.detail_info.total_money;
      } else if (val == "对象") {
        this.other_title = "交易对象";
        this.other_info = this.detail_info.company_name;
      } else if (val == "备注") {
        this.other_title = "备注";
        this.other_info = this.detail_info.remark;
      } else {
        this.other_title = this.transaction_type + "金额";
        this.other_list = val;
        this.other_info = this.detail_info.items[val].money;
      }
      this.other_edit = val;
      this.show = true;
    },
    openEdit(index, val) {
      if (val == 1) {
        this.other_title = this.transaction_type + "账户";
        this.other_info = this.detail_info.items[index].account_name;
        // console.log(this.detail_info.items[index].account_name);
      } else if (val == 2) {
        this.other_title = this.transaction_type + "凭证";
        this.other_info = this.detail_info.items[index].images;
        for (let i of this.other_info) {
          this.fileList.push({ url: i.thumbnail });
        }
      } else if (val == 3) {
        this.other_title = this.transaction_type + "日期";
        this.other_info = this.detail_info.items[index].date;
      }
      this.other_list = index;
      this.other_type = val;
      this.other_page = true;
    },
    openDate() {
      this.other_calendar = true;
    },
    close_other_page() {
      this.other_page = false;
      this.other_info = "";
      this.other_title = "";
      this.other_list = "";
      this.other_type = "";
      this.fileList = [];
      this.image_keys = "";
      this.other_money = "";
      this.getDetail();
    },
    close_other_calendar() {
      this.other_calendar = false;
    },
    openSelect() {
      if (this.other_type == 1 || this.other_type == 4) {
        this.other_select = true;
      } else if (this.other_type == 3) {
        this.other_calendar = true;
      }
    },
    openFollowUp() {
      this.other_title = "后续" + this.transaction_type;
      this.other_type = 4;
      this.other_info = this.accountInfo[0].name;
      this.account_id = this.accountInfo[0].id;
      this.other_page = true;
    },
    editAccount() {
      console.log(this.other_title);
      if (this.other_title == "账面" + this.detail_type) {
        if (this.other_info > 99999999) {
          Toast("输入的金额过大");
          return;
        }
        var data = { total_money: this.other_info };
      } else if (this.other_title == "交易对象") {
        var data = { company_name: this.other_info };
        // console.log(data);
      } else if (this.other_title == "备注") {
        var data = { remark: this.other_info };
      } else {
        this.editDetail();
        return;
      }

      // 修改账单详情
      this.axios
        .post(
          api.RecEdit.Url1 + this.id + api.RecEdit.Url2 + this.token,
          qs.stringify(data)
        )
        .then(res => {
          console.log(res);
          if (res.data.status) {
            Toast("修改成功");
            this.getDetail();
            this.show = false;
          } else {
            Toast(res.data.data);
          }
        })
        .catch(err => {
          Toast("填写数据有误");
          // console.log(err);
        });
    },
    editDetail() {
      // console.log(this.transaction_type + "金额", this.other_title);
      Toast.loading({
        mask: true,
        message: "加载中..."
      });
      if (this.other_title == this.transaction_type + "金额") {
        var data = { money: this.other_info };
      } else if (this.other_title == this.transaction_type + "凭证") {
        var data = { image_keys: this.image_keys };
        // console.log(data);
      } else if (this.other_title == this.transaction_type + "账户") {
        var data = { account_id: this.account_id };
      } else if (this.other_title == this.transaction_type + "日期") {
        var data = { date: this.other_info };
      } else {
        this.Followup();
        return;
      }
      let id = this.detail_info.items[this.other_list].id;
      // 修改分期详情
      this.axios
        .post(
          api.RecItemEdit.Url1 + id + api.RecItemEdit.Url2 + this.token,
          qs.stringify(data)
        )
        .then(res => {
          // console.log(res, "shangchuan chenggong ");
          if (res.data.status) {
            this.getDetail();
            if (this.other_type == 2) {
              Toast("图片上传成功");
              this.image_keys = "";
            } else {
              this.close_other_page();
            }
          } else {
            // console.log(res.data.data);
            Toast(res.data.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    upload(file) {
      // console.log(file);
      Toast.loading({
        mask: true,
        message: "加载中..."
      });
      let formData = new FormData();
      formData.append("file", file.file);
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      }; //添加请求头
      // 上传图片
      this.axios
        .post(api.UploadImg + this.token, formData, config)
        .then(res => {
          // console.log(res);
          if (res.data.data.status) {
            // console.log(res.data.data.file.fileKey);
            // console.log(this.image_keys);
            if (this.other_type != 4) {
              this.image_keys = res.data.data.file.fileKey;
              this.editDetail();
            } else {
              this.image_keys += res.data.data.file.fileKey;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getDateTime(value) {
      // console.log(value);
      let yy = this.currentDate.getFullYear();
      let mm = this.currentDate.getMonth() + 1;
      mm = mm < 10 ? "0" + mm : mm;
      let dd = this.currentDate.getDate();
      dd = dd < 10 ? "0" + dd : dd;
      if (this.other_type == 4) {
        this.other_date = yy + "-" + mm + "-" + dd;
      } else {
        this.other_info = yy + "-" + mm + "-" + dd;
      }
      this.other_calendar = false;
    },
    accountChange(names) {
      if (names == -1) {
        this.account = "请选择";
      } else {
        this.other_info = this.accountInfo[names].name;
        this.account_id = this.accountInfo[names].id;
        this.radios = names;
      }
      this.other_select = false;
    },
    Followup() {
      Toast.loading({
        mask: true,
        message: "加载中..."
      });
      let data = {
        record_id: this.id,
        money: this.other_money,
        image_keys: this.image_keys,
        account_id: this.account_id,
        date: this.other_date
      };
      // console.log(data, "ceshi");
      // 后续记账
      this.axios
        .post(api.Sequel + this.token, qs.stringify(data))
        .then(res => {
          // console.log(res);
          if (res.data.status) {
            Toast("记账成功");
            this.close_other_page();
          } else {
            Toast(res.data.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.constructor();
    this.getAccount();
  }
};
</script>

<style scoped lang='less'>
.detail {
  position: absolute;
  width: 100%;
  min-height: 100%;
  background-color: #fff;
  z-index: 999;
  .detailed-edit {
    position: fixed;
    top: 0;
    background-color: #eee;
    width: 100%;
    height: 100%;
    z-index: 1100;
  }
  .detailed-edit-top {
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    background-color: #78d666;
    color: #ffe;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      display: block;
      position: absolute;
      left: 15px;
      padding: 5px;
      box-sizing: border-box;
      font-size: 20px;
    }
  }
  .red {
    color: red;
  }
  .green {
    color: green;
  }
  .goBack {
    font-size: 25px;
  }

  .detail-top {
    background-color: #78d666;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
  }
  .detail-main-top {
    margin-top: 55px;
  }
  .detail-main-info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .remarks span {
    width: 100%;
    min-height: 35px;
    display: block;
    color: #888;
  }
  .detail-transition {
    min-height: 30px;
    background-color: #eee;
    line-height: 35px;
    padding: 0 15px;
    box-sizing: border-box;
    font-size: 14px;
    color: #888;
  }
  .detail-main-info-right {
    text-align: right;
    display: flex;
    align-items: center;
  }
  .detail-bottom {
    margin-bottom: 76px;
  }
  .detail-button {
    position: fixed;
    bottom: 0;
    padding: 15px;
    width: 100%;
    background-color: #eee;
    box-sizing: border-box;
    button {
      width: 100%;
      height: 45px;
      background-color: #78d666;
      border: none;
      border-radius: 5px;
      color: #ffe;
    }
  }

  .detail_edit {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    width: 100%;
    box-sizing: border-box;
    align-items: center;
    span {
      display: block;
      padding: 5px;
      input {
        text-align: right;
        border: none;
        height: 30px;
      }
    }
  }

  .detail-main-info-right {
    float: right;
    text-align: right;
    width: 75%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .detailed-edit-center {
    .detailed-edit-center-list {
      background-color: #fff;
      padding: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 15px;
      .detailed-edit-center-info {
        float: right;
        text-align: right;
        width: 80%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
      }
      input {
        width: 100%;
        text-align: right;
        border: none;
      }
    }
  }
  .van-icon-delete {
    display: none;
  }
  .detailed-edit-button {
    width: 100%;
    padding: 15px 10px;
    box-sizing: border-box;
    button {
      width: 100%;
      padding: 15px;
      background-color: #78d666;
      border: none;
      border-radius: 5px;
      color: #ffe;
      font-size: 18px;
    }
  }
}
</style>
<style>
.van-image {
  margin-right: 3px;
  border-radius: 5px;
  overflow: hidden;
}
.detailed-edit-center-list .van-uploader__preview-delete {
  display: none;
}
.van-uploader__upload,
.van-uploader__preview {
  margin: 3px;
}
</style>