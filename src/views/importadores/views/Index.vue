<template>
  <v-container fluid>
		<page-title-bar title="Importadores"></page-title-bar>
		<v-row>
			<v-col cols="12">
				<v-card>
                    <v-card-text>
                        <v-row v-if="cargadores && cargadores.length">
                            <template v-for="(item, index) in cargadores">
                                <v-col cols="12" :key="index">
                                    <cargador-component
                                        :nombreCargador="item.nombre_cargador"
                                        :separador="item.separator"
                                        :idCargador="item.id"
                                        :cabeceras="item.cabeceras"
                                    ></cargador-component>
                                </v-col>
                            </template>
                        </v-row>
                        <div v-else class="title grey--text text-center pa-4">
                            No hay cargadores creados
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
  </v-container>
</template>

<script>
const CargadorComponent = () => import("Components/Cargador/CargadorComponent");

export default {
    name: 'Importadores',
    components: {
        CargadorComponent
    },
    data: () => ({
        cargadores: []
    }),
    created() {
        this.getAllCargadores();
    },
    methods: {
        getAllCargadores() {
            this.loading = true;
            this.axios
                .get("config-cargador")
                .then((response) => {
                this.cargadores = response.data;
                this.loading = false;
                })
                .catch((error) => {
                this.$store.commit("snackbar", {
                    color: "error",
                    message: `al recuperar la configuracion de los cargadores`,
                    error: error,
                });
                this.loading = false;
                });
        },
    }
}
</script>

<style>

</style>