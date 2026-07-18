-- Seed Data for Inventory Management System
-- Target Database: MySQL 8

USE `inventory_db`;

-- 1. Seed Categories (8 items)
INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Electronics', 'Smartphones, laptops, accessories, and consumer gadgets'),
(2, 'Office Supplies', 'Paper, pens, binders, and general stationeries'),
(3, 'Furniture', 'Desks, office chairs, cabinets, and tables'),
(4, 'Apparel', 'Corporate uniforms, shirts, jackets, and accessories'),
(5, 'Food & Beverages', 'Pantry snacks, drinks, coffee, and condiments'),
(6, 'Health & Beauty', 'Sanitizers, first aid, soap, and cosmetic supplies'),
(7, 'Automotive', 'Engine oil, clean kits, spare tires, and tools'),
(8, 'Tools & Hardware', 'Screwdrivers, power drills, wrenches, and safety gear')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 2. Seed Suppliers (10 items)
INSERT INTO `suppliers` (`id`, `name`, `contact_name`, `email`, `phone`, `address`) VALUES
(1, 'Global Tech Distributors', 'John Doe', 'john@globaltech.com', '+1-555-0101', '123 Tech Park, Silicon Valley, CA'),
(2, 'Paper & Co.', 'Sarah Connor', 'sarah@paperco.com', '+1-555-0102', '456 Ink Street, Boston, MA'),
(3, 'Comfort Seatings Ltd', 'Mike Ross', 'mike@comfortseating.com', '+1-555-0103', '789 Lounge Way, Grand Rapids, MI'),
(4, 'Fashion Threads Corp', 'Jessica Pearson', 'jessica@fashionthreads.com', '+1-555-0104', '321 Runway Ave, New York, NY'),
(5, 'Fresh Delights Foods', 'Gordon Ramsey', 'gordon@freshdelights.com', '+1-555-0105', '555 Gourmet Blvd, Chicago, IL'),
(6, 'Wellness & Care Brands', 'Harvey Specter', 'harvey@wellnesscare.com', '+1-555-0106', '777 Health Cir, Miami, FL'),
(7, 'Speed Motor Parts', 'Dominic Toretto', 'dom@speedmotors.com', '+1-555-0107', '132 Quarter Mile Rd, Los Angeles, CA'),
(8, 'Ironworks Heavy Tools', 'Tony Stark', 'tony@ironworks.com', '+1-555-0108', '10880 Malibu Point, Malibu, CA'),
(9, 'Bright Light Electronics', 'Peter Parker', 'peter@brightlight.com', '+1-555-0109', '20 Ingram St, Queens, NY'),
(10, 'Premium Woods & Metals', 'Bruce Wayne', 'bruce@premiumwoods.com', '+1-555-0110', '1007 Mountain Drive, Gotham City, NJ')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 3. Seed Products (75 items)
INSERT INTO `products` (`id`, `name`, `sku`, `category_id`, `supplier_id`, `quantity`, `price`, `status`, `created_at`) VALUES
-- Electronics (Category 1) - Suppliers: 1, 9
(1, 'ProBook Laptop 15"', 'EL-PB15-001', 1, 1, 45, 899.99, 'In Stock', '2026-03-01 10:00:00'),
(2, 'UltraWide 34" Monitor', 'EL-UW34-002', 1, 1, 12, 450.00, 'Low Stock', '2026-03-02 11:00:00'),
(3, 'Wireless Mouse SE', 'EL-WMSO-003', 1, 9, 120, 29.99, 'In Stock', '2026-03-03 09:30:00'),
(4, 'Mechanical Keyboard K8', 'EL-MKB8-004', 1, 9, 8, 89.90, 'Low Stock', '2026-03-05 14:00:00'),
(5, 'Noise Cancelling Headset', 'EL-NCH9-005', 1, 1, 0, 129.99, 'Out of Stock', '2026-03-10 16:30:00'),
(6, 'USB-C Multi Hub 8-in-1', 'EL-UCH8-006', 1, 9, 150, 39.95, 'In Stock', '2026-03-12 10:15:00'),
(7, '4K Webcam Pro', 'EL-4KWC-007', 1, 1, 28, 99.00, 'In Stock', '2026-03-15 11:00:00'),
(8, 'Bluetooth Speaker Studio', 'EL-BSS2-008', 1, 9, 18, 59.99, 'Low Stock', '2026-03-18 15:45:00'),
(9, 'External SSD 1TB', 'EL-ESS1-009', 1, 1, 65, 119.99, 'In Stock', '2026-03-20 12:00:00'),
(10, 'Smart Power Strip Wi-Fi', 'EL-SPSW-010', 1, 9, 85, 24.99, 'In Stock', '2026-03-22 09:00:00'),

-- Office Supplies (Category 2) - Suppliers: 2
(11, 'Premium A4 Printer Paper', 'OS-PPA4-011', 2, 2, 500, 6.50, 'In Stock', '2026-03-01 08:30:00'),
(12, 'Gel Ink Pens (Black 12x)', 'OS-GIPB-012', 2, 2, 200, 12.00, 'In Stock', '2026-03-02 09:00:00'),
(13, 'Ergonomic Desk Organizer', 'OS-EDOR-013', 2, 2, 15, 25.50, 'Low Stock', '2026-03-05 13:00:00'),
(14, 'Dry Erase Whiteboard', 'OS-DEWB-014', 2, 2, 5, 45.00, 'Low Stock', '2026-03-08 10:30:00'),
(15, 'Heavy Duty Stapler', 'OS-HDST-015', 2, 2, 40, 18.99, 'In Stock', '2026-03-10 11:00:00'),
(16, 'Sticky Notes Pad (6-pack)', 'OS-STNP-016', 2, 2, 350, 4.99, 'In Stock', '2026-03-12 14:15:00'),
(17, 'Premium Leather Binder', 'OS-PLBD-017', 2, 2, 0, 32.00, 'Out of Stock', '2026-03-15 15:30:00'),
(18, 'Heavy Duty Paper Shredder', 'OS-HDPS-018', 2, 2, 10, 149.99, 'Low Stock', '2026-03-18 10:00:00'),
(19, 'Wall Calendar Planner', 'OS-WCP6-019', 2, 2, 90, 8.50, 'In Stock', '2026-03-20 09:00:00'),
(20, 'Adjustable Foot Rest', 'OS-ADFR-020', 2, 2, 35, 29.99, 'In Stock', '2026-03-22 16:00:00'),

-- Furniture (Category 3) - Suppliers: 3, 10
(21, 'Ergonomic Mesh Chair M1', 'FN-EMC1-021', 3, 3, 30, 249.99, 'In Stock', '2026-04-01 10:00:00'),
(22, 'L-Shaped Corner Desk', 'FN-LSCD-022', 3, 10, 15, 320.00, 'Low Stock', '2026-04-02 11:30:00'),
(23, 'Steel Filing Cabinet 3D', 'FN-SFC3-023', 3, 10, 25, 189.99, 'In Stock', '2026-04-05 09:00:00'),
(24, 'Dual Motor Standing Desk', 'FN-DMSD-024', 3, 3, 18, 450.00, 'Low Stock', '2026-04-06 14:00:00'),
(25, 'Conference Table 8ft', 'FN-CFT8-025', 3, 10, 3, 699.99, 'Low Stock', '2026-04-08 16:30:00'),
(26, 'Guest Reception Leather Sofa', 'FN-GRLS-026', 3, 3, 0, 550.00, 'Out of Stock', '2026-04-10 11:00:00'),
(27, 'Mobile Under-Desk Drawer', 'FN-MUDD-027', 3, 3, 40, 89.00, 'In Stock', '2026-04-12 10:15:00'),
(28, 'Ergonomic Seat Cushion', 'FN-ERSC-028', 3, 3, 120, 35.00, 'In Stock', '2026-04-15 15:45:00'),
(29, 'Acoustic Office Divider', 'FN-AOD6-029', 3, 10, 14, 125.00, 'Low Stock', '2026-04-18 12:00:00'),
(30, 'LED Desk Lamp Clamp', 'FN-LDLC-030', 3, 3, 80, 42.50, 'In Stock', '2026-04-20 09:00:00'),

-- Apparel (Category 4) - Suppliers: 4
(31, 'Corporate Polo Shirt (Blue)', 'AP-CPSB-031', 4, 4, 180, 25.00, 'In Stock', '2026-04-01 08:30:00'),
(32, 'Corporate Polo Shirt (Black)', 'AP-CPSL-032', 4, 4, 160, 25.00, 'In Stock', '2026-04-02 09:00:00'),
(33, 'Formal Suit Blazer Premium', 'AP-FSBP-033', 4, 4, 25, 120.00, 'In Stock', '2026-04-05 13:00:00'),
(34, 'Comfort Fit Chino Pants', 'AP-CFCP-034', 4, 4, 45, 39.99, 'In Stock', '2026-04-08 10:30:00'),
(35, 'Embroidered Cap Standard', 'AP-ECST-035', 4, 4, 5, 12.50, 'Low Stock', '2026-04-10 11:00:00'),
(36, 'Water-Resistant Windbreaker', 'AP-WRWB-036', 4, 4, 30, 65.00, 'In Stock', '2026-04-12 14:15:00'),
(37, 'Unisex Cotton Hoodie Black', 'AP-UCHB-037', 4, 4, 0, 45.00, 'Out of Stock', '2026-04-15 15:30:00'),
(38, 'Premium Leather Belt', 'AP-PLBT-038', 4, 4, 55, 29.99, 'In Stock', '2026-04-18 10:00:00'),
(39, 'Bamboo Fiber Socks (5pk)', 'AP-BFS5-039', 4, 4, 250, 15.00, 'In Stock', '2026-04-20 09:00:00'),

-- Food & Beverages (Category 5) - Suppliers: 5
(40, 'Premium Roast Coffee Beans 1kg', 'FB-PRCB-040', 5, 5, 80, 24.50, 'In Stock', '2026-05-01 10:00:00'),
(41, 'Organic Green Tea Bags (100x)', 'FB-OGTB-041', 5, 5, 110, 12.99, 'In Stock', '2026-05-02 11:30:00'),
(42, 'Sparkling Water Pack (24x)', 'FB-SWP2-042', 5, 5, 40, 18.00, 'In Stock', '2026-05-05 09:00:00'),
(43, 'Assorted Healthy Snacks Box', 'FB-AHSB-043', 5, 5, 15, 35.00, 'Low Stock', '2026-05-06 14:00:00'),
(44, 'Hot Chocolate Powder Mix', 'FB-HCPM-044', 5, 5, 50, 9.99, 'In Stock', '2026-05-08 16:30:00'),
(45, 'Oat Milk Barista Carton (6x)', 'FB-OMBC-045', 5, 5, 8, 22.50, 'Low Stock', '2026-05-10 11:00:00'),
(46, 'Salted Pretzels 500g Bag', 'FB-SP50-046', 5, 5, 0, 4.50, 'Out of Stock', '2026-05-12 10:15:00'),
(47, 'Natural Honey Squeeze Jar', 'FB-NHSJ-047', 5, 5, 30, 8.99, 'In Stock', '2026-05-15 15:45:00'),

-- Health & Beauty (Category 6) - Suppliers: 6
(48, 'Hand Sanitizer Gel 500ml', 'HB-HSG5-048', 6, 6, 300, 5.99, 'In Stock', '2026-05-01 08:30:00'),
(49, 'Antibacterial Wet Wipes (80x)', 'HB-AWW8-049', 6, 6, 180, 3.50, 'In Stock', '2026-05-02 09:00:00'),
(50, 'Wall Dispenser Soap Refill', 'HB-WDSR-050', 6, 6, 60, 14.99, 'In Stock', '2026-05-05 13:00:00'),
(51, 'First Aid Kit Emergency', 'HB-FAKE-051', 6, 6, 12, 45.00, 'Low Stock', '2026-05-08 10:30:00'),
(52, 'N95 Respirator Masks (20x)', 'HB-N95M-052', 6, 6, 95, 29.99, 'In Stock', '2026-05-10 11:00:00'),
(53, 'Automatic Soap Dispenser', 'HB-ASDP-053', 6, 6, 19, 24.99, 'Low Stock', '2026-05-12 14:15:00'),
(54, 'Air Purifier HEPA Filter', 'HB-APHF-054', 6, 6, 0, 180.00, 'Out of Stock', '2026-05-15 15:30:00'),
(55, 'Premium Hand Lotion 250ml', 'HB-PHL2-055', 6, 6, 75, 11.50, 'In Stock', '2026-05-18 10:00:00'),

-- Automotive (Category 7) - Suppliers: 7
(56, 'Synthetic Engine Oil 5W-30', 'AU-SEO5-056', 7, 7, 75, 32.99, 'In Stock', '2026-06-01 10:00:00'),
(57, 'Car Wash Shampoo & Wax', 'AU-CWSW-057', 7, 7, 120, 14.50, 'In Stock', '2026-06-02 11:30:00'),
(58, 'Heavy Duty Tire Inflator', 'AU-HDTI-058', 7, 7, 15, 49.99, 'Low Stock', '2026-06-05 09:00:00'),
(59, 'Microfiber Towels (12-pack)', 'AU-MFT1-059', 7, 7, 240, 9.99, 'In Stock', '2026-06-06 14:00:00'),
(60, 'Windshield Wiper Blades Pair', 'AU-WWBP-060', 7, 7, 40, 24.50, 'In Stock', '2026-06-08 16:30:00'),
(61, 'Emergency Roadside Flare Kit', 'AU-ERFK-061', 7, 7, 0, 39.99, 'Out of Stock', '2026-06-10 11:00:00'),
(62, 'Hydraulic Bottle Jack 4-Ton', 'AU-HBJ4-062', 7, 7, 8, 65.00, 'Low Stock', '2026-06-12 10:15:00'),
(63, 'Car Phone Mount Wireless', 'AU-CPMW-063', 7, 7, 50, 19.99, 'In Stock', '2026-06-15 15:45:00'),

-- Tools & Hardware (Category 8) - Suppliers: 8, 10
(64, 'Cordless Power Drill 20V', 'TH-CPD2-064', 8, 8, 25, 89.99, 'In Stock', '2026-06-01 08:30:00'),
(65, 'Magnetic Screwdriver Set', 'TH-MSSS-065', 8, 8, 85, 19.99, 'In Stock', '2026-06-02 09:00:00'),
(66, 'Professional Socket Set (100pc)', 'TH-PSSS-066', 8, 8, 12, 120.00, 'Low Stock', '2026-06-05 13:00:00'),
(67, 'Heavy Duty Claw Hammer', 'TH-HDCH-067', 8, 8, 60, 15.50, 'In Stock', '2026-06-08 10:30:00'),
(68, 'Safety Goggles Anti-Fog', 'TH-SGAF-068', 8, 8, 150, 7.99, 'In Stock', '2026-06-10 11:00:00'),
(69, 'Heavy Duty Tool Backpack', 'TH-HDTB-069', 8, 10, 0, 59.99, 'Out of Stock', '2026-06-12 14:15:00'),
(70, 'Digital Multimeter Tester', 'TH-DMMT-070', 8, 8, 30, 29.99, 'In Stock', '2026-06-15 15:30:00'),
(71, 'Adjustable Wrench Set (3pc)', 'TH-AWS3-071', 8, 8, 45, 24.50, 'In Stock', '2026-06-18 10:00:00'),
(72, 'Heavy Duty Extension Cord 50ft', 'TH-HEC5-072', 8, 8, 35, 39.99, 'In Stock', '2026-06-20 09:00:00'),
(73, 'LED Rechargeable Work Light', 'TH-LRWL-073', 8, 8, 8, 18.99, 'Low Stock', '2026-06-22 16:00:00'),
(74, 'Stainless Steel Tape Measure', 'TH-SSTM-074', 8, 10, 110, 11.50, 'In Stock', '2026-06-24 10:00:00'),
(75, 'Utility Knife Snap-Off (5pk)', 'TH-UKS5-075', 8, 8, 200, 6.99, 'In Stock', '2026-06-26 11:00:00')
ON DUPLICATE KEY UPDATE `sku`=VALUES(`sku`);

-- 4. Seed Inventory Activities (tracks stock changes)
INSERT INTO `inventory_activities` (`product_id`, `activity_type`, `quantity_changed`, `user_name`, `notes`, `created_at`) VALUES
(1, 'Product Created', 45, 'System', 'Initial seed quantity', '2026-03-01 10:00:00'),
(2, 'Product Created', 12, 'System', 'Initial seed quantity', '2026-03-02 11:00:00'),
(3, 'Product Created', 120, 'System', 'Initial seed quantity', '2026-03-03 09:30:00'),
(4, 'Product Created', 8, 'System', 'Initial seed quantity', '2026-03-05 14:00:00'),
(5, 'Product Created', 0, 'System', 'Initial stock is empty', '2026-03-10 16:30:00'),
(11, 'Product Created', 500, 'System', 'Bulk printer paper stock loaded', '2026-03-01 08:30:00'),
(13, 'Product Created', 20, 'System', 'Initial stock', '2026-03-05 13:00:00'),
(13, 'Stock Out', -5, 'John Admin', 'Disbursed to HR department', '2026-03-07 10:00:00'),
(21, 'Product Created', 25, 'System', 'Mesh chairs initial delivery', '2026-04-01 10:00:00'),
(21, 'Stock In', 5, 'Sarah Staff', 'Replenished from supplier order #4001', '2026-04-05 11:00:00'),
(24, 'Product Created', 18, 'System', 'Initial standing desks stock', '2026-04-06 14:00:00'),
(31, 'Product Created', 180, 'System', 'Standard polo shirt blue', '2026-04-01 08:30:00'),
(37, 'Product Created', 30, 'System', 'Initial hoodies stock', '2026-04-15 15:30:00'),
(37, 'Stock Out', -30, 'Jessica Corp', 'Shipped out all hoodies to marketing events', '2026-04-25 09:00:00'),
(40, 'Product Created', 80, 'System', 'Coffee beans stock', '2026-05-01 10:00:00'),
(48, 'Product Created', 300, 'System', 'Sanitizer gels delivery', '2026-05-01 08:30:00'),
(54, 'Product Created', 5, 'System', 'Initial stock HEPA air purifiers', '2026-05-15 15:30:00'),
(54, 'Stock Out', -5, 'Hospitality Lead', 'Installed in Executive Suite rooms', '2026-05-20 14:30:00'),
(56, 'Product Created', 75, 'System', 'Engine oil stock', '2026-06-01 10:00:00'),
(58, 'Product Created', 15, 'System', 'Initial tire inflators stock', '2026-06-05 09:00:00'),
(64, 'Product Created', 25, 'System', 'Initial power drills stock', '2026-06-01 08:30:00'),
(66, 'Product Created', 10, 'System', 'Initial socket set stock', '2026-06-05 13:00:00'),
(66, 'Stock In', 2, 'System', 'Inventory adjustment review', '2026-06-10 12:00:00'),
(69, 'Product Created', 12, 'System', 'Initial tool bags stock', '2026-06-12 14:15:00'),
(69, 'Stock Out', -12, 'Tony Stark', 'Withdrawn for workshop upgrades', '2026-06-18 16:00:00'),
(73, 'Product Created', 8, 'System', 'LED work lights stock', '2026-06-22 16:00:00');
