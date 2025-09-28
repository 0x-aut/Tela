<script lang="ts" setup>



useSeoMeta({
  title: "Tela | Design better in a fluid pattern"
})


</script>

<template>
  <div class="homepage">
    <div class="hero-section">
      <div class="text-area">
        <div class="logo-container">
          <SvgLogoText />
        </div>
        <label class="anon geist-medium">
          <span class="geist-regular">Public alpha</span>
        </label>
        <h1 class="main-header geist-medium">Design better in a fluid manner</h1>
        <p class="sub-text geist-regular">
          Tela helps you design whatever you want better in a fluid pattern,
          giving you the collaborative flexibility when needed
        </p>
        <div class="action-button-wrapper">
          <button class="action1">
            <span class="geist-medium">Get started</span>
          </button>
          <button class="action2 geist-medium">
            <span class="geist-medium">Watch the demo</span>
          </button>
        </div>
      </div>
      <div class="svg-area">
        <!-- SVG to manipulate goes here -->
         <SvgHeroSvg />
      </div>
      <!-- We are going to use svg because it is better to manipulate with gsap or animejs -->
    </div>
    <div class="large-text-container">
      <p class="geist-regular">
        Tela aims to collaboratively give you the ability to design fluidly and easily, this means building whatever you can imagine in a fluid manner, now with the help of AI right in your canvas
      </p>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.homepage {
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  // align-items: start;
  row-gap: 100px;
  .hero-section {
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
      }
      h1 {
        margin: 0;
        font-size: 48px;
        letter-spacing: -2px;
      }
      p {
        margin: 0;
        font-size: 24px;
        font-weight: normal;
        letter-spacing: -0.5px;
        opacity: 0.8;
      }
      .action-button-wrapper {
        display: flex;
        column-gap: 10px;
        button {
          all: unset;
          cursor: pointer;
          height: 40px;
          width: fit-content;
          padding: 0px 15px;
          border-radius: 7.5px;
          span {
            font-size: 16px;
            letter-spacing: -0.8px;
          }
        }
        .action1 {
          background: #2C2C2C;
          border: 1px solid rgba(240, 240, 240, 0.2);
          box-shadow: inset 1px 1px 2px 0.5px rgba(255, 255, 255, 0.1);
        }
        .action2 {
          background: #FFFFFF;
          border: 1px solid rgba(44, 44, 44, 0.2);
          box-shadow: inset 1px 1px 2px 0.5px rgba(44, 44, 44, 0.2);
          color: #000000;
        }
      }
    }
  }
  .large-text-container {
    display: flex;
    p {
      font-size: 42px;
      text-align: center;
      margin: 0;
      letter-spacing: -1px;
    }
  }
}
</style>