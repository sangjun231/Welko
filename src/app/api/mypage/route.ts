import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { data, error } = await supabase.from('reviews').select('*');

  if (error) {
    console.error('Error fetching reviews:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { content, rating, post_id, user_id } = await req.json();

  const { data, error } = await supabase.from('reviews').insert({ content, rating, post_id, user_id });

  if (error) {
    console.error('Error creating review:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const supabase = createClient();
  const { id, content, rating } = await req.json();

  const { data, error } = await supabase.from('reviews').update({ content, rating }).eq('id', id);

  if (error) {
    console.error('Error fetching reviews:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient();
  const { id } = await req.json();

  const { data, error } = await supabase.from('reviews').delete().eq('id', id);

  if (error) {
    console.error('Error deleting review:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}