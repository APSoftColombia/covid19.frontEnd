<template>
  <v-dialog v-model="dialog" persistent max-width="800">
    <v-card v-if="contacto">
      <v-toolbar dark color='teal'>
          <v-icon left>fas fa-edit</v-icon>
          <v-toolbar-title>Editar {{ contacto.covid_contacto === 2 ? 'Contacto' : 'Confirmado' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close">
              <v-icon>mdi-close</v-icon>
          </v-btn>
      </v-toolbar>
      <ValidationObserver ref="formContacto" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
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
              <v-row>
                  <v-col cols="12" sm="12" md="12" lg="12">
                      <c-radio
                          v-model="dataContacto.localiza"
                          label="¿Se localizó a la persona?"
                          rules="required"
                          name="localiza a la persona"
                          :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                          item-text="text"
                          item-value="value"
                          :column="!$vuetify.breakpoint.smAndUp"
                      />
                  </v-col>
                  <template v-if="!dataContacto.localiza">
                      <v-col cols="12" sm="12" md="12" lg="12">
                        <c-select-complete
                            v-model="dataContacto.no_efectividad"
                            label="Razon de la no localización"
                            name="razon de la no localizacion"
                            :items="noEfectividades"
                            rules="required"
                        ></c-select-complete>
                      </v-col>
                  </template>
                <template v-else>
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
                          rules="required|numeric|minlength:10|maxlength:10"
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
                    <v-col cols="12" sm="12" md="6" lg="6">
                      <c-date
                          v-model="dataContacto.fecha_nacimiento"
                          label="Fecha de Nacimiento"
                          name="Fecha de Nacimiento"
                          :max="moment().format('YYYY-MM-DD')"
                      >
                      </c-date>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6">
                      <c-select-complete
                          v-model="dataContacto.sexo"
                          label="Sexo"
                          name="sexo"
                          rules="required"
                          :items="[{text: 'Masculino', value: 'M'},{text: 'Femenino', value: 'F'}]"
                          item-text="text"
                          item-value="value"
                      ></c-select-complete>
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
                    <v-col class="pb-0" cols="12" sm="12" v-if="dataContacto.covid_contacto === 2">
                      <c-select-complete
                          v-model="dataContacto.parentesco_id"
                          label="Parentesco con el caso confirmado"
                          name="parentesco"
                          rules="required"
                          :items="parentescosData"
                          item-text="descripcion"
                          item-value="id"
                      >
                      </c-select-complete>
                    </v-col>
                    <v-col class="pb-0" :cols="`${dataContacto.path_documento_parentesco ? '10' : 12}`" :sm="`${dataContacto.path_documento_parentesco ? '10' : 12}`" v-if="dataContacto.covid_contacto === 2">
                        <v-file-input
                            v-model="dataContacto.archivo"
                            :hint="dataContacto.path_documento_parentesco && !dataContacto.archivo ? `Cargado actualmente: ${dataContacto.path_documento_parentesco.split('/')[1]}` : ''"
                            label="Documento que certifica parentesco"
                            prepend-icon="mdi-file-pdf"
                            accept=".pdf"
                            outlined
                            dense
                            persistent-hint
                        ></v-file-input>
                    </v-col>
                    <v-col cols="2" v-if="dataContacto.path_documento_parentesco">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn class="red" dark v-on="on"
                          :disabled="loadingButton"
                          :loading="loadingButton" @click="descargarDocumento"
                          >
                            <v-icon>fas fa-file-download</v-icon>
                          </v-btn>
                        </template>
                        <span>Descargar Documento</span>
                      </v-tooltip>
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
                          :items="productoFinancieroData"
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
                </template>
              </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="close" :loading="loading" :disabled="loading">
            <v-icon>mdi-close</v-icon>
            <span>Cerrar</span>
          </v-btn>
          <v-spacer></v-spacer>
          <p class="caption error--text mb-0 mx-2" v-if="invalid && validated">Hay errores en el formulario</p>
          <v-btn @click.stop="actualizarContacto" class="white--text" color="teal" :loading="loading" :disabled="loading">
            <v-icon left>fas fa-save</v-icon>
            <span>Guardar</span>
          </v-btn>
        </v-card-actions>
      </ValidationObserver>
    </v-card>
    <cet-view
        ref="addContactos"
    ></cet-view>
  </v-dialog>
</template>

<script>
  import {mapGetters} from "vuex";
  const DatosAfiliado = () => import('./DatosAfiliado')
  import CetView from "../CetView";
  export default {
    name: "EditarContacto",
    components: {
      DatosAfiliado,
      CetView
    },
    data: () => ({
      dialog: false,
      dataContacto: {},
      loading: false,
      autorizaEPSValues: [],
      autorizaGiroFam: [],
      contacto: {},
      setNoToAuthEPS: null,
      parentescosData: [],
      productoFinancieroData: [{text: 'No', value: 0}, {text: 'Si', value: 1}],
      loadingButton: false,
      fromMainForm: false,
      noEfectividades: [
          'NO CONTESTA',
          'FUERA DE SERVICIO',
          'APAGADO',
          'SIN NUMERO DE TELEFONO',
          'NO ACEPTAN LA ENCUESTA',
          'EQUIVOCADO',
          'LLAMAR LUEGO',
          'NO SE ENCUENTRA EN LA CIUDAD',
          'FALLAS DE LA PLATAFORMA'
      ]
    }),
    computed: {
      ...mapGetters([
        'parentescos',
        'entidadesFinancieras',
        'departamentos',
        'noEfectividadesOptions'
      ]),
    },
    watch: {
      'dataContacto.entidad_financiera_id': {
        handler(val){
          if(this.dialog && this.dataContacto && val){
            this.productoFinancieroData = [{text: 'Si', value: 1}]
            this.dataContacto.producto_financiero = 1
          }else{
            this.productoFinancieroData = [{text: 'No', value: 0}]
            this.dataContacto.producto_financiero = 0
          }
        },
        immediate: false
      },
      'dataContacto.giro_a_familiar': {
        handler(val){
          if(this.dataContacto.covid_contacto == 1){
            if(val && (this.dataContacto.autoriza_eps == null || !this.dataContacto.autoriza_eps)){
              this.dataContacto.autoriza_eps = 0
              this.dataContacto.comparten_gastos = 1
            }
          }
        }
      }
    },
    methods: {
      open(contacto, setNoToAuthEPS, hasContactos, fromMainForm){
        this.fromMainForm = fromMainForm
        this.dataContacto = {...contacto}
        this.dataContacto.fecha_nacimiento = this.dataContacto.fecha_nacimiento ? this.moment(this.dataContacto.fecha_nacimiento, 'DD/MM/YYYY').format('YYYY-MM-DD') : null
        this.parentescosData = this.parentescos.filter(x => x.id <= 7)
        this.dialog = true
        this.contacto = {...contacto}
         if(hasContactos && hasContactos.length && hasContactos.length > 1 && this.dataContacto.comparten_gastos == null){
          this.dataContacto.comparten_gastos = 1
        }
        if(setNoToAuthEPS && this.dataContacto.id !== setNoToAuthEPS.id) {
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
        if(this.dataContacto.no_efectividad){
             this.dataContacto.localiza = 0
         }else{
             this.dataContacto.localiza = 1
         }
      },
      close(){
        this.dialog = false
        this.contacto = {}
        this.dataContacto = {}
        this.parentescosData = {}
        this.autorizaEPSValues = []
        this.autorizaGiroFam = []
      },
      actualizarContacto(){
        this.$refs.formContacto.validate().then(result => {
          if(result) {
            this.loading = true
            this.dataContacto.id = this.contacto.id
            this.dataContacto.covid_contacto = this.contacto.covid_contacto
            if(!this.dataContacto.localiza){
                this.dataContacto.fallecido = null
                this.dataContacto.producto_financiero = null
                this.dataContacto.entidad_financiera_id = null
                this.dataContacto.giro_a_familiar = null
                this.dataContacto.fecha_expedicion = null
                this.dataContacto.cumple_aislamiento = null
                this.dataContacto.autoriza_eps = null
                this.dataContacto.parentesco_id = null
                this.dataContacto.comparten_gastos = null
            }
            let data = new FormData()
            for (const prop in this.dataContacto) {
              if (this.dataContacto[prop] !== null && typeof this.dataContacto[prop] !== 'undefined') data.append(`${prop}`, this.dataContacto[prop])
            }
            this.axios.post(`infocets-actualizar/${this.contacto.id}`, data).then(response => {
              this.dataContacto = response.data
              if(this.fromMainForm && response.data.comparten_gastos && this.contacto.covid_contacto === 1 && response.data.no_efectividad === null){
                this.$refs.addContactos.open(response.data.id)
              }
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
      },
      descargarDocumento() {
        const apiAxios = this.axios.create()
      apiAxios.defaults.baseURL = `http://apsoft-backend.test/api`
      apiAxios.defaults.headers.common["Authorization"] = `${this.token_type} ${this.access_token}`
        this.loadingButton = true
          this.axios({
            url: `download_documento_parentesco/${this.contacto.id}`,
            method: 'GET',
            responseType: 'blob'
          })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}))
            window.open(url, '_blank')
            this.loadingButton = false
          })
          .catch((error) => {
            this.loadingButton = false
            this.$store.commit('snackbar', {color: 'error', message: `al descargar el archivo.`, error: error})
          })
      }
    },
  }
</script>

<style scoped>

</style>
