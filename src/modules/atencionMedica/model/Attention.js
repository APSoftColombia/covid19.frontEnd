export default class Attention {
    static create(IAttention = null) {
        if (IAttention) {
            const {
                id = null,
                name = '',
                email = '',
                permissions = [],
                roles = []
            } = IAttention
            return new this(id, name, email, permissions, roles)
        } else {
            return new this(null, '', '', [], [])
        }
    }

    constructor (id, name, email, permissions, roles) {
        this.id = id
        this.name = name
        this.email = email
        this.permissions = permissions
        this.roles = roles
    }
}