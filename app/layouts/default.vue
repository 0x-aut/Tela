<script lang="ts" setup>
const router = useRouter();

const goToLogin = () => {
  router.push('/auth/login')
}
const goToSignup = () => {
  router.push('/auth/signup')
} 


</script>

<template>
  <div class="default-layout">
    <nav>
      <div class="auth-actions-wrapper">
        <button class="auth1" @click="goToLogin">
          <span class="geist-medium">Log in</span>
        </button>
        <button class="auth2" @click="goToSignup">
          <span class="geist-medium">Create an account</span>
        </button>
      </div>
    </nav>
    <div class="body">
      <slot />
    </div>
    <!-- <footer></footer> -->
  </div>
</template>

<style scoped lang="scss">
.default-layout {
  background: #121212;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  // align-items: start;
  row-gap: 75px;
  height: stretch;
  padding: 10px 0px;
  nav {
    display: flex;
    justify-content: right;
    column-gap: 20px;
    width: stretch;
    margin: 0px 60px;
    padding: 10px 0px;
    color: white;
    .auth-actions-wrapper {
      display: flex;
      align-items: center;
      column-gap: 15px;
      button {
        all: unset;
        cursor: pointer;
        height: 32px;
        width: fit-content;
        padding: 0px 15px;
        border-radius: 30px;
        span {
          font-size: 15px;
          letter-spacing: -0.8px;
        }
      }
      .auth1 {
        background: #2C2C2C;
        border: 1px solid rgba(240, 240, 240, 0.2);
        box-shadow: inset 1px 1px 2px 0.5px rgba(255, 255, 255, 0.1);
      }
      .auth2 {
        background: #FFFFFF;
        border: 1px solid rgba(44, 44, 44, 0.2);
        box-shadow: inset 1px 1px 2px 0.5px rgba(44, 44, 44, 0.2);
        color: #000000;
      }
    }
  }
  .body {
    width: stretch;
    margin: 0px 60px;
    // border: 1px solid white;
    color: white;
  }
}
</style>