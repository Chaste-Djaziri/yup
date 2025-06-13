-- Create blocked_emails table if it doesn't exist
CREATE OR REPLACE FUNCTION create_blocked_emails_table_if_not_exists()
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'blocked_emails') THEN
        CREATE TABLE public.blocked_emails (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT NOT NULL UNIQUE,
            reason TEXT,
            blocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create index on email for faster lookups
        CREATE INDEX idx_blocked_emails_email ON public.blocked_emails(email);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT create_blocked_emails_table_if_not_exists();
