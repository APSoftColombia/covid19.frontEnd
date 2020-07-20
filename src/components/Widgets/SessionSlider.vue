<!-- Session Slider -->
<template>
  <div>
    <slick :options="slickOptions">
      <template v-for="testimonial in loginImages">
        <div class="session-slider" :key="testimonial.id">
          <div class="slider-content">
            <img :src="testimonial.avatar" height="100%" />
          </div>
        </div>
      </template>
    </slick>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import Slick from 'vue-slick'

  export default {
    components: {
      Slick
    },
    computed: {
      ...mapGetters([
        'loginImages'
      ]),
      slickOptions() {
        return {
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          arrows: false
        }
      }
    }
  }
</script>
