// import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/db";
// import OrderModel from "@/lib/models/Order";
// import ProductModel from "@/lib/models/Product";
// import CartModel from "@/lib/models/Cart";
// import { checkoutSchema } from "@/lib/validators";
// import { getAuthUser } from "@/lib/session";
// import { generateOrderCode } from "@/lib/utils";

// export async function POST(request: NextRequest) {
//   const auth = await getAuthUser();
//   if (!auth) {
//     return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
//   }

//   const payload = await request.json().catch(() => undefined);
//   if (!payload) {
//     return NextResponse.json({ message: "Payload tidak valid." }, { status: 400 });
//   }

//   const parseResult = checkoutSchema.safeParse(payload);
//   if (!parseResult.success) {
//     return NextResponse.json(
//       { message: "Data checkout tidak valid.", errors: parseResult.error.flatten() },
//       { status: 422 },
//     );
//   }

//   await connectToDatabase();

//   const { items, shippingAddress, notes, paymentMethod, userId } = parseResult.data;
//   const targetUserId = userId ?? auth.sub;

//   if (auth.role !== "admin" && auth.sub !== targetUserId) {
//     return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
//   }

//   let productRecords: Array<{ item: (typeof items)[number]; product: Awaited<ReturnType<typeof ProductModel.findOne>> }> = [];
//   try {
//     productRecords = await Promise.all(
//       items.map(async (item) => {
//         const product = await ProductModel.findOne({
//           $or: [{ _id: item.productId }, { slug: item.productId }],
//         });
//         if (!product) {
//           throw new Error(`Produk ${item.productId} tidak ditemukan.`);
//         }
//         return { item, product };
//       }),
//     );
//   } catch (error) {
//     return NextResponse.json({ message: (error as Error).message }, { status: 404 });
//   }

//   let total = 0;
//   let orderItems: Array<{
//     product: typeof productRecords[number]["product"]["_id"];
//     productName: string;
//     productSlug: string;
//     price: number;
//     quantity: number;
//     subtotal: number;
//   }> = [];

//   try {
//     orderItems = productRecords.map(({ item, product }) => {
//       if (product.stock < item.quantity) {
//         throw new Error(`Stok ${product.name} tidak mencukupi.`);
//       }
//       const subtotal = product.price * item.quantity;
//       total += subtotal;
//       return {
//         product: product._id,
//         productName: product.name,
//         productSlug: product.slug,
//         price: product.price,
//         quantity: item.quantity,
//         subtotal,
//       };
//     });
//   } catch (error) {
//     return NextResponse.json({ message: (error as Error).message }, { status: 400 });
//   }

//   const shippingCost = Math.max(Math.round(total * 0.05), 15000);
//   const grandTotal = total + shippingCost;

//   const order = await OrderModel.create({
//     code: generateOrderCode(),
//     user: targetUserId,
//     status: "pending",
//     paymentStatus: "pending",
//     items: orderItems,
//     total,
//     shippingCost,
//     grandTotal,
//     shippingAddress,
//     notes,
//     paymentMethod,
//   });

//   await Promise.all(
//     productRecords.map(({ item, product }) =>
//       ProductModel.findByIdAndUpdate(product._id, {
//         $inc: { stock: -item.quantity },
//       }),
//     ),
//   );

//   await CartModel.findOneAndUpdate(
//     { user: targetUserId },
//     {
//       $pull: {
//         items: { product: { $in: productRecords.map(({ product }) => product._id) } },
//       },
//     },
//   );

//   return NextResponse.json(
//     {
//       message: "Checkout berhasil dibuat.",
//       data: {
//         id: order.id,
//         code: order.code,
//         grandTotal,
//         paymentStatus: order.paymentStatus,
//       },
//     },
//     { status: 201 },
//   );
// }



import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import OrderModel from "@/lib/models/Order";
import ProductModel, { type Product } from "@/lib/models/Product";
import CartModel from "@/lib/models/Cart";
import { checkoutSchema } from "@/lib/validators";
import { getAuthUser } from "@/lib/session";
import { generateOrderCode } from "@/lib/utils";
import type { HydratedDocument } from "mongoose";

export async function POST(request: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const payload = await request.json().catch(() => undefined);
  if (!payload) {
    return NextResponse.json({ message: "Payload tidak valid." }, { status: 400 });
  }

  const parseResult = checkoutSchema.safeParse(payload);
  if (!parseResult.success) {
    return NextResponse.json(
      { message: "Data checkout tidak valid.", errors: parseResult.error.flatten() },
      { status: 422 },
    );
  }

  await connectToDatabase();

  const { items, shippingAddress, notes, paymentMethod, userId } = parseResult.data;
  const targetUserId = userId ?? auth.sub;

  if (auth.role !== "admin" && auth.sub !== targetUserId) {
    return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  }

  // Ambil produk dan pastikan non-nullable
  type ProductRecord = {
    item: typeof items[number];
    product: HydratedDocument<Product>;
  };

  let productRecords: ProductRecord[] = [];

  try {
    productRecords = await Promise.all(
      items.map(async (item) => {
        const product = await ProductModel.findOne({
          $or: [{ _id: item.productId }, { slug: item.productId }],
        });

        if (!product) {
          throw new Error(`Produk ${item.productId} tidak ditemukan.`);
        }

        return { item, product };
      }),
    );
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }

  // Buat orderItems
  let total = 0;
  const orderItems = productRecords.map(({ item, product }) => {
    if (product.stock < item.quantity) {
      throw new Error(`Stok ${product.name} tidak mencukupi.`);
    }

    const subtotal = product.price * item.quantity;
    total += subtotal;

    return {
      product: product._id,
      productName: product.name,
      productSlug: product.slug,
      price: product.price,
      quantity: item.quantity,
      subtotal,
    };
  });

  const shippingCost = Math.max(Math.round(total * 0.05), 15000);
  const grandTotal = total + shippingCost;

  // Simpan order
  const order = await OrderModel.create({
    code: generateOrderCode(),
    user: targetUserId,
    status: "pending",
    paymentStatus: "pending",
    items: orderItems,
    total,
    shippingCost,
    grandTotal,
    shippingAddress,
    notes,
    paymentMethod,
  });

  // Update stok produk
  await Promise.all(
    productRecords.map(({ item, product }) =>
      ProductModel.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } }),
    ),
  );

  // Hapus produk dari cart user
  await CartModel.findOneAndUpdate(
    { user: targetUserId },
    {
      $pull: {
        items: { product: { $in: productRecords.map(({ product }) => product._id) } },
      },
    },
  );

  return NextResponse.json(
    {
      message: "Checkout berhasil dibuat.",
      data: {
        id: order._id,
        code: order.code,
        grandTotal,
        paymentStatus: order.paymentStatus,
      },
    },
    { status: 201 },
  );
}
