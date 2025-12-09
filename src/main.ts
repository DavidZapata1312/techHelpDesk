import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS y pipes globales
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // Registrar interceptor global para transformar las respuestas
  app.useGlobalInterceptors(new TransformInterceptor());

  // Establecer un prefijo global para que todos los controladores estén bajo /api
  app.setGlobalPrefix('api');

  // configuración de swagger
  const config = new DocumentBuilder()
    .setTitle("TechHelpDesk API")
    .setDescription("API para la gestión de tickets")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
      },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // exponer swagger en /api/docs (ya que establecimos el prefijo global en 'api')
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  // Mostrar URL base y endpoint de Swagger claramente
  const url = await app.getUrl();
  console.log(`Servidor en ejecución en ${url}`);
  console.log(`Documentación de Swagger disponible en ${url}/api/docs`);
}
bootstrap();
