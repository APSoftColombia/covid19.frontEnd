<template>
  <v-row no-gutters>
    <template v-for="(item, index) in itemsMenu">
      <v-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="2"
          :key="index"
      >
        <v-hover v-slot:default="{ hover }">
          <v-card
              :to="encuestaEnCurso ? null : {name: item.routeName}"
              @click.stop="$emit(encuestaEnCurso? 'goruta' : 'clickitem', item)"
              tile
              :color="item.color"
              :elevation="hover ? 20 : 1"
              :class="{ 'on-hover': hover }"
          >
            <v-card-text class="text-center title white--text" style="min-height: 226px !important; max-height: 226px !important;">
              <v-icon size="140" v-if="!item.personalIcon">{{item.icon}}</v-icon>
              <template v-else>
                <icon-base
                    v-if="item.personalIcon === 'Autopsias'"
                    width="131"
                    height="131"
                    view-box="0 0 528.000000 518.000000"
                    icon-name="autopsia"
                >
                  <autopsia
                      :fill="'rgba(255, 255, 255, 1)'"
                      translatex="-100.00000"
                      translatey="510.00000"
                  ></autopsia>
                </icon-base>
              </template>
              <br/>
              <div :class="item.subtitle ? '' : 'mt-4 mb-1'">{{item.title}}</div>
              <div class="caption">{{item.subtitle}}</div>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </template>
  </v-row>
</template>

<script>
import {mapGetters} from "vuex";

export default {
name: 'Cards',
  props: {
    itemsMenu: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters([
      'encuestaEnCurso'
    ])
  },
}
</script>

<style scoped>

</style>