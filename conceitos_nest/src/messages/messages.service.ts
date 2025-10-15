import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorsService } from 'src/authors/authors.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    private authorService: AuthorsService,
  ) {}

  async findAll(paginationDto?: PaginationDto): Promise<any> {
    const { limit = 10, page = 1 } = paginationDto || {};

    const data = await this.messageRepository.find({
      relations: ['author'],
      order: { id: 'DESC' },
      select: { author: { id: true, name: true } },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data,
      pagination: {
        total: data.length,
        page,
        limit,
      },
    };
  }

  async findOne(id: number): Promise<MessageEntity> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['author'],
      order: { id: 'DESC' },
      select: { author: { id: true, name: true } },
    });
    if (message) return message;
    throw new NotFoundException('Message not found');
  }

  async create(createMessageDto: CreateMessageDto) {
    const author = await this.authorService.findOne(createMessageDto.authorId);

    const messageData = {
      message: createMessageDto.message,
      author: author,
    };

    const message = this.messageRepository.create(messageData);
    await this.messageRepository.save(message);

    return {
      ...message,
      author: { id: author.id, name: author.name },
    };
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const author = await this.authorService.findOne(updateMessageDto.authorId);
    const messageData = await this.findOne(id);
    messageData.message = updateMessageDto?.message ?? messageData.message;
    messageData.author = author ?? messageData.author;
    messageData.updatedAt = new Date();

    await this.messageRepository.save(messageData);

    return {
      ...messageData,
      author: { id: author.id, name: author.name },
    };
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.messageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Message not found');
    }
    return true;
  }
}
