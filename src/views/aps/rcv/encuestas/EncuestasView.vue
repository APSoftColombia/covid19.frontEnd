<template>
	<v-container fluid>
		<page-title-bar title="Encuestas RCV"/>
		<v-row>
			<v-col cols="12">
				<v-card>
					<encuestas/>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>

	const Encuestas = () => import('Views/aps/rcv/encuestas/Encuestas')
	export default {
		components: {
      Encuestas
		}
	}
</script>
