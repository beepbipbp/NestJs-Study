import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {HttpExceptionFilter} from './common/exceptions/http-exception.filter';
import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, OpenAPIObject, SwaggerModule} from "@nestjs/swagger";
import * as expressBasicAuth from "express-basic-auth";
import * as past from 'path';
import {NestExpressApplication} from "@nestjs/platform-express";
import * as path from "path";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.use(['/docs', 'docs-json'], expressBasicAuth({
        challenge: true,
        users: {
            [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD
        }
    }));

    app.useStaticAssets(path.join(__dirname, 'common', 'uploads'), {
        prefix: '/media'
    });
    const config = new DocumentBuilder()
        .setTitle('Cats example')
        .setDescription('cat')
        .setVersion('1.0.0')
        .build();
    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true
    });
    const PORT = process.env.PORT;
    await app.listen(PORT);
}

bootstrap();
