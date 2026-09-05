import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ClinicModule } from './modules/clinic/clinic.module';
import { AdminModule } from './modules/admin/admin.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '@app/common';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CommonModule,
    ClinicModule, AdminModule, DoctorModule, UserModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
