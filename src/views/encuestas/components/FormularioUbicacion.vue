<template>
    <v-row v-if="ubicacion" align="center">
        <v-col class="pb-0" cols="12" sm="12" md="5" lg="3">
            <ValidationProvider name="municipio" rules="required" v-slot="{ errors, valid }">
                <v-autocomplete
                        v-model="ubicacion.municipio_id"
                        :label="(ubicacion.municipio_id ? 'M' : 'Seleccionar m') + 'unicipio'"
                        :items="divipolx"
                        item-value="id"
                        item-text="nombre"
                        :error-messages="errors"
                        outlined
                ></v-autocomplete>
            </ValidationProvider>
        </v-col>
        <v-col class="pb-0" cols="12" sm="12" md="2" lg="3">
            <v-switch
                    class="mt-0 mb-2"
                    v-model="ubicacion.urbano"
                    label="Urbano"
                    color="green"
                    :true-value="1"
                    :false-value="0"
            ></v-switch>
        </v-col>
        <v-col class="pb-0" cols="12" sm="12" md="5" lg="3">
            <ValidationProvider name="barrio o vereda" rules="required" v-slot="{ errors, valid }">
                <v-autocomplete
                        :disabled="!ubicacion.municipio_id"
                        v-model="ubicacion.barrios_vereda_id"
                        :label="(ubicacion.urbano ? (ubicacion.barrios_vereda_id ? 'B' : 'Seleccionar b') + 'arrio' : (ubicacion.barrios_vereda_id ? 'V' : 'Seleccionar v') + 'ereda')"
                        :items="ubicacion.municipio_id ? divipolx.find(y => y.id === ubicacion.municipio_id).barrios_veredas.filter(z => z.tipo === (ubicacion.urbano ? 'Barrio' : 'Vereda')) : []"
                        item-value="id"
                        item-text="nombre"
                        :error-messages="errors"
                        outlined
                ></v-autocomplete>
            </ValidationProvider>
        </v-col>
        <v-col class="pb-0" cols="12" sm="12" md="6" lg="6">
            <elemento
                    :tipo="13"
                    label="Dirección"
                    v-model="ubicacion.direccion"
                    :dense="false"
                    name="dirección"
                    rules="required"
                    :es-urbana="ubicacion.urbano"
            ></elemento>
        </v-col>
        <v-col class="pb-0" cols="12" sm="12" md="6" lg="6">
            <elemento
                    :tipo="12"
                    label="Geolocalización"
                    v-model="ubicacion.geolocalizacion"
                    :dense="false"
            ></elemento>
        </v-col>
    </v-row>
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'FormularioUbicacion',
        props: {
            ubicacion: {
                type: Object,
                default: null
            }
        },
        data: () => ({
        }),
        computed: {
            ...mapGetters([
                'divipolx'
            ])
        }
    }
</script>

<style scoped>

</style>