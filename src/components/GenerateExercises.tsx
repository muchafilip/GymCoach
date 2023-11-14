import React, { useState } from 'react';
import { OpenAI } from 'openai';
import { Exercise, ExerciseCategory } from '../types';

const ExerciseSuggestionComponent: React.FC = () => {
    const [targetBodyPart, setTargetBodyPart] = useState('');
    const [equipmentInput, setEquipmentInput] = useState('');
    const [suggestions, setSuggestions] = useState<ExerciseCategory[]>([]);

    const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

    const getExerciseSuggestions = async () => {
        const availableEquipment = equipmentInput.split(',').map(item => item.trim());
        const gpt35 = 'gpt-3.5-turbo-1106';
        const gp4 = 'gpt-4-1106-preview';
        const queryString = `What are some exercises targeting ${targetBodyPart} that can be done with ${availableEquipment.join(', ')}? Try to always suggest at least 3 different exercises for each equipment. Here is example response, always use the same format:
            [
                {
                    "type": "kettlebell",
                    "target": "shoulders",
                    "list": [
                        {
                            "name": "Kettlebell Shoulder Press",
                            "description": "Press the kettlebell overhead while standing or seated, engaging your core for stability."
                        },
                        {
                            "name": "Kettlebell Push Press",
                            "description": "Use a slight knee bend to help drive the kettlebell overhead in a pressing motion."
                        }
                    ]
                },
                {
                    "type": "barbell",
                    "target": "shoulders",
                    "list": [
                        {
                            "name": "Barbell Overhead Press (Military Press)",
                            "description": "Press the barbell from shoulder height to overhead with arms fully extended."
                        },
                        {
                            "name": "Barbell Push Press",
                            "description": "Use leg drive to help press the barbell from the shoulders to overhead."
                        },
                        {
                            "name": "Barbell Front Raise",
                            "description": "Lift the barbell from thigh level to shoulder height with arms extended."
                        }
                    ]
                },
                {
                    "type": "bodyweight",
                    "target": "shoulders",
                    "list": [
                        {
                            "name": "Handstand Push-Up",
                            "description": "Perform a push-up motion while in a handstand position against a wall for support."
                        },
                        {
                            "name": "Pike Push-Up",
                            "description": "From a pike position with hips in the air, bend the elbows to lower your head towards the ground and then push back up."
                        },
                        {
                            "name": "Wall Walks",
                            "description": "Start in a handstand with feet against the wall and walk hands away from the wall while maintaining a handstand."
                        }
                    ]
                }
            ]
        `;
        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant designed to output JSON.",
                    },
                    {
                        role: "user",
                        content: queryString
                    },
                ],
                model: gpt35,
                response_format: { type: "json_object" },
            });
            if (typeof completion.choices[0].message.content === 'string') {
                try {
                    const responseContent = JSON.parse(completion.choices[0].message.content);
                    console.log(responseContent)
                    if (Array.isArray(responseContent.exercises)) {
                        setSuggestions(responseContent.exercises);
                    } else {
                        console.error('Parsed content is not an array');
                    }
                } catch (parseError) {
                    console.error('Error parsing JSON:', parseError);
                }
            } else {
                console.error('Received null or undefined content from OpenAI');
            }
        } catch (error) {
            console.error('Error getting exercise suggestions:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={targetBodyPart}
                onChange={(e) => setTargetBodyPart(e.target.value)}
                placeholder="Target Body Part"
            />
            <input
                type="text"
                value={equipmentInput}
                onChange={(e) => setEquipmentInput(e.target.value)}
                placeholder="Available Equipment (comma separated)"
            />
            <button onClick={getExerciseSuggestions}>Get Exercise Suggestions</button>
            <div>
                {suggestions.map((category, index) => (
                    <div key={index}>
                        <h3>{category.type.toUpperCase()} Exercises for {category.target}</h3>
                        <ul>
                            {category.list.map((exercise, idx) => (
                                <li key={idx}>
                                    <strong>{exercise.name}</strong>: {exercise.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ExerciseSuggestionComponent;
