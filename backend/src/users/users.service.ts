import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  toPublic(user: User) {
    const { senha: _, ...usuario } = user;
    return usuario;
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.usersRepository.find({
      order: { nome: 'ASC' },
    });
    return users.map((user) => this.toPublic(user));
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto) {
    const existente = await this.findByEmail(createUserDto.email);
    if (existente) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const senhaHash = await bcrypt.hash(createUserDto.senha, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      senha: senhaHash,
    });

    const salvo = await this.usersRepository.save(user);
    return this.toPublic(salvo);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existente = await this.findByEmail(updateUserDto.email);
      if (existente) {
        throw new ConflictException('E-mail já cadastrado');
      }
    }

    if (updateUserDto.senha) {
      updateUserDto.senha = await bcrypt.hash(updateUserDto.senha, 10);
    }

    Object.assign(user, updateUserDto);
    const salvo = await this.usersRepository.save(user);
    return this.toPublic(salvo);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    await this.usersRepository.remove(user);
  }
}
