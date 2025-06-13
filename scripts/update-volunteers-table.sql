-- Check if the volunteer_applications table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'volunteer_applications') THEN
        -- Add country column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'volunteer_applications' 
                      AND column_name = 'country') THEN
            ALTER TABLE public.volunteer_applications ADD COLUMN country TEXT;
        END IF;
        
        -- Make sure all other required columns exist
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'volunteer_applications' 
                      AND column_name = 'first_name') THEN
            ALTER TABLE public.volunteer_applications ADD COLUMN first_name TEXT NOT NULL DEFAULT '';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'volunteer_applications' 
                      AND column_name = 'last_name') THEN
            ALTER TABLE public.volunteer_applications ADD COLUMN last_name TEXT NOT NULL DEFAULT '';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'volunteer_applications' 
                      AND column_name = 'email') THEN
            ALTER TABLE public.volunteer_applications ADD COLUMN email TEXT NOT NULL DEFAULT '';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'volunteer_applications' 
                      AND column_name = 'phone') THEN
            ALTER TABLE public.volunteer_applications ADD COLUMN phone TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'volunteer_applications' 
                      AND column_name = 'opportunity') THEN
            ALTER TABLE public.volunteer_applications ADD COLUMN opportunity TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'volunteer_applications' 
                      AND column_name = 'availability') THEN
            ALTER TABLE public.volunteer_applications ADD COLUMN availability TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'volunteer_applications' 
                      AND column_name = 'skills') THEN
            ALTER TABLE public.volunteer_applications ADD COLUMN skills TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'volunteer_applications' 
                      AND column_name = 'motivation') THEN
            ALTER TABLE public.volunteer_applications ADD COLUMN motivation TEXT NOT NULL DEFAULT '';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'volunteer_applications' 
                      AND column_name = 'terms') THEN
            ALTER TABLE public.volunteer_applications ADD COLUMN terms BOOLEAN NOT NULL DEFAULT FALSE;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'volunteer_applications' 
                      AND column_name = 'status') THEN
            ALTER TABLE public.volunteer_applications ADD COLUMN status TEXT NOT NULL DEFAULT 'new';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'volunteer_applications' 
                      AND column_name = 'created_at') THEN
            ALTER TABLE public.volunteer_applications ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'volunteer_applications' 
                      AND column_name = 'updated_at') THEN
            ALTER TABLE public.volunteer_applications ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
        
        RAISE NOTICE 'Volunteer applications table updated successfully';
    ELSE
        -- Create the table if it doesn't exist
        CREATE TABLE public.volunteer_applications (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            country TEXT,
            opportunity TEXT,
            availability TEXT,
            skills TEXT,
            motivation TEXT NOT NULL,
            terms BOOLEAN NOT NULL DEFAULT FALSE,
            status TEXT NOT NULL DEFAULT 'new',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create indexes for faster lookups
        CREATE INDEX idx_volunteer_applications_email ON public.volunteer_applications(email);
        CREATE INDEX idx_volunteer_applications_status ON public.volunteer_applications(status);
        
        RAISE NOTICE 'Volunteer applications table created successfully';
    END IF;
END$$;
