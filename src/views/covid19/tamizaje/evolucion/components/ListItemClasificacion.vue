<template>
  <v-list two-line flat class="notification-wrap" v-if="obj">
    <v-list-item
        flat
        style="border-bottom: none !important;"
        @click="click = null"
    >
      <v-list-item-avatar class="my-1">
        <v-icon color="orange">mdi-clipboard-list</v-icon>
      </v-list-item-avatar>
      <v-list-item-content class="pa-0">
        <v-list-item-subtitle class="grey--text fs-12 fw-normal">Clasificación del paciente</v-list-item-subtitle>
        <v-list-item-title><h6 class="mb-0 text-justify">{{obj.nombre}}</h6></v-list-item-title>
      </v-list-item-content>
      <v-list-item-action v-if="obj.id !== '6'">
        <v-btn icon color="blue" @click.stop="$emit('click', obj)">
          <v-icon>mdi-help-circle</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'ListItemClasificacion',
        props: {
            clasificacion: {
                type: String,
                Default: null
            },
            version: {
              type: Number,
              Default: 1
            },
            confirmado: {
              type: Number,
              Default: 0
            }
        },
        computed: {
            ...mapGetters([
                'clasificacionesCovid'
            ])
        },
        data: () => ({
          click: null,
           obj: null
        }),
        watch: {
            'clasificacion': {
                handler (val) {
                    val && this.searchClasificacion()
                },
                immediate: true
            },
            'version': {
                handler (val) {
                    val && this.searchClasificacion()
                },
                immediate: true
            },
          'confirmado': {
                handler (val) {
                    val && this.searchClasificacion()
                },
                immediate: true
            }
        },
        methods: {
            searchClasificacion () {
                if (this.clasificacionesCovid) {
                  if (this.clasificacion === '6') {
                    this.obj = this.clasificacionesCovid.find(x => x.id === this.clasificacion)
                  } else if (this.version === 1) {
                    this.obj = this.clasificacionesCovid.find(x => x.id === this.clasificacion && x.version === this.version)
                  } else if (this.version === 2) {
                    this.obj = this.clasificacionesCovid.find(x => x.id === this.clasificacion && x.version === this.version && x.text.includes(this.confirmado ? 'CC' : 'CP'))
                  }
                }
            }
        }
    }
</script>

<style scoped>

</style>