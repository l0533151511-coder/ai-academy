-- אקדמיית AI — סכמת Supabase מלאה
-- הרץ בסדר הזה ב-SQL Editor של הפרויקט ב-Supabase

create extension if not exists "uuid-ossp";

-- ============ פרופיל משתמש (מרחיב את auth.users) ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('student', 'instructor', 'admin')),
  xp int not null default 0,
  streak_days int not null default 0,
  last_active_date date,
  created_at timestamptz not null default now()
);

-- ============ תוכן קוריקולום (ניהול מרכזי, נקרא ע"י כולם) ============
create table if not exists public.tracks (
  slug text primary key,
  "order" int not null,
  title text not null,
  goal text,
  color text
);

create table if not exists public.modules (
  slug text primary key,
  track_slug text not null references public.tracks(slug) on delete cascade,
  "order" int not null,
  title text not null,
  description text,
  project_brief text,
  is_capstone boolean not null default false
);

create table if not exists public.lessons (
  slug text primary key,
  module_slug text not null references public.modules(slug) on delete cascade,
  "order" int not null,
  title text not null,
  objectives jsonb not null default '[]',
  est_minutes int not null default 20,
  difficulty text not null default 'מתחיל',
  prerequisites jsonb not null default '[]'
);

-- ============ התקדמות אישית ============
-- הערה: lesson_slug/module_slug אינם FK לטבלאות tracks/modules/lessons בכוונה —
-- תוכן הקוריקולום כרגע מנוהל בקוד (src/lib/curriculum/data.ts) ולא ב-DB, כדי לא לחסום כתיבת
-- התקדמות בזמן שהתוכן עוד מתעדכן. אפשר להדק ל-FK אמיתי בעתיד כשהתוכן יעבור ניהול מלא ב-DB.
create table if not exists public.lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_slug text not null,
  status text not null default 'completed' check (status in ('in_progress', 'completed')),
  completed_at timestamptz default now(),
  primary key (user_id, lesson_slug)
);

create table if not exists public.exercise_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exercise_id text not null,
  passed boolean not null,
  code text,
  attempted_at timestamptz not null default now()
);

create table if not exists public.quiz_results (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id text not null,
  score int not null,
  total int not null,
  answers jsonb,
  submitted_at timestamptz not null default now()
);

create table if not exists public.project_submissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  module_slug text not null,
  repo_url text,
  notes text,
  status text not null default 'submitted' check (status in ('submitted', 'reviewed', 'approved')),
  submitted_at timestamptz not null default now()
);

-- ============ הישגים ותעודות ============
create table if not exists public.achievements (
  key text primary key,
  title text not null,
  description text,
  icon text
);

create table if not exists public.user_achievements (
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_key text not null references public.achievements(key) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_key)
);

create table if not exists public.certificates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  track_slug text,
  issued_at timestamptz not null default now(),
  verify_hash text unique not null
);

-- ============ נוחות אישית ============
create table if not exists public.notes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_slug text not null,
  content text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_slug)
);

create table if not exists public.bookmarks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_slug)
);

-- ============ Row Level Security ============
alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.exercise_attempts enable row level security;
alter table public.quiz_results enable row level security;
alter table public.project_submissions enable row level security;
alter table public.user_achievements enable row level security;
alter table public.certificates enable row level security;
alter table public.notes enable row level security;
alter table public.bookmarks enable row level security;
alter table public.tracks enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.achievements enable row level security;

-- תוכן קוריקולום: קריאה פתוחה לכולם (גם אורחים), כתיבה רק ל-service role
create policy "curriculum readable by all" on public.tracks for select using (true);
create policy "curriculum readable by all" on public.modules for select using (true);
create policy "curriculum readable by all" on public.lessons for select using (true);
create policy "achievements readable by all" on public.achievements for select using (true);

-- נתונים אישיים: כל משתמש רואה/כותב רק את שלו
create policy "own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own progress" on public.lesson_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own attempts" on public.exercise_attempts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own quiz results" on public.quiz_results for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own submissions" on public.project_submissions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own achievements" on public.user_achievements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own certificates" on public.certificates for select using (auth.uid() = user_id);
create policy "own notes" on public.notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own bookmarks" on public.bookmarks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============ Trigger: יצירת profile אוטומטית בהרשמה ============
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
