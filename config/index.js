const config = {
    env: process.env.ENV,
    database: {
        development:{
            host: process.env.DEV_DATABASE_HOST, 
            name: process.env.DEV_DATABASE_NAME
        },
        production:{
            host: process.env.PROD_DATABASE_HOST, 
            name: process.env.PROD_DATABASE_NAME,
            user: process.env.PROD_DATABASE_USER,
            password: process.env.PROD_DATABASE_PASSWORD
        }
    },
    server:{
        host: process.env.SERVER_HOST,
        port: process.env.SERVER_PORT
    },
	secretKey: process.env.SECRET_KEY,
	tokenKey:process.env.TOKEN_KEY,
	idAllUser:process.env.LIST_ALL_USER
}

module.exports = config;