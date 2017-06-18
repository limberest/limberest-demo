package io.limberest.demo.api;

import io.swagger.annotations.Info;
import io.swagger.annotations.License;
import io.swagger.annotations.SwaggerDefinition;

@SwaggerDefinition(
    info=@Info(title="Movies API", version="1.0", license=@License(name="Apache 2.0")),
    schemes={SwaggerDefinition.Scheme.HTTP,SwaggerDefinition.Scheme.HTTPS},
    basePath="/demo", consumes="application/json", produces="application/json")
public class Definition {

}
