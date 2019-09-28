<template>
  <div class="m-topbar">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.m-topbar {
  display: flex;
  align-items: center;
  padding:5px;
  height: 44px;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0);
  color: #fff;
  justify-content: space-between;
}
</style>