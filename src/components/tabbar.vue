<template>
  <div class="m-tabbar">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="less">
.m-tabbar {
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  flex-basis: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  color: #c9c9c9;
  border-top: 1px solid #c1c1c1;
  height: 50px;
  background-color: #fff;
}
</style>
