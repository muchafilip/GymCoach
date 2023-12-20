import React, { useState } from 'react';

type EquipmentSelectionProps = {
    onGeneratePlan: (selectedEquipment: string[]) => void;
};

const EquipmentSelectionComponent: React.FC<EquipmentSelectionProps> = ({ onGeneratePlan }) => {
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

    const equipmentOptions = ['barbell', 'dumbbells', 'pull-up bar', 'gymnastic rings', 'kettlebell']; // Add more equipment types as needed

    const handleCheckboxChange = (equipment: string) => {
        setSelectedEquipment(prev => {
            if (prev.includes(equipment)) {
                return prev.filter(item => item !== equipment);
            } else {
                return [...prev, equipment];
            }
        });
    };

    return (
        <div>
            <h3>Select Your Equipment:</h3>
            {equipmentOptions.map(equipment => (
                <div key={equipment}>
                    <input
                        type="checkbox"
                        id={equipment}
                        name={equipment}
                        value={equipment}
                        checked={selectedEquipment.includes(equipment)}
                        onChange={() => handleCheckboxChange(equipment)}
                    />
                    <label htmlFor={equipment}>{equipment}</label>
                </div>
            ))}
        </div>
    );
};

export default EquipmentSelectionComponent;
