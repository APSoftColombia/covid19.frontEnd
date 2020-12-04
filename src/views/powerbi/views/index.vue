<template>
    <v-container fluid>
		<page-title-bar title="Analisis de Datos - beta"></page-title-bar>
		<v-row>
            <iframe width="1024" height="612" src="https://app.powerbi.com/view?r=eyJrIjoiNWQ4MGU0NjEtODIzOC00M2ZiLWE1ZmEtNzMyNmUyM2ZhMDBhIiwidCI6ImM5NTFkY2VlLThlYTktNGMwNy05MzY3LTBhYTNiMTJmZDg0ZCJ9" frameborder="0" allowFullScreen="true"></iframe>
		</v-row>
    </v-container>
</template>
<script>
import * as powerbi from 'powerbi-client'
let models = powerbi.models
let reportContainer = document.getElementById('report-container')
// powerbi.bootstrap(reportContainer, { type: "report" })
export default {
    name: "powerbi",
    data: () => ({
        loading: false,
        embedData: null
    }),
    created(){
        // this.getInducciones()
    },
    methods: {
        getInducciones(){
            this.loading = true
            this.axios.get(`powerbi-emdedded`).then(response => {
                if(response.data){
                    this.embedData = this.clone(response.data)
                    // Create a config object with type of the object, Embed details and Token Type
                    let reportLoadConfig = {
                        type: "report",
                        tokenType: models.TokenType.Embed,
                        accessToken: this.embedData.accessToken,
                        embedUrl: this.embedData.embedUrl
                    };
                    let report = powerbi.embed(reportContainer, reportLoadConfig);

                    // Clear any other loaded handler events
                    report.off("loaded");

                    // Triggers when a report schema is successfully loaded
                    report.on("loaded", function() {
                        console.log("Report load successful");
                    });

                    // Clear any other rendered handler events
                    report.off("rendered");

                    // Triggers when a report is successfully embedded in UI
                    report.on("rendered", function() {
                        console.log("Report render successful");
                    });

                    // Clear any other error handler events
                    report.off("error");

                    // Handle embed errors
                    report.on("error", function(event) {
                        let errorMsg = event.detail;
                        console.error(errorMsg);
                        return;
                    });
                }
                this.loading = false
            }).catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {color: 'error', message: `al recuperar el listado de inducciones`, error: error})
            })
        }
    }
}
</script>