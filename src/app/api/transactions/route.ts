import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorizeTransaction } from "@/lib/openai";

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        account: true,
      },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Auto-categorize using AI
    const category = await categorizeTransaction(body.description);

    const transaction = await prisma.transaction.create({
      data: {
        userId: body.userId,
        accountId: body.accountId,
        amount: body.amount,
        description: body.description,
        category,
        date: new Date(body.date),
        type: body.type,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
