const orm = require('orm');

class UserRepository {
    constructor({db}) {
        db.define("user", {
                name: String,
                surname: String,
                age: Number, // FLOAT
                male: Boolean,
                continent: ["Europe", "America", "Asia", "Africa", "Australia", "Antarctica"], // ENUM type
                photo: Buffer, // BLOB/BINARY
                data: Object // JSON encoded
            },
            {
                methods: {
                    fullName: function () {
                        return this.name + ' ' + this.surname;
                    }
                },
                validations: {
                    age: orm.enforce.ranges.number(18, undefined, "under-age")
                }
            }
        );
    }
}

module.exports = UserRepository