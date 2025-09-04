import readline from 'node:readline/promises';
import Groq from 'groq-sdk';
import { tavily } from '@tavily/core';
import NodeCache from 'node-cache';


const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const myCache = new NodeCache({stdTTL:60*60*24}); 

export async function generate(userMessage,threadId) {
    

    const baseMessage = [
        {
            role: 'system',
            content: `You are a smart personal assistant who answers the asked questions.
            Your real name is Bhoundu if somebody ask who are you or what is bhoundu then tell them you are bhoundu.
              you have to answer the question in plain  english .if the answer require real-time,update information
              then you to call the tools 
                You have access to following tools:
                1. webSearch({query}: {query: string}) //Search the latest information and realtime data on the internet.
                
                
            Decide when to you use tool and when to answer from your own knowledge 
            Do not mention the toll unless needed 
            Example:
            Q: what is the capital of France
            A: Paris is the capital of France

            Q:what is holiest river in India 
            A:The Ganga is the holiest river in India

            Q:Tell me the latest IT news
            A:use the tool call to ans this question 


            current date and time: ${new Date().toUTCString()}

                `,
        },
    ];
     

    const messages=myCache.get(threadId) ?? baseMessage;


        messages.push({
            role: 'user',
            content: userMessage,
        });
        
        const MAX_TRIES=10;
        let cnt=0;

        while (true) {

            if(cnt>MAX_TRIES)
            {
               return 'Mere Baski nhi hai re baba' 
            }
            
            cnt++;

            const completions = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                temperature: 0,
                messages: messages,
                tools: [
                    {
                        type: 'function',
                        function: {
                            name: 'webSearch',
                            description:
                                'Search the latest information and realtime data on the internet.',
                            parameters: {
                                type: 'object',
                                properties: {
                                    query: {
                                        type: 'string',
                                        description: 'The search query to perform search on.',
                                    },
                                },
                                required: ['query'],
                            },
                        },
                    },
                ],
                tool_choice: 'auto',
            });

            messages.push(completions.choices[0].message);

            const toolCalls = completions.choices[0].message.tool_calls;

            if (!toolCalls) {
                //here we end the chatbot response correct place to add cache
                myCache.set(threadId,messages);
                return completions.choices[0].message.content
            }

            for (const tool of toolCalls) {

                const functionName = tool.function.name;
                const functionParams = tool.function.arguments;

                if (functionName === 'webSearch') {
                    const toolResult = await webSearch(JSON.parse(functionParams));
                   

                    messages.push({
                        tool_call_id: tool.id,
                        role: 'tool',
                        name: functionName,
                        content: toolResult,
                    });
                }
            }
        }
    }



async function webSearch({ query }) {

    console.log('Calling web search...');

    const response = await tvly.search(query);


    const finalResult = response.results.map((result) => result.content).join('\n\n');

    return finalResult;
}




