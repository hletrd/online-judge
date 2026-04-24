-- Null out deprecated plaintext recruiting tokens.
-- The tokenHash column is sufficient for all lookup operations.
-- New invitations (since cycle 41) already insert token: null;
-- this migration cleans up legacy rows that still have plaintext values.
UPDATE recruiting_invitations SET token = NULL WHERE token IS NOT NULL;

-- Drop the unique index on the deprecated plaintext token column.
-- The ri_token_hash_idx unique index on tokenHash is the canonical lookup path.
DROP INDEX IF EXISTS ri_token_idx;
