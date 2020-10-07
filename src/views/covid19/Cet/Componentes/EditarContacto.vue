<template>
  <v-dialog v-model="dialog" persistent max-width="800">
    <template v-slot:activator="{on}">
      <v-btn
          color="blue"
          icon
          v-on="on"
          @click.stop="dialog = true"
      >
        <v-icon>far fa-edit</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color='indigo'>
          <v-icon left>fas fa-edit</v-icon>
          <v-toolbar-title>Editar {{ contacto.covid_contacto === 2 ? 'Contacto' : 'Confirmado' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
          </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-container fluid>
          <v-row>
            <datos-afiliado
                :afiliado="contacto"
                :abierto="true"
                :readOnly="true"
                :flat="true"
                :columMD="4"
            ></datos-afiliado>
          </v-row>
          <ValidationObserver ref="formContacto" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
            <v-row>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-texto
                    label="Telefono Fijo"
                    name="telefono fijo"
                    rules="numeric|minlength:7"
                    v-model="dataContacto.telefono_fijo"
                ></c-texto>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-texto
                    label="Celular"
                    name="celular"
                    rules="required|numeric|minlength:10"
                    v-model="dataContacto.celular"
                ></c-texto>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-select-complete
                    v-model="dataContacto.entidad_financiera_id"
                    label="Entidad Financiera"
                    name="entidad financiera"
                    :items="entidadesFinancieras"
                    item-text="razon_social"
                    item-value="id"
                ></c-select-complete>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-date
                    v-model="dataContacto.fecha_expedicion"
                    label="Fecha de Expedicion de Documento"
                    name="fecha de expedicion de documento"
                    rules="required"
                    :max="moment().format('YYYY-MM-DD')"
                >
                </c-date>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-texto
                    label="Email"
                    name="email"
                    rules="email"
                    v-model="dataContacto.email"
                ></c-texto>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-texto
                    label="Dirección"
                    name="dirección"
                    rules="required"
                    v-model="dataContacto.direccion"
                ></c-texto>
              </v-col>
              <v-col class="pb-0" cols="12" sm="12">
                <c-select-complete
                    v-model="dataContacto.codigo_departamento"
                    label="Departamento"
                    name="departamento"
                    rules="required"
                    :items="departamentos"
                    item-text="nombre"
                    item-value="codigo"
                >
                </c-select-complete>
              </v-col>
              <v-col class="pb-0" cols="12" sm="12">
                <c-select-complete
                    :disabled="!dataContacto.codigo_departamento"
                    v-model="dataContacto.codigo_municipio"
                    label="Municipio"
                    name="municipio"
                    rules="required"
                    :items="departamentos.length && dataContacto.codigo_departamento ? departamentos.find(x => x.codigo === dataContacto.codigo_departamento).municipios : []"
                    item-text="nombre"
                    item-value="codigo"
                >
                </c-select-complete>
              </v-col>
              <v-col class="pb-0" cols="12" sm="12" v-if="!afiliado">
                <c-select-complete
                    v-model="dataContacto.parentesco_id"
                    label="Parentesco con el caso confirmado"
                    name="parentesco"
                    rules="required"
                    :items="parentescos"
                    item-text="descripcion"
                    item-value="id"
                >
                </c-select-complete>
              </v-col>
              <v-col cols="12" sm="12" md="4" lg="4">
                <c-select-complete
                    v-model="dataContacto.fallecido"
                    label="Fallecido"
                    name="fallecido"
                    rules="required"
                    :items="[{text: 'No', value: 0},{text: 'Si', value: 1}]"
                    item-text="text"
                    item-value="value"
                ></c-select-complete>
              </v-col>
              <v-col cols="12" sm="12" md="4" lg="4">
                <c-select-complete
                    v-model="dataContacto.producto_financiero"
                    label="Tiene Producto Financiero"
                    name="producto financiero"
                    rules="required"
                    :items="[{text: 'No', value: 0},{text: 'Si', value: 1}]"
                    item-text="text"
                    item-value="value"
                ></c-select-complete>
              </v-col>
              <v-col cols="12" sm="12" md="4" lg="4">
                <c-select-complete
                    v-model="dataContacto.giro_a_familiar"
                    label="Autoriza Giro Familiar"
                    name="autoriza giro familiar"
                    rules="required"
                    :items="autorizaGiroFam"
                    item-text="text"
                    item-value="value"
                ></c-select-complete>
              </v-col>
              <v-col cols="12" sm="12" md="4" lg="4">
                <c-select-complete
                    v-model="dataContacto.cumple_aislamiento"
                    label="Cumple Aislamiento"
                    name="cumple aislamiento"
                    rules="required"
                    :items="[{text: 'No', value: 0},{text: 'Si', value: 1}]"
                    item-text="text"
                    item-value="value"
                ></c-select-complete>
              </v-col>
              <v-col cols="12" sm="12" md="4" lg="4">
                <c-select-complete
                    v-model="dataContacto.autoriza_eps"
                    label="Autoriza EPS"
                    name="autoriza eps"
                    rules="required"
                    :items="autorizaEPSValues"
                    item-text="text"
                    item-value="value"
                ></c-select-complete>
              </v-col>
              <v-col cols="12" sm="12" md="4" lg="4">
                <c-select-complete
                    v-model="dataContacto.comparten_gastos"
                    label="Comparten Gastos"
                    name="comparten gastos"
                    rules="required"
                    :items="[{text: 'No', value: 0},{text: 'Si', value: 1}]"
                    item-text="text"
                    item-value="value"
                ></c-select-complete>
              </v-col>
            </v-row>
          </ValidationObserver>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="dialog = false" :loading="loading" :disabled="loading">
          <v-icon>mdi-close</v-icon>
          <span>Cerrar</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click.stop="actualizarContacto" class="white--text" color="indigo" :loading="loading" :disabled="loading">
          <v-icon left>fas fa-save</v-icon>
          <span>Guardar</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import {mapGetters} from "vuex";
  const DatosAfiliado = () => import('./DatosAfiliado')

  export default {
    name: "EditarContacto",
    props: {
      contacto: {
        type: Object,
        default: null
      },
      afiliado: {
        type: Object,
        default: null
      },
      setNoToAuthEPS: {
        type: Object,
        default: null
      }
    },
    components: {
      DatosAfiliado
    },
    data: () => ({
      dialog: false,
      dataContacto: {},
      loading: false,
      autorizaEPSValues: [],
      autorizaGiroFam: []
    }),
    computed: {
      ...mapGetters([
        'parentescos',
        'entidadesFinancieras',
        'departamentos'
      ]),
    },
    watch: {
      contacto: {
        handler(val){
          val && this.setData()
        },
        inmediate: true
      },
      'contacto.codigo_departamento': {
        handler (val) {
          if (!val) {
            this.contacto.codigo_municipio = null
          }
        },
        immediate: false
      },
    },
    methods: {
      setData(){
        this.dataContacto = {...this.contacto}
        if(this.setNoToAuthEPS && this.dataContacto.id !== this.setNoToAuthEPS.id) {
          this.dataContacto.autoriza_eps = 0;
          this.autorizaEPSValues = [
            {text: 'No', value: 0},
          ]
        }else{
          this.autorizaEPSValues = [
            {text: 'No', value: 0},
            {text: 'Si', value: 1}
          ]
        }
        if(this.dataContacto.covid_contacto === 1){
          this.autorizaGiroFam = [
              {text: 'No', value: 0},
              {text: 'Si', value: 1}
          ]
        }else{
          this.dataContacto.giro_a_familiar = 0
          this.autorizaGiroFam = [
            {text: 'No', value: 0},
          ]
        }
      },
      actualizarContacto(){
        this.$refs.formContacto.validate().then(result => {
          if(result) {
            this.loading = true
            this.dataContacto.id = this.contacto.id
            this.dataContacto.covid_contacto = this.contacto.covid_contacto
            this.axios.put(`infocets/${this.contacto.id}`, this.dataContacto).then(response => {
              this.dataContacto = response.data
              this.$store.commit('snackbar', {color: 'success', message: 'contacto editado con exito'})
              this.$emit('editado')
              this.loading = false
              this.dialog = false
            }).catch(error => {
              this.$store.commit('snackbar', {color: 'error', message: 'contacto editado con exito', error: error})
              this.loading = false
            })
          }
        })
      }
    },
    created() {
      this.setData()
    }
  }
</script>

<style scoped>

</style>