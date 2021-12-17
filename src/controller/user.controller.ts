import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {User} from "../entity/user.entity";
import {client} from "../index";

export const Ambassadors = async (req: Request, res: Response) => {
    res.send(await getRepository(User).find({
        is_ambassador: true
    }));
}

export const Rankings = async (req: Request, res: Response) => {
    const result: string[] = await client.sendCommand(['ZREVRANGEBYSCORE', 'rankings', '+inf', '-inf', 'WITHSCORES']);
    let name;

    res.send(result.reduce((o, r) => {
        if (isNaN(parseInt(r))) {
            name = r;
            return o;
        } else {
            return {
                ...o,
                [name]: parseInt(r)
            };
        }
    }, {}));
}
