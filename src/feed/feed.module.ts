import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post as PostEntity} from 'src/entity/post.entity';
import { FeedService } from './feed.service';
import { User } from 'src/entity/user.entity';
import { CommentEntity } from 'src/entity/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, User, CommentEntity])],
  providers: [FeedService],
  controllers: [FeedController]
})

export class FeedModule {}
