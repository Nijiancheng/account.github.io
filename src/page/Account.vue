<template>
  <div class="account">
    <div class="account-top">
      <mHeader :title="title" ></mHeader>
      <div class="account-header">
        <router-link to="budget" class="right" :type="2">
          <span>收入</span>
        </router-link>
        <router-link to="out" class="left" :type="1">
          <span>支出</span>
        </router-link>
      </div>
    </div>
    <div class="account-other">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import mHeader from "../components/header";
import qs from "qs";
export default {
  data() {
    return {
      title: "记一笔",
      is_goBack: true
    };
  },
  components: {
    mHeader
  },
  methods: {},
  created() {}
};
</script>

<style scoped lang="less">
.account {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .account-top {
    position: fixed;
    width: 100%;
    .m-topbar {
      background-color: #78d666;
    }
  }
  header {
    background-color: #78d666;
  }
  .account-other {
    padding-top: 105px;
  }
  .goBack {
    font-size: 25px;
  }
  .account-header {
    width: 100%;
    height: 50px;
    display: flex;
    a {
      flex: 1;
      color: #999;
      padding: 5px 0px;
      border-bottom: 2px solid rgba(200, 200, 200, 0.5);
      position: relative;
      line-height: 40px;
      span {
        display: block;
        width: 100px;
        padding: 0 5px;
        text-align: center;
        position: relative;
      }
    }
  }
  .router-link-active {
    color: green !important;
    span::after {
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
  .left::after {
    left: 5px;
  }
  .right span {
    float: right;
    text-align: right;
  }
}
</style>
