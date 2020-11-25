<template>
  <v-dialog v-model="dialog" persistent max-width="700">
    <v-card>
      <v-toolbar dark color='teal'>
        <v-icon left>fas fa-edit</v-icon>
        <v-toolbar-title>Agregar Nuevo Contacto</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <ValidationObserver ref="formContacto" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-switch
                  v-model="tipoBusqueda"
                  color="indigo"
                  :label="tipoBusqueda ? 'busqueda general' : 'busqueda en archivo'"
                  dense
                  class="mx-auto"
              ></v-switch>
              <v-col cols="12" sm="12" md="12" lg="12">
                <buscador-afiliado
                    ref="buscadorafiliado"
                    label="Busqueda de afiliado"
                    name="busqueda de afiliado"
                    v-model="afiliado.afiliado"
                    :ruta="ruta"
                ></buscador-afiliado>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-texto
                    label="Numero Caso"
                    name="numero caso"
                    rules="required"
                    v-model="afiliado.numero_caso"
                ></c-texto>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-date
                    v-model="afiliado.fecha_diagnostico"
                    label="Fecha Diagnostico"
                    name="fecha de diagnostico"
                    :max="moment().format('YYYY-MM-DD')"
                ></c-date>
                <!--rules="required"-->
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6" class="mx-auto mt-0">
                <c-texto
                    label="Numero Unico BDUA"
                    name="numero unico bdua"
                    v-model="afiliado.bdua_afl_id"
                ></c-texto>
                <!--rules="required|maxlength:11"-->
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pb-0" cols="12" sm="12" md="12">
                <c-select-complete
                    v-model="afiliado.codeps"
                    label="EPS a la que está afiliado"
                    rules="required"
                    name="EPS de afiliación"
                    :items="epss"
                    item-value="codigo"
                    item-text="nombre"
                ></c-select-complete>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-texto
                    label="Primer Apellido"
                    name="primer apellido"
                    rules="required"
                    v-model="afiliado.apellido1"
                ></c-texto>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-texto
                    label="Segundo Apellido"
                    name="segundo apellido"
                    v-model="afiliado.apellido2"
                ></c-texto>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-texto
                    label="Primer Nombre"
                    name="primer nombre"
                    rules="required"
                    v-model="afiliado.nombre1"
                ></c-texto>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-texto
                    label="Segundo Nombre"
                    name="segundo nombre"
                    v-model="afiliado.nombre2"
                ></c-texto>
              </v-col>
              <v-col cols="12" sm="12" md="12" lg="12">
                <c-select-complete
                    label="Tipo identificación"
                    name="tipo de identificacion"
                    rules="required"
                    :items="tiposDocumentoIdentidad"
                    item-text="descripcion"
                    item-value="tipo"
                    v-model="afiliado.tipoid"
                ></c-select-complete>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-identificacion
                    label="Número de Identificación"
                    name="identificacion"
                    rules="required|numeric"
                    v-model="afiliado.identificacion"
                ></c-identificacion>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-date
                    v-model="afiliado.fecha_expedicion"
                    label="Fecha de Expedicion de Documento"
                    name="fecha de expedicion de documento"
                    :max="moment().format('YYYY-MM-DD')"
                >
                </c-date>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-date
                    v-model="afiliado.fecha_nacimiento"
                    label="Fecha nacimiento"
                    rules="required"
                    name="fecha nacimiento"
                    :max="moment().format('YYYY-MM-DD')"
                >
                </c-date>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-select-complete
                    v-model="afiliado.sexo"
                    label="Sexo"
                    rules="required"
                    name="sexo"
                    :items="sexosCovid"
                    item-text="text"
                    item-value="value"
                ></c-select-complete>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-texto
                    label="Celular"
                    name="celular"
                    rules="required|minlength:10"
                    v-model="afiliado.celular"
                ></c-texto>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-texto
                    label="Telefono Fijo"
                    name="telefono fijo"
                    rules="numeric|minlength:7"
                    v-model="afiliado.telefono_fijo"
                ></c-texto>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-select-complete
                    v-model="afiliado.entidad_financiera_id"
                    label="Entidad Financiera"
                    name="entidad financiera"
                    :items="entidadesFinancieras"
                    item-text="razon_social"
                    item-value="id"
                ></c-select-complete>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <c-texto
                    label="Email"
                    name="email"
                    rules="email"
                    v-model="afiliado.email"
                ></c-texto>
              </v-col>
              <v-col cols="12" sm="12" md="12" lg="12">
                <c-texto
                    label="Dirección"
                    name="dirección"
                    rules="required"
                    v-model="afiliado.direccion"
                ></c-texto>
              </v-col>
              <v-col class="pb-0" cols="12" sm="12">
                <c-select-complete
                    v-model="afiliado.codigo_departamento"
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
                    :disabled="!afiliado.codigo_departamento"
                    v-model="afiliado.codigo_municipio"
                    label="Municipio"
                    name="municipio"
                    rules="required"
                    :items="departamentos.length && afiliado.codigo_departamento ? departamentos.find(x => x.codigo === afiliado.codigo_departamento).municipios : []"
                    item-text="nombre"
                    item-value="codigo"
                >
                </c-select-complete>
              </v-col>
              <v-col class="pb-0" cols="12" sm="12">
                <c-select-complete
                    v-model="afiliado.parentesco_id"
                    label="Parentesco con el caso confirmado"
                    name="parentesco"
                    rules="required"
                    :items="parentescosData"
                    item-text="descripcion"
                    item-value="id"
                >
                </c-select-complete>
              </v-col>
              <v-col class="pb-0" cols="12" sm="12">
                <v-file-input
                    v-model="afiliado.archivo"
                    label="Documento que certifica parentesco"
                    prepend-icon="mdi-file-pdf"
                    accept=".pdf"
                    outlined
                    dense
                    persistent-hint
                ></v-file-input>
              </v-col>
              <v-col cols="12" sm="12" md="4" lg="4">
                <c-select-complete
                    v-model="afiliado.fallecido"
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
                    v-model="afiliado.producto_financiero"
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
                    v-model="afiliado.giro_a_familiar"
                    label="Autoriza Giro Familiar"
                    name="autoriza giro familiar"
                    rules="required"
                    :items="[{text: 'No', value: 0}]"
                    item-text="text"
                    item-value="value"
                ></c-select-complete>
              </v-col>
              <v-col cols="12" sm="12" md="4" lg="4">
                <c-select-complete
                    v-model="afiliado.cumple_aislamiento"
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
                    v-model="afiliado.autoriza_eps"
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
                    v-model="afiliado.comparten_gastos"
                    label="Comparten Gastos"
                    name="comparten gastos"
                    rules="required"
                    :items="[{text: 'No', value: 0},{text: 'Si', value: 1}]"
                    item-text="text"
                    item-value="value"
                ></c-select-complete>
              </v-col>
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
          <v-btn @click.stop="crearContacto" class="white--text" color="teal" :loading="loading" :disabled="loading">
            <v-icon left>fas fa-save</v-icon>
            <span>Guardar</span>
          </v-btn>
        </v-card-actions>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script>
  import BuscadorAfiliado from "../../../../components/Inputs/BuscadorAfiliado";
  import {mapGetters} from "vuex";
  export default {
    name: "RegistrarAfiliado",
    components: {
      BuscadorAfiliado
    },
    data: () => ({
      dialog: false,
      afiliado: {},
      contacto: null,
      loading: false,
      autorizaEPSValues: [],
      afiliadoConfirmadoID: null,
      parentescosData: null,
      productoFinancieroData: [{text: 'No', value: 0}, {text: 'Si', value: 1}],
      tipoBusqueda: true,
      ruta: 'buscar-afiliado'
    }),
    computed: {
      ...mapGetters([
          "tiposDocumentoIdentidad",
          "sexosCovid",
          "entidadesFinancieras",
          "departamentos",
          "parentescos",
          "epss",
          "municipiosTotal",
      ])
    },
    watch: {
      'tipoBusqueda': {
        handler(val){
          if(val){
            this.ruta = 'buscar-afiliado'
          }else{
            this.ruta = 'buscar-cets'
          }
          console.log(this.ruta)
        }
      },
      'afiliado.afiliado': {
        handler(val) {
          if(val) {
            this.afiliado.nombre1 = val.nombre1
            this.afiliado.nombre2 = val.nombre2
            this.afiliado.apellido1 = val.apellido1
            this.afiliado.apellido2 = val.apellido2
            this.afiliado.tipoid = val.tipo_doc ? val.tipo_doc : val.tipoid
            this.afiliado.identificacion = val.numero_documento_identidad ? val.numero_documento_identidad : val.identificacion
            if(val.tipoid) {
              this.afiliado.fecha_nacimiento = this.moment(val.fecha_nacimiento).format('YYYY-MM-DD')
            }else{
              this.afiliado.fecha_nacimiento = val.fecha_nacimiento
            }
            if(val.telefono_fijo){
              this.afiliado.telefono_fijo = val.telefono_fijo
            }
            if(val.bdua_afl_id){
              this.afiliado.updateAfiliado = true;
              this.afiliado.bdua_afl_id = val.bdua_afl_id
            }
            this.afiliado.sexo = val.sexo
            this.afiliado.celular = val.numero_celular ? val.numero_celular : val.celular
            this.afiliado.email = val.email
            this.afiliado.direccion = val.direccion
            if(val.eps_id){
              if(val.eps_id && this.epss && this.epss.length && this.epss.find(eps => eps.id === val.eps_id)){
                this.afiliado.codeps = this.epss.find(eps => eps.id === val.eps_id).codigo
              }
            }else{
              this.afiliado.codeps = val.codeps
            }
            if(val.centro_poblado_id){
              if(val.centro_poblado_id && this.municipiosTotal && this.municipiosTotal.length && this.municipiosTotal.find(x => x.id === val.centro_poblado_id)){
                let datosMunicipio = this.municipiosTotal.find(x => x.id === val.centro_poblado_id)
                this.afiliado.codigo_municipio = datosMunicipio.codigo
                this.afiliado.codigo_departamento = datosMunicipio.departamento.codigo
              }else{
                this.afiliado.codigo_municipio = null
                this.afiliado.codigo_departamento = null
              }
            }else{
              this.afiliado.codigo_municipio = val.codigo_municipio
              this.afiliado.codigo_departamento = val.codigo_departamento
            }
          }else{
            this.afiliado.nombre1 = null
            this.afiliado.nombre2 = null
            this.afiliado.apellido1 = null
            this.afiliado.apellido2 = null
            this.afiliado.tipoid = null
            this.afiliado.identificacion = null
            this.afiliado.fecha_nacimiento = null
            this.afiliado.sexo = null
            this.afiliado.celular = null
            this.afiliado.email = null
            this.afiliado.direccion = null
            this.afiliado.codigo_municipio = null
            this.afiliado.codigo_departamento = null
            this.afiliado.codigo_municipio = null
            this.afiliado.codigo_departamento = null
            this.afiliado.codeps = null
            this.afiliado.bdua_afl_id = null
            this.afiliado.updateAfiliado = null
          }
        },
        inmediate: true
      },
      'afiliado.entidad_financiera_id': {
        handler(val){
          if(val){
            this.productoFinancieroData = [{text: 'Si', value: 1}]
            this.afiliado.producto_financiero = 1
          }else{
            this.productoFinancieroData = [{text: 'No', value: 0}]
            this.afiliado.producto_financiero = 0
          }
        }
      },
      'afiliado.afiliado.eps_id': {
        handler(val) {
          if(!val) {
            this.afiliado.codeps = null
          }
        }
      },
      'afiliado.giro_a_familiar': {
        handler(val){
          if(val){
            this.afiliado.autoriza_eps = 0
          }
        },
        inmediate: true
      }
    },
    methods: {
      open(afiliadoConfirmado = null, setNoToAuthEPS = null, hasContactos = null){
        if(hasContactos && hasContactos.length && hasContactos.length > 1){
          this.afiliado.comparten_gastos = 1
        }
        this.parentescosData = this.parentescos.filter(x => x.id <= 7)
        this.afiliado.numero_caso = afiliadoConfirmado.numero_caso
        this.afiliado.id_bdua_af_confirmado = afiliadoConfirmado.bdua_afl_id
        this.afiliado.tipoid_af_confirmado = afiliadoConfirmado.tipoid
        this.afiliado.identificacion_af_confirmado = afiliadoConfirmado.identificacion
        this.afiliado.cet_id = afiliadoConfirmado.cet_id
        this.afiliado.giro_a_familiar = 0
        this.afiliado.producto_financiero = 0
        this.afiliadoConfirmadoID = afiliadoConfirmado.id
        this.dialog = true
        this.afiliado.comparten_gastos = 1
        if(setNoToAuthEPS) {
          this.afiliado.autoriza_eps = 0;
          this.autorizaEPSValues = [
            {text: 'No', value: 0},
          ]
        }else{
          this.autorizaEPSValues = [
            {text: 'No', value: 0},
            {text: 'Si', value: 1}
          ]
        }
      },
      close(){
        this.dialog = false
        this.loading = false
        this.afiliado = {}
        this.afiliadoConfirmadoID = null
        this.autorizaEPSValues = []
      },
      crearContacto(){
        this.$refs.formContacto.validate().then(async result => {
          if(result) {
            this.loading = true
            this.afiliado.covid_contacto = 2
            let data = new FormData()
            for (const prop in this.afiliado) {
              if (this.afiliado[prop] !== null && typeof this.afiliado[prop] !== 'undefined') data.append(`${prop}`, this.afiliado[prop])
            }
            this.axios.post('infocets', data).then(response => {
              response
              this.$emit('contactoCreado', this.afiliadoConfirmadoID)
              this.loading = false
              this.close()
            }).catch(error => {
              this.loading = false
              this.$store.commit('snackbar', {color: 'error', message: ' al crear al contacto', error: error})
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>