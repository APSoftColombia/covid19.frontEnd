<template>
	<v-container fluid class="py-0" style="height: 100% !important;">
		<v-row style="height: 100% !important;" justify="center" align="center">
			<v-card flat class="transparent">
				<v-responsive :aspect-ratio="16/9">
					<v-img
							:src="`/static/logos/aspect16-9/${datosEmpresa.imagen_inicio}`"
					>
					</v-img>
				</v-responsive>
			</v-card>
		</v-row>
	</v-container>
</template>

<script>
	import {mapGetters} from 'vuex'
	export default {
		data: () => ({
			loading: false
		}),
		computed: {
			...mapGetters([
				'datosEmpresa'
			]),
			casanare () {
				return this && this.datosEmpresa && this.datosEmpresa.departamento_id != 0
			},
			styleMargin () {
				if (this && this.$vuetify && this.$vuetify.breakpoint) {
					if (this.casanare) {
						if (this.$vuetify.breakpoint.lgAndUp) return -300
						if (this.$vuetify.breakpoint.mdOnly) return -200
						if (this.$vuetify.breakpoint.smOnly) return -100
						if (this.$vuetify.breakpoint.xsOnly) return 0
					}
				}
				return  0
			}
		},
		created () {
		},
		methods: {
		}
	}
</script>
