import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  const config = new DocumentBuilder()
  .setTitle("Vocher Pool API V0")
  .setDescription("This Api give management ability to provide vouchers to customer and track vouchers status")
  .setVersion("0.1")
  .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`api`, app , document);
  await app.listen(process.env.PORT);
}
bootstrap();
