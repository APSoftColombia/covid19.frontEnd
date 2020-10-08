<template>
  <v-dialog v-model="dialog" width="1000px">
    <v-card v-if="contacto">
      <v-toolbar dark color='indigo'>
        <v-icon left>fas fa-clipboard-list</v-icon>
        <v-toolbar-title>{{ contacto.numero_caso ? 'Caso No.' + contacto.numero_caso : '' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <div class="mt-5">
          <v-row v-if="contacto.covid_contacto === 2 && contacto.confirmado">
            <v-col cols="12">
              <div class="text-center font-weight-bold">
                <p>Datos del Confirmado</p>
              </div>
              <datos-afiliado
                  :afiliado="contacto.confirmado"
                  :abierto="true"
                  :readOnly="true"
                  :flat="true"
                  :columMD="4"
              ></datos-afiliado>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <div class="text-center font-weight-bold">
                <p>{{ contacto.covid_contacto === 2 ? 'Datos del Contacto' : 'Datos del Confirmado'}}</p>
              </div>
            </v-col>
            <template v-for="(item, indexItem) in datos">
              <v-col cols="12" :md="item.colmd" :lg="item.collg" xl="3" :key="`col${indexItem}`">
                <v-list two-line class="notification-wrap">
                  <v-list-item>
                    <v-list-item-avatar class="my-1">
                      <v-icon :color="item.iconColor">{{item.icon}}</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">{{item.label}}</v-list-item-subtitle>
                      <v-list-item-title><h6 class="mb-0">{{item.body}}</h6></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action v-if="item.action">
                      <v-list-item-action-text>{{item.action}}</v-list-item-action-text>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-col>
            </template>
          </v-row>
        </div>
      </v-card-text>
      <v-divider class="pa-0 ma-0"></v-divider>
      <v-card-actions class="justify-center">
        <v-btn block text @click="close">Cerrar</v-btn>
      </v-card-actions>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
  import {mapGetters} from "vuex";
  const DatosAfiliado = () => import('./Componentes/DatosAfiliado')
  export default {
    name: "InformacionContacto",
    data: () => ({
      contacto: [],
      datos: [],
      dialog: false,
      loading: false
    }),
    components: {
      DatosAfiliado
    },
    computed: {
      ...mapGetters([
        'epss',
        'municipiosTotal',
        'parentescos',
        'entidadesFinancieras'
      ]),
    },
    methods: {
      open(id = null){
        if(id){
          this.dialog = true
          this.getInfoContacto(id)
        }
      },
      close(){
        this.contacto = []
        this.dialog = false
      },
      getInfoContacto(id){
        this.loading = true
        this.axios.get(`show-contacto/${id}`).then(response => {
          this.contacto = response.data
          this.assign()
          this.loading = false
        }).catch(error => {
          this.loading = false
          this.$store.commit('snackbar', {color: 'color', message: ` al conseguir informacion del contacto`, error:error})
        })
      },
      assign () {
        this.datos = []
        this.datos.push(
            {
              label: 'Nombre',
              body: [this.contacto.nombre1, this.contacto.nombre2, this.contacto.apellido1, this.contacto.apellido2].filter(x => x).join(' '),
              icon: this.contacto.sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman',
              iconColor: 'primary',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'Fecha Diagnostico',
              body: this.contacto.fecha_diagnostico ? this.moment(this.fixFecha(this.contacto.fecha_diagnostico)).format('DD/MM/YYYY') : '-',
              icon: 'mdi-calendar-month',
              iconColor: 'warning',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'Numero Documento',
              body: this.contacto.tipoid + ' ' + this.contacto.identificacion,
              icon: 'fas fa-id-card',
              iconColor: 'primary',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'Fecha de Expedición',
              body: this.contacto.fecha_expedicion ? this.moment(this.contacto.fecha_expedicion).format('DD/MM/YYYY') : '-',
              icon: 'fas fa-id-card',
              iconColor: 'info',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'Fecha Nacimiento',
              body: this.contacto.fecha_nacimiento ? this.moment(this.fixFecha(this.contacto.fecha_nacimiento)).format('DD/MM/YYYY') : '-',
              icon: 'mdi-calendar-month',
              iconColor: 'error',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'Sexo',
              body: this.contacto.sexo ? this.contacto.sexo === 'M' ? 'Masculino' : 'Femenino' : '-',
              icon: 'mdi-human-male-female',
              iconColor: 'green',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'Email',
              body: this.contacto.email ? this.contacto.email : '-',
              icon: 'fas fa-at',
              iconColor: 'purple',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'Telefono Fijo',
              body: this.contacto.telefono_fijo ? this.contacto.telefono_fijo : '-',
              icon: 'fas fa-phone',
              iconColor: 'blue',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'Celular',
              body: this.contacto.celular ? this.contacto.celular : '-',
              icon: 'fas fa-mobile-alt',
              iconColor: 'pink',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'Municipio',
              body: this.contacto.codigo_municipio && this.municipiosTotal.find(x => x.codigo === this.contacto.codigo_municipio)
                  ? `${this.municipiosTotal.find(x => x.codigo === this.contacto.codigo_municipio).nombre}-${this.municipiosTotal.find(x => x.codigo === this.contacto.codigo_municipio).departamento.nombre}`
                  : '-',
              icon: 'mdi-map-marker-radius',
              iconColor: 'indigo',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'Dirección',
              body: this.contacto.direccion ? this.contacto.direccion : '-',
              icon: 'fas fa-map-marked',
              iconColor: 'teal',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'EPS',
              body: this.contacto.codeps && this.epss.find(x => x.codigo === this.contacto.codeps) && this.epss.find(x => x.codigo === this.contacto.codeps).nombre ? this.epss.find(x => x.codigo === this.contacto.codeps).nombre : '-',
              icon: 'fas fa-h-square',
              iconColor: 'cyan',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'Parentesco',
              body: this.contacto.parentesco_id && this.parentescos.find(x => x.id === this.contacto.parentesco_id) ? this.parentescos.find(x => x.id === this.contacto.parentesco_id).descripcion : '-',
              icon: 'fas fa-people-arrows',
              iconColor: 'light-green',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'Fallecido',
              body: this.contacto.fallecido != null ? this.contacto.fallecido ? 'Si' : 'No' : '-',
              icon: 'fas fa-dizzy',
              iconColor: 'red',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'Comparten Gastos',
              body: this.contacto.comparten_gastos != null ? this.contacto.comparten_gastos ? 'Si' : 'No' : '-',
              icon: 'fas fa-file-invoice-dollar',
              iconColor: 'lime',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'Cumple Aislamiento',
              body: this.contacto.cumple_aislamiento != null ? this.contacto.cumple_aislamiento ? 'Si' : 'No' : '-',
              icon: 'fas fa-handshake-alt-slash',
              iconColor: 'deep-orange',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'Autoriza Giro Familiar',
              body: this.contacto.giro_a_familiar != null ? this.contacto.giro_a_familiar ? 'Si' : 'No' : '-',
              icon: 'fas fa-hand-holding-usd',
              iconColor: 'blue-grey',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'Autoriza EPS',
              body: this.contacto.autoriza_eps != null ? this.contacto.autoriza_eps ? 'Si' : 'No' : '-',
              icon: 'fas fa-user-check',
              iconColor: 'light-blue',
              colmd: '4',
              collg: '4'
            },
            {
              label: 'Entidad Financiera',
              body: this.contacto.entidad_financiera_id && this.entidadesFinancieras && this.entidadesFinancieras.length
              && this.entidadesFinancieras.find(x => x.id === this.contacto.entidad_financiera_id)
                  ? this.entidadesFinancieras.find(x => x.id === this.contacto.entidad_financiera_id).razon_social : '-',
              icon: 'fas fa-university',
              iconColor: 'teal darken-4',
              colmd: '4',
              collg: '4'
            },
        )
      },
      fixFecha(fecha){
        let splitFecha = fecha.split('/')
        return new Date(+splitFecha[2], splitFecha[1] - 1, +splitFecha[0])
      }
    }
  }
</script>

<style scoped>

</style>