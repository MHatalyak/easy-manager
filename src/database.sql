CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  team_member_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  image_name VARCHAR(255) NOT NULL
);
INSERT INTO team_members (team_member_name, company_name, image_name)
VALUES
  ('John Doe', 'Company A', 'john-doe'),
  ('Jane Smith', 'Company B', 'jane-smith'),
  ('Mark Johnson', 'Company C', 'mark-johnson');