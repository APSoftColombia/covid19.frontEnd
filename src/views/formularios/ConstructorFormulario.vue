<template>
  <v-container
      fluid
      class="grid-list-md"
  >
    <v-card>
      <page-title-bar :title="model && model.id ? 'Edición de Formulario' : 'Nuevo Formulario'">
        <template slot="actions">
          <v-btn
              icon
              @click="$router.push({name: 'Formularios'})"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </page-title-bar>
      <v-card-text class="ma-0 pa-0">
        <v-container
            fluid
            class="grid-list-md" v-if="model"
        >
          <v-row>
            <v-col
                cols="12"
                class="pb-0"
            >
              <v-text-field
                  v-model="model.nombre"
                  label="Nombre"
                  outlined
                  dense
              />
            </v-col>
            <v-col
                cols="12"
                class="pb-0"
            >
              <v-textarea
                  v-model="model.descripcion"
                  label="Descripción"
                  rows="3"
                  outlined
              />
            </v-col>
            <v-col
                cols="12"
                class="pb-0"
            >
              <v-combobox
                  v-model="model.tipo"
                  :items="tiposFormulario"
                  label="Tipo"
                  outlined
                  dense
              />
            </v-col>
            <v-col
                class="pb-0"
                cols="12"
                sm="6"
            >
              <v-menu
                  v-model="menuFechaInicio"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                      v-on="on"
                      v-model="model.fecha_inicio"
                      label="Inicio"
                      append-outer-icon="mdi-calendar-month"
                      readonly
                      outlined
                      dense
                      clearable
                  />
                </template>
                <v-date-picker
                    v-model="model.fecha_inicio"
                    @input="menuFechaInicio = false"
                    no-title
                />
              </v-menu>
            </v-col>
            <v-col
                class="pb-0"
                cols="12"
                sm="6"
            >
              <v-menu
                  v-model="menuFechaFin"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                      v-on="on"
                      v-model="model.fecha_fin"
                      label="Fin"
                      append-outer-icon="mdi-calendar-month"
                      readonly
                      outlined
                      dense
                      clearable
                  />
                </template>
                <v-date-picker
                    v-model="model.fecha_fin"
                    @input="menuFechaFin = false"
                    no-title
                />
              </v-menu>
            </v-col>
            <v-col
                cols="12"
                sm="6"
                md="3"
                class="pb-0"
            >
              <v-switch
                  color="green"
                  v-model="model.habilitado"
                  label="Habilitado"
              />
            </v-col>
            <v-col
                cols="12"
                sm="6"
                md="3"
                class="pb-0"
            >
              <v-switch
                  color="green"
                  v-model="model.encuestado_activo"
                  label="Activar encuestado"
              />
            </v-col>
            <v-col
                cols="12"
                sm="6"
                md="3"
                class="pb-0"
            >
              <v-switch
                  color="green"
                  v-model="model.ubicacion_activa"
                  label="Activar ubicación"
              />
            </v-col>
            <v-col
                cols="12"
                sm="6"
                md="3"
                class="pb-0"
            >
              <v-switch
                  color="primary"
                  v-model="model.principal"
                  label="Formulario Principal"
                  :true-value="1"
                  :false-value="0"
              />
            </v-col>
            <v-col
                cols="12"
                sm="12"
                md="6"
                class="pb-0"
            >
              <v-autocomplete
                  v-model="model.formulario_individual_uuid"
                  :label="(model.formulario_individual_uuid ? 'F' : 'Seleccionar f') + 'ormulario para anidar'"
                  :items="formularios"
                  item-value="uuid"
                  item-text="nombre"
                  outlined
                  dense
              />
            </v-col>
          </v-row>
          <v-row>
            <template v-for="(seccion, indexSeccion) in model.secciones">
              <v-col
                  cols="12"
                  :key="`seccion${indexSeccion}`"
              >
                <seccion
                    :secciones="model.secciones"
                    :seccion="seccion"
                    :index="indexSeccion"
                    :last="indexSeccion === (model.secciones.length - 1)"
                    @down="down(indexSeccion)"
                    @up="up(indexSeccion)"
                    @deleteseccion="model.secciones.splice(indexSeccion, 1)"
                />
              </v-col>
            </template>
          </v-row>
          <v-row
              align="center"
              justify="center"
          >
            <v-btn
                color="primary"
                @click="addSeccion"
            >
              <v-icon left>mdi-plus</v-icon>
              Añadir Sección
            </v-btn>
          </v-row>
        </v-container>
        <template>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-btn
                  v-on="on"
                  fab
                  fixed
                  bottom
                  left
                  @click="$router.push({name: 'Formularios'})"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Cancelar</span>
          </v-tooltip>
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-btn
                  @click="submit"
                  v-on="on"
                  color="primary"
                  fab
                  fixed
                  bottom
                  right
              >
                <v-icon>fas fa-save</v-icon>
              </v-btn>
            </template>
            <span>Guardar Formulario</span>
          </v-tooltip>
        </template>
      </v-card-text>
      <app-section-loader :status="loading"/>
    </v-card>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
const Seccion = () => import('Views/formularios/components/Seccion')
export default {
  name: 'ConstructorFormulario',
  props: {
    uuid: {
      type: String,
      default: null
    }
  },
  components: {
    Seccion
  },
  data: () => ({
    loading: false,
    menuFechaInicio: false,
    menuFechaFin: false,
    model: null,
    makeModel: {
      id: null,
      uuid: null,
      nombre: null,
      descripcion: null,
      tipo: null,
      fecha_inicio: null,
      fecha_fin: null,
      habilitado: 1,
      principal: 1,
      encuestado_activo: 1,
      ubicacion_activa: 1,
      portada_id: null,
      formulario_individual_uuid: null,
      secciones: []
    },
    makeSeccion: {
      id: null,
      nombre: null,
      orden: null,
      preguntas: [],
      es_dependiente: 0,
      pregunta_condicional_id: null,
      pregunta_condicional_uuid: null,
      respuesta_condicional_id: null,
      respuesta_condicional_uuid: null,
      valor_condicional: null,
      operador: null
    }
  }),
  watch: {
    uuid: {
      handler(val) {
        val ? this.assignModel(val) : this.resetModel()
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters([
      'tiposFormulario',
      'formularios'
    ])
  },
  created() {
    this.getFuentesDatos()
  },
  methods: {
    submit() {
      this.loading = true
      this.$store.dispatch('guardarFormulario', this.model)
          .then(response => {
            if (response) {
              this.$store.commit('snackbar', {
                color: 'success',
                message: 'El formulario se ha guardado correctamente.'
              })
              this.assignModel(this.model.uuid)
            }
            this.loading = false
          })
    },
    up(index) {
      if (index > 0) {
        let ahora = this.clone(this.model.secciones[index])
        let anterior = this.clone(this.model.secciones[index - 1])
        this.model.secciones.splice((index - 1), 1, ahora)
        this.model.secciones.splice(index, 1, anterior)
      }
    },
    down(index) {
      if (index < (this.model.secciones.length - 1)) {
        let ahora = this.clone(this.model.secciones[index])
        let posterior = this.clone(this.model.secciones[index + 1])
        this.model.secciones.splice((index + 1), 1, ahora)
        this.model.secciones.splice(index, 1, posterior)
      }
    },
    addSeccion() {
      this.model.secciones.push(this.clone(this.makeSeccion))
    },
    async assignModel(uuid) {
      let registro = null
      this.loading = true
      await this.$store.dispatch('getFormulario', uuid).then(response => {
        if (response) registro = this.clone(this.$store.getters.formularioByUUID(uuid))
        this.loading = false
      })
      registro.secciones || (registro.secciones = [])
      this.model = registro
    },
    resetModel() {
      this.model = this.clone(this.makeModel)
      this.model.uuid = this.$uuid.v1()
      this.$store.dispatch('getFormulario').then(() => {
        this.loading = false
      })
    },
    getFuentesDatos() {
      this.$store.dispatch('getFuentesDatos')
    }
  }
}
</script>
