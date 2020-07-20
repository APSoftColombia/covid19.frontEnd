<template>
    <v-card>
        <v-container fluid>
            <v-row align="center" justify="center">
                <v-col cols="12">
                    <v-autocomplete
                            v-model="puntoSeleccionado"
                            :hint="!estaEditando || (estaEditando && puntoSeleccionado) ? `Clic en el ícono para ${!estaEditando ? 'cambiar' : 'seleccionar'} el punto de control` : ''"
                            :items="puntosControl"
                            :readonly="!estaEditando"
                            :label="`${(estaEditando && !puntoSeleccionado) ? 'Seleccionar' : (estaEditando && puntoSeleccionado) ? 'Cambiar' : ''} Punto de Control`"
                            persistent-hint
                            prepend-icon="mdi-map-marker-radius"
                            item-value="id"
                            item-text="title"
                    >
                        <template v-slot:append-outer>
                            <v-slide-x-reverse-transition
                                    mode="out-in"
                            >
                                <v-icon
                                        :key="`icon-${estaEditando}`"
                                        :color="estaEditando ? 'success' : 'info'"
                                        @click="estaEditando = !estaEditando"
                                        v-text="estaEditando ? puntoSeleccionado ? 'mdi-check-outline' : '' : 'mdi-circle-edit-outline'"
                                ></v-icon>
                            </v-slide-x-reverse-transition>
                        </template>
                    </v-autocomplete>
                </v-col>
            </v-row>
        </v-container>
        <v-slide-x-reverse-transition
                mode="out-in"
        >
            <v-row v-if="puntoActual" no-gutters align="center" justify="center">
                <template v-for="(item, index) in vehiculos">
                    <v-col
                            cols="6"
                            sm="4"
                            md="3"
                            :key="index"
                    >
                        <v-hover v-slot:default="{ hover }">
                            <v-card
                                    @click.stop="submitDato(item)"
                                    tile
                                    :color="item.color"
                                    :elevation="hover ? 12 : 1"
                                    :class="{ 'on-hover': hover }"
                                    :style="hover ? 'z-index: 10 !important' : ''"
                            >
                                <v-card-text class="text-center title white--text" style="text-align: center !important;">
                                    <template v-if="item.svgName">
                                        <v-img :src="`/static/vehiculos/${item.svgName}.svg`" :alt="item.svgName" :width="$vuetify.breakpoint.mdAndUp ? item.svgName === 'barcocarga' ? 199 : 140 : item.svgName === 'barcocarga' ? 58 : 40" style="margin: auto !important;"/>
                                    </template>
                                    <template v-else>
                                        <v-icon :x-large="$vuetify.breakpoint.smAndDown" :size="$vuetify.breakpoint.mdAndUp ? '140' : ''">{{item.icon}}</v-icon>
                                        <br/>
                                    </template>
                                    <v-badge
                                            :content="item.cantidad"
                                            :value="item.cantidad"
                                            :color="`${item.color} darken-3`"
                                            bordered
                                    >
                                        <span class="text-truncate">{{item.title}}</span>
                                    </v-badge>
                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </v-col>
                </template>
            </v-row>
        </v-slide-x-reverse-transition>
        <app-section-loader :status="loading"></app-section-loader>
    </v-card>
</template>

<script>
    export default {
        name: 'Vehiculos',
        computed: {
            permisos () {
                return this.$store.getters.getPermissionModule('covid')
            }
        },
        data: () => ({
            puntoSeleccionado: null,
            objetoActual: null,
            puntoActual: null,
            puntosControl: [],
            puntoAcutal: null,
            loading: false,
            estaEditando: true,
            vehiculos: [
                {
                    id: 1,
                    name: 'taxi',
                    title: 'Taxi',
                    icon: 'fas fa-taxi',
                    color: 'primary',
                    cantidad: 0,
                    loading: false
                },
                {
                    id: 2,
                    name: 'automovil',
                    title: 'Automovil',
                    icon: 'fas fa-car',
                    color: 'green',
                    cantidad: 0,
                    loading: false
                },
                {
                    id: 3,
                    name: 'camioneta',
                    title: 'Camioneta',
                    icon: 'fas fa-truck-pickup',
                    color: 'red',
                    cantidad: 0,
                    loading: false
                },
                {
                    id: 4,
                    name: 'motocicleta',
                    title: 'Motocicleta',
                    icon: 'fas fa-motorcycle',
                    color: 'blue',
                    cantidad: 0,
                    loading: false
                },
                {
                    id: 5,
                    name: 'bicicleta',
                    title: 'Bicicleta',
                    icon: 'fas fa-bicycle',
                    color: 'purple',
                    cantidad: 0,
                    loading: false
                },
                {
                    id: 6,
                    name: 'bus',
                    title: 'Bus',
                    icon: 'fas fa-bus-alt',
                    color: 'indigo',
                    cantidad: 0,
                    loading: false
                },
                {
                    id: 7,
                    name: 'van',
                    title: 'Van',
                    icon: 'fas fa-shuttle-van',
                    color: 'teal',
                    cantidad: 0,
                    loading: false
                },
                {
                    id: 8,
                    name: 'camion',
                    title: 'Camión',
                    icon: 'fas fa-truck',
                    color: 'pink',
                    routeName: 'Reportes',
                    cantidad: 0,
                    loading: false
                },
                {
                    id: 9,
                    name: 'carrotanque',
                    title: 'Carro Tanque',
                    icon: 'mdi-tanker-truck',
                    color: 'cyan',
                    cantidad: 0,
                    loading: false
                },
                {
                    id: 13,
                    name: 'avion',
                    title: 'Avión',
                    icon: 'fas fa-plane',
                    color: 'orange',
                    cantidad: 0,
                    loading: false
                },
                {
                    id: 11,
                    name: 'lancha',
                    title: 'Lancha',
                    icon: 'fas fa-ship',
                    color: 'lime',
                    cantidad: 0,
                    loading: false
                },
                {
                    id: 10,
                    name: 'planchon',
                    title: 'Planchón',
                    svgName: 'barcocarga',
                    icon: null,
                    color: 'brown',
                    cantidad: 0,
                    loading: false
                },
                {
                    id: 12,
                    name: 'canoa',
                    title: 'Canoa',
                    svgName: 'canoa',
                    icon: null,
                    color: 'info',
                    cantidad: 0,
                    loading: false
                }
            ]
        }),
        watch: {
            estaEditando: {
                handler (val) {
                    if (val) {
                        this.puntoActual = null
                    } else {
                        this.puntoSeleccionado && (this.puntoActual = this.puntoSeleccionado)
                    }
                },
                immediate: false
            },
            puntoActual: {
                handler (val) {
                    val && this.getPunto()
                },
                immediate: false
            }
        },
        created () {
            this.getData()
        },
        methods: {
            getData () {
                this.loading = true
                this.axios.get(`conteo-vehiculos`)
                    .then(response => {
                        if (response.data && response.data.length) {
                            response.data.map(x => {
                                x.title = `${x.punto} - ${x.ubicacion}`
                            })
                        }
                        this.puntosControl = response.data
                        this.loading = false
                    })
                    .catch(error => {
                        this.loading = false
                        this.$store.commit('snackbar', {color: 'error', message: `al recuperar los puntos de control.`, error: error})
                    })
            },
            submitDato (item) {
                item.loading = true
                item.cantidad++
                // this.objetoActual[item.name] = this.objetoActual[item.name]++
                this.axios.put(`conteo-vehiculos/${this.objetoActual.id}`, {tipo: item.name})
                    .then(response => {
                        console.log('respuesta guardado', response)
                        item.loading = false
                    })
                    .catch(error => {
                        item.cantidad--
                        // this.objetoActual[item.name] = this.objetoActual[item.name]--
                        item.loading = false
                        this.$store.commit('snackbar', {color: 'error', message: `al guardar los datos de contéo.`, error: error})
                    })
            },
            getPunto () {
                this.loading = true
                this.axios.get(`conteo-vehiculos/${this.puntoActual}`)
                    .then(response => {
                        console.log('el get del punto', response)
                        if (response && response.data) {
                            this.vehiculos.forEach(x => {
                                x.cantidad = response.data[x.name] || 0
                            })
                            this.objetoActual = response.data
                        } else {
                            this.$store.commit('snackbar', {color: 'error', message: `Error al recuperar los datos del punto de control.`})
                            this.puntoActual = null
                            this.objetoActual = null
                        }
                        this.loading = false
                    })
                    .catch(error => {
                        this.puntoActual = null
                        this.objetoActual = null
                        this.loading = false
                        this.$store.commit('snackbar', {color: 'error', message: `al recuperar los datos del punto de control.`, error: error})
                    })
            }
        }
    }
</script>

<style scoped>

</style>