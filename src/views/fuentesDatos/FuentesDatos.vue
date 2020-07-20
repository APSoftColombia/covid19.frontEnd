<template>
	<v-container fluid>
		<page-title-bar title="Fuentes de Datos">
			<template slot="actions">
				<v-btn color="primary" @click="registrarFuenteDatos(null)">
					<v-icon left>mdi-plus</v-icon>
					Crear Fuente de Datos
				</v-btn>
			</template>
		</page-title-bar>
		<v-row>
			<v-col cols="12">
				<v-card>
					<v-card-title>
						<v-spacer></v-spacer>
						<v-text-field
								v-model="search"
								append-icon="search"
								label="Buscar"
								single-line
								hide-details
						></v-text-field>
					</v-card-title>
					<v-data-table
							:headers="headers"
							:items="fuentesDatos"
							:search="search"
					>
						<template v-slot:item.registros="{ item }">
							<v-chip label small color="purple" dark class="title">{{ item.opciones.length}}</v-chip>
						</template>
					</v-data-table>
				</v-card>
			</v-col>
		</v-row>
		<registro-fuentes-datos ref="dialogRegistroFuenteDatos"></registro-fuentes-datos>
		<app-section-loader :status="loading"></app-section-loader>
	</v-container>
</template>

<script>
	const RegistroFuentesDatos = () => import('Views/fuentesDatos/components/RegistroFuentesDatos')
	import { mapGetters } from 'vuex'
	export default {
		components: {
			RegistroFuentesDatos
		},
		data: () => ({
			loading: false,
			search: '',
			headers: [
				{
					text: 'ID',
					align: 'left',
					sortable: true,
					value: 'id',
				},
				{
					text: 'Nombre',
					align: 'left',
					sortable: true,
					value: 'nombre',
				},
				{
					text: 'Registros',
					align: 'left',
					sortable: true,
					value: 'registros',
				},
			]
		}),
		computed: {
			...mapGetters(['fuentesDatos'])
		},
		created () {
			this.getFuentesDatos()
		},
		methods: {
			getFuentesDatos () {
				this.loading = true
				this.$store.dispatch('getFuentesDatos').then(response => {
					this.loading = false
					if (!response) this.$router.go(-1)
				})
			},
			registrarFuenteDatos (fuente) {
				this.$refs.dialogRegistroFuenteDatos.open(fuente)
			}
		}
	}
</script>