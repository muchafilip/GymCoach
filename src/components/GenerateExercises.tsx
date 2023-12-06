// import React, { useState } from 'react';
// import { OpenAI } from 'openai';
// import { Exercise, ExerciseCategory } from '../types';

// const ExerciseSuggestionComponent: React.FC = () => {
//     const [targetBodyPart, setTargetBodyPart] = useState('');
//     const [equipmentInput, setEquipmentInput] = useState('');
//     const [suggestions, setSuggestions] = useState<ExerciseCategory[]>([]);

//     const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

//     const getExerciseSuggestions = async () => {
//         const availableEquipment = equipmentInput.split(',').map(item => item.trim());
//         const gpt35 = 'gpt-3.5-turbo-1106';
//         const gpt4 = 'gpt-4-1106-preview';
//         const queryString = `What are some exercises targeting ${targetBodyPart} that can be done with ${availableEquipment.join(', ')}? Try to always suggest at least 3 different exercises for each equipment. Here is pydantic model of response, always use the same format:
//         follow this example for every output:

//         class EquipmentList(BaseModel):
//             class Exercise(BaseModel):
//                 name: str
//                 description: str

//         class EquipmentItem(BaseModel):
//             availableEquipment: str
//             targetBodyPart: str
//             suggestedExcercises: List[Exercise]

//         root = List[EquipmentItem]
//         `;
//         try {
//             const completion = await openai.chat.completions.create({
//                 messages: [
//                     {
//                         role: "system",
//                         content: "You are a helpful assistant designed to output valid JSON.",
//                     },
//                     {
//                         role: "user",
//                         content: queryString
//                     },
//                 ],
//                 model: gpt35,
//                 response_format: { type: "json_object" }
//             });
//             if (typeof completion.choices[0].message.content === 'string') {
//                 try {
//                     const responseContent = JSON.parse(completion.choices[0].message.content);
//                     console.log(responseContent)
//                     if (Array.isArray(responseContent.root)) {
//                         setSuggestions(responseContent.root);
//                     } else {
//                         console.error('Parsed content is not an array');
//                     }
//                 } catch (parseError) {
//                     console.error('Error parsing JSON:', parseError);
//                 }
//             } else {
//                 console.error('Received null or undefined content from OpenAI');
//             }
//         } catch (error) {
//             console.error('Error getting exercise suggestions:', error);
//         }
//     };

//     return (
//         <div>
//             <input
//                 type="text"
//                 value={targetBodyPart}
//                 onChange={(e) => setTargetBodyPart(e.target.value)}
//                 placeholder="Target Body Part"
//             />
//             <input
//                 type="text"
//                 value={equipmentInput}
//                 onChange={(e) => setEquipmentInput(e.target.value)}
//                 placeholder="Available Equipment (comma separated)"
//             />
//             <button onClick={getExerciseSuggestions}>Get Exercise Suggestions</button>
//             <div>
//                 {suggestions.map((suggestion, index) => (
//                     <div key={index}>
//                         <h3>{suggestion.availableEquipment.toUpperCase()} Exercises for {suggestion.targetBodyPart}</h3>
//                         <ul>
//                             {suggestion.suggestedExcercises.map((exercise: Exercise, idx: number) => (
//                                 <li key={idx}>
//                                     <strong>{exercise.name}</strong>: {exercise.description}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );

// };

// export default ExerciseSuggestionComponent;
export { }