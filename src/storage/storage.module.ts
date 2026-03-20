import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';
import { LocalStorageService } from './local-storage.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [StorageService, LocalStorageService],
  exports: [StorageService, LocalStorageService],
})
export class StorageModule {}
