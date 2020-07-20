<template>
	<div>
		<div class="pac-card" id="pac-card" style="z-index: 4 !important;">
			<div>
				<div id="title">
					<i class="fas fa-map-signs mr-1"></i>
					Buscar Dirección
				</div>
			</div>
			<div id="pac-container">
				<input id="pac-input" type="text" placeholder="Buscar Dirección">
			</div>
		</div>
		<div id="mapreferenciador" style="z-index: 1 !important; width: 100% !important; height: 500px !important;"></div>
	</div>
</template>

<script>
	import {mapGetters} from "vuex";

	export default {
		name: 'Georreferenciador',
		props: {
			tamizaje: {
				type: Object,
				default: null
			}
		},
		data() {
			return {
				loading: false,
				googleMaps: null,
				map: null,
				marker: null
			}
		},
		watch: {
			tamizaje: {
				handler (val) {
					if (val) {
						this.mounted()
					}
				},
				immediate: false
			},
			marker: {
				handler (val) {
					this.$emit('changemarker', val)
				},
				immediate: false,
				deep: false
			}
		},
		computed: {
			...mapGetters([
				'datosEmpresa'
			]),
			permisos () {
				return this.$store.getters.getPermissionModule('covid')
			}
		},
		mounted() {
			this.mounted()
		},
		methods: {
			mounted () {
				var latLng = this.latLng()
				if (!this.map) {
					/* eslint-disable */
					this.googleMaps = google.maps
					this.map = new this.googleMaps.Map(document.getElementById('mapreferenciador'), {
						zoom: 8,
						center:  latLng
					})
					var borrarControl = document.createElement('div');
					new this.createControl(borrarControl, this, 'Borrar Marcador');

					borrarControl.index = 1;
					this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(borrarControl);


					var card = document.getElementById('pac-card');
					var input = document.getElementById('pac-input');
					this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
					this.map.addListener('click', event => {
						if (!this.marker) this.createMarkers(event.latLng)
					});
				} else {
					this.map.panTo(latLng);
				}
				if (this.tamizaje && !this.tamizaje.coordenadas) {
					input.value = [this.tamizaje.direccion, this.tamizaje.municipio.nombre, this.tamizaje.municipio.departamento.nombre].filter(x => x).join(', ')
				}
				let autocomplete = new google.maps.places.Autocomplete(input);
				autocomplete.bindTo('bounds', this.map);
				autocomplete.setFields(['address_components', 'geometry', 'name', 'adr_address', 'icon']);
				autocomplete.setComponentRestrictions({country: 'CO'});
				autocomplete.addListener('place_changed', () => {
					this.placeChanged(autocomplete)
				})
				this.createMarkers()
			},
			placeChanged (autocomplete) {
				this.deleteMarkers()
				var place = autocomplete.getPlace();
				if (!place.geometry) {
					this.$store.commit('snackbar', {color: 'warning', message: `No se encuentra la dirección: ${place.name}`})
					return;
				}
				if (place.geometry.viewport) {
					this.map.fitBounds(place.geometry.viewport);
				} else {
					this.map.setCenter(place.geometry.location);
					this.map.setZoom(17);
				}
				this.createMarkers(place.geometry.location)
			},
			deleteMarkers () {
				if (this.marker) {
					this.marker.setMap(null)
					this.marker = null
				}
			},
			createMarkers (dato = null) {
				this.deleteMarkers()
				if ((this.tamizaje && this.tamizaje.coordenadas) || dato) {
					let latlan = dato ? dato : this.tamizaje.coordenadas.replace(/ /g, '').split(',')
					this.marker = new this.googleMaps.Marker({
						position: dato ? latlan : {lat: Number(latlan[0]), lng: Number(latlan[1])},
						map: this.map,
						draggable: true
					})
					this.map.panTo(dato ? latlan : {lat: Number(latlan[0]), lng: Number(latlan[1])});
				}
			},
			createControl(controlDiv, tthis, title) {
				// Set CSS for the control border.
				var controlUI = document.createElement('div');
				controlUI.style.backgroundColor = '#fff';
				controlUI.style.border = '2px solid #fff';
				controlUI.style.borderRadius = '3px';
				controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
				controlUI.style.cursor = 'pointer';
				controlUI.style.marginBottom = '22px';
				controlUI.style.textAlign = 'center';
				controlUI.title = title;
				controlDiv.appendChild(controlUI);

				// Set CSS for the control interior.
				var controlText = document.createElement('div');
				controlText.style.color = 'rgb(25,25,25)';
				controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
				controlText.style.fontSize = '16px';
				controlText.style.lineHeight = '38px';
				controlText.style.paddingLeft = '5px';
				controlText.style.paddingRight = '5px';
				controlText.innerHTML = title;
				controlUI.appendChild(controlText);

				// Setup the click event listeners: simply set the map to Chicago.
				controlUI.addEventListener('click', e => {
					tthis.deleteMarkers()
				});
			}
		}
	}
</script>

<style lang="scss">
	.pac-card {
		margin: 10px 10px 0 0;
		border-radius: 2px 0 0 2px;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		outline: none;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
		background-color: #fff;
		font-family: Roboto;
	}

	#pac-container {
		padding-top: 6px;
		padding-bottom: 6px;
		padding-right: 6px;
		padding-left: 6px;
	}

	#pac-input {
		background-color: #fff;
		font-family: Roboto;
		font-size: 15px;
		font-weight: 300;
		padding: 6px 6px 6px 6px;
		width: 400px;
	}

	#title {
		color: #fff;
		background-color: #4d90fe;
		font-size: 15px;
		font-weight: 500;
		padding: 6px 12px;
	}
</style>
