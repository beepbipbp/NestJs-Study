import {Injectable, UnauthorizedException} from '@nestjs/common';
import {CatRequestDto} from "./dto/cats.request.dto";
import * as bcrypt from 'bcrypt';
import {CatsRepository} from "./cats.repository";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class CatsService {
    constructor(private readonly catsRepository: CatsRepository) {}

    async signUp(body: CatRequestDto) {
        const { email, name, password } = body;

        const isCatExist = await this.catsRepository.existByEmail(email);
        if(isCatExist) {
            throw new UnauthorizedException('해당 이메일의 고양이가 이미 존재합니다.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const cat = await this.catsRepository.create({ email, name, password: hashedPassword });

        return cat.readOnlyData;
    }
}