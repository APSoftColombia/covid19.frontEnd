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
              tile
          >
            <v-list>
              <v-list-item
                  :to="encuestaEnCurso ? null : {name: item.routeName}"
                  @click.stop="$emit(encuestaEnCurso? 'goruta' : 'clickitem', item)"
              >
                <v-list-item-avatar size="50" :color="item.color" :class="item.personalIcon ? 'pa-2' : ''">
                  <v-icon size="30" color="white" v-if="!item.personalIcon">{{item.icon}}</v-icon>
                  <template v-else>
                    <icon-base
                        v-if="item.personalIcon === 'Autopsias'"
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
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title><span class="text-truncate">{{item.title}}</span></v-list-item-title>
                  <v-list-item-subtitle class="caption text-truncate">{{item.subtitle}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-hover>
      </v-col>
    </template>
  </v-row>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
name: 'CardsList',
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
  }
}
</script>

<style scoped>

</style>