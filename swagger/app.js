'use strict';

var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');

var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: {
    api_key: function (req, authOrSecDef, scopesOrApiKey, cb) {
      // 환경변수를 사용하거나 기본값 설정
      var validApiKey = process.env.API_KEY || 'my_key';
      
      // 요청 헤더 값이 api_key 이고, 값이 유효한 키일 경우에만 실행을 허용한다
      if (validApiKey === scopesOrApiKey) {
        cb();
      } else {
        cb(new Error('Access Denied'));
      }
    }
  }
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.runner.swagger.host = '127.0.0.1:10010';
  app.use(SwaggerUi(swaggerExpress.runner.swagger));
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  console.log('Server started on port:', port);
  
  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});