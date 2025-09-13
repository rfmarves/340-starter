-- 1
-- Insert record into account
INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
VALUES   (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
  );

-- 2
-- Modify account to be an admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- 3
-- Delete record from account
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- 4
-- Modify GM Hummer description
UPDATE public.inventory
SET inv_description = REPLACE(inv_description,'the small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5
-- Inner join to get all inventory with classification name for all Sports vehicles
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory AS i
INNER JOIN public.classification AS c 
    ON i.classification_id = c.classification_id
    WHERE c.classification_name = 'Sport'; 

-- 6
-- Update all records in the inventory table to add '/vehicles' to the meiddle of the file path
-- in the inv_image and inv_thumbnail columns
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
WHERE inv_image NOT LIKE '%/vehicles/%' 
  AND inv_thumbnail NOT LIKE '%/vehicles/%';

