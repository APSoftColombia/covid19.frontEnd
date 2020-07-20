<template>
	<v-container fluid>
		<page-title-bar title="Población"></page-title-bar>
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
							:items="encuestados"
							:search="search"
					>
						<template v-slot:item.identificacion="{ item }">
							<span>{{item.numero_documento_identidad}}</span>
						</template>
						<template v-slot:item.nombre="{ item }">
							<span>{{[item.nombre1, item.nombre2, item.apellido1, item.apellido2].filter(x => x).join(' ')}}</span>
						</template>
						<template v-slot:item.finalizada="{ item }">
							<v-chip label :color="item.finalizada ? 'Success' : 'warning'">
								{{item.finalizada ? 'Finalizada' : 'Pendiente'}}
							</v-chip>
						</template>
						<template v-slot:item.actions="{ item }">
							<v-tooltip top>
								<template v-slot:activator="{ on }">
									<v-btn color="primary" slot="activator" icon v-on="on" @click="verDetalle(item)">
										<v-icon small>fas fa-info</v-icon>
									</v-btn>
								</template>
								<span>Mas información</span>
							</v-tooltip>
						</template>
					</v-data-table>
				</v-card>
			</v-col>
		</v-row>
		<app-section-loader :status="loading"></app-section-loader>
	</v-container>
</template>

<script>
	export default {
		components: {
		},
		data: () => ({
			loading: false,
			encuestados: [],
			search: '',
			headers: [
				{
					text: 'Identificación',
					align: 'left',
					sortable: true,
					value: 'numero_documento_identidad',
				},
				{
					text: 'Nombre',
					align: 'left',
					sortable: true,
					value: 'nombre',
				},
				{
					text: 'Celular',
					align: 'left',
					sortable: true,
					value: 'numero_celular',
				},
				{
					text: 'Finalizada',
					align: 'left',
					sortable: true,
					value: 'finalizada',
				},
				{
					text: 'Opciones',
					align: 'left',
					sortable: true,
					value: 'actions',
				}
			]
		}),
		created () {
			this.getEncuestados()
		},
		methods: {
			verDetalle (item) {
				console.log('item de encuestado', item)
			},
			getEncuestados () {
				this.loading = true
				this.axios.get(`encuestado`)
					.then(response => {
						this.encuestados = response.data
						this.loading = false
					})
					.catch(error => {
						this.$store.commit('snackbar', {color: 'error', message: `al traer los encuestados.`, error: error})
						this.loading = false
					})
			}
		}
	}
</script>