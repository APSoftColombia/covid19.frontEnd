
export const RiesgoLabel = {
    render: function (createElement) {
        return createElement (
            `v-chip`,
            {
                class: this.clase,
                props: {
                    label: true,
                    color: this.color,
                    textColor: 'white'
                }
            },
            this.text
        )
    },
    props: ['text', 'color', 'clase', 'id']
}
