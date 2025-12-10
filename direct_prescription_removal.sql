-- Direct prescription data removal
-- Execute these commands one by one in your database client

-- Remove prescription medications
DELETE FROM prescription_medications;

-- Remove prescriptions  
DELETE FROM prescriptions;

-- Remove patient data (if only used for prescriptions)
DELETE FROM patients WHERE patient_id LIKE 'N/A' OR patient_name = 'N/A';

-- Remove doctor data (if only used for prescriptions)
DELETE FROM doctors WHERE doctor_name LIKE 'Dr. N/A' OR doctor_name = 'N/A';

-- Reset auto-increment counters (PostgreSQL)
SELECT setval('prescriptions_id_seq', 1, false);
SELECT setval('patients_id_seq', 1, false);  
SELECT setval('doctors_id_seq', 1, false);

-- Reset auto-increment counters (MySQL)
-- ALTER TABLE prescriptions AUTO_INCREMENT = 1;
-- ALTER TABLE patients AUTO_INCREMENT = 1;
-- ALTER TABLE doctors AUTO_INCREMENT = 1;

SELECT 'All prescription data removed successfully!' as result;
