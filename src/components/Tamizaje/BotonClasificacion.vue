<template>
    <v-tooltip top v-if="obj">
        <template v-slot:activator="{on}">
            <v-btn
                    v-on="on"
                    :color="color"
                    :class="`${textColor}--text`"
                    @click="$emit('click', obj)"
            >{{obj.text}}</v-btn>
        </template>
        <span>{{obj.nombre}}</span>
    </v-tooltip>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: 'BotonClasificacion',
        props: {
            clasificacion: {
                type: String,
                Default: null
            },
            color: {
                type: String,
                Default: undefined
            },
            textColor: {
                type: String,
                Default: 'white'
            }
        },
        computed: {
            ...mapGetters([
                'clasificacionesCovid'
            ])
        },
        data: () => ({
           obj: null
        }),
        watch: {
            'clasificacion': {
                handler (val) {
                    val && this.searchClasificacion()
                },
                immediate: true
            }
        },
        methods: {
            searchClasificacion () {
                if (this.clasificacionesCovid) {
                    this.obj = this.clasificacionesCovid.find(x => x.id === this.clasificacion)
                }
            }
        }
    }
</script>

<style scoped>

</style>