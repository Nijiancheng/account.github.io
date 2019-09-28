<template>
  <div class="type-mgt">
    <div class="type-mgt-top">
      <mHeader :title="title" :is_goBack="is_goBack"></mHeader>
      <div class="type-mgt-header">
        <router-link to="type_income" class="right">
          <span>收入</span>
        </router-link>
        <router-link to="type_out" class="left">
          <span>支出</span>
        </router-link>
      </div>
    </div>
    <div class="type-mgt-other">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import mHeader from "../../components/header";
import qs from "qs";
export default {
  data() {
    return {
      title: "类别管理",
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
header {
  background-color: #78d666;
}
.type-mgt {
  position: absolute;
  width: 100%;
  min-height: 100%;
  background-color: #fff;
  z-index: 500;
}
.type-mgt-top {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1001;
  .m-topbar {
    background-color: #78d666;
  }
}
.goBack {
  font-size: 25px;
}
.type-mgt-header {
  width: 100%;
  height: 50px;
  display: flex;
  background-color: #fff;
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
.type-mgt-other {
  margin: 100px 0 85px 0;
}
</style>


