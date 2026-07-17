
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid
                 WHERE t.typname = 'role_code' AND e.enumlabel = 'ICON_JUDGE') THEN
    ALTER TYPE role_code ADD VALUE 'ICON_JUDGE';
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid
                 WHERE t.typname = 'role_code' AND e.enumlabel = 'ICON_MODERATOR') THEN
    ALTER TYPE role_code ADD VALUE 'ICON_MODERATOR';
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid
                 WHERE t.typname = 'role_code' AND e.enumlabel = 'ICON_GOVERNANCE') THEN
    ALTER TYPE role_code ADD VALUE 'ICON_GOVERNANCE';
  END IF;
END$$;
