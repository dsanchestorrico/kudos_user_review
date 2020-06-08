const { Router } = require('express');
const axios = require('axios');
const router = Router();

const connection = require('../models/connectMysql');
const publisher = require('../queue/publisher');

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM usuario';
    connection.query(sql,(error,resultado)=>{
        if (error) throw error;
        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.send('No hay registros');
        }
    });
});

router.get('/usuario/:idUser', (req, res) => {    
    const sql = `SELECT * FROM usuario WHERE id = ${req.params.idUser} `;
    connection.query(sql, async(error, resultado) => {
        if (error) throw error;
        if (resultado.length > 0) {    
            let cadena = JSON.stringify(resultado);
            let data = JSON.parse(cadena);
            var detail =[];
            var getDetail = async () => { return await axios.get(`http://localhost:3000/list/${req.params.idUser}`)
            .then(response =>{
                console.log(response.data);
                detail = response.data;
            })
            .catch(error =>{
                console.log('Error;'+error);
 
            })};

            await getDetail();

            data[0].detail = JSON.stringify(detail);
            //console.log(data);
            res.json(data);
        } else {
            res.send('No hay registros');
        }
    });
});

router.post('/create', (req, res) => {
    const sql = 'INSERT INTO usuario SET ?';
    const usuario = {
        nickname: req.body.nickname,
        realname: req.body.realname,
        kudosqty: 0
    }
    connection.query(sql,usuario,error=>{
        if (error) throw error; 
        res.send(usuario);

    });
});
router.get('/find', (req, res) => {
    const sql = 'SELECT * FROM usuario WHERE lower(nickname) like lower(\'%' + req.body.input + '%\') OR  lower(realname) like lower(\'%' + req.body.input +'%\') ';
    
    connection.query(sql,(error,resultado)=>{
        if (error) throw error; 
        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.send('No se encontraron registros para '+ req.body.input);
        }

    });
});
router.delete('/:idUser', (req, res) => {
    const {idUser} = req.params;
    const sql = `DELETE FROM usuario WHERE id = ${idUser}`;
    connection.query(sql, error => {
        if (error) throw error;
        res.send(`Usuario ${idUser} eliminado`);
        let data = {
            destino: req.params.idUser
        }
        publisher.publish(data).catch((error) => {
            console.error(error)
            process.exit(1)
        });

    });
});

module.exports = router;