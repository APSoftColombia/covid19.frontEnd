<template>
    <v-tooltip top :disabled="!tooltip">
        <template v-slot:activator="{on}">
            <v-btn
                    v-on="on"
                    :color="color"
                    :class="`${textColor}--text`"
                    @click="$emit('click', value)"
            >
                {{text}}
            </v-btn>
        </template>
        <span>{{tooltip}}</span>
    </v-tooltip>
</template>

<script>

    export default {
        name: 'BotonTooltip',
        props: {
            text: {
                type: [Number, String],
                Default: null
            },
            color: {
                type: String,
                Default: undefined
            },
            textColor: {
                type: String,
                Default: 'white'
            },
            tooltip: {
                type: String,
                Default: null
            },
            value: {
                type: [String, Number, Object],
                default: null
            }
        }
    }
</script>

<style scoped>

</style>