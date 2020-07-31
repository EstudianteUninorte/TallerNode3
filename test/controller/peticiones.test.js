const request = require('supertest')
const app = require('../../index');
const User = require('../../api/models/users');


describe('Prueba Controlador User', () => {

    beforeAll(async () => {
        await User.findOneAndDelete({username: 'test'});
    })

    it('Crear Usuario exitosamente', async () => {
        const res = await request(app).post('/api/users')
        .send({
            name: 'Test',
            age: 1,
            username: 'test',
            password: '123456',
            email: 'test@test',
            telephone: ['1234567890']            
        })

        expect(res.status).toEqual(201);

    });
    

    var id;

    it('Consultar Usuario Test', async () => {

        const login = await request(app).post('/api/users/login').send({username: "admin", password:"12345"});

        const res = await request(app).get('/api/users').set("x-access-token",login.body.token);

        let testUser = res.body.filter((e)=>{
            return e.username=="test";
        }).pop();

        expect(testUser).toBeDefined();        
        
        id = testUser._id;

    })

    it('Eliminar Usuario Test', async () => {
       
        const res = await request(app).delete('/api/users')
        .send({
            id: id
        });

        expect(res.status).toEqual(202);
    });
    
});