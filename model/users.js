const uuidv1 = require('uuid/v1')
const tcomb = require('tcomb')


const bcrypt = require('bcrypt');
const saltRounds = 10;

const USER = tcomb.struct({
    id: tcomb.String,
    name: tcomb.String,
    login: tcomb.String,
    age: tcomb.Number,
    password: tcomb.String
}, {strict: true})

const users = [
    {
        id: '45745c60-7b1a-11e8-9c9c-2d42b21b1a3e',
        name: 'Pedro Ramirez',
        login: 'pedro',
        age: 44,
        password: bcrypt.hash("tacos", saltRounds)
    }, {
        id: '456897d-98a8-78d8-4565-2d42b21b1a3e',
        name: 'Jesse Jones',
        login: 'jesse',
        age: 48,
        password: bcrypt.hash("oscar", saltRounds)
    }, {
        id: '987sd88a-45q6-78d8-4565-2d42b21b1a3e',
        name: 'Rose Doolan',
        login: 'rose',
        age: 36,
        password: bcrypt.hash("kittens", saltRounds)
    }, {
        id: '654de540-877a-65e5-4565-2d42b21b1a3e',
        name: 'Sid Ketchum',
        login: 'sid',
        age: 56,
        password: bcrypt.hash("skateboard", saltRounds)
    }
]

const get = (id) => {
    let result = null
    const usersFound = users.filter((user) => user.id === id)
    if (usersFound.length >= 1){
        result = Object.assign({}, usersFound[0])
        delete result.password
    }
    else {
        result = undefined
    }
    return result
}

const getAll = () => {
    const result = []
    let tmp = null
    users.forEach(user => {
        tmp = Object.assign({}, user)
        delete tmp.password
        result.push(tmp)
    });
return result
}

const add = async (user) => {
    return new Promise(async (resolve, reject) => {
        bcrypt.hash(user.password, saltRounds)
        .then((hash) => {
            user.password = hash
            const newUser = {
                ...user,
                id: uuidv1()
            }
            if (validateUser(newUser)) {
                users.push(newUser)
                resolve(newUser)
            } else {
                reject('user.not.valid')
            }
        })
        .catch((error) => {
            reject(error)
        })
    })
}

const update = async (id, newUserProperties) => {
    const usersFound = users.filter((user) => user.id === id)

    if (usersFound.length === 1) {
        const oldUser = usersFound[0]

        //cas du changement de mdp
        if( newUserProperties.password){
            newUserProperties['password']=await bcrypt.hash(newUserProperties['password'], saltRounds)
        }

        const newUser = {
            ...oldUser,
            ...newUserProperties
        }

        if (validateUser(newUser)) 
        {
            // Object.assign permet d'éviter la suppression de l'ancien élément puis l'ajout
            // du nouveau Il assigne à l'ancien objet toutes les propriétés du nouveau
            Object.assign(oldUser, newUser)
            return oldUser
        } 
        else 
        {
            throw new Error('user.not.valid')
        }

    } else {
        throw new Error('user.not.found')
    }
}

const remove = (id) => {
    const indexFound = users.findIndex((user) => user.id === id)
    if (indexFound > -1) {
        users.splice(indexFound, 1)
    } else {
        throw new Error('user.not.found')
    }
}

const verifyUser = (login, password) => {
    return new Promise((resolve, reject) => {
        const usersFound = users.filter((user) => user.login === login)
        if (usersFound.length >= 1){
            bcrypt.compare(password, usersFound[0].password)
            .then((res) => {
                res ? resolve() : reject()
            })
            .catch(() => {
                reject()
            })
        }
        else {
            reject()
        }
    })
}

function validateUser(user) {
    let result = false
    /* istanbul ignore else */
    if (user) {
        try {
            const tcombUser = USER(user)
            result = true
        } catch (exc) {
            result = false
        }
    }
    return result
}

exports.get = get
exports.getAll = getAll
exports.add = add
exports.update = update
exports.remove = remove
exports.verifyUser = verifyUser