<script lang="ts" setup>
import { signIn, signUp, useSession } from '../../lib/auth-client';
import { ref } from 'vue';

useSeoMeta({
  title: "Tela | Log in to your account"
})

const router = useRouter()

var isLoading = ref(false);
var name = ref("");
var email = ref("");
var password = ref("");
var confirm_password = ref("");

const createAccount = async () => {
  if (confirm_password.value !== password.value) {
    alert("Passwords do not match");
    return
  }
  const { data, error } = await signUp.email({
    email: email.value,
    name: name.value,
    password: password.value,
    }, {
    onRequest: (ctx) => {
      isLoading.value = true
    },
    onSuccess: (ctx) => {
      //redirect to the dashboard or sign in page
      router.push("/design/1")
      isLoading.value = false
    },
    onError: (ctx) => {
      // display the error message
      alert(ctx.error.message);
      console.log(ctx.error)
      isLoading.value = false
    },
  });
}

</script>

<template>
  <div class="auth-page">
    <div class="form-section">
      <div class="text-area">
        <div class="logo-container">
          <SvgLogoText />
        </div>
        <label class="anon">
          <span class="geist-regular">Create your account</span>
        </label>
        <form>
          <div class="input-form">
            <label for="name">
              <span class="geist-regular">Name</span>
            </label>
            <input
              placeholder="Enter your fullname"
              type="text"
              name="name"
              required
              v-model="name"
            />
          </div>
          <div class="input-form">
            <label for="email">
              <span class="geist-regular">Email</span>
            </label>
            <input
              placeholder="Enter your email"
              type="email"
              name="email"
              required
              v-model="email"
            />
          </div>
          <div class="input-form">
            <label for="password">
              <span class="geist-regular">Password</span>
            </label>
            <input
              placeholder="Enter your password"
              type="password"
              name="password"
              required
              v-model="password"
            />
          </div>
          <div class="input-form">
            <label for="confirmpassword">
              <span class="geist-regular">Confirm password</span>
            </label>
            <input
              placeholder="Confirm your password"
              type="password"
              name="confirmpassword"
              required
              v-model="confirm_password"
            />
          </div>
        </form>
        <div class="action-button-wrapper">
          <button class="action1" @click="createAccount">
            <span class="geist-medium" v-if="isLoading === false">Create your account</span>
            <ReusablesLoader v-if="isLoading === true" />
          </button>
        </div>
      </div>
      <div class="svg-area">
         <SvgSignupSvg />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth-page {
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  // align-items: start;
  row-gap: 100px;
  height: 100vh;
  .form-section {
    display: flex;
    justify-content: space-between;
    align-items: start;
    .text-area {
      width: 450px;
      // border: 1px solid white;
      display: flex;
      flex-direction: column;
      justify-content: start;
      row-gap: 10px;
      .logo-container {
        margin-bottom: 10px;
      }
      .anon {
        all: unset;
        width: fit-content;
        padding: 5px 10px;
        border-radius: 30px;
        border: 1px solid rgba(240, 240, 240, 0.2);
        background: #2C2C2C;
        box-shadow: inset 1px 1px 2px 0.5px rgba(255, 255, 255, 0.1);
        // filter: drop-shadow(2px 4px 4px rgba(0, 0, 0, 0.5));
        span {
          font-size: 15px;
          letter-spacing: -0.8px;
        }
      }
      form {
        display: flex;
        flex-direction: column;
        row-gap: 15px;
        margin: 10px 0px 20px 0px;
        div {
          display: flex;
          flex-direction: column;
          row-gap: 5px;
          label {
            span {
              font-size: 15px;
              letter-spacing: -0.3px;
            }
          }
          input {
            all: unset;
            width: 250px;
            border-radius: 5px;
            height: 24px;
            background: rgba(65, 65, 65, 1);
            border: 1px solid rgba(240, 240, 240, 0.2);
            // box-shadow: inset 1px 1px 2px 0.5px rgba(255, 255, 255, 0.1);
            padding: 5px 10px;
            font-family: "geist-medium";
            font-weight: normal;
            font-size: 15px;
            letter-spacing: -0.3px;
            transition: 0.2s ease-out;
            &:focus {
              border: 1px solid rgba(240, 240, 240, 1);
            }
          }
        }
      }
      .action-button-wrapper {
        display: flex;
        column-gap: 10px;
        button {
          all: unset;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 32px;
          width: 250px;
          padding: 0px 10px;
          border-radius: 30px;
          span {
            font-size: 16px;
            letter-spacing: -0.8px;
          }
        }
        .action1 {
          background: #FFFFFF;
          border: 1px solid rgba(44, 44, 44, 0.2);
          box-shadow: inset 1px 1px 2px 0.5px rgba(44, 44, 44, 0.2);
          color: #000000;
        }
      }
    }
  }
}
</style>