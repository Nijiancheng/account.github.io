<template>
  <div class="statistics">
    <div class="statistics-info">
      <div class="statistics-top">
        <m-header :title="title"></m-header>
        <div class="statistics-top-main">
          <div class="statistics-left">
            <span class="statistics-datetime small-font">
              <span class="year">{{year}}</span>年
            </span>
            <p class="statistics-datetime">
              <span>{{month}}</span>
              <span class="small_num">月</span>
            </p>
          </div>
          <div class="statistics-center">
            <span class="statistics-datetime small-font">账面收入</span>
            <p class="statistics-datetime">
              <span>{{income_int}}</span>.
              <span class="small_num">{{income_float}}</span>
            </p>
          </div>
          <div class="statistics-right">
            <span class="statistics-datetime small-font">账面支出</span>
            <p class="statistics-datetime">
              <span>{{out_int}}</span>.
              <span class="small_num">{{out_float}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="statistics-top-list">
        <router-link class to="menu">
          <span class="iconfont">&#xe62b;</span>
        </router-link>
        <router-link class to="pie-chart">
          <span class="iconfont">&#xe65f;</span>
        </router-link>
      </div>
      <div class="transition">
        <div class="statistics-left">{{mm}}月{{dd}}日</div>
        <div class="statistics-right">收入{{income_int}}.{{income_float}} 支出{{out_int}}.{{out_float}}</div>
      </div>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
import mHeader from "../components/header";
import api from "../api";
import { PullRefresh } from "vant";
export default {
  data() {
    return {
      title: "账簿",
      out_int: "0",
      out_float: "00",
      income_int: "0",
      income_float: "00",
      month: "",
      year: "",
      yy: "",
      mm: "",
      dd: "",
      isLoading: false
    };
  },
  methods: {
    constructor() {
      // 时间
      var date = new Date();
      let MM = date.getMonth() + 1;
      this.mm = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      this.dd = d < 10 ? "0" + d : d;
      // 账面信息
      this.axios
        .get(api.View + localStorage.getItem("token"))
        .then(response => {
          // console.log(response);
          let out = response.data.data.account.out.split(".");
          let income = response.data.data.account.in.split(".");
          // console.log(out);
          // console.log(income);
          let arr = response.data.data.account.month.split("-");
          this.out_int = out[0];
          this.out_float = out[1];
          this.income_int = income[0];
          this.income_float = income[1];
          this.year = arr[0];
          this.month = arr[1];
          // console.log(arr);
        });
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.isLoading = false;
        this.reload();
      }, 500);
    }
  },
  components: {
    mHeader,
    [PullRefresh.name]: PullRefresh
  },
  created() {
    this.constructor();
  }
};
</script>

<style scoped lang="less">
.statistics {
  .statistics-info {
    position: fixed;
    top: 0;
    z-index: 1000;
    width: 100%;
  }
  .statistics-top {
    background-color: #78d666;
  }
  .statistics-top-main {
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    background-color: #78d666;
    color: #fff;
    text-align: left;
    display: flex;
    padding: 0 15px;
    div {
      flex: 1;
      p {
        font-size: 25px;
        padding: 5px 0;
        .small_num {
          font-size: 14px;
        }
      }
    }
  }
  .small-font {
    font-size: 14px;
  }
  .statistics-top-list {
    min-height: 40px;
    display: flex;
    position: relative;
    left: 0;
    top: 0;
    right: 0;
    background-color: #fff;
    a {
      text-align: center;
      text-decoration: none;
      flex: 1;
      font-size: 16px;
      color: grey;
      font-size: 30px;
      span {
        width: 100%;
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        font-size: 20px;
      }
    }
  }
  .router-link-active span {
    color: #78d666;
    position: relative;
    &::after {
      content: "";
      display: inline-block;
      position: absolute;
      width: 100%;
      height: 2px;
      background-color: #78d666;
      bottom: 1px;
      left: 0px;
    }
  }
  .transition {
    min-height: 30px;
    display: flex;
    padding: 0 15px;
    background-color: #f1f1f1;
    div {
      float: left;
      flex: 1;
      font-size: 14px;
      color: grey;
      /* line-height: 30px; */
      display: flex;
      align-items: center;
    }
    .statistics-right {
      text-align: right;
    }
  }
  .year {
    font-size: 16px;
  }
}
</style>
