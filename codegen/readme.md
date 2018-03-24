## swagger codegen example
https://github.com/swagger-api/swagger-codegen

This generates basically the same service and model objects that are in limberest-demo git
(minus comments, etc).  The purpose of this is to illustrate how limberest impl code can
be generated from swagger api docs.

Probably the most useful aspect of this is Jsonable model class generation.

To run these scripts, download swagger-codegen-cli.jar and limberest.jar into this directory:
http://repo1.maven.org/maven2/io/swagger/swagger-codegen-cli/2.3.1/

The following additional debug options are available for all codegen targets:
  ```
  -DdebugSwagger prints the OpenAPI Specification as interpreted by the codegen
  -DdebugModels prints models passed to the template engine
  -DdebugOperations prints operations passed to the template engine
  -DdebugSupportingFiles prints additional data passed to the template engine
  ```