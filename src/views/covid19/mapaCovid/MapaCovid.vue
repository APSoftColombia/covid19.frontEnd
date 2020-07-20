<template>
	<v-container fluid>
		<page-title-bar title="Mapa Covid-19">
			<template slot="actions">
				<v-tooltip top :disabled="$vuetify.breakpoint.smAndUp">
					<template v-slot:activator="{on}">
						<v-btn
								v-on="on"
								color="primary"
								@click.stop="showFilters = !showFilters"
								class="white--text"
						>
							<v-icon :left="$vuetify.breakpoint.smAndUp">mdi-filter-variant</v-icon>
							{{$vuetify.breakpoint.smAndUp ? 'Filtros' : ''}}
						</v-btn>
					</template>
					<span>Filtros</span>
				</v-tooltip>
			</template>
		</page-title-bar>
		<v-expand-transition>
			<v-card v-show="showFilters" class="mb-2">
				<v-container
						fluid
						grid-list-md
						class="py-1 px-3"
				>
					<filtros
							:medicos="medicos"
							ref="filtrosTamizaje"
							:ruta-base="rutaBase"
							@filtra="val => goDatos(val)"
					></filtros>
				</v-container>
				<v-divider class="ma-0 pa-0"></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn small color="primary" @click.stop="filtrar">Aplicar filtros</v-btn>
				</v-card-actions>
			</v-card>
		</v-expand-transition>
		<app-card :fullBlock="true">
			<div id="map"></div>
			<app-section-loader :status="loading"></app-section-loader>
		</app-card>
		<seguimiento ref="seguimiento"></seguimiento>
	</v-container>
</template>

<script>
	const Filtros = () => import('Views/covid19/tamizaje/filtros/Filtros')
	const Seguimiento = () => import('Views/covid19/tamizaje/Seguimiento')
	export default {
		name: 'MapaCovid',
		components: {
			Filtros,
			Seguimiento
		},
		data() {
			return {
				medicos: [],
				rutaBase: 'tamizajes',
				showFilters: true,
				loading: false,
				googleMaps: null,
				map: null,
				datos: [],
				markers: []
			}
		},
		computed: {
			permisos () {
				return this.$store.getters.getPermissionModule('covid')
			}
		},
		created () {
			this.goDatos()
			this.getMedicos()
		},
		mounted () {
			var latLng = this.latLng()
			/* eslint-disable */
			this.googleMaps = google.maps
			this.map = new this.googleMaps.Map(document.getElementById('map'), {
				zoom: 8,
				maxZoom: 17,
				center: latLng
			})
		},
		methods: {
			filtrar () {
				this.$refs && this.$refs.filtrosTamizaje && this.$refs.filtrosTamizaje.aplicaFiltros()
			},
			goDatos (ruta) {
				this.loading = true
				this.axios.get(ruta)
						.then(response => {
							console.log('la data', response.data)
							this.datos = response.data.filter(x => x.coordenadas)
							console.log('la data', this.datos ? this.datos.length : 0)
							this.deleteMarkers()
							this.createMarkers()
							this.loading = false
						})
						.catch(error => {
							this.deleteMarkers()
							this.loading = false
							context.commit('snackbar', {color: 'error', message: `al recuperar los datos.`, error: error.response.data})
						})
			},
			deleteMarkers () {
				if (this.markers && this.markers.length) {
					this.markers.forEach(x => {
						x.setMap(null)
					})
					this.marker = []
				}
			},
			createMarkers () {
				let infowindow = new this.googleMaps.InfoWindow({
					content: ''
				});
				this.datos.forEach(x => {
					let latlan = x.coordenadas.replace(/ /g, '').split(',')
					var circle = {
						path: this.googleMaps.SymbolPath.CIRCLE,
						fillColor: 'red',
						fillOpacity: 0.5,
						scale: 20,
						strokeColor: 'red',
						strokeWeight: 0
					};

					let marker = new this.googleMaps.Marker({
						position: {lat: Number(latlan[0]), lng: Number(latlan[1])},
						// map: this.map,
						title: x.direccion || 'No reporta',
						label: x.id,
						icon: circle
					});
					marker.addListener('click', () => {
						infowindow.setContent(this.textInfoWindow(x))
						infowindow.open(this.map, marker);
						document.addEventListener('click',e => {
							if(e.target.id === 'firstHeading'){
								this.verSeguimiento(e.target.attributes.data.value)
							}
						});
					});
					this.markers.push(marker)
				})

				new MarkerClusterer(this.map, this.markers,
						{
							imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
						}
				)
			},
			textInfoWindow (dato) {
				return `
				<div id="content">
					<a id="elcoso">
						<h3 id="firstHeading" class="firstHeading" data="${dato.id}">
							<i class="primary--text ${dato.infoviajero ? 'mdi mdi-bus-marker' : 'fas fa-file-medical'}"></i>
							ERP No. ${dato.id}
						</h3>
					</a>
					<div id="bodyContent">
						<p>
							<b>
								<i class="${dato.sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman'} indigo--text font-lg"></i>
								${[dato.nombre1, dato.nombre2, dato.apellido1, dato.apellido2].filter(x => x).join(' ')}
							</b>
						</p>
						<p>
							<b>
								<i class="fas fa-map-signs orange--text font-lg"></i>
								${dato.direccion || 'No registra dirección'}
							</b>
						</p>
					</div>
				</div>`
			},
			verSeguimiento (itemId) {
				if (this.permisos.tamizajeVer) {
					this.$refs.seguimiento.open(itemId)
				} else {
					this.$store.commit('snackbar', {color: 'warning', message: `No tiene permisos para ver el detalle.`})
				}
			},
			getMedicos () {
				this.axios.get(`users-role?role=Médico`)
						.then(response => {
							this.medicos = response.data
						})
						.catch(error => {
							this.$store.commit('snackbar', {color: 'error', message: `al recuperar los registros de los médicos.`, error: error})
						})
			}
		}
	}
</script>

<style lang="scss" scoped>
	#map {
		height: 720px;
	}
</style>
