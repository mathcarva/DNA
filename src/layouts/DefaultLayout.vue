<template>
  <div class="default-layout" id="default-layout">
    <MobileMenu v-if="!isDesktop" />
    <Menu v-if="isDesktop" />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
    <Footer />
  </div>
</template>

<script>
import Menu from "@components/layout/Menu.vue";
import MobileMenu from "@components/layout/MobileMenu.vue";
import { mapActions, mapGetters } from "vuex";
import Footer from "@components/layout/Footer.vue";
import Sketch from "@three/Sketch";
export default {
  name: "DefaultLayout",
  components: {
    Menu,
    MobileMenu,
    Footer,
  },
  methods: {
    ...mapActions(["setWindowWidth", "setSketch"]),
    
    handleResize() {
      this.setWindowWidth(window.innerWidth);
    },
    
    handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      if(this.sketchInstance && typeof this.sketchInstance.onScroll === "function"){
        this.sketchInstance.onScroll(scrollY);
      }
    }
  },
  computed: {
    ...mapGetters(["isDesktop"]),
  },
  mounted() {
    this.sketchInstance = new Sketch();
    this.setSketch(this.sketchInstance);
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("scroll", this.handleScroll);
  },
};

</script>