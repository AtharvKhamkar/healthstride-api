import { Module } from "@nestjs/common";
import { PostgreSqlService } from "./postgresql.service";

@Module({
    imports: [],
    providers:[PostgreSqlService],
    exports:[PostgreSqlService]
})


export class PostgreSqlModule { } 