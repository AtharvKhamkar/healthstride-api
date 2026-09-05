import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ClinicModule } from './modules/clinic/clinic.module';
import { AdminModule } from './modules/admin/admin.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { UserModule } from './modules/user/user.module';


@Module({
  imports: [ClinicModule, AdminModule, DoctorModule, UserModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
