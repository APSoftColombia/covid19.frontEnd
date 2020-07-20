<template>
    <v-tooltip top :disabled="!tooltip">
        <template v-slot:activator="{on}">
            <v-avatar
                    class="elevation-4"
                    :color="value.color ? value.color : 'grey'"
                    :size="value.size ? value.size : '48'"
                    v-on="on"
            >
                <v-icon class="white--text">fas fa-traffic-light</v-icon>
            </v-avatar>
        </template>
        <span>{{tooltip}}</span>
    </v-tooltip>
</template>

<script>
    export default {
        name: 'SemaforoAvatar',
        props: {
            value: {
                type: Object,
                Default: null
            }
        },
        computed: {
            tooltip () {
                if (this && this.value && this.value.color) {
                    let text = ''
                    if (this.value.color === 'black') text = 'Fallecido'
                    else if (this.value.color === 'blue') text = 'No requiere seguimiento'
                    else if (this.value.color === 'red') text = 'Requiere seguimiento'
                    else if (this.value.color === 'yellow') text = 'No se ha podido contactar hoy'
                    else if (this.value.color === 'green') text = 'Ya fue atendido hoy'
                    else if (this.value.color === 'orange') text = 'No Clasificado en ninguna de las definiciones'
                    return text
                }
                return null
            }
        }
    }
</script>

<style scoped>

</style>