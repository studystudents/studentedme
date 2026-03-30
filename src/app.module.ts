import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
// import { ScheduleModule } from '@nestjs/schedule';
// import { BullModule } from '@nestjs/bull';
// import { ThrottlerModule } from '@nestjs/throttler';
// import { APP_GUARD } from '@nestjs/core';

// Core modules
import { DatabaseModule } from './database/database.module';
import { StorageModule } from './storage/storage.module';
import { AppController } from './app.controller';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
// import { StudentsModule } from './modules/students/students.module';
// import { LeadsModule } from './modules/leads/leads.module';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { AnalyzerModule } from './modules/analyzer/analyzer.module';
// import { VisaModule } from './modules/visa/visa.module';
// import { TasksModule } from './modules/tasks/tasks.module';
// import { NotificationsModule } from './modules/notifications/notifications.module';
// import { PaymentsModule } from './modules/payments/payments.module';
// import { PartnersModule } from './modules/partners/partners.module';
// import { AnalyticsModule } from './modules/analytics/analytics.module';
// import { AdminModule } from './modules/admin/admin.module';

// Guards
// import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Event Emitter (for domain events)
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),

    // Core modules
    DatabaseModule,
    StorageModule,

    // Feature modules - only essential ones for MVP
    AuthModule,
    UsersModule,
    OpportunitiesModule,
    ApplicationsModule,
    // StudentsModule,
    // LeadsModule,
    DocumentsModule,
    AnalyzerModule,

    // VisaModule,
    // TasksModule,
    // NotificationsModule,
    // PaymentsModule,
    // PartnersModule,
    // AnalyticsModule,
    // AdminModule,
  ],
  controllers: [AppController],
  providers: [
    // Apply JWT auth guard globally - disabled for minimal MVP
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
