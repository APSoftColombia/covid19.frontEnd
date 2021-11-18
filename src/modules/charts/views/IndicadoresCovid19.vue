<template>
  <v-container fluid>
    <page-title-bar title="Indicadores Covid-19"/>
    <v-row>
      <v-col
          cols="12"
          sm="12"
          md="12"
          lg="12"
          xl="8"
          offset-xl="2"
      >
        <v-tabs
            :vertical="$vuetify.breakpoint.mdAndUp"
            show-arrows
        >
          <template v-for="(item, indexItem) in packs">
            <v-tab
                :key="`tab-${indexItem}`"
                style="max-width: 250px !important; padding-left: 8px !important; padding-right: 8px !important;"
                :style="$vuetify.breakpoint.mdAndUp ? 'padding-top: 14px !important; display: block !important;' : ''"
                class="text-truncate"
            >
              <p class="text-start">{{ item.title }}</p>
            </v-tab>
          </template>
          <template v-for="(item, indexItem) in packs">
            <v-tab-item
                :key="`tab-item${indexItem}`"
            >
              <v-container fluid :class="$vuetify.breakpoint.smAndDown ? 'pt-6' : ''">
                <pack-chart
                    ref="packNo"
                    :init-pack="item"
                    external-filters
                    :height-chart="200"
                >
                  <template v-slot:externalfilters>
                    <v-col
                        cols="12"
                        sm="6"
                        md="3"
                        class="text-end"
                    >
                      <v-text-field
                          label="Outlined"
                          placeholder="Placeholder"
                          outlined
                          dense
                          @input="val => makeExternalFiltersString(indexItem, val)"
                      />
                    </v-col>
                    <v-col
                        cols="2"
                        sm="1"
                        class="text-end"
                    >
                      <v-btn
                          color="primary"
                          icon
                          @click="$refs.packNo[indexItem].packInit(item.id)"
                      >
                        <v-icon>mdi-reload</v-icon>
                      </v-btn>
                    </v-col>
                  </template>
                </pack-chart>
              </v-container>
            </v-tab-item>
          </template>
        </v-tabs>
      </v-col>
    </v-row>
    <app-section-loader :status="loading"/>
  </v-container>
</template>

<script>
import PackChart from '@/modules/charts/components/PackChart'
export default {
  name: 'Charts',
  components: {
    PackChart
  },
  data: () => ({
    loading: false,
    packs: [],
    tab: null,
    algo: null
  }),
  created () {
    this.getPackx()
  },
  methods: {
    makeExternalFiltersString (indexItem, val) {
      console.log('indexItemindexItem', `${indexItem} y val = ${val}`)
      let string = ''
      if (val) string = string + `valorfilter[filter]=${val}`
      console.log('string', string)
      this.$refs.packNo[indexItem].externalFilterStringDefine(string)
    },
    getPackx () {
      this.loading = true
      this.axios.get('graphic_reports')
        .then(response => {
          console.log('response', response.data)
          this.packs = response.data
          this.loading = false
        })
        .catch(error => {
          this.$store.commit('snackbar', {
            color: 'error',
            message: 'al recuperar los packs de gráficas.',
            error: error
          })
          this.loading = false
        })
    }
  }
}
</script>
