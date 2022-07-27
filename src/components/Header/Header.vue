<template>
	<div>
		<v-app-bar
			class="Vuely-toolbar"
			app
			:color="activeHeaderFilter.class"
			fixed
		>
			<div class="d-custom-flex align-items-center navbar-left pa-0">
<!--        <v-img class="img-responsive" :width="$vuetify.breakpoint.mdAndUp ? '280' : '222'" :src="`/static/img/session.png`">-->
				<v-img class="img-responsive" :width="$vuetify.breakpoint.mdAndUp ? '220' : '162'" :src="`/static/logos/logo_apsoft.png`">
					<v-btn
							fixed
							dark
							fab
							top
							left
							small
							color="error"
              :style="`top: -18px; margin-left: ${$vuetify.breakpoint.mdAndUp ? 180 : 124}px`"
					>
<!--            :style="`top: -18px; margin-left: ${$vuetify.breakpoint.mdAndUp ? 240 : 190}px`"-->
						<span :class="$vuetify.breakpoint.mdAndUp ? 'mt-3' : 'mt-3'">V{{appVersion}}</span>
					</v-btn>
				</v-img>
				<app-menu v-if="user && !user.change_password_needed"/>
			</div>
			<v-spacer/>
      <template v-if="user && !user.cod_ips && permisosCR.referenciasAlerta">
        <alerta-solicitudes
            @notificar="reloadReferencias"
            @seleccionar="val => seleccionarItemAlert(val)"
        />
        <v-divider vertical inset class="mr-4 ml-3"/>
      </template>
			<div class="d-custom-flex align-items-center navbar-right pa-0">
        <v-tooltip left v-if="permisos.generarReporteDePrensa && datosEmpresa['covid-informeDePrensa'] === '1'">
          <template v-slot:activator="{ on }">
            <v-btn color="red" icon v-on="on" :disabled="loadingPDF1" :loading="loadingPDF1" @click="descargarPDF('generar-pdf-reporte-de-prensa')">
              <v-icon>far fa-file-pdf</v-icon>
            </v-btn>
          </template>
          <span>Generar informe de corte diario</span>
        </v-tooltip>
        <v-tooltip left v-if="permisos.informeDePrensaSucre && datosEmpresa['covid-informeDePrensa'] === '2'">
          <template v-slot:activator="{ on }">
            <v-btn color="orange" icon v-on="on" :disabled="loadingPDF2" :loading="loadingPDF2" @click="descargarPDF('generar-pdf-reporte-de-prensa-sucre')">
              <v-icon>far fa-file-pdf</v-icon>
            </v-btn>
          </template>
          <span>Generar informe de corte diario</span>
        </v-tooltip>
<!--				<v-tooltip left>-->
<!--					<template v-slot:activator="{ on }">-->
<!--						<v-btn icon large v-on="on">-->
<!--							<v-icon v-if="onLine" color="success" dark>mdi mdi-signal-cellular-3</v-icon>-->
<!--							<v-icon v-else color="red" dark>mdi mdi-signal-off</v-icon>-->
<!--						</v-btn>-->
<!--					</template>-->
<!--					<span>{{onLine ? 'En línea' : 'Sin internet'}}</span>-->
<!--				</v-tooltip>-->
				<v-btn icon large @click="toggleFullScreen" class="full-screen ma-0">
					<v-icon color="grey">mdi-fullscreen</v-icon>
				</v-btn>
<!--				<v-btn class="ma-0" icon large @click.stop="chatSidebar = !chatSidebar">-->
<!--					<v-icon color="grey">mdi-forum</v-icon>-->
<!--				</v-btn>-->
<!--				<notifications></notifications>-->
				<user></user>
			</div>
		</v-app-bar>
		<!-- Chat Searchbar -->
<!--		<v-navigation-drawer fixed v-model="chatSidebar" :right="!rtlLayout" temporary app class="chat-sidebar-wrap" :width="300">-->
<!--			<chat-sidebar></chat-sidebar>-->
<!--		</v-navigation-drawer>-->
		<mobile-search-form></mobile-search-form>
    <detalle-referencia
        ref="detalleItem"
        @guardado="reloadReferencias"
    />
	</div>
</template>

<script>
// import ChatSidebar from '../ChatSidebar/ChatSidebar.vue'
import screenfull from 'screenfull'
// import Notifications from './Notifications'
import AlertaSolicitudes from 'Views/centroRegulador/components/referencias/AlertaSolicitudes'
import DetalleReferencia from 'Views/centroRegulador/components/referencias/detalleReferencia/DetalleReferencia'
import AppMenu from './AppMenu'
import MobileSearchForm from './MobileSearchForm'
import { mapGetters, mapState } from 'vuex'
import User from './User'
import axios from "axios";
export default {
	name: 'Header',
	props: {
		horizontal: {
			default: false,
			type: Boolean
		}
	},
	data() {
		return {
			chatSidebar: false, // chat component right sidebar,
      loadingPDF1: false,
      loadingPDF2: false
		}
	},
	computed: {
		...mapGetters([
			'rtlLayout',
			'activeHeaderFilter',
			'appVersion',
			'onLine',
      'datosEmpresa',
		]),
		...mapState({
			user: state => state.auth.user
		}),
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
    },
    permisosCR() {
      return this.$store.getters.getPermissionModule('centroRegulador')
    }
	},
	methods: {
    detalleReferencia(item) {
      this.$refs.detalleItem.open(item)
    },
    seleccionarItemAlert(val) {
      this.detalleReferencia({ id: val })
      this.$store.commit('notificadoNuevasReferenciaId', val)
      setTimeout(() => {
        this.$store.dispatch('getNuevasReferencias')
      }, 2000)
    },
    reloadReferencias() {
      this.$store.commit('reloadTable', 'tablaReferencias')
    },
		toggleFullScreen() {
			if (screenfull.enabled) {
			screenfull.toggle()
			}
		},
		toggleSearchForm() {
			this.$store.dispatch('toggleSearchForm')
		},
    descargarPDF(ruta){
      ruta == 'generar-pdf-reporte-de-prensa' ? this.loadingPDF1 = true : this.loadingPDF2 = true
      const apiAxios = axios.create()
      apiAxios.defaults.baseURL = `http://apsoft-backend.test/api`
      apiAxios.defaults.headers.common["Authorization"] = `${this.token_type} ${this.access_token}`
      this.axios( {
        url: ruta + `?corte_diario=${true}`, //your url,
        method: 'GET',
        responseType: 'blob', // important
      }).then(async response => {
        if(response.status === 204) {
          this.$store.commit('snackbar', {color: 'info', message: 'Los parametros aplicados no han generado registros para crear PDF'})
        }else{
          const fileURL = window.URL.createObjectURL(
              new Blob([response.data], {type: 'application/pdf'}))
          await window.open(fileURL, '_blank')
        }
        this.loadingPDF1 = false
        this.loadingPDF2 = false
      }).catch(error => {
        this.loadingPDF1 = false
        this.loadingPDF2 = false
        this.$store.commit('snackbar', {color: 'error', message: 'al descargar el PDF', error: error})
      })
    },
	},
	components: {
		// ChatSidebar,
		// Notifications,
    DetalleReferencia,
    AlertaSolicitudes,
		AppMenu,
		MobileSearchForm,
		User
	}
}
</script>
