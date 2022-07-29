/*SE REALIZA EL LLAMADO DE LAS DEPENDENCIAS A UTILIZAR
 - EXPRESS: DEPENDENCIA PARA LEVANTAR ELSERVIDOR
 - MYSQL: DEPENDENCIA PARA CONECTAR CON LA BASE DE DATOS MYSQL
 - BODY-PARSER: DEPENDENCIA PARA RECUPERAR DATOS DE UN FORMULARIO (ENVIAR DATOS DEL HTML HASTA EL SERVIDOR)
*/
const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')

/*VARIABLES
 - APP: ES UNA VARIABLE PARA LLAMAR A LAS FUNCIONES DE EXPRESS, QUE MÁS ADELANTE SE USARA PARA MONTAR SERVIDOR Y CREAR RUTAS
 - PORT: ES EL PUERTO POR DONDE SALDRA EL SERVIDOR (process.env.PORT) BUSCARA UN PUERTO POR DEFECTO EN VARIABLES DE ENTORNO, DE NO SER ASÍ TOMARA COMO PUERTO EL 3000
 - HOST: ESTE ES EL HOST DEL SERVIDOR (process.env.HOST) BUSCARA UN HOST POR DEFECTO EN LAS VARIABLES DE ENTORNO, DE NO SER ASÍ USARA EL '0.0.0.0'
*/
const app = express()
const port = process.env.PORT || 3000
const host = process.env.HOST || '0.0.0.0'


//AQUI SE HACE USO DE BODY PARSER PARA PODER MANDAR A LLAMAR LOS DATOS DESDE UN FORMULARIO
app.use(bodyParser.urlencoded({ extended:false }))

//CONEXIÓN CON LA BASE DE DATOS
const conexion = mysql.createConnection({
    host : 'mysql-inventario-audiosuite.alwaysdata.net',
    database : 'inventario-audiosuite_inventario',
    user : '276951',
    password : '@49S99L7cpDvVb@'

})

//VERIFICACIÓN SI LA BASE DE DATOS SE CONECTO CORRECTAMENTE
conexion.connect(function(err) {
    if (err) {
        console.error('Error de conexion: ' + err.stack);
        return; //EN CASO DE QUE LA CONEXIÓN FALLE RETORNARA UN ERROR EN LA CONSOLA
    }
    console.log('Conectado con el identificador ' + conexion.threadId);
    //EN CASO DE QUE LA CONEXIÓN SEA EXITOSA SE AVISARA POR CONSOLA CON EL NUMERO IDENTIFICADOR
});

//SE DECLARA EL MOTOR DE VISTA CON EJS, (LA CARPETA DE VISTAS ESTA SELECCIONADA POR DEFECTO EN VIEWS)
app.set('view engine', 'ejs')
//SE DECLARA LA CARPETA ESTATICA EN LA RUTA DE PUBLIC (DENTRO DE ESTA CARPETA IRAN LOS ARCHIVOS CSS)
app.use(express.static('public'))

//VISTA DE LA RUTA INDEX, EL APP.GET SE UTILIZA PARA OBTENER O VER LA VISTA DE EJS(HTML)
//RES.RENDER ES USADO PARA RENDERIZAR LA VISTA DE EJS(SE ENCUENTRAN EN LA CARPETA VIEWS)
app.get('/', (req,res) => {
    res.render('index')
})

/*EL APP.GET EN ESTE CASO ES PARA CREAR LAS PAGINAS DE LOS KEYS
    -keyVerde
    -keyAzul
    -keyNegro
DENTRO DE CONEXION.QUERY SE ENCUENTRA LA CONSULTA A MYSQL, DESPUES DE ESO ARROJA UN ERROR(ERR), Y UN RESULTA(RESULTS) RESULTS CONTIENE LOS DATOS ARROJADOS POR LA CONSULTA
*/
app.get('/keyVerde', (req,res) => {
    const key = req.params.key
    conexion.query('SELECT * FROM keyVerde', function(err, results){
        if (err){
            throw err;
        }
        res.render('keys', {
            objetos:results,
            num: results.length,
            key:'keyVerde',
            title: 'Keys Verdes'
        })
    })
})
app.get('/keyAzul', (req,res) => {
    const key = req.params.key
    conexion.query('SELECT * FROM keyAzul', function(err, results){
        if (err){
            throw err;
        }
        res.render('keys', {
            objetos:results,
            num: results.length,
            key:'keyAzul',
            title: 'Keys Azules'
        })
    })
})
app.get('/keyNegro', (req,res) => {
    const key = req.params.key
    conexion.query('SELECT * FROM keyNegro', function(err, results){
        if (err){
            throw err;
        }
        res.render('keys', {
            objetos:results,
            num: results.length,
            key:'keyNegro',
            title: 'Keys Negros'
        })
    })
})


/*APP.POST ES USADO PARA ENVIAR DATOS, EN ESTE CASO SE ESTAN ENVIANDO DATOS AL SERVIDOR PARA DESPUES SER MANDADOS A LA BASE DE DATOS
    - CONEXION.QUERY EN ESTA CASO ESTA HACIENDO UNA CONSULTA, LA VARIABLE KEY ESTA OBTENIENDO DATOS DE LA URL POR MEDIO DE REQ.PARAMS
    - DATOS ES UNA VARIABLE QUE ESTA OBTENIENDO DATOS DEL FORMULARIO PARA MANDARLOS A LA BASE DE DATOS
UNA VEZ REALIZADA LA INSERSION DE DATOS SERA REDIRIGIDO A LA PAGINA DE KEY CORRESPONDIENTE*/
app.post('/insert/:key', (req,res)=>{
    const key = req.params.key
    const datos = req.body
    console.log(datos)
    conexion.query(`INSERT INTO ${key} SET ?`, [datos], function (err,rows){
        if(err){
            throw err;
        }
        res.redirect(`/${key}`)
    })
})

//ESTE ES SIMILAR A LA INSERSIÓN DE DATOS, EN ESTE CASO EN VEZ DE INSERTAR SE VA A REALIZAR UN DELETE
app.post('/delete/:key/:id', (req,res)=>{
    const key = req.params.key
    const id = req.params.id
    conexion.query(`DELETE FROM ${key} WHERE id = '${id}'`, function(err,rows){
        if(err){
            throw err;
        }
        res.redirect(`/${key}`)
    })
})

//AQUI SE ENCUENTRA LEVANTADO EL SERVIDOR, USANDO COMO VARIABLES EL HOST Y POST MENCIONADOS AL PRINCIPIO, EN CASO DE SER LEVANTADO CORRECTAMENTE SE MANDARA UN MENSAJE POR CONSOLA.
app.listen(port,host, () => {
    console.log(`Example app listening on port ${port}!`)
})
