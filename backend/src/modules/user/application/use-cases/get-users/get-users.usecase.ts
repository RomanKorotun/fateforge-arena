import { Injectable } from "@nestjs/common";

import { UserQueryService } from "../../../infrastructure/prisma/query/prisma-user-query.service";

@Injectable()
export class GetUsersUseCase {
    constructor(private readonly userQueryService: UserQueryService) {}
    async execute() {
        return await this.userQueryService.getPublicUsers()
    }
}