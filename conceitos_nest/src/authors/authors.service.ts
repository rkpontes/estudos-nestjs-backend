import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorEntity } from './entities/author.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorsRepository: Repository<AuthorEntity>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<AuthorEntity> {
    try {
      const authorData = {
        email: createAuthorDto.email,
        passwordHash: this.generatePasswordHash(createAuthorDto.password),
        name: createAuthorDto.name,
        bio: createAuthorDto.bio,
      };
      const author = await this.authorsRepository.create(authorData);
      return await this.authorsRepository.save(author);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Author already exists');
      }
      throw new InternalServerErrorException('Error creating author');
    }
  }

  async findAll(): Promise<AuthorEntity[]> {
    return this.authorsRepository.find();
  }

  async findOne(id: number): Promise<AuthorEntity> {
    const author = await this.authorsRepository.findOne({ where: { id } });
    if (!author) throw new NotFoundException('Author not found');
    return author;
  }

  async update(
    id: number,
    updateAuthorDto: UpdateAuthorDto,
  ): Promise<AuthorEntity> {
    const author = await this.authorsRepository.preload({
      id: id,
      name: updateAuthorDto?.name,
      bio: updateAuthorDto?.bio,
    });

    if (updateAuthorDto?.password !== undefined) {
      const passwordHash = this.generatePasswordHash(updateAuthorDto.password);
      author.passwordHash = passwordHash;
    }

    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return this.authorsRepository.save(author);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.authorsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Author not found');
    }
    return true;
  }

  private generatePasswordHash(password: string): string {
    const hash = bcrypt.hashSync(password, 10);
    return hash;
  }
}
