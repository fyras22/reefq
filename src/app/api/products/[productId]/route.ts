import { NextRequest, NextResponse } from 'next/server'; export const dynamic = 'force-dynamic'; export async function GET(request: NextRequest, { params }: { params: { productId: string } }) { return NextResponse.json({ id: params.productId, name: 'Product placeholder', price: 100 }); }
