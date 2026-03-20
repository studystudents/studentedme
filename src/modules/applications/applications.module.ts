import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { ApplicationEventsListener } from './listeners/application-events.listener';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, ApplicationEventsListener],
  exports: [ApplicationsService]
})
export class ApplicationsModule {}
