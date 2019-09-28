<template>
  <div class="total">
    <div class="total-list" @click="goToRouter('detailed')">
      <div class="total-list-left">
        <div class="total-list-left-title">账面收入</div>
      </div>
      <div class="total-list-right-money green">{{parseFloat(account.in).toFixed(2)}}</div>
    </div>
    <div class="total-list" @click="goToRouter('detailed')">
      <div class="total-list-left">
        <div class="total-list-left-title">账面支出</div>
      </div>
      <div class="total-list-right-money red">{{parseFloat(account.out).toFixed(2)}}</div>
    </div>
    <div class="total-list" @click="goToRouter('detailed')">
      <div class="total-list-left">
        <div class="total-list-left-title">账面利润</div>
      </div>
      <div class="total-list-right-money orange">{{parseFloat(account.in-account.out).toFixed(2)}}</div>
    </div>
    <div class="total-transition">待收/待付</div>
    <div class="total-list" @click="goToRouter('wait-income')">
      <div class="total-list-left">
        <div class="total-list-left-title">待收款</div>
      </div>
      <div class="total-list-right-money green">{{parseFloat(list.waitingForPayment).toFixed(2)}}</div>
    </div>
    <div class="total-list" @click="goToRouter('wait-out')">
      <div class="total-list-left">
        <div class="total-list-left-title">待付款</div>
      </div>
      <div class="total-list-right-money red">{{parseFloat(list.waitingForCollection).toFixed(2)}}</div>
    </div>
  </div>
</template>

<script>
import api from "../../api";
export default {
  data() {
    return {
      start: 0,
      end: 0,
      list: {},
      account: {}
    };
  },
  components: {},
  methods: {
    constructor() {
      // 总数据
      this.axios
        .get(api.View + localStorage.getItem("token"))
        .then(res => {
          // console.log(res);
          this.list = res.data.data;
          this.account = res.data.data.account;
        })
        .catch(err => {
          console.log(err);
        });
    },
    goToRouter(url) {
      this.$router.push(url);
    }
  },
  created() {
    this.constructor();
  }
};
</script>

<style scoped lang="less">
.total {
  margin-top: 190px;
  .total-list {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    font-size: 16px;
    align-items: center;
    background: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    .total-list-left {
      display: flex;
      align-items: center;
    }
  }
  .total-transition {
    padding: 5px 15px;
    color: #999;
    font-size: 14px;
  }
  .red {
    color: red !important;
  }
  .green {
    color: green;
  }
  .orange {
    color: orange;
  }
}
</style>
