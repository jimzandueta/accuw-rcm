<template>
  <div class="search">
    <div class="main-j is-full" :style="mainBGStyle">
      <b-field class="searchbar">
          <b-input
              rounded
              type="search"
              icon-right="magnify">
          </b-input>
      </b-field>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .search {
    width: 90%;
    height: 80%;
    min-width: 1229px;
    min-height: 614px;
  }
  .main-j {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      background-size: cover;
      width: 100%;
      height: calc(100vh - 20%);
      position: relative;
      box-shadow: -2px 6px 9px 0px rgba(0,0,0,0.59);
      -webkit-box-shadow: -2px 6px 9px 0px rgba(0,0,0,0.59);
      -moz-box-shadow: -2px 6px 9px 0px rgba(0,0,0,0.59);
      .searchbar {
        margin: 1em;
        width: 40%;
      }
  }
</style>
