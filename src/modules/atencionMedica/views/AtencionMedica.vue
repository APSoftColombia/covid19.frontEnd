<template>
  <v-container fluid>
    <page-title-bar title="Atenciones Médicas RCV">
      <template slot="actions">
        <excel-file-uploader
            v-if="permisos.manageFile"
        />
        <v-divider
            v-if="permisos.manageFile && permisos.create"
            class="mx-6"
            vertical
            inset
        />
        <c-tooltip
            v-if="permisos.create"
            tooltip="Crear atención médica"
            top
        >
          <v-btn
              color="primary"
              depressed
              :small="$vuetify.breakpoint.xsOnly"
              fab
              @click="createItem"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </c-tooltip>
      </template>
    </page-title-bar>
    <v-row>
      <v-col cols="12">
        <v-card tile flat>
          <template v-if="!isPrestador">
            <v-tabs
                v-model="tab"
                fixed-tabs
                right
                icons-and-text
                show-arrows
            >
              <v-tabs-slider/>
              <v-tab
                  href="#tab-1"
              >
                <span class="subtitle-1">Registros de atención</span>
              </v-tab>
              <v-tab
                  href="#tab-2"
              >
                <span class="subtitle-1">Cargues masivos</span>
              </v-tab>
            </v-tabs>
            <v-tabs-items
                v-model="tab"
                class="mt-2"
                touchless
            >
              <v-tab-item
                  value="tab-1"
              >
                <Attentions/>
              </v-tab-item>
              <v-tab-item
                  value="tab-2"
              >
                <loads/>
              </v-tab-item>
            </v-tabs-items>
          </template>
          <loads v-else/>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ExcelFileUploader from '../components/ExcelFileUploader'
import Attentions from '../components/Attentions/Attentions'
import {mapGetters} from 'vuex'
import Loads from '../components/Loads/Loads'

export default {
  name: 'AtencionMedica',
  components: {
    Loads,
    Attentions,
    ExcelFileUploader
  },
  data: () => ({
    tab: null
  }),
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    isPrestador () {
      return this.getUser?.cod_ips
    },
    permisos () {
      return this.$store.getters.getPermissionModule('atencionMedicaRCV')
    }
  },
  watch: {
    isPrestador: {
      handler (val) {
        if(val){
          setTimeout(() => {
            this.tab === 'tab-2'
          }, 5000)
        }
      },
      immediate: true
    }
  },
  methods: {
    createItem() {
      // this.$refs.registerItem.open()
    }
  }
}
</script>