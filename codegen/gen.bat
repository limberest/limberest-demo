java -Xdebug -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8038 ^
  -cp limberest-1.1.5.jar;swagger-codegen-cli.jar ^
  io.swagger.codegen.SwaggerCodegen ^
  generate ^
  -l limberest ^
  --template-dir ../../limberest/codegen ^
  -c config.json ^
  -i https://limberest.io/demo/api-docs ^
  -o ../generated
