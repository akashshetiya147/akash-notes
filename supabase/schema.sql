-- Create a table for comments
create table comments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unit_path text not null, -- The unique path for the unit, e.g., "2025/sem1/physics/unit1"
  content text not null,
  author_name text default 'Anonymous'
);

-- Enable Row Level Security (RLS)
alter table comments enable row level security;

-- Create a policy that allows anyone to read comments
create policy "Public comments are viewable by everyone."
  on comments for select
  using ( true );

-- Create a policy that allows anyone to insert comments
create policy "Everyone can insert comments."
  on comments for insert
  with check ( true );
