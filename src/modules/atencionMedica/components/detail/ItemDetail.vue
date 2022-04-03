<template>
  <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      fullscreen
      hide-overlay
      persistent
      :retain-focus="false"
  >
    <v-card tile flat>
      <v-card-title
          v-if="attention"
          class="py-1"
          style="background-color: #125a9c"
      >
        <v-list-item class="pa-0" dark>
          <v-list-item-avatar class="mr-1">
            <v-icon>mdi-file-find</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="title">
              Detalle de Atención Médica RCV No. {{ attention.id }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
                large
                icon
                @click="close"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-card-title>
      <v-container>
        <v-row>
          <v-col cols="12">
            <personal-information :item="attention"/>
          </v-col>
          <v-col cols="12">
            <v-card tile>
              <v-tabs
                  v-model="tab"
                  fixed-tabs
                  right
                  icons-and-text
                  show-arrows
                  :color="tabColor"
              >
                <v-tabs-slider/>
                <v-tab
                    href="#tab-1"
                >
                  <span class="subtitle-1">General</span>
                </v-tab>
                <v-tab
                    href="#tab-2"
                >
                  <v-badge
                      overlap
                      :color="tab === 'tab-2' ? 'teal' : 'grey'"
                      :content="(attention.examenes && String(attention.examenes.length)) || 0"
                      :class="tab === 'tab-2' ? 'teal--text' : 'text--secondary'"
                  >
                    <span class="subtitle-1">Laboratorios</span>
                  </v-badge>
                </v-tab>
                <v-tab
                    href="#tab-3"
                >
                  <span class="subtitle-1">Clasificaciones</span>
                </v-tab>
                <v-tab
                    href="#tab-4"
                >
                  <span class="subtitle-1">Valoraciones</span>
                </v-tab>
                <v-tab
                    href="#tab-5"
                >
                  <v-badge
                      overlap
                      :color="tab === 'tab-5' ? 'purple' : 'grey'"
                      :content="(attention.controles && String(attention.controles.length)) || 0"
                      :class="tab === 'tab-5' ? 'purple--text' : 'text--secondary'"
                  >
                    <span class="subtitle-1">Controles</span>
                  </v-badge>
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
                  <general
                      :item="attention"
                      :color="tabColor"
                  />
                </v-tab-item>
                <v-tab-item
                    value="tab-2"
                >
                  <laboratorios
                      :item="attention"
                      :color="tabColor"
                  />
                </v-tab-item>
                <v-tab-item
                    value="tab-3"
                >
                  <clasificaciones
                      :item="attention"
                      :color="tabColor"
                  />
                </v-tab-item>
                <v-tab-item
                    value="tab-4"
                >
                  <valoraciones
                      :item="attention"
                      :color="tabColor"
                  />
                </v-tab-item>
                <v-tab-item
                    value="tab-5"
                >
                  <controles
                      :item="attention"
                      :color="tabColor"
                  />
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <loading
          :value="loading"
          absolute
      />
    </v-card>
  </v-dialog>
</template>

<script>
import PersonalInformation from './PersonalInformation'
import General from './tabs/General'
import Laboratorios from './tabs/Laboratorios'
import Clasificaciones from "./tabs/Clasificaciones";
import Valoraciones from "./tabs/Valoraciones";
import Controles from "./tabs/Controles";
export default {
  name: 'ItemDetail',
  components: {
    Controles,
    Valoraciones,
    Clasificaciones,
    Laboratorios,
    General,
    PersonalInformation
  },
  data: () => ({
    tab: null,
    loading: false,
    dialog: false,
    attention: null
  }),
  computed: {
    tabColor() {
      return this.tab === 'tab-1'
          ? 'primary'
          : this.tab === 'tab-2'
              ? 'teal'
              : this.tab === 'tab-3'
                  ? 'warning'
                  : this.tab === 'tab-4'
                      ? 'indigo'
                      : 'purple'
    }
  },
  methods: {
    getItem(id) {
      this.loading = true
      this.axios.get(`seguimientos/${id}`)
          .then(response => {
            this.attention = response.data
            this.tab = 1
            this.loading = false
          })
          .catch(error => {
            this.$store.commit('snackbar', {color: 'error', message: `al recuperar el registro de la atención médica.`, error: error})
            this.close()
          })
    },
    open(id = null) {
      if (id) {
        this.getItem(id)
        this.dialog = true
      } else {
        this.$store.commit('snackbar', {color: 'error', message: 'No se ha seleccionado un registro válido de atención médica.'})
      }
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.attention = null
      }, 500)
    }
  }
}
</script>