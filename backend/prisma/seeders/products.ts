import { PrismaClient } from "../../generated/prisma/client";
import { logStep, logSuccess } from "./utils";

const productData = [
  {
    name: "Choclo Clásico",
    description:
      "El choclo tradicional de Bob's Corn con mantequilla y sal marina",
    price: 2.5,
    imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400",
    order: 1,
  },
  {
    name: "Choclo Ceroso",
    description:
      "Choclo de variedad cerosa, naturalmente dulce y con textura cremosa ideal para acompañar",
    price: 3.0,
    imageUrl:
      "https://st.depositphotos.com/1000503/1364/i/450/depositphotos_13640368-stock-photo-mini-blue-corn.jpg",
    order: 2,
  },
  {
    name: "Choclo Opaco",
    description:
      "Choclo de variedad opaca con textura firme y sabor intenso, perfecto para preparaciones tradicionales",
    price: 3.2,
    imageUrl:
      "https://st3.depositphotos.com/12603566/16592/i/450/depositphotos_165921510-stock-photo-fresh-white-corns-on-wooden.jpg",
    order: 3,
  },
  {
    name: "Baby Choclo",
    description:
      "Choclos tiernos cosechados temprano, de tamaño pequeño y sabor delicado, perfectos para ensaladas y platos gourmet",
    price: 2.8,
    imageUrl:
      "https://st2.depositphotos.com/1000605/6532/i/450/depositphotos_65322329-stock-photo-baby-corn.jpg",
    order: 4,
  },
];

export async function seedProducts(prisma: PrismaClient) {
  logStep("Creating products");

  const createdProducts = [];

  for (const product of productData) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name },
    });

    let createdProduct;
    if (existingProduct) {
      createdProduct = await prisma.product.update({
        where: { id: existingProduct.id },
        data: product,
      });
    } else {
      createdProduct = await prisma.product.create({
        data: product,
      });
    }

    createdProducts.push(createdProduct);
  }

  logSuccess(`Created/Updated ${createdProducts.length} products`);
  return createdProducts;
}
