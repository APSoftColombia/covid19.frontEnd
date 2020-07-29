<template>
    <v-card>
        <v-card-title>
            <span>Barrios y Veredas</span>
            <v-spacer></v-spacer>
            <v-btn class="primary" @click="$refs.formBarrioVereda.open()">
                <v-icon left>fas fa-plus</v-icon>
                <span>Nuevo</span>
            </v-btn>
        </v-card-title>
        <v-card-text>
            <data-table
                ref="tablaBarriosVeredas"
                v-model="dataTable"
                @resetOption="item => resetOptions(item)"
                @editar="item => editar(item)"
                @eliminar="item => eliminar(item)"
            ></data-table>
        </v-card-text>
        <form-b-v
            ref="formBarrioVereda"
            @actualizarTabla="refreshTable"
        ></form-b-v>
        <dialog-eliminar
            ref="dialogEliminar"
            @actualizarTabla="refreshTable"
        ></dialog-eliminar>
    </v-card>
</template>

<script>
    const FormBV = () => import('./FormBarriosVeredas')
    const DialogEliminar = () => import('./EliminarBarrioVereda')
    export default {
        name: "BarriosVeredas",
        data: () => ({
            formDialog: false,
            dataTable: {
                advanceFilters: false,
                buttonZone: false,
                nameItemState: 'tablaBarriosVeredas',
                route: 'get-barrios-veredas',
                makeHeaders: [
                    {
                        text: 'ID',
                        align: 'left',
                        sortable: false,
                        value: 'id'
                    },
                    {
                        text: 'Codigo',
                        align: 'left',
                        sortable: false,
                        value: 'codigo'
                    },
                    {
                        text: 'Nombre',
                        align: 'left',
                        sortable: false,
                        value: 'nombre'
                    },
                    {
                        text: 'Tipo',
                        align: 'left',
                        sortable: false,
                        value: 'tipo'
                    },
                    {
                        text: 'Municipio',
                        align: 'left',
                        sortable: false,
                        value: 'nombre_municipio'
                    },
                    {
                        text: 'Opciones',
                        align: 'center',
                        sortable: false,
                        actions: true,
                        singlesActions: true
                    }
                ]}
        }),
        methods: {
            editar(item){
                this.$refs.formBarrioVereda.open(item)
            },
            refreshTable(){
                this.$store.commit('reloadTable', 'tablaBarriosVeredas')
            },
            eliminar(item){
                this.$refs.dialogEliminar.open(item)
            },
            resetOptions(item) {
                item.options = []
                item.options.push({event: 'editar', icon: 'fas fa-edit', tooltip: 'Editar', color: 'warning'})
                item.options.push({event: 'eliminar', icon: 'fas fa-trash-alt', tooltip: 'Eliminar', color: 'error'})
                return item
            },
        },
        components: {
            FormBV,
            DialogEliminar
        }
    }
</script>

<style scoped>

</style>