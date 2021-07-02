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
			])
		}
	}
</script>
