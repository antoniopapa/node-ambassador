import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {Product} from "../entity/product.entity";
import {client} from "../index";

export const Products = async (req: Request, res: Response) => {
    res.send(await getRepository(Product).find());
}

export const CreateProduct = async (req: Request, res: Response) => {
    res.status(201).send(await getRepository(Product).save(req.body));
}

export const GetProduct = async (req: Request, res: Response) => {
    res.send(await getRepository(Product).findOne(req.params.id));
}

export const UpdateProduct = async (req: Request, res: Response) => {
    const repository = getRepository(Product);

    await repository.update(req.params.id, req.body);

    res.status(202).send(await repository.findOne(req.params.id));
}

export const DeleteProduct = async (req: Request, res: Response) => {
    await getRepository(Product).delete(req.params.id);

    res.status(204).send(null);
}

export const ProductsFrontend = async (req: Request, res: Response) => {
    let products = JSON.parse(await client.get('products_frontend'));

    if (!products) {
        products = await getRepository(Product).find();

        await client.set('products_frontend', JSON.stringify(products), {
            EX: 1800 //30 min
        });
    }

    res.send(products);
}

export const ProductsBackend = async (req: Request, res: Response) => {
    let products: Product[] = JSON.parse(await client.get('products_frontend'));

    if (!products) {
        products = await getRepository(Product).find();

        await client.set('products_frontend', JSON.stringify(products), {
            EX: 1800 //30 min
        });
    }

    if (req.query.s) {
        const s = req.query.s.toString().toLowerCase();

        products = products.filter(p => p.title.toLowerCase().indexOf(s) >= 0 || p.description.toLowerCase().indexOf(s) >= 0);
    }

    if (req.query.sort === 'asc' || req.query.sort === 'desc') {
        products.sort((a, b) => {
            const diff = a.price - b.price;

            if (diff === 0) return 0;

            const sign = Math.abs(diff) / diff; // -1, 1

            return req.query.sort === 'asc' ? sign : -sign;
        });
    }

    const page: number = parseInt(req.query.page as any) || 1;
    const perPage = 9;
    const total = products.length;

    const data = products.slice((page - 1) * perPage, page * perPage);

    res.send({
        data,
        meta: {
            total,
            page,
            last_page: Math.ceil(total / perPage)
        }
    });
}
