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
      <div class="floating-panel" v-if="!loading">
        <v-btn-toggle
            v-model="togglebtn"
            mandatory
        >
          <v-btn>Sectorizado</v-btn>
          <v-btn>Calor</v-btn>
        </v-btn-toggle>
      </div>
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
				rutaBase: 'tamizajes-mapa',
				showFilters: true,
				loading: false,
				googleMaps: null,
				map: null,
        heatmap: null,
        markerCluster: null,
        togglebtn: 0,
				datos: [],
				markers: [],
        gradient: [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
        ]
			}
		},
		computed: {
			permisos () {
				return this.$store.getters.getPermissionModule('covid')
			}
		},
    watch: {
      togglebtn: {
        handler(val) {
          if (val === 0) {
            this.goMarkers()
          } else if (val === 1) {
            this.goCalor()
          }
        },
        immediate: false
      }
    },
		created () {
			this.filtrar()
			this.getMedicos()
		},
		mounted () {
			var latLng = this.latLng()
			/* eslint-disable */
			this.googleMaps = google.maps
			this.map = new this.googleMaps.Map(document.getElementById('map'), {
				zoom: 9,
				maxZoom: 17,
				minZoom: 8,
				center: latLng
			})
      this.markerCluster = new MarkerClusterer(this.map, this.markers,
          {
            ignoreHidden: true,
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
          }
      )
		},
		methods: {
      getPoints () {
        let puntos = []
        this.datos.forEach(x => {
          let latlan = x.coordenadas.replace(/ /g, '').split(',')
          puntos.push(new this.googleMaps.LatLng(Number(latlan[0]), Number(latlan[1])))
        })
        return puntos
      },
			filtrar () {
				this.$refs && this.$refs.filtrosTamizaje && this.$refs.filtrosTamizaje.aplicaFiltros()
			},
			goDatos (ruta) {
				this.loading = true
        if (this.heatmap) this.heatmap.setMap(null)
        this.deleteMarkers()
        this.markerCluster.clearMarkers()
				// this.axios.get( `${ruta}${ruta.indexOf('?') > -1 ? '&' : '?'}per_page=5000`)
				this.axios.get( `${ruta}`)
						.then(async response => {
						  console.log('response', response)
							this.datos = await response.data.filter(x => x.coordenadas)
              if(this.togglebtn) {
                this.goCalor()
              } else {
                this.goMarkers()
              }
              this.loading = false
						})
						.catch(error => {
							this.deleteMarkers()
							this.loading = false
							this.$store.commit('snackbar', {color: 'error', message: `al recuperar los datos.`, error: error.response.data})
						})
			},
      async goMarkers () {
        await this.deleteMarkers()
        await this.createMarkers()
        if (this.heatmap) this.heatmap.setMap(null)
      },
      goCalor () {
        if (this.heatmap) this.heatmap.setMap(null)
        this.deleteMarkers()
        this.markerCluster.clearMarkers()
        this.heatmap = new this.googleMaps.visualization.HeatmapLayer({
          data: this.getPoints(),
          map: this.map
        })
        this.heatmap.set('radius', 60)
        this.heatmap.set('opacity', 0.9)
        this.heatmap.set('maxIntensity', 0.9)
        // this.heatmap.set('gradient', this.gradient)
      },
			deleteMarkers () {
				if (this.markers && this.markers.length) {
					this.markers.forEach(x => {
						x.setMap(null)
					})
					this.markers = []
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
						icon: circle
					});
					// marker.addListener('click', () => {
					// 	infowindow.setContent(this.textInfoWindow(x))
					// 	infowindow.open(this.map, marker);
					// 	document.addEventListener('click',e => {
					// 		if(e.target.id === 'firstHeading'){
					// 			this.verSeguimiento(e.target.attributes.data.value)
					// 		}
					// 	});
					// });
					this.markers.push(marker)
				})
        this.markerCluster.addMarkers(this.markers)
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

<style lang="scss">
	#map {
		height: 720px;
	}
  .floating-panel {
    position: absolute;
    top: 4px;
    left: 42%;
    z-index: 5;
    border: 1px solid #999;
    text-align: center;
    font-family: 'Roboto','sans-serif';
  }
</style>
