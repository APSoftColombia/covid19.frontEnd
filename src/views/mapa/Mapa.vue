<template>
  <v-container fluid>
    <page-title-bar title="Mapa"/>
    <app-card :fullBlock="true">
      <div id="map"/>
      <app-section-loader :status="loading"/>
    </app-card>
  </v-container>
</template>

<script>
export default {
  name: 'Mapa',
  data() {
    return {
      loading: false,
      googleMaps: null,
      map: null,
      datos: []
    }
  },
  created() {
    this.getData()
  },
  mounted() {
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
    getData() {
      this.loading = true
      this.axios.get('recuperar-encuestas')
          .then(response => {
            this.datos = response.data.filter(x => x.geolocalizacion)
            this.createMarkers()
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            context.commit('snackbar', {
              color: 'error',
              message: 'al recuperar las encuestas.',
              error: error.response.data
            })
          })
    },
    createMarkers() {
      let infowindow = new this.googleMaps.InfoWindow({
        content: ''
      });
      this.datos.forEach(x => {
        let latlan = x.geolocalizacion.replace(/ /g, '').split(',')
        // var circle = {
        // 	path: this.googleMaps.SymbolPath.CIRCLE,
        // 	fillColor: 'red',
        // 	fillOpacity: 0.6,
        // 	scale: 40,
        // 	strokeColor: 'red',
        // 	strokeWeight: 4
        // };

        let marker = new this.googleMaps.Marker({
          position: {lat: Number(latlan[0]), lng: Number(latlan[1])},
          map: this.map,
          title: x.direccion || 'No reporta'
        });

        marker.addListener('click', () => {
          infowindow.setContent(this.textInfoWindow(x))
          infowindow.open(this.map, marker);
        });
      })
    },
    textInfoWindow(dato) {
      return `
				<div id="content">
					<h1 id="firstHeading" class="firstHeading">
						<i class="fas fa-edit purple--text"></i>
						Encuesta ${dato.id}
					</h1>
					<div id="bodyContent">
						<p><b>Código:</b> ${dato.uuid}</p>
						<p><b>Dirección:</b> ${dato.direccion || 'No reporta'}</p>
						<p>
							<i class="mdi mdi-timer primary--text"></i>
							<b>Duración:</b> ${dato.duracion}
						</p>
					</div>
				</div>`
    }
  }
}
</script>

<style lang="scss" scoped>
#map {
  height: 720px;
}
</style>
