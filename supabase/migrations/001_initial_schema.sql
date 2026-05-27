-- ============================================================
-- HireQuest — Full Database Schema
-- Supabase PostgreSQL
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('candidate', 'recruiter');
CREATE TYPE quest_status AS ENUM ('applied', 'screening', 'arena', 'offer', 'hired', 'rejected');
CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'internship', 'freelance', 'co_founder');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard', 'very_hard', 'legendary');
CREATE TYPE verification_status AS ENUM ('pending', 'in_review', 'verified', 'rejected');

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    display_name TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    title TEXT DEFAULT 'Novice Explorer',
    bio TEXT,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    location_city TEXT,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    gold INTEGER DEFAULT 0,
    hp INTEGER DEFAULT 100,
    gems INTEGER DEFAULT 0,
    verification_status verification_status DEFAULT 'pending',
    id_document_url TEXT,
    selfie_url TEXT,
    skills TEXT[] DEFAULT '{}',
    resume_url TEXT,
    video_resume_url TEXT,
    video_transcript TEXT,
    video_analysis JSONB,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COMPANIES (Guilds)
-- ============================================================
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    logo_url TEXT,
    banner_url TEXT,
    description TEXT,
    industry TEXT,
    website TEXT,
    location_city TEXT,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    size TEXT,
    guild_level INTEGER DEFAULT 1,
    guild_xp INTEGER DEFAULT 0,
    verification_status verification_status DEFAULT 'pending',
    registration_doc_url TEXT,
    is_startup BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- JOBS (Quests / Boss Fights)
-- ============================================================
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    posted_by UUID REFERENCES profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    requirements TEXT[] DEFAULT '{}',
    skills_required TEXT[] DEFAULT '{}',
    job_type job_type DEFAULT 'full_time',
    difficulty difficulty_level DEFAULT 'medium',
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency TEXT DEFAULT 'INR',
    xp_reward INTEGER DEFAULT 100,
    gem_reward INTEGER DEFAULT 10,
    location_city TEXT,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    is_remote BOOLEAN DEFAULT FALSE,
    is_side_quest BOOLEAN DEFAULT FALSE,
    is_boss_fight BOOLEAN DEFAULT FALSE,
    applicant_count INTEGER DEFAULT 0,
    max_applicants INTEGER DEFAULT 100,
    recommended_level INTEGER DEFAULT 1,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- APPLICATIONS (Quest Progress)
-- ============================================================
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status quest_status DEFAULT 'applied',
    match_score REAL,
    ai_summary TEXT,
    cover_note TEXT,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, candidate_id)
);

-- ============================================================
-- INTERVIEWS (Boss Fights / Arena)
-- ============================================================
CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    recruiter_id UUID REFERENCES profiles(id),
    candidate_id UUID REFERENCES profiles(id),
    scheduled_at TIMESTAMPTZ,
    duration_minutes INTEGER DEFAULT 30,
    meeting_room_id TEXT,
    status TEXT DEFAULT 'scheduled',
    recording_url TEXT,
    transcript TEXT,
    ai_analysis JSONB,
    recruiter_notes TEXT,
    candidate_score REAL,
    metrics JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VIDEO ANALYSES
-- ============================================================
CREATE TABLE video_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    transcript TEXT,
    summary TEXT,
    confidence_score REAL,
    communication_score REAL,
    grammar_score REAL,
    eye_contact_score REAL,
    posture_score REAL,
    enthusiasm_score REAL,
    professionalism_score REAL,
    behavior_notes TEXT[] DEFAULT '{}',
    improvements TEXT[] DEFAULT '{}',
    overall_score REAL,
    raw_analysis JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SKILL CATEGORIES & NODES
-- ============================================================
CREATE TABLE skill_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT
);

CREATE TABLE skill_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES skill_categories(id),
    name TEXT NOT NULL,
    parent_id UUID REFERENCES skill_nodes(id),
    tier INTEGER DEFAULT 1,
    xp_required INTEGER DEFAULT 100,
    description TEXT
);

CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    skill_node_id UUID REFERENCES skill_nodes(id),
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, skill_node_id)
);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    xp_reward INTEGER DEFAULT 50,
    condition_type TEXT,
    condition_value INTEGER,
    rarity TEXT DEFAULT 'common'
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id),
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES profiles(id),
    receiver_id UUID REFERENCES profiles(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- XP LOG
-- ============================================================
CREATE TABLE xp_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    source TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Profiles readable by all" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Companies
CREATE POLICY "Companies readable by all" ON companies FOR SELECT USING (true);
CREATE POLICY "Recruiters can insert companies" ON companies FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'recruiter')
);
CREATE POLICY "Owners can update companies" ON companies FOR UPDATE USING (owner_id = auth.uid());

-- Jobs
CREATE POLICY "Jobs readable by all" ON jobs FOR SELECT USING (true);
CREATE POLICY "Recruiters can insert jobs" ON jobs FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'recruiter')
);
CREATE POLICY "Posters can update jobs" ON jobs FOR UPDATE USING (posted_by = auth.uid());

-- Applications
CREATE POLICY "Candidates see own applications" ON applications FOR SELECT USING (candidate_id = auth.uid());
CREATE POLICY "Recruiters see applications for their jobs" ON applications FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM jobs j
        JOIN companies c ON j.company_id = c.id
        WHERE j.id = applications.job_id AND c.owner_id = auth.uid()
    )
);
CREATE POLICY "Candidates can insert applications" ON applications FOR INSERT WITH CHECK (candidate_id = auth.uid());
CREATE POLICY "Status updates by recruiters" ON applications FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM jobs j
        JOIN companies c ON j.company_id = c.id
        WHERE j.id = applications.job_id AND c.owner_id = auth.uid()
    )
);

-- Interviews
CREATE POLICY "Interview participants can view" ON interviews FOR SELECT USING (
    recruiter_id = auth.uid() OR candidate_id = auth.uid()
);
CREATE POLICY "Recruiters can insert interviews" ON interviews FOR INSERT WITH CHECK (recruiter_id = auth.uid());
CREATE POLICY "Recruiters can update interviews" ON interviews FOR UPDATE USING (recruiter_id = auth.uid());

-- Video analyses
CREATE POLICY "Users see own analyses" ON video_analyses FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can insert own analyses" ON video_analyses FOR INSERT WITH CHECK (profile_id = auth.uid());

-- Messages
CREATE POLICY "Users see own messages" ON messages FOR SELECT USING (
    sender_id = auth.uid() OR receiver_id = auth.uid()
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Receivers can update read status" ON messages FOR UPDATE USING (receiver_id = auth.uid());

-- XP Log
CREATE POLICY "Users see own xp" ON xp_log FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can insert xp" ON xp_log FOR INSERT WITH CHECK (user_id = auth.uid());

-- Skills
CREATE POLICY "Skills readable by all" ON user_skills FOR SELECT USING (true);
CREATE POLICY "Users can manage own skills" ON user_skills FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own skills" ON user_skills FOR UPDATE USING (user_id = auth.uid());

-- Achievements
CREATE POLICY "Achievements readable by all" ON user_achievements FOR SELECT USING (true);
CREATE POLICY "System can insert achievements" ON user_achievements FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================================
-- REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE applications;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE interviews;

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'candidate')::user_role,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Increment applicant count
CREATE OR REPLACE FUNCTION public.increment_applicant_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE jobs SET applicant_count = applicant_count + 1 WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_application_created
  AFTER INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_applicant_count();

-- Award XP function
CREATE OR REPLACE FUNCTION public.award_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_source TEXT,
  p_description TEXT DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  new_xp INTEGER;
  new_level INTEGER;
BEGIN
  -- Update profile XP
  UPDATE profiles
  SET xp = xp + p_amount, updated_at = NOW()
  WHERE id = p_user_id
  RETURNING xp INTO new_xp;

  -- Calculate new level (every 1000 XP = 1 level)
  new_level := GREATEST(1, FLOOR(new_xp / 1000.0) + 1);

  -- Update level
  UPDATE profiles SET level = new_level WHERE id = p_user_id;

  -- Log XP
  INSERT INTO xp_log (user_id, amount, source, description)
  VALUES (p_user_id, p_amount, p_source, p_description);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- STORAGE BUCKETS (run in Supabase Dashboard)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('video-resumes', 'video-resumes', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('id-documents', 'id-documents', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('selfies', 'selfies', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('interview-recordings', 'interview-recordings', false);
