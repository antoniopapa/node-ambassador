import {createConnection, getRepository} from "typeorm";
import {User} from "../entity/user.entity";
import bcryptjs from "bcryptjs";
import * as faker from "faker";

createConnection().then(async () => {
    const repository = getRepository(User);

    const password = await bcryptjs.hash("1234", 10);

    for (let i = 0; i < 30; i++) {
        await repository.save({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: faker.internet.email(),
            password,
            is_ambassador: true
        })
    }

    process.exit();
});
