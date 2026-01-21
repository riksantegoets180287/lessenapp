/*
  # Add Write Policies for Admin Interface

  1. Changes
    - Add INSERT policies for topics, lessons, and parts
    - Add UPDATE policies for topics, lessons, and parts  
    - Add DELETE policies for topics, lessons, and parts
    
  2. Security
    - Allow public write access for admin interface
    - Note: In production, these should be restricted to authenticated admin users
*/

-- Topics write policies
CREATE POLICY "Public can insert topics"
  ON topics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update topics"
  ON topics FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete topics"
  ON topics FOR DELETE
  USING (true);

-- Lessons write policies
CREATE POLICY "Public can insert lessons"
  ON lessons FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update lessons"
  ON lessons FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete lessons"
  ON lessons FOR DELETE
  USING (true);

-- Parts write policies
CREATE POLICY "Public can insert parts"
  ON parts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update parts"
  ON parts FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete parts"
  ON parts FOR DELETE
  USING (true);
