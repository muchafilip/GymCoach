// src/utils/openAiUtils.js
import { OpenAI } from 'openai';
import workoutPlanTemplates from './planTemplate'; // Update the path accordingly

const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

export const getExerciseSuggestionsFromAI = async (userEquipment) => {
    const template = workoutPlanTemplates;

    if (!template) {
        console.error('Template not found');
        return null;
    }
    const equipmentArray = Array.isArray(userEquipment) ? userEquipment : userEquipment.split(',').map(e => e.trim());

    const jsonString = JSON.stringify(template, null, 2);
    const queryString = `Given the availle equipment ${equipmentArray.join(', ')},
    suggest exercises for each target body part in this workout plan template that can be done using all the specified equipment. Replace the targetBodyPart with specific exercises.
    Return the suggestions in this JSON model:\n\n${jsonString}\
    number of items in days.bodyparts array should be the same as items in days.bodyparts from input.
    example output: 
    {
        "name": "upperbody4daysPerWeek",
        days: [
            {
                name: "chest&back",
                bodyparts: [< exercise>, < exercise>, < exercise>, < exercise>,< exercise>, < exercise>]
            }, {
                name: "legs&abs",
                bodyparts: [< exercise>, < exercise>,< exercise>,< exercise>, < exercise>, < exercise>, < exercise>]
            },
            {
                name: "back&biceps",
                bodyparts: [< exercise>,< exercise>,< exercise>,< exercise>,< exercise>,< exercise>]
            },
            {
                name: "arms&shoulders",
                bodyparts: [< exercise>,< exercise>, < exercise>, < exercise>, < exercise>, < exercise>]
            }
        ]
    }
    
    `
        ;

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant designed to output valid JSON with same structure as per example",
                },
                {
                    role: "user",
                    content: queryString
                },
            ],
            model: 'gpt-3.5-turbo-1106',
            response_format: { type: "json_object" }
        });

        if (typeof completion.choices[0].message.content === 'string') {
            const responseContent = JSON.parse(completion.choices[0].message.content);
            console.log(responseContent)
            return responseContent; // Modified workout plan with specific exercises
        }
    } catch (error) {
        console.error('Error getting exercise suggestions:', error);
    }
};

export default getExerciseSuggestionsFromAI;
