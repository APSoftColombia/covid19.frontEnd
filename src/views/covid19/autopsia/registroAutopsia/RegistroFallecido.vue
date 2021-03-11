<template>
  <v-dialog v-model="dialog" persistent max-width="720">
    <template v-slot:activator="{ on }">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn fab color="primary" small dark v-on="on" @click="dialog = true">
            <v-icon>mdi-{{ fallecido ? 'pencil' : 'plus' }}</v-icon>
          </v-btn>
        </template>
        <span>{{ fallecido ? 'Editar' : 'Agregar' }} Datos Fallecido</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-icon left>fas fa-user-tag</v-icon>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">Registro de fallecido</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <ValidationObserver ref="formFallecido" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
          <form-persona
              v-model="persona"
              tipo="fallecido"
              @verificado="val => verificar(val)"
              @responsetamizaje="val => respuestaPersona = val"
          />
        </ValidationObserver>
        <v-card-actions>
          <v-btn @click.stop="close">
            <v-icon>mdi-close</v-icon>
            Cerrar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.stop="guardar">
            <v-icon left>fas fa-save</v-icon>
            Guardar
          </v-btn>
        </v-card-actions>
      </v-container>
      <seguimiento
          ref="seguimiento"
      />
      <v-dialog v-model="dialogx" persistent max-width="1020">
        <v-card class="pt-3">
          <template v-if="respuestaPersona">
            <v-card-text class="text-center"
                         :class="respuestaPersona.mensaje && respuestaPersona.mensaje.id === 1 ? 'green--text' : 'orange--text'">
              <p class="headline mb-0">{{ respuestaPersona.mensaje ? respuestaPersona.mensaje.mensaje : '' }}</p>
            </v-card-text>
            <v-card-text>
              <v-list two-line class="notification-wrap">
                <v-list-item
                    style="border-bottom: none !important;"
                >
                  <v-list-item-avatar class="my-1">
                    <v-icon large color="primary">
                      {{ respuestaPersona.tamizajes[0].sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman' }}
                    </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content class="pa-0">
                    <v-list-item-title>
                      <h6 class="mb-0 text-justify">
                        {{ [respuestaPersona.tamizajes[0].nombre1, respuestaPersona.tamizajes[0].nombre2, respuestaPersona.tamizajes[0].apellido1, respuestaPersona.tamizajes[0].apellido2].filter(x => x).join(' ') }}
                      </h6>
                    </v-list-item-title>
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                      {{ tiposDocumentoIdentidad && respuestaPersona.tamizajes[0].tipo_identificacion ? tiposDocumentoIdentidad.find(x => x.id === respuestaPersona.tamizajes[0].tipo_identificacion).tipo : '' }}{{ respuestaPersona.tamizajes[0].identificacion }}{{ respuestaPersona.tamizajes[0].celular ? ', Cel. ' + respuestaPersona.tamizajes[0].celular : '' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th class="text-left">ID</th>
                    <th class="text-left">Fecha</th>
                    <th class="text-left">Riesgos</th>
                    <th class="text-left">
                      <v-tooltip top>
                        <template v-slot:activator="{on}">
                          <a v-on="on" class="brown--text font-weight-bold">Seg</a>
                        </template>
                        <span>Seguimientos</span>
                      </v-tooltip>
                    </th>
                    <th class="text-left">
                      <v-tooltip top>
                        <template v-slot:activator="{on}">
                          <a v-on="on" class="brown--text font-weight-bold">Estado A.</a>
                        </template>
                        <span>Estado Afectación</span>
                      </v-tooltip>
                    </th>
                    <th class="text-left">Estado Proceso</th>
                    <th class="text-left">Estado Encuesta</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, indexItem) in respuestaPersona.tamizajes" :key="indexItem">
                    <td>
                      <span v-if="isCaller">{{ item.id }}</span>
                      <v-tooltip v-else top>
                        <template v-slot:activator="{on}">
                          <v-btn v-on="on" color="primary" @click="verSeguimiento(item.id)">{{ item.id }}</v-btn>
                        </template>
                        <span>Ver detalle</span>
                      </v-tooltip>
                    </td>
                    <td>{{ moment(item.created_at).format('DD/MM/YYYY') }}</td>
                    <td>
                      <c-chip
                          clase="mr-1"
                          :text="item.cantidad_sintomas || 0"
                          color="indigo"
                          tooltip="Sintomas"
                          text-color="white"
                          label
                      ></c-chip>
                      <c-chip
                          v-if="item.riesgo_procedencia"
                          clase="mr-1"
                          text="V"
                          color="green"
                          tooltip="Antecedentes de viaje"
                          text-color="white"
                          label
                      ></c-chip>
                      <c-chip
                          v-if="item.riesgo_ocupacional"
                          clase="mr-1"
                          text="O"
                          color="blue"
                          tooltip="Es trabajador de la Salud"
                          text-color="white"
                          label
                      ></c-chip>
                      <c-chip
                          v-if="item.riesgo_contacto"
                          clase="mr-1"
                          text="C"
                          color="purple"
                          tooltip="Ha tenido contacto estrecho"
                          text-color="white"
                          label
                      ></c-chip>
                    </td>
                    <td>
                      <c-chip
                          :text="item.seguimientos || 0"
                          color="deep-purple"
                          :tooltip="`Seguimiento${item.seguimientos === 1 ? '' : 's'}`"
                          text-color="white"
                          label
                      ></c-chip>
                    </td>
                    <td>
                      <v-list-item class="pa-0">
                        <v-list-item-content class="pa-0">
                          <v-list-item-title>{{ item.estado_afectacion }}</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ item.ultimo_seguimiento ? moment(item.ultimo_seguimiento).format('DD/MM/YYYY') : '' }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </td>
                    <td>
                      <v-list-item class="pa-0" v-if="respuestaPersona.mensaje && (respuestaPersona.mensaje.id === 2 || respuestaPersona.mensaje.id === 3)">
                        <v-list-item-content class="pa-0">
                          <v-list-item-title>Activo</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ respuestaPersona.mensaje.id === 2 ? 'Pendiente por Asignar' : 'En Caso de Estudio' }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </td>
                    <td>
                      <v-list-item class="pa-0">
                        <v-list-item-content class="pa-0">
                          <v-list-item-title>
                            {{ item.localiza_persona === 1 && item.contesta_encuesta === 1 ? 'Encuesta Realizada' : item.localiza_persona === 0 ? 'Fallida - Persona No Localizado' : item.contesta_encuesta === 0 ? 'Fallida - Persona No Desea Responder' : '' }}
                          </v-list-item-title>
                          <v-list-item-subtitle v-if="item.no_efectividad">
                            {{ item.no_efectividad }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </template>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script>
const Seguimiento = () => import('Views/covid19/tamizaje/Seguimiento')
import FormPersona from 'Views/covid19/tamizaje/FormPersona'
import {mapGetters} from "vuex";

export default {
  name: 'RegistroFallecido',
  props: {
    fallecido: {
      type: Object,
      default: null
    }
  },
  components: {
    Seguimiento,
    FormPersona
  },
  computed: {
    ...mapGetters([
      'tiposDocumentoIdentidad',
      'modelPersona'
    ])
  },
  watch: {
    fallecido: {
      handler(val) {
        val && this.assign()
      },
      immediate: false
    }
  },
  data: () => ({
    verificado: 0,
    dialog: false,
    persona: null,
    dialogx: false,
    respuestaPersona: null
  }),
  created() {
    this.persona = this.clone(this.modelPersona)
  },
  methods: {
    assign() {
      this.persona = this.clone(this.fallecido)
    },
    close() {
      this.dialog = false
    },
    guardar() {
      this.$refs.formFallecido.validate().then(result => {
        if (result) {
          this.$emit('guardar', this.persona)
          this.close()
        } else {
          this.$store.commit('snackbar', {color: 'warning', message: `Hay datos requeridos por diligenciar.`})
        }
      })
    },
    verSeguimiento(id) {
      this.$refs.seguimiento.open(id)
    },
    verificar(val) {
      this.verificado = val
      this.$emit('verificado', val)
      if ((val === -1) || (val === 1 && this.respuestaPersona && this.respuestaPersona.mensaje && this.respuestaPersona.mensaje.id === 1)) this.dialogx = true
    }
  }
}
</script>

<style scoped>

</style>