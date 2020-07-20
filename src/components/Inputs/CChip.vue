<template>
    <v-tooltip top :disabled="!tooltip">
        <template v-slot:activator="{on}">
            <v-chip
                    v-on="on"
                    :class="clase"
                    :color="color"
                    :label="label"
                    :large="large"
                    :small="small"
                    :text-color="textColor"
            >{{text}}</v-chip>
        </template>
        <span>{{tooltip}}</span>
    </v-tooltip>
</template>

<script>
    export default {
        name: 'CChip',
        props: {
            text: {
                type: [String, Number],
                Default: null
            },
            clase: {
                type: String,
                Default: null
            },
            tooltip: {
                type: String,
                Default: null
            },
            color: {
                type: String,
                Default: undefined
            },
            label: {
                type: Boolean,
                Default: true
            },
            large: {
                type: Boolean,
                Default: false
            },
            small: {
                type: Boolean,
                Default: false
            },
            textColor: {
                type: String,
                Default: 'white'
            }
        }
    }
</script>

<style scoped>

</style>