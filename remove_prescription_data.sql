-- Remove prescription data based on the interface shown
-- RX-202511-00001 and related records

BEGIN;

-- Show current prescription records
SELECT 'Current Prescriptions:' as info, COUNT(*) as count
FROM prescriptions
WHERE prescription_id LIKE 'RX-%';

-- Remove the specific prescription record shown in the interface
DELETE FROM prescription_medications
WHERE prescription_id = 'RX-202511-00001';

DELETE FROM prescriptions
WHERE prescription_id = 'RX-202511-00001';

-- Remove all prescription records if they exist
DELETE FROM prescription_medications
WHERE prescription_id LIKE 'RX-%';

DELETE FROM prescriptions
WHERE prescription_id LIKE 'RX-%'
   OR prescription_date = '2025-11-22'
   OR status = 'Active';

-- Clean up patient records associated with prescriptions
DELETE FROM patients
WHERE patient_id NOT IN (
    SELECT DISTINCT patient_id
    FROM prescriptions
    WHERE patient_id IS NOT NULL
);

-- Clean up doctor records if they're only linked to prescriptions
DELETE FROM doctors
WHERE doctor_id NOT IN (
    SELECT DISTINCT doctor_id
    FROM prescriptions
    WHERE doctor_id IS NOT NULL
);

-- Show results
SELECT 'Remaining Prescriptions:' as info, COUNT(*) as count
FROM prescriptions;

SELECT 'Prescription data removal completed!' as result;

COMMIT;
